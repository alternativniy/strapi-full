import { StrictMode } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
export default function StartupLayout({ children }) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </StrictMode>
  )
}