import { string } from "prop-types";

export type JournalEntryType= {
  id: number;
  date: Date;
  content: string;
}

export type Notification = {
  id: number;
  message: string;
}

export type EntryPromptsPair = {
  id: number;
  entry: JournalEntryType;
  prompts: Notification[];
}

export type latLong = {
  lat: number;
  long: number;
}

export type QuoteSentimentLocationTime = {
  quote: string;
  sentiment: {
    label: string,
    score: number,
  };
  location: string;
  time: string;
}

// function to get the prompts for a given entry given an array of EntryPromptsPair
export function getPromptsForEntry(entryId: number, entryPromptsPairs: EntryPromptsPair[]): Notification[] {
  const entryPromptsPair = entryPromptsPairs.find(pair => pair.id === entryId);
  return entryPromptsPair ? entryPromptsPair.prompts : [];
}

