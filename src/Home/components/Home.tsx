import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="h-full flex flex-col justify-evenly items-center p-2">
      <h1 className="text-5xl tracking-wider">{t("home.title")}</h1>
      <section className="flex flex-col self-start">
        <h2 className="text-3xl">{t("home.subtitle")}</h2>
        <p className="w-prose">{t("home.description")}</p>
      </section>
      <Link
        to="/"
        className="rounded-lg p-2 text-slate-100 bg-sky-500 hover:bg-sky-600 hover:text-slate-50 dark:bg-sky-700 dark:hover:bg-sky-600 dark:hover:text-slate-200"
      >
        {t("home.btn-new")}
      </Link>
    </main>
  );
}
