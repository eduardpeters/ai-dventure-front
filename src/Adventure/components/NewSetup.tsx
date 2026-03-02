import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { adventureTypesQueryOptions } from "../queryOptions/adventureTypes";
import {
  advanceAdventureMutationOptions,
  createAdventureMutationOptions,
} from "../queryOptions/adventures";
import { isServiceUnavailableError } from "@/errors/errors";
import StyledButton from "@/components/StyledButton";
import StyledLink from "@/components/StyledLink";

export default function NewSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const adventureTypesQuery = useSuspenseQuery(adventureTypesQueryOptions);
  const adventureMutation = useMutation(createAdventureMutationOptions);
  const initializeAdventureMutation = useMutation(
    advanceAdventureMutationOptions,
  );
  const [selectedType, setSelectedType] = useState<string | undefined>(
    adventureTypesQuery.data[0]?.id,
  );

  const adventureTypes = adventureTypesQuery.data;

  const description =
    adventureTypes.find((type) => type.id === selectedType)?.description ??
    "missing";

  async function newAdventure(e: FormEvent) {
    e.preventDefault();
    if (!selectedType) return;

    const newAdventure = await adventureMutation.mutateAsync(selectedType);

    try {
      // Allows for retrieval upon arriving on the Gameplay page
      await initializeAdventureMutation.mutateAsync({
        adventureId: newAdventure.adventure,
      });
    } catch (e: unknown) {
      console.error(e);
    } finally {
      navigate({
        to: "/adventure/$adventureId",
        params: { adventureId: newAdventure.adventure },
      });
    }
  }

  return (
    <main className="h-full w-full flex flex-col items-center p-2 gap-8 text-black bg-neutral-200 dark:text-neutral-200 dark:bg-slate-800">
      <div className="flex self-start p-4">
        <StyledLink text={t("new.link-home")} linkOptions={{ to: "/" }} />
      </div>

      {(adventureTypesQuery.isError || adventureMutation.isError) && (
        <div className="p-4">
          <span className="text-red-600 dark:text-red-400">
            {isServiceUnavailableError(adventureMutation.error)
              ? t(`new.error-${adventureMutation.error.type}`)
              : t("new.error-generic")}
          </span>
        </div>
      )}
      {adventureTypesQuery.isSuccess && (
        <form
          onSubmit={(e) => newAdventure(e)}
          className="w-full md:max-w-96 flex-1 flex flex-col gap-8 p-4"
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
              className="border rounded-lg p-2 dark:bg-slate-800"
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
          <StyledButton
            type="submit"
            disabled={
              !selectedType ||
              adventureMutation.isPending ||
              initializeAdventureMutation.isPending
            }
            text={t("new.btn-submit")}
          />
        </form>
      )}
    </main>
  );
}
