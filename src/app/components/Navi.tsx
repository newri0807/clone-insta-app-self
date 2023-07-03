/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Login from "./Login";
import { signIn, signOut, useSession } from "next-auth/react";
import { AiOutlineHome } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { BsPlusSquare } from "react-icons/bs";
import { BsPlusSquareFill } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { RiSearchFill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avartar from "./Avartar";
const Navi = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const username =
    session?.user && (session.user as { username: string }).username;
  return (
    <div className="flex justify-between items-center px-4 bg-white border-b-2 border-[#ecebec] fixed top-0 left-0 w-full">
      <h1 className="font-bold text-2xl">
        <Link href={"/"}>InstaClone</Link>
      </h1>
      <ul className="flex justify-between gap-2 items-center">
        <li className="mx-[7px]">
          <Link href={"/"}>
            {" "}
            {pathname === "/" ? (
              <AiFillHome className="w-[28px] h-[28px]" />
            ) : (
              <AiOutlineHome className="w-[28px] h-[28px]" />
            )}
          </Link>
        </li>
        <li className="mx-[7px]">
          <Link href={"/search"}>
            {" "}
            {pathname === "/search" ? (
              <RiSearchFill className="w-[28px] h-[28px]" />
            ) : (
              <RiSearchLine className="w-[28px] h-[28px]" />
            )}
          </Link>
        </li>
        <li className="mx-[7px]">
          <Link href={"/postupload"}>
            {" "}
            {pathname === "/postupload" ? (
              <BsPlusSquareFill className="w-[28px] h-[28px]" />
            ) : (
              <BsPlusSquare className="w-[28px] h-[28px]" />
            )}
          </Link>
        </li>
        <li className="flex justify-between gap-1 items-center">
          {session?.user ? (
            <>
              <Link href={`/post/${username}`}>
                <Avartar
                  img={session.user.image || ""}
                  active={true}
                  size="small"
                />
              </Link>

              <button
                className="m-4 p-1 rounded-md from-rose-400 via-fuchsia-500 to-indigo-500 bg-gradient-to-r"
                onClick={() => signOut()}
              >
                <span className="block text-black px-4 py-2 font-semibold rounded-md bg-white hover:bg-transparent hover:text-white transition">
                  {" "}
                  Sign Out
                </span>
              </button>
            </>
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
        </li>
      </ul>
    </div>
  );
};

export default Navi;
