import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from '../shared/shared.module';
import { GameInviteComponent, InviteDialogComponent, JoinGameDialogComponent, PongInputComponent, PongScreenComponent } from './components';
import { Pong3DScreenComponent } from './components/pong-3dscreen/pong-3dscreen.component';
import { PongEndOverlayComponent } from './components/pong-end-overlay/pong-end-overlay.component';
import { PongScreenContainerComponent } from './components/pong-screen-container/pong-screen-container.component';
import { PongService } from './services/pong.service';

@NgModule({
  declarations: [
		GameInviteComponent,
		InviteDialogComponent,
		JoinGameDialogComponent,
		PongScreenContainerComponent,
		PongEndOverlayComponent,
		PongScreenComponent,
		Pong3DScreenComponent,
		PongInputComponent,
	],
  imports: [DialogModule, ButtonModule, CommonModule, SharedModule],
	exports: [
		GameInviteComponent,
		InviteDialogComponent,
		JoinGameDialogComponent,
		PongScreenContainerComponent,
		PongEndOverlayComponent,
		PongScreenComponent,
		Pong3DScreenComponent,
		PongInputComponent,
	],
  providers: [PongService],
})
export class PongModule {}