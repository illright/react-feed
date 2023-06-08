import { useInfiniteQuery } from "@tanstack/react-query";

export const articles = new Array(20).fill(null).map((_, index) => ({
  title: `Article ${index + 1}`,
  description: "This is an article",
  comments: new Array(Math.floor(Math.random() * 3)).fill(null).map((_, index) => ({
    text: "Nice!",
    id: String(index),
  })),
}));

export function useArticles() {
  return useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: async ({ pageParam }) => {
      await sleep(1000);

      return new Array(20).fill(null).map((_, index) => ({
        title: `Article ${(pageParam ?? 0) * 20 + index + 1}`,
        description: "This is an article",
        comments: new Array(Math.floor(Math.random() * 3))
          .fill(null)
          .map((_, index) => ({
            text: "Nice!",
            id: String(index),
          })),
      }));
    },
    getNextPageParam: (data) => Math.floor((data.length ?? 0) / 20),
    networkMode: "offlineFirst"
  })
}

function sleep(timeMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeMs));
}
