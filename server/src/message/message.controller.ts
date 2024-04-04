import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Patch(':applicationRef/:userId')
  update(
    @Param('applicationRef') applicationRef: string,
    @Param('userId') userId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update(applicationRef, userId, updateMessageDto);
  }

  @Delete(':id/:userId')
  remove(@Param('id') applicationRef: string, @Param('userId') userId: string) {
    return this.messageService.remove(applicationRef, userId);
  }
}
