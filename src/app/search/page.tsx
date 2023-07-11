import { Metadata } from "next";
import UserSearch from "../components/UserSearch";

export const metadata: Metadata = {
  title: {
    default: "User Search",
    template: "Search users to follow",
  },
};
// 요청이 올때마다 수행하게 셋팅
export const dynamic = "force-dynamic";
export default function page() {
  return <UserSearch />;
}
