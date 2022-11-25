import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChatRole,
  ChatRoom,
  ChatRoomVisibility,
  UserChatRoom,
} from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomWithMessages, CreateChatRoomDto } from './dto';
import { ChatMessageWithAuthor, CreateChatMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(dto: CreateChatRoomDto, ownerId: number): Promise<ChatRoom> {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    if (!owner) {
      throw new BadRequestException("Room owner doesn't exist");
    }

    let hash = undefined;
    let isProtected = false;
    if (dto.password) {
      dto.password = dto.password.trim();
      if (dto.password.length > 0) {
        hash = await argon2.hash(dto.password);
        isProtected = true;
      }
    }

    delete dto.password;
    return this.prisma.chatRoom.create({
      data: {
        ...dto,
        hash,
        isProtected,
        users: {
          create: [
            {
              isOwner: true,
              role: ChatRole.ADMIN,
              user: { connect: { id: owner.id } },
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
  }

  async getRoomsForUser(userId: number): Promise<ChatRoom[]> {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        OR: [
          { users: { some: { userId } } },
          { visibility: ChatRoomVisibility.PUBLIC },
        ],
      },
      include: {
        users: true,
      },
    });
    rooms.map((room) => {
      delete room.hash;
      return room;
    });
    return rooms;
  }

  async addUserToRoom(
    userId: number,
    roomId: string,
    password?: string,
  ): Promise<UserChatRoom> {
    const userChatRoom = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    if (userChatRoom) {
      throw new BadRequestException('User already in chat room');
    }

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new BadRequestException("Room doesn't exist");
    }

    if (room.isProtected) {
      if (!password) {
        throw new UnauthorizedException('Wrong password');
      }
      const passwordOk = await argon2.verify(room.hash, password);
      if (!passwordOk) {
        throw new UnauthorizedException('Wrong password');
      }
    }

    return await this.prisma.userChatRoom.create({
      data: { userId, roomId },
    });
  }

  async validateUserForRoom(userId: number, roomId: string): Promise<ChatRoom> {
    let room = await this.prisma.chatRoom.findFirst({
      where: {
        AND: {
          id: roomId,
          users: {
            some: { userId },
          },
        },
      },
    });

    if (!room) {
      room = await this.prisma.chatRoom.findFirst({
        where: { id: roomId, visibility: ChatRoomVisibility.PUBLIC },
      });
      if (room) {
        await this.addUserToRoom(userId, roomId);
      }
    }

    if (!room) {
      throw new UnauthorizedException("You can't access this chatroom");
    }

    return room;
  }

  async createMessage(
    userId: number,
    roomId: string,
    message: CreateChatMessageDto,
  ): Promise<ChatMessageWithAuthor> {
    const room = await this.validateUserForRoom(userId, roomId);

    return this.prisma.chatMessage.create({
      data: {
        ...message,
        author: { connect: { id: userId } },
        room: { connect: { id: room.id } },
      },
      include: { author: true },
    });
  }

  async getRoomWithMessages(
    userId: number,
    roomId: string,
  ): Promise<ChatRoomWithMessages> {
    await this.validateUserForRoom(userId, roomId);

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        messages: {
          include: { author: true },
          orderBy: {
            createdAt: 'asc',
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    delete room?.hash;
    return room;
  }

  async removeUserFromRoom(userId: number, roomId: string): Promise<void> {
    const userRoom = await this.prisma.userChatRoom.findUnique({
      where: {
        userId_roomId: {
          roomId,
          userId,
        },
      },
    });

    if (!userRoom) {
      throw new BadRequestException('User not in room');
    }

    await this.prisma.userChatRoom.delete({
      where: {
        userId_roomId: {
          roomId,
          userId,
        },
      },
    });

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: { users: true },
    });

    if (room.users.length === 0) {
      await this.prisma.chatRoom.delete({
        where: {
          id: roomId,
        },
      });
    } else {
      const newOwner = room.users.reduce((prev, user) => {
        if (!prev) {
          return user;
        }

        if (prev.role !== 'ADMIN' && user.role === 'ADMIN') {
          return user;
        }

        return prev;
      });

      newOwner.role = 'ADMIN';
      newOwner.isOwner = true;

      await this.prisma.userChatRoom.update({
        where: {
          userId_roomId: {
            userId: newOwner.userId,
            roomId: newOwner.roomId,
          },
        },
        data: newOwner,
      });
    }
  }
}
