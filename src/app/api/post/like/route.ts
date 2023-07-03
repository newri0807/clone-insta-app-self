import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { toggleLike } from "@/app/service/post";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;

  if (!userInfo) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const requestData = await request.json();
  const { postId, userId } = requestData;

  return toggleLike(postId, userId)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}
