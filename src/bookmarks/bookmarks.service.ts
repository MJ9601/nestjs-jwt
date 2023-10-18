import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
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
    return this.bookmarkRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findBookMarkByUrl(urlParam: string) {
    return this.bookmarkRepository.findOneBy({ urlParam });
  }

  async createNewBookmark(input: BookmarkDto, userId: number) {
    try {
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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBookmark(
    id: number,
    input: Partial<BookmarkDto>,
    userId: number,
  ) {
    try {
      const bookmark = await this.findBookMarkById(id);
      if (!bookmark) throw new NotFoundException('Bookmark Not Found!!');

      if (bookmark.user.id !== userId)
        throw new ForbiddenException('Not Allowed!!');

      const updatedBookmark = await this.bookmarkRepository.update(
        { id },
        { ...input, updatedAt: new Date() },
      );

      return this.findBookMarkById(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBookmark(id: number) {
    const deletedBookmark = await this.bookmarkRepository.delete({ id });

    return true;
  }
}
