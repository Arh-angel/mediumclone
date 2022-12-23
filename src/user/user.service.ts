import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { IsEmail } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where('user.email = :email', { email: loginUserDto.email })
      .getOne();

    if (!user) {
      throw new HttpException(
        'email are not find',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPassword = await compare(loginUserDto.password, user.password);

    if (!isPassword) {
      throw new HttpException(
        'password are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
