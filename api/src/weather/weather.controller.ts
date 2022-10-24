import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User, Weather } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guards';

import { CreateWeatherDto, UpdateWeatherDto } from './dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getWeather(@GetUser() user: User): Promise<Weather[]> {
    console.log(user);
    return await this.weatherService.getWeather();
  }

  @Get(':id')
  async getWeatherById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Weather> {
    return await this.weatherService.getWeatherById(id);
  }

  @Post()
  async createWeather(@Body() weatherDto: CreateWeatherDto): Promise<Weather> {
    return await this.weatherService.createWeather(weatherDto);
  }

  @Patch(':id')
  async updateWeather(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWeatherDto,
  ): Promise<Weather> {
    return await this.weatherService.updateWeather(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWeather(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.weatherService.deleteWeather(id);
  }
}