import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "context/user";
import Nav from "components/nav";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Nav />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
