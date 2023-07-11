"use client";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";
import Avatar from "../components/Avartar";
import Avartar from "../components/Avartar";
import { Post } from "../service/type";

function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading } = useSWR(`/api/account/all`);

  const filteredData = data
    ? data.filter((item: Post) =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  console.log(data);
  return (
    <div className="w-[60%] my-10 mx-auto">
      <form onSubmit={(event) => event.preventDefault()}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="border w-full p-1"
          placeholder="Search for username or name..."
        />
      </form>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error occurred</div>}
      {filteredData.length > 0 && (
        <ul className="my-4 w-full bg-white">
          {filteredData.map((result: Post) => (
            <Link key={result._id} href={`/post/${result.username}`}>
              <li className="flex items-center border p-2 justify-around gap-2 my-2">
                <Avartar img={result.image} active={false} size="small" />
                <div className="w-full flex-wrap">
                  <p className="font-boldw-full"> {result.username}</p>
                  <p className="w-full text-gray-600"> {result.name}</p>
                  <p className="w-full text-gray-600">
                    {" "}
                    {result.followers?.length || 0} followers &nbsp;
                    {result.following?.length || 0} following
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserSearch;
