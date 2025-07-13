import z from "zod";

export const createProdiSchema = z.object({
  kode: z.string().min(2),
  nama: z.string().min(2),
  fakultasId: z.number().int().positive(),
});

export type CreateProdiDto = z.infer<typeof createProdiSchema>;
export const updateProdiSchema = createProdiSchema.partial();
export type UpdateProdiDto = z.infer<typeof updateProdiSchema>;