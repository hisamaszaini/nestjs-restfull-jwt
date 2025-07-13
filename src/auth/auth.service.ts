import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService
    ) { }

    // --- REGISTRASI PENGGUNA BARU ---
    async register(dto: CreateUserDto) {
        const hashedPassword = await this.hashData(dto.password);

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.username,
                name: dto.name,
                password: hashedPassword,
                role: dto.role,
            },
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    // --- VALIDASI PENGGUNA SAAT LOGIN ---
    async validateUser(email: string, pass: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Kredensial tidak valid.');
        }

        const passwordMatches = await bcrypt.compare(pass, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Kredensial tidak valid.');
        }

        return user;
    }

    // --- LOGIN DAN BUAT TOKENS ---
    async login(user: any) {
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        const [accessToken, refreshToken] = await this.getTokens(payload);
        await this.updateRefreshTokenHash(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    // --- LOGOUT ---
    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null,
                },
            },
            data: {
                hashedRefreshToken: null,
            },
        });
    }

    // --- REFRESH TOKEN ---
    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Akses Ditolak');
        }

        const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
        if (!rtMatches) throw new ForbiddenException('Akses Ditolak');

        const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
        const [accessToken, refreshToken] = await this.getTokens(payload);
        await this.updateRefreshTokenHash(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    // --- Lupa Password ---
    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('Pengguna tidak ditemukan.');
        }

        const resetToken = randomBytes(32).toString('hex');
        const hashedResetToken = await this.hashData(resetToken);
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await this.prisma.user.update({
            where: { email },
            data: {
                passwordResetToken: hashedResetToken,
                passwordResetExpires: resetExpires,
            },
        });

        try {
            await this.mailService.sendPasswordResetEmail(user.email, resetToken);
            return { message: 'Link reset password telah dikirim ke email Anda.' };
        } catch (error) {
            await this.prisma.user.update({
                where: { email },
                data: {
                    passwordResetToken: null,
                    passwordResetExpires: null,
                },
            });
            throw new Error('Gagal mengirim email reset password.');
        }
    }

    // --- Reset Password ---
    async resetPassword(token: string, newPass: string) {
        const hashedToken = await this.hashData(token);

        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { gt: new Date() },
            },
        });

        if (!user) {
            throw new NotFoundException('Token tidak valid atau sudah kedaluwarsa.');
        }

        const newHashedPassword = await this.hashData(newPass);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: newHashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        return { message: 'Password berhasil direset.' };
    }

    // --- FUNGSI BANTUAN ---
    private async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    private async updateRefreshTokenHash(userId: number, refreshToken: string) {
        const hash = await this.hashData(refreshToken);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hash },
        });
    }

    private async getTokens(payload: { sub: number; email: string; username: string; role: string; }) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        });

        // Refresh token
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        });

        return [accessToken, refreshToken];
    }
}