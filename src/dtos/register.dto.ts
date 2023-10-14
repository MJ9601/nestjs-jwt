import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email:string


  @IsString()
  name?:string

  @IsNotEmpty()
  password:string
}