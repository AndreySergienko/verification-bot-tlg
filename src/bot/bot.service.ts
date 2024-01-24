import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { useSendMessage } from '../hooks/useSendMessage';
import { btnActions } from '../utils/keyboard';
import { validateMsg } from '../utils/messages';

function hasPassedDay(date: number) {
  return Date.now() - 24 * 60 * 60 * 1000 > date * 1000;
}

@Injectable()
export class BotService implements OnModuleInit {
  constructor(@InjectModel(Bot) private botRepository: typeof Bot) {
    global.bot = new TelegramBot(process.env.TOKEN_BOT, { polling: true });
  }

  async startBot() {
    global.bot.on(
      'chat_join_request',
      async ({
        user_chat_id,
        chat,
        date,
        from,
      }: TelegramBot.ChatJoinRequest) => {
        try {
          const userId = user_chat_id;
          const isInclude = await this.botRepository.findOne({
            where: { userId },
          });
          if (isInclude) return;
          const chatId = chat.id;
          await this.botRepository.create({ userId, date, chatId });
          const login = from.first_name || from.last_name || from.username;
          await global.bot.sendMessage(
            userId,
            validateMsg(login),
            useSendMessage({
              inline_keyboard: btnActions(userId),
              remove_keyboard: true,
            }),
          );
        } catch (e) {
          console.log(e);
        }
      },
    );

    global.bot.on(
      'callback_query',
      async ({ from, id: callback_query_id }: TelegramBot.CallbackQuery) => {
        try {
          const userId = from.id;
          const user = await this.botRepository.findOne({ where: { userId } });
          if (!user) return;
          if (hasPassedDay(user.date)) return;
          await global.bot.approveChatJoinRequest(user.chatId, userId);
          await this.botRepository.destroy({ where: { userId } });
          // Method has deprecated
          await global.bot.answerCallbackQuery({
            callback_query_id,
          });
        } catch (e) {
          console.log(e);
        }
      },
    );
  }

  async onModuleInit() {
    await this.startBot();
  }
}
