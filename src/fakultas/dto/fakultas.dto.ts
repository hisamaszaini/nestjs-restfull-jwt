import z from "zod";

export const createFakultasSchema = z.object({
    kode: z.string().min(2, { message: 'Kode fakultas minimal 2 karakter' }),
    nama: z.string().min(5, { message: 'Nama fakultas minimal 5 karakter' }),
})

export const updateFakultasSchema = z.object({
    kode: z.string().min(2, { message: 'Kode fakultas minimal 2 karakter' }),
    nama: z.string().min(5, { message: 'Nama fakultas minimal 5 karakter' }).optional(),
})

export type CreateFakultasDto = z.infer<typeof createFakultasSchema>;
export type UpdateFakultasDto = z.infer<typeof updateFakultasSchema>;

