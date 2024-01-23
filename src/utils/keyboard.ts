import type { InlineKeyboardButton } from 'node-telegram-bot-api';

export const btnActions = (userId: number): InlineKeyboardButton[][] => [
  [{ text: 'Не бот', callback_data: `${userId}` }],
  [{ text: 'Бот', callback_data: `${userId}` }],
];
