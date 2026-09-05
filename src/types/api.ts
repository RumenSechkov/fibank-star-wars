/** A character as returned by the SWAPI `people` endpoint. */
export interface Person {
  name: string;
  /** Mass in kilograms, e.g. `"77"` or `"unknown"`. */
  mass: string;
  /** Height in centimetres, e.g. `"172"` or `"unknown"`. */
  height: string;
  hair_color: string;
  skin_color: string;
  /** Canonical resource URL, unique per character. */
  url: string;
}

/** Envelope every paginated SWAPI list endpoint responds with. */
export interface PaginatedResponse<T> {
  /** Total number of items across all pages. */
  count: number;
  /** Absolute URL of the next page, or `null` on the last page. */
  next: string | null;
  /** Absolute URL of the previous page, or `null` on the first page. */
  previous: string | null;
  results: T[];
}

export type PeopleResponse = PaginatedResponse<Person>;
