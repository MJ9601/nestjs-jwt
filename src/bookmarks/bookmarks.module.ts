import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { BookmarkEntity, UserEntity } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService],
  imports: [TypeOrmModule.forFeature([BookmarkEntity, UserEntity])],
})
export class BookmarksModule {}
