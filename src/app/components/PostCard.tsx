/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Avatar from "./Avartar";
import { useSession } from "next-auth/react";
import user from "../../../sanity-studio/schemas/user";
import Link from "next/link";
import DetailPopUp from "./DetailPopUp";
import { toggleBookmark, toggleLike } from "../service/common";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { MdInsertEmoticon } from "react-icons/md";
import { format } from "timeago.js";
import { Post } from "../service/type";

type Props = {
  item: Post;
};

function PostCard({ item }: Props) {
  console.log("🔖", item);
  const [comment, setComment] = useState("");
  const { data: session } = useSession();

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막습니다.

    // 서버로 전송할 데이터를 정의합니다.
    const data = {
      postId: item._id, // 게시물 ID를 적절히 지정해야 합니다.
      comment,
      userId: localStorage.getItem("userId") || "",
    };

    // 서버로 데이터를 전송합니다.
    fetch("/api/following", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          // 성공적인 응답 처리
          console.log("Comment posted successfully!");
          setComment("");
        } else {
          // 실패한 응답 처리
          console.error("Failed to post comment.");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  const [showPopup, setShowPopup] = useState(false);

  const handleImageClick = () => {
    setShowPopup(true);
  };
  return (
    <div className="w-full my-4  bg-white rounded-lg shadow ">
      <div className="p-2">
        <Link
          href={`/post/${item.author.username}`}
          className="flex justify-start gap-2 items-center w-[100px] mb-2"
        >
          <Avatar img={item.author.image} active={true} size="small" />
          <p className="font-bold">{item.author.username}</p>
        </Link>

        <img
          src={item.image}
          alt={item.image}
          className="flex w-full mb-2 object-cover aspect-square"
          onClick={handleImageClick}
        />

        <div className="flex justify-between w-full mb-2">
          <p onClick={() => toggleLike(item._id)} className="cursor-pointer">
            {item.likes &&
            item.likes.some(
              (like: Post) =>
                like.username === session?.user?.email?.split("@")[0]
            ) ? (
              <AiFillHeart />
            ) : (
              <AiOutlineHeart />
            )}
          </p>

          <p
            onClick={() => toggleBookmark(item._id, item.isBookmarked)}
            className="cursor-pointer"
          >
            {item.isBookmarked ? <BsFillBookmarkFill /> : <BsBookmark />}{" "}
          </p>
        </div>
        <div className=" mb-2 w-full">
          <p className="font-bold flex text-sm mb-2">
            {item.likes.length > 0 ? item.likes.length : 0} like
          </p>
          <p className="w-ful mb-1">
            <span className="text-black font-bold mr-2">
              {item.comments[0].author.username}
            </span>
            {item.comments[0].comment}
          </p>
          <p className="text-gray-500">
            {format(`${item.comments[0]._createdAt}`)}
          </p>
        </div>
      </div>
      <div className=" mb-2  border-t-2">
        <div className="p-2 w-full flex justify-around">
          <p className="w-1/12">
            <MdInsertEmoticon className="text-[1.5em] " />
          </p>
          <form
            onSubmit={handleSubmit}
            className="w-11/12 flex justify-between"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-10/12"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <button className="text-cyan-500 w-2/12" type="submit">
              Post
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <DetailPopUp
          item={item}
          setShowPopup={setShowPopup}
          userName={session?.user?.email?.split("@")[0] || ""}
        />
      )}
    </div>
  );
}

export default PostCard;
