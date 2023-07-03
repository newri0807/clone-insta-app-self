import React from "react";
import Avartar from "./components/Avartar";
import { useSession } from "next-auth/react";
import SideMenu from "./components/SideMenu";
import FollowingBar from "./components/FollowingBar";
import MainPostList from "./components/MainPostList";

function page() {
  return (
    <div className="flex w-full">
      <div className="w-8/12 px-[1%]">
        <FollowingBar />
        <MainPostList />
      </div>
      <div className="w-4/12 px-[1%]">
        <SideMenu />
      </div>
    </div>
  );
}

export default page;
