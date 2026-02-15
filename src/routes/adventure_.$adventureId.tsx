import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Gameplay from "@/Adventure/components/Gameplay";
import { adventureQueryOptions } from "@/Adventure/queryOptions/adventures";

export const Route = createFileRoute("/adventure_/$adventureId")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { adventureId } }) =>
    queryClient.prefetchQuery(adventureQueryOptions(adventureId)),
  errorComponent: ({ error }) => (
    <div>Error loading adventure: {error.message}</div>
  ),
});

function RouteComponent() {
  const { adventureId } = Route.useParams();

  return (
    <Suspense fallback={<div>Loading adventure...</div>}>
      <Gameplay adventureId={adventureId} />;
    </Suspense>
  );
}
