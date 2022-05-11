import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthorityService } from './authority.service'

@Controller('authority')
export class AuthorityController {
  constructor(private readonly AuthorityService: AuthorityService) {}

  @Get()
  @Render('')
  async getIndex() {
    return 0;
  }

  @Post()
  async getAuthority(@Req() req: Request, @Res() res: Response) {
    return this.AuthorityService.getAuthority(req, res);
  }

  @Post('Allow')
  async AllowUser(@Req() req: Request, @Res() res: Response) {
    return this.AuthorityService.AllowUser(req, res);
  }

  @Post('Delete')
  async DeleteUser(@Req() req: Request, @Res() res: Response) {
    return this.AuthorityService.DeleteUser(req, res);
  }

}
