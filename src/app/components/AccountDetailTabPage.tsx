/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import DetailPopUp from "./DetailPopUp";
import { RiseLoader } from "react-spinners";
import { Post, UserInfo } from "../service/type";
import TapImg from "./TapImg";

interface props {
  username: string;
}
function AccountDetailTabPage({ username }: props) {
  const [activeTab, setActiveTab] = useState("POSTS");
  const [showPopup, setShowPopup] = useState(false);
  const [forPostPopup, setForPostPopup] = useState<Post | undefined>(undefined);
  const { data, error, isLoading } = useSWR(
    `/api/account/detail?userId=${username}`
  );

  useEffect(() => {
    const interval = setInterval(() => {
      mutate(`/post/${username}`); // 데이터 갱신
    }, 10000); // 10초마다 갱신

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, [data, username]);

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="py-[5em] flex justify-center items-center">
        <RiseLoader color="#F265A2" />
      </div>
    );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleImageClick = (postId: string, type: string) => {
    setShowPopup(true);

    let matchedPost: Post;

    if (type === "likes") {
      matchedPost = data.likes.find((post: Post) => post._id === postId);
    } else if (type === "bookMarks") {
      matchedPost = data.bookMarks.find((post: Post) => post._id === postId);
    } else {
      matchedPost = data.uploadingAllPosts.find(
        (post: Post) => post._id === postId
      );
    }
    if (matchedPost) {
      setForPostPopup(matchedPost);
    }
  };
  return (
    <div>
      <div className="mb-4 border-b border-gray-200  mt-2  ">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-center">
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "POSTS" ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => handleTabClick("POSTS")}
            >
              POSTS
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "LIKES" ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => handleTabClick("LIKES")}
            >
              LIKES
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "BOOKMARKS"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => handleTabClick("BOOKMARKS")}
            >
              BOOKMARKS
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div
          className={`${
            activeTab === "POSTS" ? "block" : "hidden"
          } rounded-lg bg-gray-50 p-2`}
        >
          <div className="text-sm text-gray-500 w-full flex flex-wrap justify-start ">
            {data.uploadingAllPosts.map((post: Post) => (
              <div
                key={post._id}
                className="md:w-4/12 w-full flex items-center justify-center px-1"
              >
                <TapImg item={post} />
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${
            activeTab === "LIKES" ? "block" : "hidden"
          } p-4 rounded-lg bg-gray-50 `}
        >
          <div className="text-sm text-gray-500 w-full flex flex-wrap justify-start ">
            {data.likes.map((post: Post) => (
              <div
                key={post._id}
                className="md:w-4/12 w-full flex items-center justify-center px-1"
              >
                <TapImg item={post} />
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${
            activeTab === "BOOKMARKS" ? "block" : "hidden"
          } p-4 rounded-lg bg-gray-50 `}
        >
          <div className="text-sm text-gray-500 w-full flex flex-wrap justify-start ">
            {data.bookMarks.map((post: Post) => (
              <div
                key={post._id}
                className="md:w-4/12 w-full flex items-center justify-center px-1"
              >
                <TapImg item={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {showPopup && (
        <DetailPopUp
          item={forPostPopup!}
          setShowPopup={setShowPopup}
          userName={data?.user?.username}
          from={activeTab}
        />
      )} */}
    </div>
  );
}

export default AccountDetailTabPage;
