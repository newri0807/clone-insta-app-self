import { client } from "./sanity";

type OAuthUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  image?: string | null;
};
export async function addUser({ id, username, email, image, name }: OAuthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: "user",
    username,
    email,
    image,
    name,
    following: [],
    followers: [],
    bookmarks: [],
  });
}

export async function getUserByUsername(username: string) {
  return client.fetch(
    `*[_type == "user" && username == "${username}"][0]{
      ...,
      "id":_id,
      following[]->{username,image,_id},
      followers[]->{username,image,_id},
      "bookmarks":bookmarks[]->_id
    }`
  );
}

export async function addCommentToPost(
  postId: string,
  comment: string,
  userId: string
) {
  return client
    .patch(postId)
    .setIfMissing({ comments: [] })
    .append("comments", [
      { comment, author: { _ref: userId, _type: "refence" } },
    ])
    .commit({ autoGenerateArrayKeys: true });
}
