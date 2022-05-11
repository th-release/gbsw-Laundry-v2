import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service'
import { Request, Response } from 'express';

@Controller()
export class AppController {
	constructor (private readonly AppService: AppService) {}
	@Get()
	@Render('home')
	getIndex() {
		return 0;
	}

	@Post()
	getData(@Req() req: Request, @Res() res: Response) {
		return this.AppService.getIndex(req, res);
	}
}
