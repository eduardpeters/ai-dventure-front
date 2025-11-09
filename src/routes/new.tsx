import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import NewSetup from "@/Adventure/components/NewSetup";
import { adventureTypesQueryOptions } from "@/Adventure/queryOptions/adventureTypes";

export const Route = createFileRoute("/new")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adventureTypesQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<div>Loading adventure setup...</div>}>
      <NewSetup />
    </Suspense>
  );
}
