import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PanelController } from './panel/panel.controller';
import { PanelService } from './panel/panel.service';
import { AuthorityController } from './authority/authority.controller';
import { AuthorityService } from './authority/authority.service';
@Module({
  imports: [],
  controllers: [AppController, AuthController, PanelController, AuthorityController],
  providers: [AppService, AuthService, PanelService, AuthorityService],
})
export class AppModule {}
