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
      className="shadow-sm border text-center rounded-lg p-2 cursor-pointer text-black bg-neutral-200 hover:outline dark:text-neutral-100 dark:bg-slate-800"
      {...props.linkOptions}
    >
      {props.text}
    </Link>
  );
}
