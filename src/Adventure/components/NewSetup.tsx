import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { adventureTypesQueryOptions } from "../queryOptions/adventureTypes";
import {
  advanceAdventureMutationOptions,
  createAdventureMutationOptions,
} from "../queryOptions/adventures";

export default function NewSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const adventureTypesQuery = useSuspenseQuery(adventureTypesQueryOptions);
  const adventureMutation = useMutation(createAdventureMutationOptions);
  const initializeAdventureMutation = useMutation(
    advanceAdventureMutationOptions
  );
  const [selectedType, setSelectedType] = useState<string | undefined>(
    adventureTypesQuery.data[0]?.id
  );

  const adventureTypes = adventureTypesQuery.data;

  const description =
    adventureTypes.find((type) => type.id === selectedType)?.description ??
    "missing";

  async function newAdventure(e: FormEvent) {
    e.preventDefault();
    if (!selectedType) return;

    try {
      const newAdventure = await adventureMutation.mutateAsync(selectedType);

      try {
        const firstChapter = await initializeAdventureMutation.mutateAsync({
          adventureId: newAdventure.adventure,
        });
        if (firstChapter) {
          // Allows for retrieval upon arriving on the Gameplay page
          sessionStorage.setItem(
            newAdventure.adventure,
            JSON.stringify(firstChapter)
          );
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        navigate({
          to: "/adventure/$adventureId",
          params: { adventureId: newAdventure.adventure },
        });
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }

  return (
    <main className="h-full w-full flex flex-col items-center p-2 gap-8">
      <Link
        to="/"
        className="text-sm border rounded-lg p-1 cursor-pointer self-start"
      >
        {t("new.link-home")}
      </Link>
      {adventureTypesQuery.isError ? (
        <div>
          <span>This is unfortunate, please come back later!</span>
        </div>
      ) : (
        <form
          onSubmit={(e) => newAdventure(e)}
          className="w-full flex-1 flex flex-col gap-8 p-4"
        >
          <h1 className="text-3xl">{t("new.title")}</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="adventure-type">{t("new.label-setting")}</label>
            <select
              name="adventure-type"
              id="adventure-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              required
              className="border rounded-lg p-2"
            >
              {adventureTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {t(`new.option-${type.description}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl">{t("new.title-summary")}</h3>
            <p>{t(`new.summary-${description}`)}</p>
          </div>
          <button
            type="submit"
            disabled={
              !selectedType ||
              adventureMutation.isPending ||
              initializeAdventureMutation.isPending
            }
            className="border rounded-lg p-2 cursor-pointer"
          >
            {t("new.btn-submit")}
          </button>
        </form>
      )}
    </main>
  );
}
