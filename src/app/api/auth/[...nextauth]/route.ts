import { addUser } from "@/app/service/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // 원하는 소셜 provider를 같은 방식으로 추가
  ],
  callbacks: {
    async signIn({ user: { id, name, email, image } }) {
      //console.log(user);
      if (!email) {
        return false;
      }
      addUser({
        id,
        name: email.split("@")[0] || "",
        email,
        image,
        username: email.split("@")[0],
      });
      return true;
    },
    async session({ session, token }: any) {
      const user = session?.user;
      if (user) {
        session.user = {
          ...user,
          username: user.email?.split("@")[0] || "",
          id: token.id as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export default NextAuth(authOptions);
