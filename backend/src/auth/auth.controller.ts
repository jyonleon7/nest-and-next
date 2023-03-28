import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return {
      csrfToken: req.csrfToken(),
    };
  }

  @Post('signup')
  async signUp(@Body() authDto: AuthDto): Promise<Msg> {
    return await this.authService.singUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    // res を使用してcookie を使用すると、return値がJSONにならないため、passthrough:true をつける
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(authDto);
    // cookie に jwt.accessTokenを付与する
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      // default は chrome の場合にcookieがセットできないので、noneにする
      sameSite: 'none',
      // https かどうか
      secure: true,
      path: '/',
    });
    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
