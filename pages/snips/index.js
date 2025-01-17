import { Badge, Button, Card, Loading, Popover, Text } from "@nextui-org/react";
import {
  collection,
  deleteDoc,
  doc,
  FieldPath,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { SnippetsTypeLinks } from "../../components/Heading/SnippetsType";
import { DeleteCodeSnippet } from "../../components/NonModal/DeleteCodeSnippet";
import { DeleteDocumentIcon } from "../../components/SVG/DeleteDocumentIcon";
import { EditDocumentIcon } from "../../components/SVG/EditDocumentIcon";
import { LoginIcon } from "../../components/SVG/LoginIcon";
import { Paper } from "../../components/SVG/Paper";
import { PaperFail } from "../../components/SVG/PaperFail";
import { auth, db } from "../../firebase/clientApp";

const MySnippets = () => {
  const [user] = useAuthState(auth);

  const [myCodeSnippets, setMyCodeSnippets] = useState();
  const [myErrorSnippets, setMyErrorSnippets] = useState();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const getMyCodeSnippets = async () => {
    try {
      const snippetQuery = query(
        collection(db, "CodeSnippetsData1"),
        where(new FieldPath("userData", "uid"), "==", user?.uid),
        orderBy("postedAt", "desc"),
        limit(4)
      );

      const snippetDocs = await getDocs(snippetQuery);
      const snippets = snippetDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyCodeSnippets(snippets);
      setLoading(false);
    } catch (error) {
      console.log("getPosts error", error.message);
    }
  };

  const getMyErrorSnippets = async () => {
    try {
      const snippetQuery = query(
        collection(db, "ErrorSnippetsData1"),
        where(new FieldPath("userData", "uid"), "==", user?.uid),
        orderBy("postedAt", "desc"),
        limit(4)
      );

      const snippetDocs = await getDocs(snippetQuery);
      const snippets = snippetDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyErrorSnippets(snippets);
      setLoading(false);
    } catch (error) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getMyCodeSnippets();
      getMyErrorSnippets();
    }
  }, [user, update]);

  const handleCodeDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "CodeSnippetsData1", id));
      setUpdate(!update);
    } catch (error) {
      console.log("Fejl i sletning!", error.message);
    }
  };

  const handleErrorDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "CodeSnippetsData1", id));
      setUpdate(!update);
    } catch (error) {
      console.log("Fejl i sletning!", error.message);
    }
  };

  return (
    <div className="min-h-[70vh]">
      <Head>
        <title>Mine snips - SNIPV</title>
        <meta name="description" content="Created by Peter G" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-3">
        <SnippetsTypeLinks />
      </div>

      <div>
        <div className="flex flex-col gap-6">
          {myCodeSnippets && (
            <div className="flex flex-col gap-2">
              <div>
                <Text transform="uppercase" h5>
                  Seneste kode snips
                </Text>
              </div>
              <div className="flex flex-col gap-4">
                {myCodeSnippets.map((snip, index) => (
                  <div key={index} className="hoverable-item flex gap-2">
                    <Link href={`/s/${snip.id}`}>
                      <div className="hoverable-item w-full">
                        <Card
                          isPressable
                          variant="flat"
                          css={{ mw: "100%", padding: "$0" }}
                          key={snip.id}
                        >
                          <div className="cardHover bg-[#F1F7FF] hoverable-item flex gap-3 items-center p-2 border-b rounded-xl w-full">
                            <div className="w-full flex flex-col gap-2">
                              <div className="flex gap-6 items-center">
                                <div className="pl-2">
                                  <Paper
                                    fill="#0072F5"
                                    className="cursor-pointer"
                                    width={50}
                                    height={50}
                                  />
                                </div>

                                <div className="w-full flex flex-col justify-center gap-3 MonoHeading">
                                  <div className="w-full">
                                    <p className="text-[#031B4E] text-lg font-[500] truncateText">
                                      {snip.title}
                                    </p>
                                  </div>
                                  {snip.description && (
                                    <div className="-mt-2 h-5">
                                      <h6 className="text-[#031b4ed4] whitespace-nowrap MonoHeading truncateText">
                                        {snip.description}
                                      </h6>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-24 flex justify-center">
                                  {snip.folder.folderSnippetType === "code" && (
                                    <div className="pr-[.60rem]">
                                      <Badge
                                        isSquared
                                        color="primary"
                                        variant="flat"
                                      >
                                        KODE
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="w-full MonoHeading">
                                  <div className="flex gap-2">
                                    <div
                                      className={`l${snip.category.langId} lBadge rounded-3xl flex justify-center items-center`}
                                    >
                                      <p className="text-xs MonoHeading font-semibold lowercase">
                                        {snip.folder.language?.label}
                                      </p>
                                    </div>
                                    {snip.folder?.framework.frameworkId && (
                                      <div
                                        className={`f${snip.folder.framework.frameworkId} lBadge rounded-3xl flex justify-center items-center`}
                                      >
                                        <p className="text-xs MonoHeading font-semibold lowercase">
                                          {snip.folder.framework?.label}
                                        </p>
                                      </div>
                                    )}
                                    {snip?.folder?.processor.processorId && (
                                      <div
                                        className={`p${snip.folder?.processor.processorId} lBadge rounded-3xl flex justify-center items-center`}
                                      >
                                        <p className="text-xs MonoHeading font-semibold lowercase">
                                          {snip.folder.processor?.label}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-[#031B4E]">
                                  <p className="text-xs font-mono">
                                    {new Date(
                                      snip.postedAt.seconds * 1000
                                    ).toLocaleDateString("da-DK")}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="hoverable-show">
                              <LoginIcon
                                width={30}
                                height={30}
                                fill="#0072F5"
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Link>
                    <div className="hoverable-show flex flex-col gap-1 justify-center items-center">
                      <div>
                        <Button auto light>
                          <EditDocumentIcon
                            fill="#0072F5"
                            className="cursor-pointer"
                            width={26}
                            height={26}
                          />
                        </Button>
                      </div>
                      <div>
                        <Popover placement="top">
                          <Popover.Trigger>
                            <Button auto light>
                              <DeleteDocumentIcon
                                fill="#F31260"
                                className="cursor-pointer"
                                width={26}
                                height={26}
                              />
                            </Button>
                          </Popover.Trigger>
                          <Popover.Content>
                            <DeleteCodeSnippet
                              snip={snip}
                              handleDelete={handleCodeDelete}
                            />
                          </Popover.Content>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/snips/codes">
                    <Text b className="cursor-pointer hover:underline">
                      SE ALLE
                    </Text>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {myErrorSnippets && (
            <div className="flex flex-col gap-2">
              <div>
                <Text transform="uppercase" h5>
                  Seneste fejl snips
                </Text>
              </div>
              <div className="flex flex-col gap-4">
                {myErrorSnippets.map((snip, index) => (
                  <div key={index} className="hoverable-item flex gap-2">
                    <Link href={`/s/${snip.id}`}>
                      <div className="hoverable-item w-full">
                        <Card
                          isPressable
                          variant="flat"
                          css={{ mw: "100%", padding: "$0" }}
                          key={snip.id}
                        >
                          <div className="cardHover bg-[#F1F7FF] hoverable-item flex gap-3 items-center p-2 border-b rounded-xl w-full">
                            <div className="w-full flex flex-col gap-2">
                              <div className="flex gap-6 items-center">
                                <div className="pl-2">
                                  <PaperFail
                                    fill="#FF3137"
                                    className="cursor-pointer"
                                    width={50}
                                    height={50}
                                  />
                                </div>

                                <div className="w-full flex flex-col justify-center gap-3 MonoHeading">
                                  <div className="w-full">
                                    <p className="text-[#031B4E] text-lg font-[500] truncateText">
                                      {snip.title}
                                    </p>
                                  </div>
                                  {snip.description && (
                                    <div className="-mt-2 h-5">
                                      <h6 className="text-[#031b4ed4] whitespace-nowrap MonoHeading truncateText">
                                        {snip.description}
                                      </h6>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-24 flex justify-center">
                                  {snip.folder.folderSnippetType ===
                                    "error" && (
                                    <div className="pr-[.60rem]">
                                      <Badge
                                        isSquared
                                        color="error"
                                        variant="flat"
                                      >
                                        FEJL
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="w-full MonoHeading">
                                  <div className="flex gap-2">
                                    <div
                                      className={`l${snip.category.langId} lBadge rounded-3xl flex justify-center items-center`}
                                    >
                                      <p className="text-xs MonoHeading font-semibold lowercase">
                                        {snip.folder.language?.label}
                                      </p>
                                    </div>
                                    {snip.folder?.framework.frameworkId && (
                                      <div
                                        className={`f${snip.folder.framework.frameworkId} lBadge rounded-3xl flex justify-center items-center`}
                                      >
                                        <p className="text-xs MonoHeading font-semibold lowercase">
                                          {snip.folder.framework?.label}
                                        </p>
                                      </div>
                                    )}
                                    {snip?.folder?.processor.processorId && (
                                      <div
                                        className={`p${snip.folder?.processor.processorId} lBadge rounded-3xl flex justify-center items-center`}
                                      >
                                        <p className="text-xs MonoHeading font-semibold lowercase">
                                          {snip.folder.processor?.label}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-[#031B4E]">
                                  <p className="text-xs font-mono">
                                    {new Date(
                                      snip.postedAt.seconds * 1000
                                    ).toLocaleDateString("da-DK")}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="hoverable-show">
                              <LoginIcon
                                width={30}
                                height={30}
                                fill="#0072F5"
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Link>
                    <div className="hoverable-show flex flex-col gap-1 justify-center items-center">
                      <div>
                        <Button auto light>
                          <EditDocumentIcon
                            fill="#0072F5"
                            className="cursor-pointer"
                            width={26}
                            height={26}
                          />
                        </Button>
                      </div>
                      <div>
                        <Popover placement="top">
                          <Popover.Trigger>
                            <Button auto light>
                              <DeleteDocumentIcon
                                fill="#F31260"
                                className="cursor-pointer"
                                width={26}
                                height={26}
                              />
                            </Button>
                          </Popover.Trigger>
                          <Popover.Content>
                            <DeleteCodeSnippet
                              snip={snip}
                              handleDelete={handleErrorDelete}
                            />
                          </Popover.Content>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/snips/errors">
                    <Text b className="cursor-pointer hover:underline">
                      SE ALLE
                    </Text>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        {loading && (
          <div className="flex justify-center items-center h-[20vh]">
            <Loading size="lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MySnippets;
