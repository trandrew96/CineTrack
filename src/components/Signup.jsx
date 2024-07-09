import { useState, React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase.config";
import { UserContext } from "./context";
import { query, collection, where, getDocs, addDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Email address cannot be empty.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage(
        "Password and Confirm Password are not the same. Please try again."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return;
    }

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

    try {
      let userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSuccess(true);
      setErrorMessage(null);

      // The signed-in user info.
      const user = userCredential.user;

      const userInfo = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      };

      createWatchlist(user.uid);

      // IdP data available using getAdditionalUserInfo(result)

      setUser(userInfo);

      setTimeout(() => {
        navigate("/");
      }, "3000");
    } catch (error) {
      console.log("Error: we could not sign you up");

      const errorCode = error.code;
      const errorMessage = error.message;

      setSuccess(false);
      setErrorMessage(errorMessage);
    }
  };

  return (
    <main className="text-center max-w-72 mx-auto mt-4">
      <h2 className="text-xl">Sign Up</h2>
      <div>
        <div className="h-16 p-2">
          {success && (
            <>
              <h2 className="bg-green-500">
                Congratulations, you have successfully signed up for CineTrack!
              </h2>
            </>
          )}

          {errorMessage && (
            <>
              <h2 className="bg-red-500">{errorMessage}</h2>
            </>
          )}
        </div>

        <input
          type="text"
          placeholder="E-mail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 w-full rounded"
        />
        <br />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 w-full rounded"
        />
        <input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="mb-2 p-2 w-full rounded"
        />
        <br />
        <br />
        <button
          type="submit"
          onClick={() => handleSignup()}
          className="bg-blue-700 w-full py-2 px-3 rounded mb-3"
        >
          Sign Up
        </button>
      </div>
    </main>
  );
};

export default Signup;
