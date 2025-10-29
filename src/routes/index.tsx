import { createFileRoute } from "@tanstack/react-router";
import Home from "@/Home/components/Home";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <Home />;
}
