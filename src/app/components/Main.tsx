"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { MainProps } from "../service/type";
import Navi from "./Navi";
const Main = ({ propsChildren }: MainProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen flex-col items-center  py-[6rem] px-[3rem]">
      {session?.user ||
      pathname === "/search" ||
      pathname.startsWith("/post/") ? (
        <>{propsChildren}</>
      ) : (
        <button
          className="m-4 p-1 rounded-md from-rose-400 via-fuchsia-500 to-indigo-500 bg-gradient-to-r"
          onClick={() => signIn("google")}
        >
          <span className="block text-black px-4 py-2 font-semibold rounded-md bg-white hover:bg-transparent hover:text-white transition">
            {" "}
            Sign In
          </span>
        </button>
      )}
    </div>
  );
};

export default Main;
