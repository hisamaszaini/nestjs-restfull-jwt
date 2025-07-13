import { NamaSemester } from "@prisma/client";
import z from "zod";

export const createSemesterSchema = z.object({
    kode: z.int().min(9, { message: 'Kode semester minimal 9 karakter' }),
    nama: z.string().min(9, { message: 'Nama semester minimal 9 karakter' }),
    tipe: z.nativeEnum(NamaSemester),
    tahunMulai: z.int().min(4, { message: 'Tahun minimal 4 karakter' }).max(4, { message: 'Tahun minimal 4 karakter' }),
    tahunSelesai: z.int().min(4, { message: 'Tahun minimal 4 karakter' }).max(4, { message: 'Tahun minimal 4 karakter' }),
    status: z.boolean(),
});

export const updateSemesterSchema = z.object({
    kode: z.int().min(9, { message: 'Kode semester minimal 9 karakter' }),
    nama: z.string().min(9, { message: 'Nama semester minimal 9 karakter' }),
    tipe: z.nativeEnum(NamaSemester),
    tahunMulai: z.int().min(4, { message: 'Tahun minimal 4 karakter' }).max(4, { message: 'Tahun minimal 4 karakter' }),
    tahunSelesai: z.int().min(4, { message: 'Tahun minimal 4 karakter' }).max(4, { message: 'Tahun minimal 4 karakter' }),
    status: z.boolean(),
});

export type CreateSemesterDto = z.infer<typeof createSemesterSchema>;
export type UpdateSemesterDto = z.infer<typeof updateSemesterSchema>;