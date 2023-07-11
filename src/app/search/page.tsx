import { Metadata } from "next";
import UserSearch from "../components/UserSearch";

export const metadata: Metadata = {
  title: {
    default: "User Search",
    template: "Search users to follow",
  },
};

export default function page() {
  return <UserSearch />;
}
