import { Module } from '@nestjs/common';
import * as process from 'process';
import {ConfigModule} from "@nestjs/config";
import SqlDatabase from "./database/samples/SqlDatabase";
import {SequelizeModule} from "@nestjs/sequelize";
import {BotModule} from "./bot/bot.module";
import {Bot} from "./bot/models/bot.model";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.envs/.${process.env.STAND}.env`,
  }),
    SequelizeModule.forRoot(new SqlDatabase().connect([Bot])),
    BotModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
