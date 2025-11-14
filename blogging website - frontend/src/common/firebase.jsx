
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyB_qHuRRTGwilaGd9rqonhZUsVF-vdUdbo",
  authDomain: "react-js-website-yt.firebaseapp.com",
  projectId: "react-js-website-yt",
  storageBucket: "react-js-website-yt.firebasestorage.app",
  messagingSenderId: "678489605435",
  appId: "1:678489605435:web:fd5c85abfd72499c10a31e",
  measurementId: "G-4HLWJMWQD0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// google auth

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

const auth = getAuth();

export const authWithGoogle = async () => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user;
    }).catch((err) => {
        console.log(err);
    });

    return user;
}