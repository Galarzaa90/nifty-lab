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
    description: "Compare everyday items by their true unit price.",
    start_url: startUrl,
    scope: startUrl,
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#486cea",
    lang: "en",
    orientation: "portrait",
    icons: [
      {
        src: withBasePath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
