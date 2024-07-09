import { React, useContext } from "react";
import { UserContext } from "./context";
import { auth } from "../config/firebase.config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Account() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await signOut(auth);
      setUser(null);
      console.log("Successfully logged out");
      navigate("/login");
    } catch (err) {
      console.log(`Error signing out: ${err}`);
    }
  };

  if (!user) return <></>;

  return (
    <div className="mx-auto w-fit">
      <h1>Your Account</h1>
      <pre>{JSON.stringify(user, null, "\t")}</pre>

      <button
        className="bg-red-500 border my-10"
        onClick={() => handleSignOut()}
      >
        Log Out
      </button>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Account;
