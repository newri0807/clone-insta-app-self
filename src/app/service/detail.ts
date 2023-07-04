import urlFor, { client } from "./sanity";
import { Post } from "./type";

export async function getUserPostDetail(userId: string) {
  const user = await client.fetch(
    `*[_type == "user" && username == "${userId}"][0]{
      ...,
      "id":_id,
      following[]->{username,image,_id},
      followers[]->{username,image,_id},
      "bookmarks":bookmarks[]->_id
    }`
  );

  const posts = await client.fetch(
    `*[_type == "post"]{
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
      comments[]{
        ...,
        author->{
          username,
          name,
          image
        },
      }
    }`
  );

  const nowloginUser = await client.fetch(
    `*[_type == "user" && username == "${userId}"][0]{
      ...,
      "id":_id,
      following[]->{username,image,_id},
      followers[]->{username,image,_id},
      "bookmarks":bookmarks[]->_id
    }`
  );

  const uploadingAllPosts = await client.fetch(
    `*[_type == "post" && author->username == "${userId}"] | order(_createdAt desc) {
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
         "_updatedAt": ^._updatedAt,
      }
    }`
  );

  const filteredPosts = posts
    .map((post: Post) => ({
      _id: post._id,
      author: post.author,
      photo: post.photo,
      likes: post.likes.filter((like: Post) => like.username === userId),
      bookMarks: nowloginUser.bookmarks,
      comments: post.comments,
    }))
    .filter(
      (post: Post) =>
        post.likes && post.likes.some((like: Post) => like.username === userId)
    )
    .filter((post: Post) => post.likes.length > 0)
    .map((post: Post) => ({
      ...post,
      image: urlFor(post.photo),
    }));

  const bookmarkedPosts = posts
    .filter((post: Post) => user.bookmarks && user.bookmarks.includes(post._id))
    .map((post: Post) => ({
      _id: post._id,
      author: post.author,
      photo: post.photo,
      likes: post.likes,
      bookMarks: nowloginUser.bookmarks,
      comments: post.comments,
    }))
    .map((post: Post) => ({
      ...post,
      image: urlFor(post.photo),
    }));

  const isLoginUserFollowing =
    nowloginUser?.following &&
    nowloginUser.following.find((follow: Post) => follow.username === userId)
      ? true
      : false;

  const processedPosts = uploadingAllPosts.map((post: Post) => ({
    ...post,
    image: urlFor(post.photo),
    bookMarks: nowloginUser.bookmarks,
  }));

  return {
    user,
    likes: filteredPosts,
    bookMarks: bookmarkedPosts,
    isLoginUserFollowing: isLoginUserFollowing,
    uploadingAllPosts: processedPosts,
  };
}
