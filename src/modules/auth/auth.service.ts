import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, EntityManager } from "typeorm";
import { User } from "../users/users.entity";
import { Auth } from "./auth.entity";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/user";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        private jwtService: JwtService,
        private usersService: UsersService,
        private dataSource: DataSource,
    ) { }

    async register(createUserDto: CreateUserDto, ip: string, userAgent: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const manager = queryRunner.manager;
            const user = await this.usersService.create(createUserDto, manager);

            const session = await this.createSession(user.id, ip, userAgent, manager);
            const tokens = await this.generateTokens(user, session.id);

            await this.updateSessionWithToken(session.id, tokens.refreshToken, manager);

            await queryRunner.commitTransaction();
            return { user, ...tokens };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async login(email: string, password: string, ip: string, userAgent: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const manager = queryRunner.manager;
            const user = await this.usersRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'role']
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const session = await this.createSession(user.id, ip, userAgent, manager);
            const tokens = await this.generateTokens(user, session.id);
            await this.updateSessionWithToken(session.id, tokens.refreshToken, manager);

            await queryRunner.commitTransaction();
            return { user, ...tokens };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async generateTokens(user: Pick<User, 'id' | 'email' | 'role'>, sessionId?: string) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessOptions: JwtSignOptions = {
            secret: process.env.JWT_ACCESS_SECRET || 'fallback-secret-key',
            expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as JwtSignOptions['expiresIn'],
        };
        const refreshOptions: JwtSignOptions = {
            secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
            expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as JwtSignOptions['expiresIn'],
        };

        const refreshPayload = sessionId ? { sub: user.id, sessionId } : { sub: user.id };

        const [accessToken, refreshToken]: [string, string] = await Promise.all([
            this.jwtService.signAsync(payload, accessOptions),
            this.jwtService.signAsync(refreshPayload, refreshOptions),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async createSession(userId: string, ip: string, userAgent: string, manager?: EntityManager): Promise<Auth> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + Number(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? 7));

        const session = manager ? await manager.save(Auth, {
            user: { id: userId } as User,
            hashedRefreshToken: '',
            expiresAt,
            userAgent,
            ipAddress: ip,
        }) : await this.authRepository.save({
            user: { id: userId } as User,
            hashedRefreshToken: '',
            expiresAt,
            userAgent,
            ipAddress: ip,
        });

        return session;
    }

    private async updateSessionWithToken(sessionId: string, refreshToken: string, manager?: EntityManager): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        if (manager) {
            await manager.update(Auth, { id: sessionId }, { hashedRefreshToken });
        } else {
            await this.authRepository.update({ id: sessionId }, { hashedRefreshToken });
        }
    }

    async refreshTokens(refreshToken: string, ip: string, userAgent: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
            });

            const user = await this.usersRepository.findOne({
                where: { id: payload.sub },
                select: ['id', 'email', 'role']
            });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const sessionId = payload.sessionId;
            if (!sessionId) {
                throw new UnauthorizedException('Invalid refresh token format');
            }

            const currentSession = await this.getActiveSession(sessionId, refreshToken);
            if (!currentSession) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            if (currentSession.expiresAt < new Date()) {
                throw new UnauthorizedException('Refresh token expired');
            }

            const tokens = await this.generateTokens(user, sessionId);

            await this.updateSessionWithToken(currentSession.id, tokens.refreshToken);

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getActiveSession(sessionId: string, refreshToken: string) {
        const session = await this.authRepository.findOne({
            where: { id: sessionId },
        });

        if (!session) {
            return null;
        }

        const isTokenValid = await bcrypt.compare(refreshToken, session.hashedRefreshToken);
        return isTokenValid ? session : null;
    }

    async logoutAll(userId: string) {
        await this.authRepository.delete({ user: { id: userId } });
        return { message: 'Logged out successfully' };
    }
}