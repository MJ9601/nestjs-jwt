import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('varchar', { length: 90 })
  email: string;

  @Column('varchar', { length: 50, nullable: true })
  name?: string;

  @Column('varchar', { length: 150 })
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  access: number;

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  bookmarks?: BookmarkEntity[];
}
