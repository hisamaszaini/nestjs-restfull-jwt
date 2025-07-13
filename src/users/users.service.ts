import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { ChangePasswordDto, UpdateProfileDto, UpdateUserStatusDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { name: dto.name },
        });

        const { password, hashedRefreshToken, ...userWithoutPassword } = user;
        return user;
    }

    async changePassword(userId: number, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User tidak ditemukan.');
        }

        const passwordMatches = await bcrypt.compare(dto.oldPassword, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Password lama salah.');
        }

        const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: newHashedPassword },
        });

        return { message: 'Password berhasil diubah.' };
    }

    async updateUserStatus(userIdToUpdate: number, dto: UpdateUserStatusDto) {
        return this.prisma.user.update({
            where: { id: userIdToUpdate },
            data: { status: dto.status },
        });
    }
}