import { UserEntity } from './entities/user.entity';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  Param,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiHeaders,
  ApiProperty,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ description: 'createUserDto' })
  @Post('users')
  @UsePipes(new ValidationPipe())
  async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.create(createUserDto);

    return await this.userService.buildUserResponse(user);
  }

  @ApiBody({ description: 'loginUserDto' })
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);

    return await this.userService.buildUserResponse(user);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return await this.userService.buildUserResponse(user);
  }

  @ApiBearerAuth('token')
  @ApiHeader({
    name: 'Authorization',
  })
  @ApiBody({ description: 'updateUserDto' })
  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') id: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const updateUser = await this.userService.updateUser(id, updateUserDto);
    return await this.userService.buildUserResponse(updateUser);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
