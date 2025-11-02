import { createFileRoute } from "@tanstack/react-router";
import NewSetup from "@/Adventure/components/NewSetup";

export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <NewSetup />
    </div>
  );
}
