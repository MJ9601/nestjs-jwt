import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/typeorm';
import { LoginDto, RegisterDto } from 'src/dtos';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllUsers() {
    return this.userRepository.find();
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async validateUserInfo(input: LoginDto): Promise<false | UserEntity> {
    const user = await this.findUserByEmail(input.email);
    if (!user) throw new ConflictException('Invalid Email Or Password!');

    const validatePass = await argon.verify(user.password, input.password);
    return validatePass ? user : false;
  }

  async registerNewUser(input: Readonly<RegisterDto>) {
    const user = await this.findUserByEmail(input.email);

    if (user) throw new ConflictException('Invalid Email Or Password!!');

    const newUser = this.userRepository.create({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.userRepository.save(newUser);
  }

  async loginUser(input: Readonly<LoginDto>) {
    const user = await this.validateUserInfo(input);
    if (!user) throw new ConflictException('Invalid Email Or Password!!');
  }

  async deleteUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new ConflictException('Invalid Email Or Password!!');

    const deleteUser = await this.userRepository.delete({ id: user.id });

    return true;
  }
}
