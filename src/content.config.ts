import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const games = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    platform: z.enum(['multi', 'mobile']),
    heroImage: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    storeLinks: z
      .object({
        playStore: z.string().url().optional(),
        appStore: z.string().url().optional(),
      })
      .default({}),
    devNotes: z
      .array(
        z.object({
          image: z.string().optional(),
          caption: z.string(),
        }),
      )
      .default([]),
    suits: z
      .array(
        z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          image: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { games };
