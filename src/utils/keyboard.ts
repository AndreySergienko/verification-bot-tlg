import type {
  InlineKeyboardButton,
  KeyboardButton,
} from 'node-telegram-bot-api';
import { btnToMsg, btnValidMsg } from './messages';

export const btnActions: KeyboardButton[][] = [[{ text: btnValidMsg }]];

export const btnTo = (url: string): InlineKeyboardButton[][] => [
  [{ text: btnToMsg, url }],
];
