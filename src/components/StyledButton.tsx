import type { ButtonHTMLAttributes } from "react";

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function StyledButton({ text, ...props }: StyledButtonProps) {
  return (
    <button
      className="shadow-sm border rounded-lg p-2 cursor-pointer disabled:cursor-not-allowed text-black bg-neutral-200 hover:outline dark:text-neutral-100 dark:bg-slate-800"
      {...props}
    >
      {text}
    </button>
  );
}
