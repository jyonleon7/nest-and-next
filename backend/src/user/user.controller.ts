import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  async updateuser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return await this.userService.updateUser(req.user.id, updateUserDto);
  }
}
