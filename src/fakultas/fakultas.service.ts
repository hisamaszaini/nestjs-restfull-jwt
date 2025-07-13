import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFakultasDto, UpdateFakultasDto } from './dto/fakultas.dto';

@Injectable()
export class FakultasService {
    constructor(private prisma: PrismaService) { }

    create(createFakultasDto: CreateFakultasDto) {
        return this.prisma.fakultas.create({ data: createFakultasDto });
    }

    findAll() {
        return this.prisma.fakultas.findMany();
    }

    findOne(id: number) {
        return this.prisma.fakultas.findUniqueOrThrow({ where: { id } });
    }

    update(id: number, updateFakultasDto: UpdateFakultasDto) {
        return this.prisma.fakultas.update({
            where: { id },
            data: updateFakultasDto,
        });
    }

    remove(id: number) {
        return this.prisma.fakultas.delete({ where: { id } });
    }
}
