import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SourceStatuses } from './enums/source-statuses.enum';
import { Users } from '../users/users.entity';

@Entity('sources')
export class Sources {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', unique: true })
  link: string;

  @ManyToOne(() => Users, (user) => user.sources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ type: 'enum', enum: SourceStatuses, default: SourceStatuses.NEW })
  status: SourceStatuses;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
