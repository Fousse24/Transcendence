import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WeatherModule } from './weather/weather.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PongServerModule } from './pong-server/pong-server.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WeatherModule,
    AuthModule,
    PassportModule.register({ session: true }),
    UserModule,
    ChatModule,
    CloudinaryModule,
    PongServerModule,
  ],
  controllers: [],
})
export class AppModule {}