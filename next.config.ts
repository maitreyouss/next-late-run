import type { NextConfig } from "next";

import { securityHeaders } from "./src/lib/http/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["@modelcontextprotocol/sdk"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
};

export default nextConfig;
