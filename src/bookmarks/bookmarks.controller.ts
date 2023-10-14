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
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from 'src/dtos';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  @Post('create')
  async createNewBookmark(@Body() input: BookmarkDto) {
    try {
      return this.bookmarkService.createNewBookmark(input);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getBookmarkById(@Param('id') id: number) {
    try {
      return this.bookmarkService.findBookMarkById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('update/:id')
  async updateBookmark(@Body() input: BookmarkDto, @Param('id') id: number) {
    try {
      return this.bookmarkService.updateBookmark(id, input);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
  async deleteBookmarkById(@Param('id') id: number) {
    try {
      const deletedItem = await this.bookmarkService.deleteBookmark(id);

      return { succeeded: deletedItem };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
