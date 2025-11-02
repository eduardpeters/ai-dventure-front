import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const mockOptions = [
  { id: "123", description: "fantasy" },
  { id: "234", description: "scifi" },
  { id: "345", description: "contemporarythriller" },
];

export default function NewSetup() {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");

  function updateSelectedDescription(id: string) {
    const selectedType = mockOptions.find((o) => o.id === id);
    if (selectedType) {
      setDescription(selectedType.description);
    }
  }

  async function newAdventure(formData: FormData) {
    const adventureTypeId = formData.get("adventure-type");
    console.log("Will request a new adventure:", adventureTypeId);
  }

  return (
    <main className="h-full flex flex-col justify-evenly items-center p-2">
      <Link
        to="/"
        className="text-sm border rounded-lg p-1 cursor-pointer self-start"
      >
        {t("new.link-home")}
      </Link>
      <form action={newAdventure} className="flex flex-col gap-2">
        <h1 className="text-3xl">{t("new.title")}</h1>
        <label htmlFor="adventure-type">{t("new.label-setting")}</label>
        <select
          name="adventure-type"
          id="adventure-type"
          onChange={(e) => updateSelectedDescription(e.target.value)}
          required
        >
          {mockOptions.map((o) => (
            <option value={o.id}>{t(`new.option-${o.description}`)}</option>
          ))}
        </select>
        <h3 className="text-xl">{t("new.title-summary")}</h3>
        <p>{t(`new.summary-${description}`)}</p>
        <button type="submit">{t("new.btn-submit")}</button>
      </form>
    </main>
  );
}
