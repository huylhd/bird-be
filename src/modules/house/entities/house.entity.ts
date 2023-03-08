import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'houses' })
export class House {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Generated('uuid')
  ubid: string;

  @Column('integer', { default: 0 })
  birds: number;

  @Column('integer', { default: 0 })
  eggs: number;

  @Column('numeric')
  longitude: number;

  @Column('numeric')
  latitude: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
