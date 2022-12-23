import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'email user',
    example: 'kggjhg@mail.ru',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 24)
  password: string;
}
