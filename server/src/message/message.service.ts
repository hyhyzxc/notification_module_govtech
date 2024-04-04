import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { dynamoDBClient } from 'src/aws-config/dynamoDBClient';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MessageService {
  async create(createMessageDto: CreateMessageDto) {
    const userId = uuid();
    return await dynamoDBClient()
      .put({
        TableName: 'Message',
        Item: {
          applicationRef: uuid(),
          userId: userId,
          message: createMessageDto.message,
          userName: createMessageDto.userName,
          statusName: createMessageDto.statusName,
          userNumber: createMessageDto.userNumber,
        },
      })
      .promise();
  }

  async findAll() {
    const results = await dynamoDBClient()
      .scan({
        TableName: 'Message',
      })
      .promise();
    return results.Items;
  }

  async update(
    applicationRef: string,
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ) {
    const updated = await dynamoDBClient()
      .update({
        TableName: 'Message',
        Key: { applicationRef: applicationRef, userId: userId },
        UpdateExpression:
          'set message = :m, userName = :name, statusName = :s, userNumber = :num',
        ExpressionAttributeValues: {
          ':m': updateMessageDto.message,
          ':name': updateMessageDto.userName,
          ':s': updateMessageDto.statusName,
          ':num': updateMessageDto.userNumber,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return updated.Attributes;
  }

  async remove(applicationRef: string, userId: string) {
    return await dynamoDBClient()
      .delete({
        TableName: 'Message',
        Key: { applicationRef: applicationRef, userId: userId },
      })
      .promise();
  }
}
