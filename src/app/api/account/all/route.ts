import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getAllAccount } from "@/app/service/account";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") as string;
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;

  // const userName =
  //   userInfo && userInfo.email ? userInfo.email.split("@")[0] : "";

  // if (!userInfo) {
  //   return new Response(`Authentication Error`, { status: 401 });
  // }

  return getAllAccount().then((data) => NextResponse.json(data));
}
