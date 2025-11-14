import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog-banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState
  } = useContext(EditorContext);
  let editorRef = useRef(null);

  // useEffect

  useEffect(() => {
    if (!editorRef.current) {
      let editor = new EditorJS({
        holder: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Start writing your blog...",
      });
      editorRef.current = editor;
      setTextEditor(editor);
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToastId = toast.loading("Uploading...");

      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToastId);
            toast.success("Upload Successful!", { id: loadingToastId });

            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToastId);
          return toast.error(err);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () => {
    // if (!banner.length) {
    //   toast.error("Please upload a banner image");
    //   return;
    // }

    // if (!title.length) {
    //   toast.error("Write blog title to publish it");
    //   return;
    // }

    // if (textEditor.isReady) {
        textEditor.save().then(data => {
            // if(data.blocks.length){
            setBlog({ ...blog, content: data });
            // proceed to publish
            setEditorState("publish");
        // } else{
        //     toast.error("Blog content cannot be empty");
        // }
        })
        .catch((err) => {
            toast.error("Failed to save blog content");
        });
      
    // }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="Logo" />
        </Link>
        <p className=" text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  // hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              className="w-full text-4xl font-medium h-20 outline-none resize-none mt-10 leading-tight first-letter placeholder:opacity-40 "
              placeholder="Blog Title"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className=" w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio "></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
