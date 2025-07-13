import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProdiDto, UpdateProdiDto } from './dto/prodi.dto';

@Injectable()
export class ProdiService {
    constructor(private prisma: PrismaService) { }

    create(createProdiDto: CreateProdiDto) {
        return this.prisma.prodi.create({ data: createProdiDto });
    }

    findAll() {
        return this.prisma.prodi.findMany();
    }

    findOne(id: number) {
        return this.prisma.prodi.findUniqueOrThrow({ where: { id } });
    }

    update(id: number, updateProdiDto: UpdateProdiDto) {
        return this.prisma.prodi.update({
            where: { id },
            data: updateProdiDto,
        });
    }

    remove(id: number) {
        return this.prisma.prodi.delete({ where: { id } });
    }
}
