import ky, { isHTTPError, type HTTPError } from "ky";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/adventures`;

interface NewAdventureResponse {
  adventure: string;
}

interface ChapterResponse {
  chapterNumber: number;
  narrative: string;
  choices: {
    id: string;
    action: string;
  }[];
}

export class AdventureService {
  static counter: number = 1;

  static async create(adventureTypeId: string) {
    const json = await ky
      .post<NewAdventureResponse>(BASE_URL, { json: { adventureTypeId } })
      .json();
    return json;
  }

  static async advance(adventureId: string, chapterChoiceId?: string) {
    console.log("Called advance", adventureId, chapterChoiceId);
    const mockResponse: ChapterResponse = {
      chapterNumber: this.counter++,
      narrative: "some text here",
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
                id: "2c379328-5bd4-4dc4-a3aa-4d598f7ad7c6",
                action:
                  "Search the clearing for any hidden treasures or clues.",
              },
            ],
    };
    await new Promise((r) => setTimeout(r, 1000));
    return mockResponse;

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
