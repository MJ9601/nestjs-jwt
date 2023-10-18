import {
  Controller,
  HttpException,
  ConflictException,
  HttpStatus,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from '../dtos';
import { AccessGuard, JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';
import { UserEntity } from 'src/typeorm';

@Controller('bookmarks')
@UseGuards(JwtGuard)
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  @Post('create')
  async createNewBookmark(
    @Body() input: BookmarkDto,
    @GetUser() user: Omit<UserEntity, 'password'>,
  ) {
    return this.bookmarkService.createNewBookmark(input, user.id);
  }

  @Get(':id')
  async getBookmarkById(@Param('id') id: number) {
    return this.bookmarkService.findBookMarkById(id);
  }

  @Put('update/:id')
  async updateBookmark(
    @Body() input: Partial<BookmarkDto>,
    @Param('id') id: number,
    @GetUser() user: Omit<UserEntity, 'password'>,
  ) {
    console.log({ id, input, userId: user.id });
    return this.bookmarkService.updateBookmark(+id, input, user.id);
  }

  @Get()
  async getAllBookmarks() {
    try {
      return this.bookmarkService.findAllBookmarks();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(new AccessGuard(90))
  async deleteBookmarkById(@Param('id') id: number) {
    try {
      const deletedItem = await this.bookmarkService.deleteBookmark(id);

      return { succeeded: deletedItem };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
