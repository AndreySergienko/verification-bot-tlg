import type { InlineKeyboardButton } from 'node-telegram-bot-api';

export const btnActions = (userId: number): InlineKeyboardButton[][] => [
  [{ text: 'Я не робот', callback_data: `${userId}` }],
];
