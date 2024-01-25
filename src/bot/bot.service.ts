import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { useSendMessage } from '../hooks/useSendMessage';
import { btnActions, btnTo } from '../utils/keyboard';
import { acceptMsg, btnValidMsg, validateMsg } from '../utils/messages';
import * as process from 'process';

/**
 * Method check timeout request
 * @param {number} date - timestamp tlg
 * **/
function hasPassedTwoDays(date: number) {
  return Date.now() - 48 * 60 * 60 * 1000 > date * 1000;
}

@Injectable()
export class BotService implements OnModuleInit {
  constructor(@InjectModel(Bot) private botRepository: typeof Bot) {
    global.bot = new TelegramBot(process.env.TOKEN_BOT, { polling: true });
  }

  async startBot() {
    // watch chat request thread
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
          const chatId = chat.id;
          if (isInclude) {
            await this.botRepository.update(
              { chatId, userId, date },
              { where: { userId } },
            );
          } else {
            await this.botRepository.create({ userId, date, chatId });
          }
          const login = from.first_name || from.last_name || from.username;
          await global.bot.sendMessage(
            userId,
            validateMsg(login),
            useSendMessage({
              keyboard: btnActions,
              remove_keyboard: true,
              resize_keyboard: true,
            }),
          );
        } catch (e) {
          console.log(e);
        }
      },
    );

    // watch msg thread
    global.bot.on('message', async ({ from, text }: TelegramBot.Message) => {
      const userId = from.id;
      let isHasUser = false;

      try {
        if (text !== btnValidMsg) return;
        const user = await this.botRepository.findOne({ where: { userId } });
        isHasUser = !!user;
        if (!user) return;

        // check timeout request
        if (hasPassedTwoDays(user.date)) {
          await this.botRepository.destroy({ where: { userId } });
          return;
        }

        await global.bot.approveChatJoinRequest(user.chatId, userId);
        await global.bot.sendMessage(
          userId,
          acceptMsg,
          useSendMessage({
            inline_keyboard: btnTo(process.env.LINK),
            remove_keyboard: true,
          }),
        );
        await this.botRepository.destroy({ where: { userId } });
      } catch (e) {
        console.log(e);
        if (isHasUser) await this.botRepository.destroy({ where: { userId } });
      }
    });
  }

  async onModuleInit() {
    await this.startBot();
  }
}
