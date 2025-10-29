import { createFileRoute } from "@tanstack/react-router";
import Home from "@/Home/components/Home";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-full bg-neutral-300 dark:bg-gray-800 text-slate-800 dark:text-slate-100">
      <Home />
    </div>
  );
}
