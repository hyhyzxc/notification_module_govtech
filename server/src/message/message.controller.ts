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

  @Patch(':applicationRef/:sortKey')
  update(
    @Param('applicationRef') applicationRef: string,
    @Param('sortKey') sortKey: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update(
      applicationRef,
      sortKey,
      updateMessageDto,
    );
  }

  @Delete(':id/:userId/:statusId')
  remove(
    @Param('id') applicationRef: string,
    @Param('userId') userId: string,
    @Param('statusId') statusId: string,
  ) {
    const sk = userId + '#' + statusId;
    console.log(applicationRef);
    console.log(sk);
    return this.messageService.remove(applicationRef, sk);
  }
}
