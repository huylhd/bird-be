import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity()
export class House {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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
}
