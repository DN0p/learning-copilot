import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";
import { User } from "../users/users.entity";

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @ManyToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'text' })
    hashedRefreshToken: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'text', nullable: true })
    userAgent: string;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ipAddress: string;

    @CreateDateColumn()
    createdAt: Date;
}