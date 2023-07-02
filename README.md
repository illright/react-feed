# @illright/react-feed

![npm version](https://img.shields.io/npm/v/@illright/react-feed)
![minzipped package size](https://img.shields.io/bundlephobia/minzip/@illright/react-feed.svg)

_Your list of cards could do with a bit of keyboard navigation, eh?_

The headless implementation of the [ARIA feed pattern](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) for React.

## Installation

```bash
pnpm add @illright/react-feed
```

Type definitions are built in 😎. 

Minimum requirements for React? The one that has hooks (16.8+), that's it.

<details>
  <summary>I don't use <code>pnpm</code></summary>

What do you mean "I don't use [`pnpm`](https://pnpm.io)"? It's so much faster! Alright, here's your `npm` command:

```bash
npm install --save @illright/react-feed
```

</details>

## Usage

It exports two components: 
* `Feed`, the list of cards  
  Props:
  * `aria-labelledby?: string`, the ID of the element that labels the feed. This element should be outside the feed, like a sibling.
  * `aria-busy?: boolean`, whether the feed is being updated with more articles.
* `Article`, each individual card
  Props:
  * **Required**: `aria-labelledby: string`, the ID of the element that labels the article. This element should be inside the article.
  * `aria-describedby?: string`, the ID of the element that describes the article. It should be inside the article.

Here's an example (see the [demo](./demo) folder for a complete one): 

```tsx
import { useId } from "react";  // This is from React 18, but you don't have to use it
import { Feed, Article } from "react-feed";

// ↓ This is a hook to fetch data, e.g. from React Query
import { useArticles } from "./data";

export function App() {
  const idBase = useId();
  const { data: articles, fetchNextPage, isFetching } = useArticles();

  return (
    <Feed aria-busy={isFetching}>
      {articles.map((article) => (
        <Article
          key={article.title}
          aria-labelledby={`${idBase}-${article.id}`}
          aria-describedby={`${idBase}-${article.id}-desc`}
        >
          <h2 id={`${idBase}-${article.id}`}>{article.title}</h2>
          <p id={`${idBase}-${article.id}-desc`}>
            {article.description}
          </p>
        </Article>
      ))}
      // ↓ Note that the "load more" button should be an article too.
      <Article aria-labelledby={`${idBase}-more`}>
        <button
          id={`${idBase}-more`}
          onClick={() => fetchNextPage()}
        >
          Load more posts
        </button>
      </Article>
    </Feed>
  );
}
```

### Styling

The `<Feed>` component renders a `<div role="feed">` with no styling, you can pass any other props to it, for example, a class to style it. Similarly, the `<Article>` renders a `<article>` with no styling.

Therefore, styling with Tailwind CSS, plain CSS, or any other CSS-in-JS library is easy. Styling with styled-components will be supported in future versions.

## License

The source code of this project is distributed under the terms of the ISC license. It's like MIT, but better. [Click here](https://choosealicense.com/licenses/isc/) to learn what that means.
