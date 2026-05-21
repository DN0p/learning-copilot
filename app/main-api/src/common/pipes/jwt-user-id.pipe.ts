import { Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUserIdPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  async transform(value: string): Promise<string> {
    if (!value) {
      throw new UnauthorizedException('JWT token is required');
    }

    const token = value.startsWith('Bearer ') ? value.slice(7) : value;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'fallback-secret-key',
      });

      const userId = payload?.sub ?? payload?.userId ?? payload?.id;
      if (!userId) {
        throw new UnauthorizedException('JWT payload does not contain userId');
      }

      return String(userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
