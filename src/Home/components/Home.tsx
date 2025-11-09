import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="h-full flex flex-col justify-evenly items-center p-2">
      <h1 className="text-5xl tracking-wider">{t("home.title")}</h1>
      <section className="flex flex-col self-start px-4">
        <h2 className="text-3xl">{t("home.subtitle")}</h2>
        <p className="w-prose">{t("home.description")}</p>
      </section>
      <Link to="/new" className="border rounded-lg p-2 cursor-pointer">
        {t("home.link-new")}
      </Link>
    </main>
  );
}
