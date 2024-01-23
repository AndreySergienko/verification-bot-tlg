import type {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  SendMessageOptions,
} from 'node-telegram-bot-api';

export function useSendMessage(
  reply_markup:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined,
): SendMessageOptions {
  return {
    parse_mode: 'HTML',
    reply_markup,
  };
}
