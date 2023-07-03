import { addCommentToPost } from "@/app/service/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getfollowingPost } from "@/app/service/post";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;
  const userName =
    userInfo && userInfo.email ? userInfo.email.split("@")[0] : "";

  if (!userInfo) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  return getfollowingPost(userName).then((data) => NextResponse.json(data));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;

  if (!userInfo) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const requestData = await request.json();
  const { postId, comment, userId } = requestData;

  return addCommentToPost(postId, comment, userId)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}
