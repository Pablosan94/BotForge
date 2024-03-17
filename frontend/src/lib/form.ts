import { z } from 'zod';

export const botFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  description: z.string().trim().optional(),
  basePersonality: z.string().trim().min(1, { message: 'Base is required' }),
  personalityTraits: z.string().trim().optional(),
  useCaseTemplate: z.string().trim().optional(),
  status: z.enum(['active', 'preview', 'inactive']),
});
