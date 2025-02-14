import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config/config";
import Navigation from "../components/Navigation";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Navigation />
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
