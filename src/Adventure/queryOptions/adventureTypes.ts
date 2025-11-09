import { queryOptions } from "@tanstack/react-query";
import { AdventureTypeService } from "../services/adventureTypes";

export const adventureTypesQueryOptions = queryOptions({
  queryKey: ["adventure-types"],
  queryFn: AdventureTypeService.fetchAll,
});
