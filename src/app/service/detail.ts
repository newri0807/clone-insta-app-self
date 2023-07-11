import { Session } from "inspector";
import urlFor, { client } from "./sanity";
import { Post } from "./type";

export async function getUserPostDetail(
  userId: string,
  nowLoginUserName: string
) {
  // console.log(userId, nowLoginUserName);

  const [user, posts, nowloginUser, uploadingAllPosts] = await Promise.all([
    client.fetch(
      `*[_type == "user" && username == "${userId}"][0]{
        ...,
        "id":_id,
        following[]->{username,image,_id},
        followers[]->{username,image,_id},
        "bookmarks":bookmarks[]->_id
      }`
    ),
    client.fetch(
      `*[_type == "post"]{
        _id,
        author->{
          username,
          name,
          image
        },
        photo,
        likes[]->{username,name,image},
        comments[]{
          ...,
          author->{
            username,
            name,
            image
          },
        }
      }`
    ),
    client.fetch(
      `*[_type == "user" && username == "${nowLoginUserName}"][0]{
        ...,
        "id":_id,
        following[]->{username,image,_id},
        followers[]->{username,image,_id},
        "bookmarks":bookmarks[]->_id
      }`
    ),
    client.fetch(
      `*[_type == "post" && author->username == "${userId}"] | order(_createdAt desc) {
        _id,
        author->{
          username,
          name,
          image
        },
        photo,
        likes[]->{username,name,image},
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
    ),
  ]);

  const userLikes = user.likes;
  const userBookmarks = user.bookmarks || [];

  const filteredPosts = posts
    .filter((post: Post) =>
      post.likes.some((like: Post) => like.username === userId)
    )
    .map((post: Post) => ({
      _id: post._id,
      author: post.author,
      photo: post.photo,
      likes: post.likes,
      bookMarks: nowloginUser?.bookmarks || [],
      comments: post.comments,
      image: urlFor(post.photo),
    }));

  const bookmarkedPosts = posts
    .filter((post: Post) => userBookmarks && userBookmarks.includes(post._id))
    .map((post: Post) => ({
      _id: post._id,
      author: post.author,
      photo: post.photo,
      likes: post.likes,
      bookMarks: nowloginUser?.bookmarks || [],
      comments: post.comments,
      image: urlFor(post.photo),
    }));

  const isLoginUserFollowing =
    nowloginUser && nowloginUser.following
      ? nowloginUser.following.some(
          (follow: Post) => follow.username === userId
        )
      : false;

  const processedPosts = uploadingAllPosts.map((post: Post) => ({
    ...post,
    image: urlFor(post.photo),
    bookMarks: nowloginUser?.bookmarks || [],
  }));

  return {
    user,
    likes: filteredPosts,
    bookMarks: bookmarkedPosts || [],
    isLoginUserFollowing,
    uploadingAllPosts: processedPosts,
  };
}
