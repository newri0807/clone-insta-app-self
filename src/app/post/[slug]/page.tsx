import AccountDetailHeader from "@/app/components/AccountDetailHeader";
import AccountDetailTabPage from "@/app/components/AccountDetailTabPage";

import React from "react";
type Props = {
  params: {
    slug: string; // slug는 폴더명;
  };
};

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.slug} · Instantgram Photos`,
    description: `${params.slug}'s all Instantgram posts`,
  };
}

const page = ({ params }: Props) => {
  return (
    <div className="p-2">
      <AccountDetailHeader username={params.slug} />
      <AccountDetailTabPage username={params.slug} />

      {/* 탭메뉴 */}
    </div>
  );
};

export default page;
