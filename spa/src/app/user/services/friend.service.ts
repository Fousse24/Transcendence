import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services';
import { UpdateFriendsDto, UpdateUserDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private readonly baseApiService: BaseApiService) {}

  getFriend(dto: UpdateFriendsDto, userId: number): Observable<UpdateFriendsDto>{
    return this.baseApiService.getOne(`/users/${userId}/friend/${dto.adresseeId}`);
  }

  getFriends(userId: number): Observable<UpdateFriendsDto[]> {
    return this.baseApiService.getMany(`/users/${userId}/friends_list`);
  }

  getPendingInvitations(userId: number): Observable<UpdateFriendsDto[]> {
    return this.baseApiService.getMany(`/users/${userId}/pending_friends`);
  }

  updateFriendship(
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/addfriend/${dto.adresseeId}`,
      dto
    );
  }

  removeFriendship(
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/removefriend/${dto.adresseeId}`,
      dto
    );
  }

  createFriendship(
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.postOne(
      `/users/${userId}/createfriend/${dto.adresseeId}`,
      dto
    );
  }
}
