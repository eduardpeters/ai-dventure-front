import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="h-full flex flex-col justify-evenly items-center p-2 bg-neutral-200 dark:text-neutral-200 dark:bg-slate-800">
      <h1 className="text-5xl tracking-wider">{t("home.title")}</h1>
      <section className="w-full sm:max-w-96 flex flex-col px-4 sm:px-0">
        <h2 className="text-3xl">{t("home.subtitle")}</h2>
        <p className="w-prose">{t("home.description")}</p>
      </section>
      <Link
        to="/new"
        className="rounded-lg p-2 cursor-pointer text-neutral-100 bg-sky-600 hover:text-neutral-50 hover:bg-sky-700 dark:bg-sky-800 dark:hover:bg-sky-700"
      >
        {t("home.link-new")}
      </Link>
    </main>
  );
}
