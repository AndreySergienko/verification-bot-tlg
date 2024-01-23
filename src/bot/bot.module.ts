import { BotService } from './bot.service';
import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';

@Global()
@Module({
  controllers: [],
  providers: [BotService],
  exports: [],
  imports: [SequelizeModule.forFeature([Bot])],
})
export class BotModule {}
