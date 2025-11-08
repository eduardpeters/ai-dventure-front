import { mutationOptions } from "@tanstack/react-query";
import { AdventureService } from "../services/adventures";

export const createAdventureMutationOptions = mutationOptions({
  mutationFn: (adventureTypeId: string) =>
    AdventureService.create(adventureTypeId),
});
