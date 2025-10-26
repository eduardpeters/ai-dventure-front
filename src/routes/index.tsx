import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
      <div>
        <h1>{t("title")}</h1>
        <span>{t("description.part1")}</span>
        <span>{t("description.part2")}</span>
      </div>
    </div>
  );
}
