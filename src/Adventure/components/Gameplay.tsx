import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { advanceAdventureMutationOptions } from "../queryOptions/adventures";

interface GameplayProps {
  adventureId: string;
}

interface Chapter {
  chapterNumber: number;
  narrative: string;
  choices: {
    id: string;
    action: string;
    chosen: boolean;
  }[];
}

export default function Gameplay({ adventureId }: GameplayProps) {
  const adventureMutation = useMutation(advanceAdventureMutationOptions);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const initialized = useRef<boolean>(false);

  const hasEnded =
    chapters.length > 0 && chapters[chapters.length - 1].choices.length === 0;

  useEffect(() => {
    async function startAdventure(adventureId: string) {
      const nextChapter = await adventureMutation.mutateAsync({ adventureId });
      if (!nextChapter) {
        console.error("No response received");
        return;
      }
      setCurrentChapter(nextChapter.chapterNumber);
      setChapters((prev) => [
        ...prev,
        {
          ...nextChapter,
          choices: nextChapter.choices.map((c) => ({ ...c, chosen: false })),
        },
      ]);
    }

    // TODO: Remove this effect and send first mutation at adventure creation
    if (!initialized.current) {
      initialized.current = true;

      startAdventure(adventureId);
    }

    return () => {
      adventureMutation.reset();
    };
  }, []);

  async function advanceAdventure(chapterChoiceId: string) {
    try {
      const nextChapter = await adventureMutation.mutateAsync({
        adventureId,
        chapterChoiceId,
      });
      if (!nextChapter) {
        console.error("No response received");
        return;
      }
      setChapters((prev) => [
        ...prev.map((chapter) =>
          chapter.chapterNumber === currentChapter
            ? {
                ...chapter,
                choices: chapter.choices.map((c) => ({
                  ...c,
                  chosen: c.id === chapterChoiceId,
                })),
              }
            : chapter
        ),
        {
          ...nextChapter,
          choices: nextChapter.choices.map((c) => ({ ...c, chosen: false })),
        },
      ]);
      setCurrentChapter(nextChapter.chapterNumber);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  return (
    <main className="h-full w-full flex flex-col items-center p-2 gap-8">
      <h1>Now venturing in {adventureId}</h1>
      {chapters.map((chapter) => (
        <div key={chapter.chapterNumber}>
          <span>{chapter.narrative}</span>
          <div>
            {chapter.choices.map((choice) => (
              <button
                key={choice.id}
                className={`border rounded-md p-2 bg-gray-100 active:text-gray-800 active:bg-gray-300 ${choice.chosen ? "disabled:text-gray-800 disabled:bg-gray-200" : "disabled:text-gray-400 disabled:bg-gray-100"}`}
                onClick={() => advanceAdventure(choice.id)}
                disabled={currentChapter > chapter.chapterNumber}
              >
                {choice.action}
              </button>
            ))}
          </div>
        </div>
      ))}
      {adventureMutation.isPending && <div>narrating...</div>}
      {hasEnded && <div>The adventured has concluded</div>}
    </main>
  );
}
