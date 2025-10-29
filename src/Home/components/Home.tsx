import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1>{t("title")}</h1>
      <span>{t("description.part1")}</span>
      <span>{t("description.part2")}</span>
    </div>
  );
}
