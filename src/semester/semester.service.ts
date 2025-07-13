import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSemesterDto, UpdateSemesterDto } from './dto/semester.dto';

type StringOrInt = string | number;

@Injectable()
export class SemesterService {
    constructor(private prisma: PrismaService) { }

    create(createSemesterDto: CreateSemesterDto) {
        return this.prisma.semester.create({ data: createSemesterDto });
    }

    findAll() {
        return this.prisma.semester.findMany();
    }

    findOne(id: number) {
        return this.prisma.semester.findUniqueOrThrow({ where: { id } });
    }


    findByOne(param: string, value: StringOrInt) {
        return this.prisma.semester.findFirst({ where: { [param]: value } });
    }

    findByMany(param: string, value: StringOrInt) {
        return this.prisma.semester.findMany({ where: { [param]: value } });
    }

    update(id: number, updateSemesterDto: UpdateSemesterDto) {
        return this.prisma.semester.update({
            where: { id },
            data: updateSemesterDto,
        });
    }

    remove(id: number) {
        return this.prisma.semester.delete({ where: { id } });
    }
}
