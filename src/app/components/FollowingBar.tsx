"use client";
import React from "react";
import { BeatLoader } from "react-spinners";
import useSWR from "swr";
import Avatar from "./Avartar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
const FollowingBar = () => {
  const { data, error, isLoading } = useSWR("/api/me");
  console.log(data);
  localStorage.setItem("userId", data?._id);
  localStorage.setItem("username", data?.username);
  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="flex justify-center item-center py-2">
        <BeatLoader color="#F265A2" />
      </div>
    );

  type props = {
    image: string;
    index: number;
    username: string;
    _id: string;
  };
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 10,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 10,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow ">
      <Carousel infinite autoPlay responsive={responsive} itemClass="m-1">
        {data.following.map(({ image, index, username, _id }: props) => (
          <div key={username} className="flex justify-center">
            <Link href={`/post/${username}`}>
              <Avatar img={image} active={true} size="small" />
              <p className="text-center">{username}</p>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default FollowingBar;
