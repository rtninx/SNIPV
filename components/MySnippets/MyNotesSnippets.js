import React from "react";
import { Card, Text } from "@nextui-org/react";
import NoUser from "../NoPage/NoUser";
import { auth } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

const MyNotesSnippets = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? (
        <Card>
          <Card.Body>
            <Text b>Du har ingen noter snippets endnu!</Text>
          </Card.Body>
        </Card>
      ) : (
        <NoUser />
      )}
    </div>
  );
};

export default MyNotesSnippets;
