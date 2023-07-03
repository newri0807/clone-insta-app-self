/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import post from "../../../sanity-studio/schemas/post";
import { Post } from "../service/type";
import DetailPopUp from "./DetailPopUp";
import { useSession } from "next-auth/react";

function TapImg({ item }: any) {
  console.log(item);
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const handleImageClick = () => {
    setShowPopup(true);
  };
  return (
    <>
      <img
        src={item.image}
        alt={item.username}
        onClick={handleImageClick}
        className="max-w-full max-h-full object-contain cursor-pointer"
        style={{ aspectRatio: "1/1" }}
      />
      {showPopup && (
        <DetailPopUp
          item={item}
          setShowPopup={setShowPopup}
          userName={session?.user?.email?.split("@")[0] || ""}
        />
      )}
    </>
  );
}

export default TapImg;
