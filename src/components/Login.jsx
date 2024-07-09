import { useState, React, useContext } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, db } from "../config/firebase.config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { UserContext } from "./context";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "./icons/GoogleIcon";
import { query, collection, where, getDocs, addDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      setPersistence(auth, browserSessionPersistence);
      let userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setErrorMessage(null);
      const user = userCredential.user;

      let userInfo = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        providerDate: user.providerData,
      };

      setUser(userInfo);

      // setUser(user);

      navigate("/notes");
    } catch (error) {
      console.log("Error: we could not sign you up with Firebase");

      const errorCode = error.code;
      const errorMessage = error.message;

      setErrorMessage(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    const createWatchlist = async (uid) => {
      try {
        const q = query(
          collection(db, "lists"),
          where("owner", "==", uid),
          where("name", "==", "watchlist")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("user doesn't have a watchlist yet. creating one now");
          await addDoc(collection(db, "lists"), {
            owner: uid,
            name: "watchlist",
            films: [],
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;

        const userInfo = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          providerDate: user.providerData,
          photoUrl: user.photoURL,
        };

        createWatchlist(user.uid);

        // IdP data available using getAdditionalUserInfo(result)

        setUser(userInfo);
        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        setErrorMessage(errorMessage);
      });
  };

  return (
    <div className="text-center max-w-72 w-full mx-auto">
      <h2 className="text-xl mb-10">Login</h2>
      <>
        <div>
          {errorMessage && (
            <>
              <h2>{errorMessage}</h2>
            </>
          )}
          <input
            type="text"
            placeholder="E-mail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 p-2 w-full rounded"
          />

          <input
            type="password"
            name="password"
            id="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 p-2 w-full rounded"
          />

          <button
            type="submit"
            onClick={() => handleLogin()}
            className="bg-blue-700 w-full py-2 px-3 rounded mb-3"
          >
            Sign in
          </button>

          <button
            onClick={() => handleGoogleLogin()}
            className="mx-auto mb-2 block"
          >
            <GoogleIcon />
          </button>

          <span>
            Not a member yet? <Link to="/signup">Sign up</Link>
          </span>
        </div>
      </>
    </div>
  );
};

export default Login;
