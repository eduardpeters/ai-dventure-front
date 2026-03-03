interface ChoiceProps {
  content: string;
  chosen: boolean;
  isCurrent: boolean;
  onChosen: VoidFunction;
}

export default function Choice({
  content,
  chosen,
  isCurrent,
  onChosen,
}: ChoiceProps) {
  if (isCurrent) {
    return (
      <button
        className="transition-tranform duration-300 text-justify underline text-gray-800 dark:text-neutral-200 cursor-pointer hover:scale-105"
        onClick={onChosen}
      >
        {content}
      </button>
    );
  }
  return (
    <span
      className={
        chosen
          ? "max-w-3/4 text-lg text-gray-800 dark:text-neutral-200 self-end"
          : "text-neutral-500 dark:text-gray-500"
      }
    >
      {content}
    </span>
  );
}
