import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('bookmarks')
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('varchar', { length: 50 })
  urlParam: string;

  @Column('varchar', { length: 90 })
  title: string;

  @Column('varchar', { length: 150 })
  description: string;

  @Column('varchar', { length: 90 })
  imageUrl: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;


@ManyToOne(() => UserEntity, user => user.bookmarks)
user?:UserEntity
}
