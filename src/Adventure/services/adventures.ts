import ky, { isHTTPError, type HTTPError } from "ky";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/adventures`;

interface NewAdventureResponse {
  adventure: string;
}

export interface ChapterResponse {
  chapterNumber: number;
  narrative: string;
  choices: {
    id: string;
    action: string;
  }[];
}

export class AdventureService {
  // Used when mocking backend responses
  static counter: number = 1;

  static async create(adventureTypeId: string) {
    const json = await ky
      .post<NewAdventureResponse>(BASE_URL, { json: { adventureTypeId } })
      .json();
    return json;
  }

  static async advance(adventureId: string, chapterChoiceId?: string) {
    /* Use to mock backend responses
    const mockResponse: ChapterResponse = {
      chapterNumber: this.counter++,
      narrative:
        "In the mystical realm of Eldoria, where ancient magic flows through the veins of the land, you find yourself as a humble apprentice to the renowned sorcerer, Elarion. The kingdom of Valoria is under threat from the dark sorcerer, Malakar, who seeks to plunge the land into eternal shadow. Elarion has tasked you with a crucial mission to gather the three legendary artifacts that can counter Malakar's dark magic. Your journey begins in the bustling city of Emerald Keep, where whispers of the first artifact, the Amulet of Light, have been heard.",
      choices:
        this.counter >= 6
          ? []
          : [
              {
                id: "202c904d-8486-4f21-8dc7-24559e6e4f81",
                action:
                  "Venture into the dense forest to seek the wisdom of the ancient trees.",
              },
              {
                id: "",
                action:
                  "Seek out the wise old librarian in the Great Library of Emerald Keep.",
              },
              {
                id: "2c379328-5bd4-4dc4-a3aa-4d598f7ad7c6",
                action:
                  "Search the clearing for any hidden treasures or clues.",
              },
            ],
    };
    await new Promise((r) => setTimeout(r, 1000));
    return mockResponse;
    */

    try {
      const json = await ky
        .post<ChapterResponse>(`${BASE_URL}/${adventureId}/forth`, {
          json: { choice: chapterChoiceId },
        })
        .json();
      return json;
    } catch (error) {
      if (isHTTPError(error)) {
        const msg = await (error as HTTPError).response.text();
        console.log(msg);
      }
    }
  }
}
