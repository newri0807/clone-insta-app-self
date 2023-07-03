import urlFor, { client } from "./sanity";
import { UserInfo } from "./type";

export async function getAllAccount() {
  const users = await client.fetch(
    `*[_type == "user"]{
      ...,
      "id":_id,
      following[]->{username,image,_id},
      followers[]->{username,image,_id},
      "bookmarks":bookmarks[]->_id
    }`
  );

  // 중복 제거를 위해 Set을 사용하여 유일한 값만 포함된 배열 생성
  const uniqueUsers = Array.from(
    new Set(users.map((user: UserInfo) => user.id))
  ).map((id) => users.find((user: UserInfo) => user.id === id));

  return uniqueUsers;
}
