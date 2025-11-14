import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component.jsx";
import UserAuthFormPage from "./pages/userAuthForm.page.jsx";
import { useEffect, useState, createContext } from "react";
import { lookInsession } from "./common/session.jsx";
import Editor from "./pages/editor.pages.jsx";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInsession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({
          access_token: null,
        });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="editor" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthFormPage type="sign-in" />} />
          <Route path="signup" element={<UserAuthFormPage type="sign-up" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
