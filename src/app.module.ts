import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { FakultasModule } from './fakultas/fakultas.module';
import { SemesterModule } from './semester/semester.module';
import { ProdiModule } from './prodi/prodi.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),

    AuthModule,
    UsersModule,

    PrismaModule,

    MailModule,

    FakultasModule,

    SemesterModule,

    ProdiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
