/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { toggleBookmark, toggleLike } from "../service/common";
import Avatar from "./Avartar";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { MdInsertEmoticon } from "react-icons/md";
import { format } from "timeago.js";
import { Post } from "../service/type";
import useSWR, { mutate, useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  item: Post;
  setShowPopup: (show: boolean) => void;
  userName: string;
};

function DetailPopUp({ item, setShowPopup, userName }: Props) {
  const [comment, setComment] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const nowLoginUserId =
    (session?.user && (session.user as { id: string }).id) || "";

  // 🎁 mutate 업데이트 작성법1
  const { mutate } = useSWRConfig();

  // const { data, error, isLoading } = useSWR(
  //   `/api/account/detail?userId=${userName}`,
  //   {
  //     revalidateOnFocus: true,
  //     revalidateOnReconnect: true,
  //     refreshInterval: 5000,
  //   }
  // );

  useEffect(() => {
    const interval = setInterval(() => {
      mutate(`/api/account/detail?userId=${userName}`); // 데이터 갱신
    }, 10000); // 10초마다 갱신

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []);

  console.log(item, "-------", userName);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막습니다.

    // 서버로 전송할 데이터를 정의합니다.
    const data = {
      postId: item?._id, // 게시물 ID를 적절히 지정해야 합니다.
      comment,
      userId: nowLoginUserId || "",
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
          if (response.status === 401) {
            alert(`로그인 후 사용 가능한 기능입니다.😊`);
            return;
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  const toggleLikeStatus = async () => {
    try {
      // 좋아요 상태 토글 요청 보내기
      await Promise.all([
        toggleLike(item._id, nowLoginUserId),
        mutate(`/api/account/detail?userId=${userName}`),
      ]);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle like status:", error);
    }
  };

  const toggleBookmarkStatus = async () => {
    try {
      // 북마크 상태 토글 요청 보내기
      await Promise.all([
        toggleBookmark(item._id, nowLoginUserId),
        mutate(`/api/account/detail?userId=${userName}`),
      ]);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle bookmark status:", error);
    }
  };

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-[999999]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowPopup(false);
          }
        }}
      >
        <div className="w-[95%] mx-auto bg-white flex justify-center">
          {/* Popup content goes here */}

          <img
            src={item.image}
            alt={item.image}
            className="w-7/12 h-auto object-cover aspect-square"
          />
          <div className="w-full relative">
            <div className="flex justify-start gap-2 items-center  p-1">
              <Avatar img={item.author.image} active={true} size="small" />
              <p>{item.author.username}</p>
            </div>
            <div className=" border-t-2 w-full min-h-[300px]">
              {item.comments &&
                item.comments.map(
                  (
                    comment: { author: { image: string }; comment: string },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="w-full flex justify-start align-middle items-center p-1"
                    >
                      <Avatar
                        img={comment.author.image}
                        active={true}
                        size="small"
                      />
                      <p className="ml-2">{comment.comment}</p>
                    </div>
                  )
                )}
            </div>

            <div className="w-full absolute bottom-0">
              <div className="w-full p-2 ">
                <div className="flex justify-between w-full mb-2 ">
                  <p onClick={toggleLikeStatus} className="cursor-pointer">
                    {item.likes &&
                    item.likes.some(
                      (like: { username: string }) => like.username === userName
                    ) ? (
                      <AiFillHeart />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </p>

                  <p onClick={toggleBookmarkStatus} className="cursor-pointer">
                    {(item.bookMarks &&
                      item.bookMarks.some(
                        (bookmark: string) => bookmark === item._id
                      )) ||
                    item?.isBookmarked ? (
                      <BsFillBookmarkFill />
                    ) : (
                      <BsBookmark />
                    )}{" "}
                  </p>
                </div>
                <div className="font-bold flex w-full text-sm mb-2 flex-wrap">
                  <p className="w-full">
                    {item.likes.length > 0 ? item.likes.length : 0} likes
                  </p>
                  <p className="text-gray-500 w-full">
                    {" "}
                    {format(`${item.comments[0]._createdAt}`)}
                  </p>
                </div>
              </div>
              <div className="border-t-2 w-full">
                <div className="p-2 w-full flex justify-around">
                  <p className="w-1/12">
                    {" "}
                    <MdInsertEmoticon className="text-[1.5em]" />
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="w-11/12 flex justify-between gap-1"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPopUp;
