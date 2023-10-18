import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../dtos';
import { AccessGuard, JwtGuard } from './guards';
import { GetUser } from './decorators';
import { UserEntity } from '../typeorm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async getUsers() {
    try {
      return this.authService.findAllUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('users/:id')
  async getUser(@Param('id') id: number) {
    try {
      return this.authService.findUserById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async createUser(@Body() input: RegisterDto) {
    try {
      return await this.authService.registerNewUser(input);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async signinUser(@Body() input: LoginDto) {
    try {
      return await this.authService.loginUser(input);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('users/:id')
  @UseGuards(JwtGuard, new AccessGuard(90))
  async deleteUser(@Param(':id') id: number) {
    try {
      const user = await this.authService.deleteUserById(id);
      return { succeeded: user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('me')
  @UseGuards(JwtGuard, new AccessGuard(11))
  async getMe(
    @GetUser() user: Omit<UserEntity, 'password'>,
    @GetUser('id') id: number,
  ) {
    return { user, id };
  }
}
