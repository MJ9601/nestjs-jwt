import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dtos/register.dto';
import { LoginDto } from 'src/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async getUsers() {}

  @Get('users/:id')
  async getUser(@Param('id') id: number) {}


  @Post('register')
  async createUser(@Body() input:RegisterDto){}


  @Post("login")
  async signinUser(@Body() input:LoginDto){}

  @Delete("users/:id")
  async deleteUser(@Param(":id") id:number){}
}
