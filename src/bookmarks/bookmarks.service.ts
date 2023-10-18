import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkDto } from '../dtos';
import { BookmarkEntity, UserEntity } from '../typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllBookmarks() {
    return this.bookmarkRepository.find();
  }

  async findBookMarkById(id: number) {
    return this.bookmarkRepository.findOneBy({ id });
  }

  async findBookMarkByUrl(urlParam: string) {
    return this.bookmarkRepository.findOneBy({ urlParam });
  }

  async createNewBookmark(input: BookmarkDto, userId: number) {
    const bookmark = await this.bookmarkRepository.findOneBy({
      urlParam: input.urlParam,
    });

    if (bookmark) throw new ConflictException('urlParam is taken!!');

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not Found!!');

    const newBookmark = this.bookmarkRepository.create({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      user,
    });

    return this.bookmarkRepository.save(newBookmark);
  }

  async updateBookmark(id: number, input: BookmarkDto) {
    const bookmark = await this.findBookMarkById(id);
    if (!bookmark) return false;
    const updatedBookmark = await this.bookmarkRepository.update(
      { id },
      { ...input, updatedAt: new Date() },
    );

    return this.findBookMarkById(id);
  }

  async deleteBookmark(id: number) {
    const deletedBookmark = await this.bookmarkRepository.delete({ id });

    return true;
  }
}
