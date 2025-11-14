import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";
import aws from "aws-sdk";

const serviceAccountKey = JSON.parse(
  readFileSync(
    "./react-js-website-yt-firebase-adminsdk-fbsvc-66f710c8b7.json",
    "utf-8"
  )
);

// Schema below
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
import e from "express";

dotenv.config();

const Server = express();

let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// strict RFC-5322-style email: checks total/local length, valid symbols, and properly formed domain labels
const emailRegex =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
// at least 8 chars, <=64, need upper, lower, digit, special
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

Server.use(express.json());
Server.use(cors());

mongoose
  .connect(process.env.DB_LOCATION, { autoIndex: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// setting up s3 bucket
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}_${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).json({ error: "Access token missing." });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid access token." });
    }
    req.user = user;
    next();
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    {
      id: user._id,
    },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    fullname: user.personal_info.fullname,
    username: user.personal_info.username,
  };
};

const generateUsername = async (email) => {
  let baseUsername = email.split("@")[0].replace(/[^A-Za-z0-9]/g, "");

  while (baseUsername.length < 3) {
    baseUsername += Math.floor(Math.random() * 10);
  }

  let usernameCandidate = baseUsername;

  while (
    await User.exists({
      "personal_info.username": usernameCandidate,
    }).then((result) => result !== null)
  ) {
    usernameCandidate = `${baseUsername}${nanoid(4)}`;
  }

  return usernameCandidate;
};

// upload image url route
Server.get("/get-upload-url", async (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

Server.post("/signup", async (req, res) => {
  let { fullname, email, password } = req.body;

  // validation the data from the frontend
  if (fullname.length < 3) {
    return res
      .status(400)
      .json({ error: "Full Name must be at least 3 letters long." });
  }
  if (!email.length) {
    return res.status(400).json({ error: "Email is required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  if (!password.length) {
    return res.status(400).json({ error: "Password is required." });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be 8-64 characters long and include uppercase, lowercase, digit, and special character.",
    });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    if (err) {
      return res.status(500).json({ error: "Failed to hash password." });
    }

    let username = await generateUsername(email);

    const user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code === 11000 && err.keyPattern?.["personal_info.email"]) {
          return res.status(409).json({ error: "Email already in use." });
        }
        if (err.code === 11000 && err.keyPattern?.["personal_info.username"]) {
          return res.status(409).json({ error: "Username already taken." });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});

Server.post("/signin", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found." });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error occurred while login, please try again." });
        }

        if (!result) {
          return res.status(403).json({ error: "Incorrect password." });
        }

        return res.status(200).json(formatDatatoSend(user));
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

Server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        //login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "Email already registered without Google authentication. Please use your email and password to sign in.",
          });
        }
      } else {
        //signup

        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email: email,
            username: username,
            //profile_img: picture,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((error) => {
      return res.status(500).json({
        error:
          "Failed to authenticate with Google. Try with some other Google account.",
      });
    });
});

// Check for duplicate blog title
Server.post("/check-duplicate-title", verifyJWT, (req, res) => {
  let { title } = req.body;
  let authorId = req.user.id;

  Blog.findOne({ title, author: authorId })
    .then((existingBlog) => {
      if (existingBlog) {
        return res.status(200).json({ duplicate: true });
      }
      return res.status(200).json({ duplicate: false });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Failed to check for duplicate title." });
    });
});


Server.post("/create-blog", verifyJWT, (req, res) => {
  let authorId = req.user.id;

  let { title, des, banner, tags, content, draft } = req.body;

  if (!title.length) {
    return res.status(403).json({ error: "Title is required." });
  }

  if (!des.length || des.length > 200) {
    return res
      .status(403)
      .json({ error: "Description must be between 1 and 200 characters." });
  }

  if (!banner.length) {
    return res.status(403).json({ error: "Banner image is required." });
  }

  if (!tags.length || tags.length > 10) {
    return res.status(403).json({
      error: "At least one tag is required, Maximum 10 tags allowed.",
    });
  }

  if (!content.blocks || content.blocks.length === 0) {
    return res.status(403).json({ error: "Blog content is required." });
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  let blog = new Blog({
    blog_id,
    author: authorId,
    title,
    des,
    banner,
    tags,
    content,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incremntVal = draft ? 0 : 1;
      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": incremntVal },
          $push: {
            blogs: blog._id,
          },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "Failed to update user posts number." });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });

});

Server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
