import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'house_histories' })
export class HouseHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ubid: string;

  @Column('integer')
  birds: number;

  @Column('integer')
  eggs: number;

  @CreateDateColumn()
  createdAt: Date;
}
