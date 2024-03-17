export type Bot = {
  _id: string;
  name: string;
  description: string;
  basePersonality: string;
  personalityTraits: string[];
  useCaseTemplate: string;
  status: 'active' | 'inactive' | 'preview';
};
