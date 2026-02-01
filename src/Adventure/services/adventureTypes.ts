import ky, { isHTTPError } from "ky";
import { mapHttpResponseToError } from "@/errors/mapResponseToError";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/adventure-types`;

interface AdventureType {
  id: string;
  description: string;
}

export class AdventureTypeService {
  static async fetchAll() {
    try {
      const json = await ky.get<AdventureType[]>(BASE_URL).json();
      return json;
    } catch (error: unknown) {
      if (isHTTPError(error)) {
        const body = await error.response.text();
        throw mapHttpResponseToError(error.response.status, body, error);
      }
      throw error;
    }
  }
}
