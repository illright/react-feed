import { useInfiniteQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";

export const articles = new Array(20).fill(null).map(() => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  comments: new Array(Math.floor(Math.random() * 3))
    .fill(null)
    .map((_, index) => ({
      text: faker.lorem.sentences(),
      id: String(index),
    })),
}));

export function useArticles() {
  return useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      await sleep(1000);

      return new Array(20).fill(null).map(() => ({
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        comments: new Array(Math.floor(Math.random() * 3))
          .fill(null)
          .map((_, index) => ({
            text: faker.lorem.sentences(),
            id: String(index),
          })),
      }));
    },
    getNextPageParam: (_lastPage, allPages) => allPages.length ?? 0 + 1,
    networkMode: "offlineFirst",
  });
}

function sleep(timeMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeMs));
}
