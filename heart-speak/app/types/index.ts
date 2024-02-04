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

// function to get the prompts for a given entry given an array of EntryPromptsPair
export function getPromptsForEntry(entryId: number, entryPromptsPairs: EntryPromptsPair[]): Notification[] {
  const entryPromptsPair = entryPromptsPairs.find(pair => pair.id === entryId);
  return entryPromptsPair ? entryPromptsPair.prompts : [];
}

