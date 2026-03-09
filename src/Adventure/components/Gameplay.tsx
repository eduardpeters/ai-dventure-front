import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  adventureQueryOptions,
  advanceAdventureMutationOptions,
} from "../queryOptions/adventures";
import Choice from "./Choice";
import StyledButton from "@/components/StyledButton";
import StyledLink from "@/components/StyledLink";

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

export default function Gameplay({ adventureId }: Readonly<GameplayProps>) {
  const { t } = useTranslation();
  const adventure = useSuspenseQuery(adventureQueryOptions(adventureId));
  const adventureMutation = useMutation(advanceAdventureMutationOptions);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const chaptersRef = useRef<HTMLDivElement | null>(null);

  const notStarted = chapters.length === 0 && currentChapter === 0;
  const hasEnded =
    chapters.length > 0 && chapters[chapters.length - 1].choices.length === 0;

  useEffect(() => {
    if (!adventure.isError && adventure.data) {
      // Split latest adventure state into our local state and manage it from there
      if (adventure.data.chapters.length === 0) {
        console.log("Allow for manual start here");
        return;
      }
      let latestChapter = 0;
      const previousChapters: Chapter[] = adventure.data.chapters.map(
        (chapter) => {
          if (chapter.number > latestChapter) latestChapter++;
          return {
            chapterNumber: chapter.number,
            narrative: chapter.narrative,
            choices: [...chapter.choices],
          };
        },
      );
      setCurrentChapter(latestChapter);
      setChapters(previousChapters);
    }
  }, [adventure.isError, adventure.data]);

  async function startAdventure() {
    if (chapters.length !== 0) return;

    try {
      const firstChapter = await adventureMutation.mutateAsync({
        adventureId,
      });
      if (!firstChapter) {
        console.error("No response received");
        return;
      }
      setCurrentChapter(firstChapter.chapterNumber);
      setChapters([
        {
          ...firstChapter,
          choices: firstChapter.choices.map((c) => ({
            ...c,
            chosen: false,
          })),
        },
      ]);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  async function advanceAdventure(chapterChoiceId: string) {
    try {
      const nextChapter = await adventureMutation.mutateAsync({
        adventureId,
        chapterChoiceId,
      });

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
              : chapter,
          ),
          {
            ...nextChapter,
            choices: nextChapter.choices.map((c) => ({ ...c, chosen: false })),
          },
        ]);
        setCurrentChapter(nextChapter.chapterNumber);
      });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      if (chaptersRef.current) {
        chaptersRef.current.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-2 gap-4 text-black bg-neutral-200 dark:text-neutral-200 dark:bg-slate-800">
      <h1 className="text-lg tracking-wide">{t("adventure.title")}</h1>
      {notStarted && (
        <div className="flex flex-col items-center gap-4">
          <p>{t("adventure.start")}</p>
          <StyledButton
            text={t("adventure.btn-start")}
            onClick={startAdventure}
            disabled={adventureMutation.isPending}
          />
        </div>
      )}
      <div ref={chaptersRef} className="max-w-xl flex flex-col gap-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.chapterNumber}
            className="flex flex-col gap-2 px-2 sm:px-0"
          >
            <p className="text-justify">{chapter.narrative}</p>
            <div className="flex flex-col gap-1">
              {chapter.choices.map((choice) => (
                <Choice
                  key={choice.id}
                  content={choice.action}
                  chosen={choice.chosen}
                  onChosen={() => advanceAdventure(choice.id)}
                  isCurrent={currentChapter === chapter.chapterNumber}
                />
              ))}
            </div>
          </div>
        ))}
        {adventureMutation.isError && (
          <div className="text-red-600 dark:text-red-400">
            {t("adventure.error-chapter")}
          </div>
        )}
        {adventureMutation.isPending && <div>{t("adventure.narrating")}</div>}
      </div>
      {hasEnded && (
        <div className="flex flex-col gap-2 pb-4">
          <span className="dark:text-neutral-100 text-lg">
            {t("adventure.concluded")}
          </span>
          <StyledLink
            text={t("adventure.link-home")}
            linkOptions={{ to: "/" }}
          />
        </div>
      )}
    </main>
  );
}
