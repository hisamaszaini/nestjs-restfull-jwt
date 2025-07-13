import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SemesterService } from './semester.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateSemesterDto, UpdateSemesterDto } from './dto/semester.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('semester')
export class SemesterController {
    constructor(private readonly semesterService: SemesterService) { }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createSemesterDto: CreateSemesterDto) {
        return this.semesterService.create(createSemesterDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.DOSEN, Role.VALIDATOR)
    findAll() {
        return this.semesterService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.DOSEN, Role.VALIDATOR)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.semesterService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSemesterDto: UpdateSemesterDto) {
        return this.semesterService.update(id, updateSemesterDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.semesterService.remove(id);
    }
}