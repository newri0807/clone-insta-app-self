import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { toggleFollow } from "@/app/service/post";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;

  if (!userInfo) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const requestData = await request.json();
  const { postUserId, userId } = requestData;

  return toggleFollow(postUserId, userId)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}
