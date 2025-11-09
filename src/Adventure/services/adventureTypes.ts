import ky from "ky";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/adventure-types`;

interface AdventureType {
  id: string;
  description: string;
}

export class AdventureTypeService {
  static async fetchAll() {
    const json = await ky.get<AdventureType[]>(BASE_URL).json();
    return json;
  }
}
