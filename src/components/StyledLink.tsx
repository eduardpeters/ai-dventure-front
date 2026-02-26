import {
  Link,
  type RegisteredRouter,
  type ValidateLinkOptions,
} from "@tanstack/react-router";

interface StyledLinkProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> {
  text: string;
  linkOptions: ValidateLinkOptions<TRouter, TOptions>;
}

export default function StyledLink<TRouter extends RegisteredRouter, TOptions>(
  props: StyledLinkProps<TRouter, TOptions>,
) {
  return (
    <Link
      className="rounded-lg p-2 cursor-pointer text-neutral-100 bg-sky-600 hover:text-neutral-50 hover:bg-sky-700 dark:bg-sky-800 dark:hover:bg-sky-700"
      {...props.linkOptions}
    >
      {props.text}
    </Link>
  );
}
