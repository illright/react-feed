import { useEffect, useId, useRef } from "react";
import { Feed, Article } from "react-feed";
import { useIntersectionObserver } from "usehooks-ts";

import { useArticles } from "./data";
import classes from "./App.module.css";

export function App() {
  const idBase = useId();
  const { data: articles, fetchNextPage, isFetching } = useArticles();

  const ref = useRef<HTMLButtonElement>(null);
  const entry = useIntersectionObserver(ref, { rootMargin: "3000px" });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className={classes.root}>
      <h1 id={idBase}>Feed</h1>
      {articles !== undefined && (
        <Feed
          className={classes.feed}
          aria-labelledby={idBase}
          aria-busy={isFetching}
        >
            {articles.pages.flat().map((article) => (
              <Article
                className={classes.post}
                aria-labelledby={getId(idBase, article.id, "label")}
                aria-describedby={getId(idBase, article.id, "desc")}
                key={article.title}
              >
                <h2 id={getId(idBase, article.id, "label")}>{article.title}</h2>
                <p id={getId(idBase, article.id, "desc")}>
                  {article.description}
                </p>
                <button>Like</button>
                {article.comments.length > 0 && (
                  <>
                    <h3 id={getId(idBase, article.id, "comments")}>Comments</h3>
                    <Feed
                      aria-labelledby={getId(idBase, article.id, "comments")}
                      className={classes.comments}
                    >
                      {article.comments.map((comment) => (
                        <Article
                          className={classes.comment}
                          key={comment.id}
                          aria-labelledby={getId(
                            idBase,
                            article.id,
                            "comment",
                            comment.id
                          )}
                        >
                          <span
                            id={getId(
                              idBase,
                              article.id,
                              "comment",
                              comment.id
                            )}
                          >
                            {comment.text}
                          </span>
                        </Article>
                      ))}
                    </Feed>
                  </>
                )}
              </Article>
            ))}
            <Article aria-labelledby={getId(idBase, "load")}>
              <button
                id={getId(idBase, "load")}
                ref={ref}
                onClick={() => fetchNextPage()}
              >
                Load more posts
              </button>
            </Article>
        </Feed>
      )}
    </div>
  );
}

function getId(...components: string[]) {
  return components.map((component) => component.replace(" ", "-")).join("-");
}
