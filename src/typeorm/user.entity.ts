import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  createdAt: string;

  @Column()
  updatedAt: string;
}
