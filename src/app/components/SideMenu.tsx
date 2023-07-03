"use client";
import { useSession } from "next-auth/react";
import React from "react";
import Avartar from "./Avartar";
import Link from "next/link";
function SideMenu() {
  const { data: session } = useSession();
  if (!session?.user) {
    return null; // 또는 원하는 처리를 수행하세요.
  }
  const username = (session.user as { username: string }).username;
  return (
    <div className="w-full">
      {session?.user && (
        <>
          <div className="flex justify-start items-center flex-wrap gap-1 mb-4">
            <Link href={`/post/${username}`} className="w-3/12">
              <Avartar
                img={session.user.image || ""}
                active={false}
                size="large"
              />
            </Link>
            <div className="w-7/12 ">
              <p className="w-full">{session.user.name}</p>
              <p className="font-bold w-full">{username}</p>
            </div>
          </div>
          <div className="w-full mb-4">
            <span className="text-slate-600">
              About • Help • Press • API • jobs • privacy • Terms • Location •
              Laguage
            </span>
          </div>
          <div className="w-full mb-4 font-bold text-sm">
            <span className="text-slate-600">
              ©Copyright INSTAGRAM from METAL
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default SideMenu;
