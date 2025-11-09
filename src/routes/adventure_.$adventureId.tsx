import { createFileRoute } from "@tanstack/react-router";
import Gameplay from "@/Adventure/components/Gameplay";

export const Route = createFileRoute("/adventure_/$adventureId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adventureId } = Route.useParams();

  return <Gameplay adventureId={adventureId} />;
}
