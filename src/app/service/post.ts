import urlFor, { assetsURL, client } from "./sanity";
import { Post, UserInfo } from "./type";

export async function getfollowingPost(username: string) {
  const user = await client.fetch(
    `*[_type == "user" && username == "${username}"][0]`
  );

  const bookmarkedPostIds = user.bookmarks.map(
    (bookmark: { _ref: Bookmark }) => bookmark._ref
  );

  return client
    .fetch(
      `*[_type == "post" && author._ref in *[_type == "user" && _id in *[_type == "user" && username == "${username}"].following[]._ref]._id]{
        _id,
        author->{
          username,
          name,
          image
        },
        photo,
        likes[]->{
          username,
          name,
          image
        },
        "comments": comments[]{
          ...,
          author->{
            username,
            name,
            image
          },
          "_createdAt": ^._createdAt,
          "_updatedAt": ^._updatedAt
        },
        "isBookmarked": _id in $bookmarkedPostIds
      } | order(_createdAt desc)`,
      {
        bookmarkedPostIds,
      }
    )
    .then((posts) =>
      posts.map((post: Post) => ({
        ...post,
        image: urlFor(post.photo),
        isBookmarked: post.isBookmarked === true, // Convert to boolean
      }))
    );
}

//북마크 토글 관련

interface Bookmark {
  _ref: string;
  _type: string;
  // Add more properties as needed
}
export async function toggleBookmark(postId: string, userId: string) {
  const user = await client.fetch(
    `*[_type == "user" && _id == "${userId}"][0]`
  );
  const bookmarkedPostIds = user.bookmarks.map(
    (bookmark: Bookmark) => bookmark._ref
  );

  const updatedBookmarks = bookmarkedPostIds.includes(postId)
    ? user.bookmarks.filter((bookmark: Bookmark) => bookmark._ref !== postId)
    : [...user.bookmarks, { _ref: postId, _type: "reference" }];

  return client
    .patch(userId)
    .set({ bookmarks: updatedBookmarks })
    .commit({ autoGenerateArrayKeys: true });
}

//좋아요 토글 관련
interface Likes {
  _ref: string;
  _type: string;
  // Add more properties as needed
}
export async function toggleLike(postId: string, userId: string) {
  const post = await client.fetch(
    `*[_type == "post" && _id == "${postId}"][0]`
  );
  const likesPostIds = post.likes.map((like: Likes) => like._ref);

  const updatedLikes = likesPostIds.includes(userId)
    ? post.likes.filter((like: Likes) => like._ref !== userId)
    : [...post.likes, { _ref: userId, _type: "reference" }];

  return client
    .patch(postId)
    .set({ likes: updatedLikes })
    .commit({ autoGenerateArrayKeys: true });
}

//팔로우 토글 관련
interface Follows {
  _ref: string;
  _type: string;
  // Add more properties as needed
}
export async function toggleFollow(postUserId: string, userId: string) {
  const user = await client.fetch(
    `*[_type == "user" && _id == "${userId}"][0]`
  );
  const filterFollow = user.following.map((follow: Follows) => follow._ref);

  const updatedFollow = filterFollow.includes(postUserId)
    ? user.following.filter((follow: Follows) => follow._ref !== postUserId)
    : [...user.following, { _ref: postUserId, _type: "reference" }];

  return client
    .patch(userId)
    .set({ following: updatedFollow })
    .commit({ autoGenerateArrayKeys: true });
}

//포스트 업로드
export async function myPostUpload(userId: string, text: string, file: Blob) {
  console.log(userId, text, file);

  return fetch(assetsURL, {
    method: "POST",
    headers: {
      "content-type": file.type,
      authorization: `Bearer ${process.env.SANITY_SECRET_TOKEN}`,
    },
    body: file,
  })
    .then((res) => res.json())
    .then((result) => {
      return client.create(
        {
          _type: "post",
          author: { _ref: userId },
          photo: { asset: { _ref: result.document._id } },
          comments: [
            {
              comment: text,
              author: { _ref: userId, _type: "reference" },
            },
          ],
          likes: [],
        },
        { autoGenerateArrayKeys: true }
      );
    });
}
