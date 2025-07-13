import { Body, Controller, Get, Param, ParseIntPipe, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ChangePasswordDto, UpdateProfileDto, UpdateUserStatusDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

  constructor(private userService: UsersService) { }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Patch('profile/details')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.sub;
    return this.userService.updateProfile(userId, dto);
  }

  @Patch('profile/password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    const userId = req.user.sub;
    return this.userService.changePassword(userId, dto);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  getAllUsers() {
    return 'Hanya admin yang bisa melihat ini.';
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(id, dto);
  }

  @Get('data-validasi')
  @Roles(Role.ADMIN, Role.VALIDATOR)
  getValidationData() {
    return 'Data untuk admin dan validator.';
  }
}