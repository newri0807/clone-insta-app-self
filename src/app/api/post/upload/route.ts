import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { myPostUpload } from "@/app/service/post";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userInfo = session?.user;

  if (!userInfo) {
    return new Response(`Authentication Error`, { status: 401 });
  }

  const form = await request.formData();
  const userId = form.get("userId")?.toString();
  const text = form.get("text")?.toString();
  const file = form.get("file") as Blob;

  if (!text || !file) {
    return new Response("Bad Request", { status: 400 });
  }

  return myPostUpload(userId!, text, file)
    .then((res) => NextResponse.json(res))
    .catch((error) => new Response(JSON.stringify(error), { status: 500 }));
}
