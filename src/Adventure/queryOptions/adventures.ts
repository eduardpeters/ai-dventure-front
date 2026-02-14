import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { AdventureService } from "../services/adventures";

export const adventureQueryOptions = (adventureId: string) =>
  queryOptions({
    queryKey: ["adventures", adventureId],
    queryFn: () => AdventureService.get(adventureId),
    staleTime: "static",
  });

export const createAdventureMutationOptions = mutationOptions({
  mutationFn: (adventureTypeId: string) =>
    AdventureService.create(adventureTypeId),
});

export const advanceAdventureMutationOptions = mutationOptions({
  mutationFn: ({
    adventureId,
    chapterChoiceId,
  }: {
    adventureId: string;
    chapterChoiceId?: string;
  }) => AdventureService.advance(adventureId, chapterChoiceId),
});
