import { Metadata } from "next";
import AuthSession from "./components/AuthSession";
import Main from "./components/Main";
import Navi from "./components/Navi";
import SWRConfigContext from "./context/SWRConfigContext";
import "./globals.css";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Instantgram clone -self",
    template: "Instantgram | %s",
  },
  description: "Instantgram Photos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className} suppressHydrationWarning={true}>
        <AuthSession>
          <Navi />
          <h1>2222</h1>
          <SWRConfigContext>
            <Main propsChildren={children} />
          </SWRConfigContext>
        </AuthSession>
      </body>
    </html>
  );
}
