import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async singUp(authDto: AuthDto): Promise<Msg> {
    const hashedPassword = await bcrypt.hash(authDto.password, 12);
    try {
      await this.prisma.user.create({
        data: {
          email: authDto.email,
          hashedPassword,
        },
      });
      return {
        message: 'ok',
      };
    } catch (error) {
      console.dir(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'このメールアドレスはすでに存在しています。',
          );
        }
      }
      throw error;
    }
  }

  async login(authDto: AuthDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException(
        'メールアドレスかパスワードが正しくありません。もう一度確認してください',
      );
    }
    const isValid = await bcrypt.compare(authDto.password, user.hashedPassword);
    if (!isValid) {
      throw new ForbiddenException(
        'メールアドレスかパスワードが正しくありません。もう一度確認してください',
      );
    }

    return await this.generateJwt(user.id, user.email);
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: 60 * 60,
      secret: this.configService.get('JWT_SECRET'),
    });

    return { accessToken };
  }
}
