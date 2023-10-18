import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkEntity, UserEntity } from './typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  async flushingDb() {
    const bookmarks = await this.bookmarkRepository.find();
    const users = await this.userRepository.find();
    await Promise.all(
      users.map(
        async (user) => await this.userRepository.delete({ id: user.id }),
      ),
    );
    await Promise.all(
      bookmarks.map(
        async (bookmark) =>
          await this.userRepository.delete({ id: bookmark.id }),
      ),
    );
  }
}
