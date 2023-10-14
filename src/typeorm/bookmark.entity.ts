import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  createdAt: string;

  @Column()
  updatedAt: string;
}
