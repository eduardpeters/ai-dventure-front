import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/adventure/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to="/" />;
}
