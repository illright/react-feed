import { useId } from "react";
import { Feed, Article } from "react-feed";

import { useArticles } from "./data";
import classes from "./App.module.css";

export function App() {
  const idBase = useId();
  const { data: articles, fetchNextPage, isLoading } = useArticles();

  return (
    <div className={classes.root}>
      <h1 id={idBase}>Feed</h1>
      {articles !== undefined && (
        <Feed
          className={classes.feed}
          aria-labelledby={idBase}
          aria-busy={isLoading}
        >
          {articles.pages.flat().map((article) => (
            <Article
              className={classes.post}
              aria-labelledby={getId(idBase, article.title, "label")}
              aria-describedby={getId(idBase, article.title, "desc")}
              key={article.title}
            >
              <h2 id={getId(idBase, article.title, "label")}>
                {article.title}
              </h2>
              <p id={getId(idBase, article.title, "desc")}>
                {article.description}
              </p>
              <button>Like</button>
              {article.comments.length > 0 && (
                <>
                  <h3 id={getId(idBase, article.title, "comments")}>
                    Comments
                  </h3>
                  <Feed
                    aria-labelledby={getId(idBase, article.title, "comments")}
                    className={classes.comments}
                  >
                    {article.comments.map((comment) => (
                      <Article
                        className={classes.comment}
                        key={comment.id}
                        aria-labelledby={getId(
                          idBase,
                          article.title,
                          "comment",
                          comment.id
                        )}
                      >
                        <span
                          id={getId(
                            idBase,
                            article.title,
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
        </Feed>
      )}
      <button onClick={() => fetchNextPage()}>load more posts</button>
    </div>
  );
}

function getId(...components: string[]) {
  return components.map((component) => component.replace(" ", "-")).join("-");
}
