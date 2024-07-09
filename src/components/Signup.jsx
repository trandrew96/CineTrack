import { useState, React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase.config";
import { UserContext } from "./context";
import { query, collection, where, getDocs, addDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async () => {
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
      navigate("/");
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
      <h2 className="text-xl mb-10">Sign Up</h2>
      <div>
        {success && (
          <>
            <h2>You successfully signed up!</h2>
          </>
        )}

        {errorMessage && (
          <>
            <h2>{errorMessage}</h2>
          </>
        )}
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
