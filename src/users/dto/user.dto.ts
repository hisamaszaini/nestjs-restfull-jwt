import { Role, UserStatus } from '@prisma/client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),

  username: z
    .string()
    .min(3, { message: 'Username minimal 3 karakter' }),

  name: z
    .string()
    .min(3, { message: 'Nama minimal 3 karakter' }),

  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' }),
    
  role: z.nativeEnum(Role).optional(), 
  status: z.nativeEnum(UserStatus).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, 'Password lama minimal 8 karakter'),
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password baru dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export type UpdateUserStatusDto = z.infer<typeof updateUserStatusSchema>;