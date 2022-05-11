/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}
  @Get()
  @Render('login')
  getIndex() {
    return 0;
  }
  
  @Get('/login')
  @Render('login')
  getLogIn() {
    return 0;
  }

  @Get('/signin')
  @Render('login')
  getSignIn() {
    return 0;
  }

  @Get('/signup')
  @Render('signup')
  async getSignUp() {
    return 0;
  }

  @Get('/logout')
  @Render('signout')
  async getLogOut() {
    return 0;
  }

  @Get('/signout')
  @Render('signout')
  async getSignOut() {
    return 0;
  }

  @Post('login')
  async Login(@Req() req, @Res() res) {
    return this.AuthService.login(req, res);
  }

  @Post('signup')
  async SignUp(@Req() req, @Res() res: Response) {
    return this.AuthService.signup(req, res);
  }
}
