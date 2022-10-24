import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatSocket } from '../../core/core.module';

import { ToastService } from '../../core/services';
import { Room } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: ChatSocket,
    private readonly toastService: ToastService
  ) {}

  sendMessage() {}

  getMessage(): Observable<string> {
    return this.socket.fromEvent('message');
  }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  createRoom(room: Room) {
    this.socket.emit('createRoom', room);
    this.toastService.showSuccess('Success', `Room ${room.name} created`);
  }
}