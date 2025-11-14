import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App.jsx";
import PublishForm from "../components/publish-form.component.jsx";
import BlogEditor from "../components/blog-editor.component.jsx";
import { createContext } from "react";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState(null);


  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
      {access_token === null ? (
        <Navigate to={"/signin"} />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};
export default Editor;
