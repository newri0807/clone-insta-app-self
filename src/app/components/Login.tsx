"use client"; // 필수!
import { signIn, signOut } from "next-auth/react";

const Login = () => {
  return (
    <div>
      <button onClick={() => signIn()}>Sign In</button>
      {/* <button onClick={() => signOut()}>Sign Out</button> */}
    </div>
  );
};

export default Login;
