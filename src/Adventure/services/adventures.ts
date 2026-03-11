import ky, { isHTTPError } from "ky";
import { mapHttpResponseToError } from "@/errors/mapResponseToError";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/adventures`;

interface NewAdventureResponse {
  adventure: string;
}

interface AdventureChapterChoice {
  id: string;
  action: string;
  chosen: boolean;
}

interface AdventureChapter {
  number: number;
  narrative: string;
  choices: AdventureChapterChoice[];
}

interface GetAdventureResponse {
  id: string;
  setting: string;
  chapters: AdventureChapter[];
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
  static async create(adventureTypeId: string) {
    try {
      const json = await ky
        .post<NewAdventureResponse>(BASE_URL, { json: { adventureTypeId } })
        .json();
      return json;
    } catch (error: unknown) {
      if (isHTTPError(error)) {
        const body = await error.response.text();
        throw mapHttpResponseToError(error.response.status, body, error);
      }
      throw error;
    }
  }

  static async get(adventureId: string) {
    try {
      const json = await ky
        .get<GetAdventureResponse>(`${BASE_URL}/${adventureId}`)
        .json();
      return json;
    } catch (error: unknown) {
      if (isHTTPError(error)) {
        const body = await error.response.text();
        throw mapHttpResponseToError(error.response.status, body, error);
      }
    }
  }

  static async advance(adventureId: string, chapterChoiceId?: string) {
    try {
      const json = await ky
        .post<ChapterResponse>(`${BASE_URL}/${adventureId}/forth`, {
          json: { choice: chapterChoiceId },
        })
        .json();
      return json;
    } catch (error) {
      if (isHTTPError(error)) {
        const body = await error.response.text();
        throw mapHttpResponseToError(error.response.status, body, error);
      }
      throw error;
    }
  }
}
