import { createFileRoute } from "@tanstack/react-router";
import NewSetup from "@/Adventure/components/NewSetup";
import { adventureTypesQueryOptions } from "@/Adventure/queryOptions/adventureTypes";

export const Route = createFileRoute("/new")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(adventureTypesQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <NewSetup />
    </div>
  );
}
