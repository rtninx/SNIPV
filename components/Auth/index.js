import React, { useEffect } from "react";
import { auth, db } from "../../Firebase/clientApp";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { Button, Grid, User } from "@nextui-org/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const Auth = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

    const createUserDocument = async (user) => {
      const userDocRef = doc(db, 'UsersData', user.uid);
      await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));

      await updateDoc(doc(db, "UsersData", user.uid), {
        isAdmin: false,
        author: user.displayName,
        username: "",
        premium: false,
        donator: false,
        isModerator: false,
        superUser: false,
      });
    }
  
    useEffect(() => {
      if (userCred?.user) {
        createUserDocument(userCred.user)
      }
    }, [userCred])

    console.log(userCred?.user);

  return (
    <div>
      <Button onClick={() => signInWithGoogle()}>Continue with Google</Button>
    </div>
  );
};

export default Auth;
