import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { getUserByUsername } from "@/app/service/user";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;

  const userName =
    userInfo && userInfo.email ? userInfo.email.split("@")[0] : "";

  if (!userInfo) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  return getUserByUsername(userName).then((data) => NextResponse.json(data));
}
