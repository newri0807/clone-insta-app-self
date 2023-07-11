import { Metadata } from "next";
import { ClientSafeProvider, signIn } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    default: "SignIn",
    template: "Signup or Login to Instantgram",
  },
};

type Props = {
  providers: Record<string, ClientSafeProvider>;
  callbackUrl: string;
};

const Signin = ({ providers, callbackUrl }: Props) => {
  return (
    <>
      {Object.values(providers).map(({ name, id }) => (
        <div key={id}>
          <button
            className="m-4 p-1 rounded-md from-rose-400 via-fuchsia-500 to-indigo-500 bg-gradient-to-r"
            onClick={() => signIn(id, { callbackUrl })}
          >
            <span className="block text-black px-4 py-2 font-semibold rounded-md bg-white hover:bg-transparent hover:text-white transition">
              {" "}
              Sign In
            </span>
          </button>
        </div>
      ))}
    </>
  );
};

export default Signin;
