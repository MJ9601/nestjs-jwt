import { IsString, IsNotEmpty } from 'class-validator';

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  urlParam: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;
}
