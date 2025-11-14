# MERN Blogging Website - Work Record

## 📋 Project Overview
A full-stack blogging platform built with **MongoDB**, **Express**, **React**, and **Node.js** featuring rich text editing, image uploads, and user authentication.

---

## 🔐 How to Backup Code to GitHub

### Quick Backup (Use this every time):
```bash
# 1. Check what files changed
git status

# 2. Add all changes
git add -A

# 3. Commit with a descriptive message
git commit -m "describe your changes here"

# 4. Push to GitHub
git push origin master
```

### Example Commit Messages:
- `git commit -m "fix: resolve EditorJS duplicate instance issue"`
- `git commit -m "feat: add blog publish functionality"`
- `git commit -m "refactor: improve tag management system"`
- `git commit -m "docs: update README with setup instructions"`

### Safety Tips:
- ✅ Backup after completing each feature
- ✅ Backup before making major changes
- ✅ Backup at the end of each work session
- ✅ Always check `git status` before committing
- ⚠️ Never commit `.env` files (already in `.gitignore`)

---

## 🗺️ Project Plan & Roadmap

### ✅ Completed Features (as of Nov 14, 2025)

#### Phase 1: Authentication & User Management
- [x] User signup with email/password
- [x] User login with JWT authentication
- [x] Google OAuth integration (Firebase Admin SDK)
- [x] Session management with localStorage
- [x] Protected routes with JWT verification

#### Phase 2: Blog Editor
- [x] EditorJS integration (v2.27.2)
- [x] Rich text editing tools:
  - [x] Headers (H1-H6)
  - [x] Lists (ordered/unordered)
  - [x] Image upload to AWS S3
  - [x] Quote blocks
  - [x] Code snippets
  - [x] Text markers
  - [x] Embed (YouTube, Twitter, etc.)
- [x] Banner image upload
- [x] Title and description fields
- [x] Tag management system
  - [x] Add tags (max 10)
  - [x] Edit tags inline
  - [x] Delete tags
  - [x] Duplicate prevention

#### Phase 3: Blog Publishing
- [x] Publish form with preview
- [x] Field validation
- [x] Duplicate title warning (non-blocking)
- [x] Success notifications
- [x] Auto-navigation after publish
- [x] Draft/Published status

#### Phase 4: Backend API
- [x] MongoDB Atlas connection
- [x] User schema with authentication
- [x] Blog schema with content structure
- [x] AWS S3 integration for image storage
- [x] API Endpoints:
  - [x] `/signup` - User registration
  - [x] `/signin` - User login
  - [x] `/google-auth` - Google OAuth
  - [x] `/get-upload-url` - S3 pre-signed URLs
  - [x] `/create-blog` - Blog creation
  - [x] `/check-duplicate-title` - Title validation

### 🚧 In Progress / Next Steps

#### Phase 5: Blog Display & Reading
- [ ] Home page with latest blogs
- [ ] Blog detail page with full content
- [ ] Blog list with pagination
- [ ] Search functionality
- [ ] Filter by tags
- [ ] Sort by date/popularity

#### Phase 6: User Interaction
- [ ] Comment system
- [ ] Like/Unlike blogs
- [ ] Bookmark/Save blogs
- [ ] Share functionality
- [ ] Notifications

#### Phase 7: User Dashboard
- [ ] Manage published blogs
- [ ] Edit existing blogs
- [ ] Delete blogs
- [ ] View analytics (views, likes, comments)
- [ ] Draft management

#### Phase 8: User Profile
- [ ] Profile page
- [ ] Edit profile information
- [ ] Change password
- [ ] Upload profile picture
- [ ] User bio and social links

#### Phase 9: Polish & Optimization
- [ ] Responsive design improvements
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Accessibility (a11y)

#### Phase 10: Deployment
- [ ] Environment configuration
- [ ] Production build optimization
- [ ] Deploy backend (Heroku/Railway/Render)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Domain setup
- [ ] SSL certificate
- [ ] Monitoring and logging

---

## 🐛 Bug Fixes & Solutions

### Issue 1: EditorJS Creating Duplicate Instances
**Problem:** Editor recreated on every re-render, wiping content  
**Solution:** Used `useRef` to persist editor instance, changed `useEffect` dependency to `[]`  
**Files:** `blog-editor.component.jsx`, `editor.pages.jsx`

### Issue 2: Server Crash - "Bad CPU type"
**Problem:** Node.js binary incompatible with Apple Silicon  
**Solution:** Used `nvm use 24` to switch to arm64-compatible Node v24.11.0  

### Issue 3: Author Field BSON Error
**Problem:** Entire JWT payload passed as author field  
**Solution:** Changed `req.user` to `req.user.id` in `/create-blog` route  
**File:** `server/server.js` line 277

### Issue 4: Empty Response from `/create-blog`
**Problem:** Accessing `blog.blog` instead of `blog.blog_id`  
**Solution:** Fixed response to return `{ id: blog.blog_id }`  
**File:** `server/server.js` line 338

### Issue 5: Duplicate Tags in Array
**Problem:** Tags not checking for duplicates before adding  
**Solution:** Added `tags.includes(tag)` check and `trim()` in tag handlers  
**Files:** `tags.component.jsx`, `publish-form.component.jsx`

### Issue 6: Server Variable Name Error
**Problem:** Used `app.post()` instead of `Server.post()`  
**Solution:** Changed to match Express instance name `Server`  
**File:** `server/server.js` line 277

---

## 📁 Project Structure

```
mern-blogging-website/
├── blogging website - frontend/
│   ├── src/
│   │   ├── common/          # Utilities (AWS, Firebase, session, etc.)
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (routes)
│   │   ├── imgs/            # Image assets
│   │   ├── App.jsx          # Main app with routing
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── Schema/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   ├── server.js            # Express server & API routes
│   ├── package.json
│   └── .gitignore
│
├── .gitignore               # Root gitignore
└── WORK_RECORD.md          # This file
```

---

## 🔧 Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **Vite** 4.4.5 - Build tool
- **React Router** 6.15.0 - Routing
- **EditorJS** 2.27.2 - Rich text editor
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling

### Backend
- **Node.js** v24.11.0 - Runtime
- **Express** 4.18.2 - Web framework
- **MongoDB** with Mongoose - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Firebase Admin SDK** - Google OAuth
- **AWS SDK** - S3 image storage
- **nanoid** - Unique ID generation

---

## 🔑 Environment Variables

### Frontend (`.env` in `blogging website - frontend/`)
```env
VITE_SERVER_DOMAIN=http://localhost:3000
```

### Backend (`.env` in `server/`)
```env
DB_LOCATION=mongodb+srv://[your-connection-string]
SECRET_ACCESS_KEY=[your-jwt-secret]
AWS_SECRET_ACCESS_KEY=[your-aws-secret]
AWS_ACCESS_KEY=[your-aws-key]
AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1
```

⚠️ **Never commit these files to GitHub!** (Already protected by `.gitignore`)

---

## 🚀 How to Run the Project

### First Time Setup
```bash
# 1. Clone the repository
git clone https://github.com/javago101/mern-blogging-website.git
cd mern-blogging-website

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd "../blogging website - frontend"
npm install

# 4. Create .env files (see Environment Variables section above)
```

### Running the Application
```bash
# Terminal 1 - Run Backend (from server/)
cd server
npm start
# Server runs at http://localhost:3000

# Terminal 2 - Run Frontend (from blogging website - frontend/)
cd "blogging website - frontend"
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 📝 Development Notes

### EditorJS Best Practices
- Always use `useRef` to store the editor instance
- Use empty dependency array `[]` in useEffect to prevent recreation
- Check if editor exists with `if (textEditor)` before calling methods
- Call `textEditor.save()` to get content as JSON

### MongoDB Schema Design
- `blog_id` is generated as: sanitized title + nanoid() for uniqueness
- Tags are stored as lowercase array for case-insensitive search
- Author references User `_id` for relational data
- Draft boolean determines published status

### JWT Authentication Flow
1. User logs in → Server generates JWT with `{ id: userId }`
2. Frontend stores token in localStorage
3. Protected API calls include `Authorization: Bearer ${token}`
4. Server verifies JWT and attaches `req.user = { id, iat }`

---

## 📊 Database Collections

### Users
- `personal_info` (name, email, profile_img, username, bio)
- `social_links` (youtube, instagram, facebook, twitter, github, website)
- `account_info` (total_posts, total_reads, total_blogs)
- `google_auth` (boolean)
- `blogs` (array of blog references)

### Blogs
- `blog_id` (unique string)
- `title`, `banner`, `des` (description)
- `content` (EditorJS blocks array)
- `tags` (lowercase array)
- `author` (User reference)
- `activity` (total_likes, total_comments, total_reads, total_parent_comments)
- `comments` (array)
- `draft` (boolean)
- Timestamps: `publishedAt`

---

## 🎯 Current Session Goals

- [x] Fix EditorJS integration issues
- [x] Implement tag management
- [x] Create blog publishing API
- [x] Add duplicate title warning
- [x] Backup code to GitHub
- [x] Document project structure

---

## 📅 Work Log

### November 14, 2025
- Fixed EditorJS duplicate instances with useRef pattern
- Implemented complete tag system (add, edit, delete)
- Built `/create-blog` API endpoint with validation
- Added duplicate title checking (non-blocking warning)
- Resolved backend server issues (Node version, JWT payload)
- Created comprehensive backup to GitHub
- Documented entire project in WORK_RECORD.md

---

## 🤝 Contributing

This is a personal learning project. If you find bugs or have suggestions:
1. Create an issue on GitHub
2. Fork the repository
3. Make your changes
4. Submit a pull request

---

## 📞 Support & Resources

- **GitHub Repository:** https://github.com/javago101/mern-blogging-website
- **EditorJS Docs:** https://editorjs.io/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/

---

**Last Updated:** November 14, 2025  
**Current Status:** ✅ Blog editor and publishing complete, ready for next phase
