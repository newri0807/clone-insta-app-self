import { FormEvent } from "react";

export interface Author {
  username: string;
  image: string;
}

export interface Comment {
  _createdAt: Date;
  author: Author;
  comment: string;
  // Add more comment properties as needed
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author; // Updated to be an object of type Author
  createdAt: Date;
  comments: Comment[]; // Updated to be an array of Comment objects
  likes: []; // Update the type of likes if applicable
  isBookmarked: boolean;
  followers: [];
  following: [];
  bookMarks: [];
  image: string;
  username: string;
  name: string;
  photo: string;

  // Add more properties as needed
}
export interface UserInfo {
  username: string;
  id: string;
  userId: string;
  // Add more properties as needed
}

export interface MainProps {
  propsChildren: React.ReactNode;
}
