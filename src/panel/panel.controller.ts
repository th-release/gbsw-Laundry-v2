import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PanelService } from './panel.service'
@Controller('panel')
export class PanelController {
  constructor(private readonly PanelService:PanelService) {}

  @Get()
  @Render('panel')
  async getIndex() {
    return 0;
  }

  @Get('laundry')
  @Render('laundry')
  async getLaundry() {
    return 0;
  }

  @Get('/authority')
  @Render('authority')
  async getAuthority() {
    return 0;
  }

  @Post('/GetData')
  async GetData(@Req() req: Request, @Res() res: Response) {
    return this.PanelService.GetData(req, res);
  }

  @Post('/Laundry')
  async UseLaundry(@Req() req: Request, @Res() res: Response) {
    return this.PanelService.UseLaundry(req, res);
  }
}
