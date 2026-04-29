import type { MetadataRoute } from "next";
export const dynamic = "force-static";

const rawBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? "";
const normalizedBasePath = rawBasePath
  ? rawBasePath.startsWith("/")
    ? rawBasePath
    : `/${rawBasePath}`
  : "";
const basePath =
  normalizedBasePath.length > 1 && normalizedBasePath.endsWith("/")
    ? normalizedBasePath.slice(0, -1)
    : normalizedBasePath;

const withBasePath = (path: string) =>
  `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

export default function manifest(): MetadataRoute.Manifest {
  const startUrl = basePath ? `${basePath}/` : "/";

  return {
    name: "Nifty Lab",
    short_name: "Nifty Lab",
    description:
      "Quick calculators for every day use.",
    start_url: startUrl,
    scope: startUrl,
    display: "standalone",
    background_color: "#11130f",
    theme_color: "#11130f",
    lang: "en",
    orientation: "portrait",
    icons: [
      {
        src: withBasePath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/icon-192-maskable.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: withBasePath("/icons/icon-512-maskable.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
