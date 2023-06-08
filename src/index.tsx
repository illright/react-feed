import {
  type ComponentProps,
  forwardRef,
  useRef,
  createContext,
  type RefObject,
  useContext,
  useState,
  useEffect,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { FocusScope, useFocusManager, useKeyboard } from "react-aria";
import { getFocusableTreeWalker } from "@react-aria/focus";
import { mergeRefs } from "@react-aria/utils";

export type FeedProps = Omit<ComponentProps<"div">, "role">;
export interface ArticleProps extends ComponentProps<"article"> {
  "aria-labelledby": string;
}

const FeedRefContext = createContext<RefObject<HTMLDivElement> | null>(null);

export const Feed = forwardRef<HTMLDivElement, FeedProps>(
  ({ children, ...restProps }, ref) => {
    const realRef = useRef<HTMLDivElement>(null);
    const [setSize, setSetSize] = useState(-1);

    useEffect(() => {
      if (realRef.current === null) {
        return;
      }

      setSetSize([...realRef.current.children].filter(isArticle).length);

      const observer = new MutationObserver(([record]) => {
        setSetSize(
          ([...record.target.childNodes] as Element[]).filter(isArticle).length
        );
      });
      observer.observe(realRef.current, { childList: true });

      return () => observer.disconnect();
    }, [realRef, setSetSize]);

    return (
      <div role="feed" ref={mergeRefs(ref, realRef)} {...restProps}>
        <FeedRefContext.Provider value={realRef}>
          <FocusScope>
            {Children.map(children, (child, index) =>
              isValidElement(child)
                ? cloneElement(child, {
                    "aria-setsize": setSize,
                    "aria-posinset": index + 1,
                    ...child.props,
                  })
                : child
            )}
          </FocusScope>
        </FeedRefContext.Provider>
      </div>
    );
  }
);

Feed.displayName = "Feed";

export const Article = forwardRef<HTMLDivElement, ArticleProps>(
  (props, ref) => {
    const focusManager = useFocusManager();
    const feedRef = useContext(FeedRefContext);

    function isArticleInThisFeed(node: Element) {
      const isInFeed = node.parentElement === feedRef?.current;

      return isArticle(node) && isInFeed;
    }

    const { keyboardProps } = useKeyboard({
      onKeyDown: (e) => {
        if (e.key === "PageDown") {
          e.preventDefault();
          focusManager.focusNext({
            accept: e.altKey ? isArticle : isArticleInThisFeed,
          });
        } else if (e.key === "PageUp") {
          e.preventDefault();
          focusManager.focusPrevious({
            accept: e.altKey ? isArticle : isArticleInThisFeed,
          });
        } else if (e.key === "Home") {
          e.preventDefault();
          const nodeBeforeFeed = getElementBefore(feedRef?.current ?? null);
          if (nodeBeforeFeed !== null && e.ctrlKey) {
            nodeBeforeFeed.focus();
          } else {
            focusManager.focusFirst({ accept: isArticleInThisFeed });
          }
        } else if (e.key === "End") {
          e.preventDefault();
          const nodeAfterFeed = getElementAfter(feedRef?.current ?? null);
          if (nodeAfterFeed !== null && e.ctrlKey) {
            nodeAfterFeed.focus();
          } else {
            focusManager.focusLast({ accept: isArticleInThisFeed });
          }
        }
      },
    });

    return <article tabIndex={0} ref={ref} {...keyboardProps} {...props} />;
  }
);

Article.displayName = "Article";

function getElementBefore(node: HTMLElement | null) {
  if (node?.parentElement != null) {
    const walker = getFocusableTreeWalker(document.body, { from: node });
    return walker.previousNode() as HTMLElement | null;
  }
  return null;
}

function getElementAfter(node: HTMLElement | null) {
  if (node?.parentElement != null) {
    const walker = getFocusableTreeWalker(document.body, { from: node });
    return walker.nextNode() as HTMLElement | null;
  }
  return null;
}

function isArticle(node: Element) {
  return node.tagName === "ARTICLE" || node.role?.toLowerCase() === "article";
}
