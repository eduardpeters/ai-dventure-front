import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { advanceAdventureMutationOptions } from "../queryOptions/adventures";
import type { ChapterResponse } from "../services/adventures";

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
  const { t } = useTranslation();
  const adventureMutation = useMutation(advanceAdventureMutationOptions);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const chaptersRef = useRef<HTMLDivElement | null>(null);

  const hasEnded =
    chapters.length > 0 && chapters[chapters.length - 1].choices.length === 0;

  useEffect(() => {
    if (chapters.length === 0) {
      const stored = sessionStorage.getItem(adventureId);
      if (!stored) {
        console.log("Allow for manual start!");
        return;
      }
      try {
        const parsedChapter = JSON.parse(stored) as ChapterResponse;
        setCurrentChapter(parsedChapter.chapterNumber);
        setChapters([
          {
            ...parsedChapter,
            choices: parsedChapter.choices.map((c) => ({
              ...c,
              chosen: false,
            })),
          },
        ]);
      } catch (e: unknown) {
        console.error(e);
      }
    }

    return () => {
      sessionStorage.removeItem(adventureId);
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
      // Update the DOM Synchronously so that scrolling to the last child occurs with the new node appended
      flushSync(() => {
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
      });
      if (chaptersRef.current) {
        chaptersRef.current.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }
    } catch (error: unknown) {
      console.error(error);
    }
  }

  return (
    <main className="h-full w-full flex flex-col items-center p-2 gap-8">
      <h1>{t("adventure.title")}</h1>
      <div ref={chaptersRef}>
        {chapters.map((chapter) => (
          <div key={chapter.chapterNumber}>
            <p>{chapter.narrative}</p>
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
      </div>
      {adventureMutation.isPending && <div>{t("adventure.narrating")}</div>}
      {hasEnded && (
        <div className="flex flex-col gap-2">
          <span>{t("adventure.concluded")}</span>
          <Link
            to="/"
            className="text-sm border rounded-lg p-1 cursor-pointer self-start"
          >
            {t("adventure.link-home")}
          </Link>
        </div>
      )}
    </main>
  );
}
