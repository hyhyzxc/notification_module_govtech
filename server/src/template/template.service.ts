import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { v4 as uuid } from 'uuid';
import { dynamoDBClient } from 'src/aws-config/dynamoDBClient';

@Injectable()
export class TemplateService {
  async create(createTemplateDto: CreateTemplateDto) {
    const templateId = uuid();
    const statusId = uuid();
    return await dynamoDBClient()
      .put({
        TableName: 'Template',
        Item: {
          templateId: templateId,
          statusId: statusId,
          fields: createTemplateDto.fields,
          statusName: createTemplateDto.statusName,
          body: createTemplateDto.body,
        },
      })
      .promise();
  }

  async findAll() {
    const results = await dynamoDBClient()
      .scan({
        TableName: 'Template',
      })
      .promise();
    return results.Items;
  }

  async findByStatusName(statusName) {
    const results = await dynamoDBClient()
      .scan({
        TableName: 'Template',
        FilterExpression: 'statusName = :statusName',
        ExpressionAttributeValues: {
          ':statusName': statusName,
        },
      })
      .promise();
    return results.Items;
  }

  async update(
    templateId: string,
    statusName: string,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    const updated = await dynamoDBClient()
      .update({
        TableName: 'Template',
        Key: { templateId: templateId, statusName: statusName },
        UpdateExpression: 'set #f = :f, body = :b',
        ExpressionAttributeValues: {
          ':f': updateTemplateDto.fields,
          ':b': updateTemplateDto.body,
        },
        ExpressionAttributeNames: {
          '#f': 'fields',
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return updated.Attributes;
  }

  async remove(templateId: string) {
    return await dynamoDBClient()
      .delete({
        TableName: 'Message',
        Key: { templateId: templateId },
      })
      .promise();
  }
}
