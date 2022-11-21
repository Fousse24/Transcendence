import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BadgeModule } from 'primeng/badge';
import {
  NavBarComponent,
  NotFoundComponent,
  ServerErrorComponent,
} from './components';
import { RouterModule } from '@angular/router';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { MatchHistoryComponent } from './components/match-history/match-history.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    NavBarComponent,
    SearchUserComponent,
    UserAvatarComponent,
    MatchHistoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    AvatarModule,
    RouterModule,
    TabViewModule,
    CardModule,
    InputTextareaModule,
    BadgeModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    NavBarComponent,
    InputTextModule,
    AvatarModule,
    DialogModule,
    TabViewModule,
    CardModule,
    SearchUserComponent,
    UserAvatarComponent,
    MatchHistoryComponent,
    InputTextareaModule,
    BadgeModule,
  ],
})
export class SharedModule {}
