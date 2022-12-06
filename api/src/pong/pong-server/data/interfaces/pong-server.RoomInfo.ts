import { User, Winner } from '@prisma/client';
import { Score } from 'src/pong/pong-game/data/interfaces';
import { RoomState } from '../enums';

export interface RoomInfo {
  prismaId: number;
  roomId: string;
  user1: User;
  user2: User;
  user1Ready: boolean;
  user2Ready: boolean;
  user1Joined: boolean;
  user2Joined: boolean;
  score: Score;
  scoreToWin: number;
  state: RoomState;
  time: number;
  hasCountdown: boolean;
  countdownTime: number;
  countdownLabel: string;
  winner: Winner;
}
