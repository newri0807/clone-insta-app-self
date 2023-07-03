"use client";
import React, { useEffect } from "react";
import { RiseLoader } from "react-spinners";
import useSWR, { mutate } from "swr";
import PostCard from "./PostCard";
import { Post } from "../service/type";
function MainPostList() {
  const { data, error, isLoading } = useSWR("/api/following");

  useEffect(() => {
    const interval = setInterval(() => {
      mutate("/api/following"); // 데이터 갱신
    }, 10000); // 10초마다 갱신

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []);

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="py-[5 em] flex justify-center items-center">
        <RiseLoader color="#F265A2" />
      </div>
    );
  return (
    <>
      {data.map((item: Post, index: number) => (
        <PostCard item={item} key={index} />
      ))}
    </>
  );
}

export default MainPostList;
