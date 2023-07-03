/* eslint-disable @next/next/no-img-element */
import React from "react";

type Props = {
  img: string;
  active: boolean;
  size: string;
};

const Avatar = ({ img, active, size }: Props) => {
  const getSizeClassName = () => {
    if (size === "small") {
      return "w-12 h-12";
    } else if (size === "large") {
      return "w-13 h-13";
    } else {
      return "w-[100px] h-[100px]";
    }
  };

  const getClassNames = () => {
    if (active) {
      return "p-[2px] from-rose-400 via-fuchsia-500 to-indigo-500 bg-gradient-to-r";
    } else {
      return "";
    }
  };

  return (
    <>
      {img && (
        <img
          className={`m-[0 auto] rounded-full overflow-hidden min-w-[48px]  ${getSizeClassName()} ${getClassNames()}`}
          src={img}
          alt=""
        />
      )}
    </>
  );
};

export default Avatar;
