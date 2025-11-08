import ky from "ky";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/adventures`;

interface NewAdventureResponse {
  adventure: string;
}

export class AdventureService {
  static async create(adventureTypeId: string) {
    const json = await ky
      .post<NewAdventureResponse>(BASE_URL, { json: { adventureTypeId } })
      .json();
    return json;
  }
}
