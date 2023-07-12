"use client";
import Avatar from "@/app/components/Avartar";
import React, { useEffect } from "react";
import { BeatLoader } from "react-spinners";
import useSWR, { mutate, useSWRConfig } from "swr";
import { UserInfo } from "../service/type";
import { useSession } from "next-auth/react";

interface props {
  username: string;
}

function AccountDetailHeader({ username }: props) {
  const { data: session } = useSession();
  const nowLoginUserName =
    session?.user && (session.user as { username: string }).username;

  const { data, error, isLoading, mutate } = useSWR(
    `/api/account/detail?userId=${username}`
  );
  //const { mutate } = useSWRConfig();

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="py-[5em] flex justify-center items-center">
        <BeatLoader color="#F265A2" />
      </div>
    );

  //console.log(session?.user, `로그인 확인--------------`, data);

  const toggleFollow = (id: string) => {
    const data_ = {
      postUserId: id, // 게시물 ID를 적절히 지정해야 합니다.
      userId: localStorage.getItem("userId") || "",
    };

    const optimisticData = {
      ...data,
      user: {
        ...data.user,
        following: data.isLoginUserFollowing
          ? data.user.following &&
            data.user.following.filter((userId: string) => userId !== id)
          : [...(data.user.following || []), id],
      },
      isLoginUserFollowing: !data.isLoginUserFollowing,
    };

    fetch("/api/post/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_),
    })
      .then(async (response) => {
        if (response.ok) {
          // 성공적인 응답 처리
          // 🎁 mutate 업데이트 작성법2
          await mutate(`/api/account/detail?userId=${username}`, {
            optimisticData: optimisticData,
            populateCache: false,
            revalidate: false,
            rollbackOnError: false,
          });
          console.log("following change successfully!", data);
        } else {
          // 실패한 응답 처리
          console.error("Failed to following change.");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <div>
      {data && (
        <>
          <div className="flex justify-center gap-1 w-full m-auto">
            <div className="w-6/12 flex justify-end mr-2">
              <Avatar img={data.user.image} active={true} size="" />
            </div>

            <div className="w-6/12 flex justify-around items-center gap-2 flex-wrap ">
              <div className="w-full flex justify-start gap-2 items-center">
                <p>{data.user.username}</p>
                {session?.user && data.user.username !== nowLoginUserName && (
                  <button
                    onClick={() => toggleFollow(data?.user?.id)}
                    className={`rounded-md text-white text-center min-w-[100px] p-1 ${
                      data.isLoginUserFollowing ? `bg-red-700` : `bg-blue-500`
                    }`}
                  >
                    {data.isLoginUserFollowing ? `unfollow` : `follow`} {}
                  </button>
                )}
              </div>
              <div className="w-full flex justify-start gap-2 text-sm items-center">
                <p>
                  {" "}
                  <strong>
                    {data.uploadingAllPosts?.length || 0}
                  </strong> posts{" "}
                </p>
                <p>
                  <strong>{data.user.followers?.length || 0}</strong> followers
                </p>
                <p>
                  <strong>{data.user.following?.length || 0}</strong> following
                </p>
              </div>
              <strong className="w-full flex justify-start gap-2 text-sm items-center">
                {data.user?.name || ""}
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AccountDetailHeader;
