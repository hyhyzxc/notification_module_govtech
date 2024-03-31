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

  async findByStatusId(statusId) {
    const results = await dynamoDBClient()
      .scan({
        TableName: 'Template',
        FilterExpression: 'statusId = :statusId',
        ExpressionAttributeValues: {
          ':statusId': statusId,
        },
      })
      .promise();
    return results.Items;
  }

  async update(
    templateId: string,
    statusId: string,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    const updated = await dynamoDBClient()
      .update({
        TableName: 'Template',
        Key: { templateId: templateId, statusId: statusId },
        UpdateExpression: 'set #f = :f, body = :b, statusName = :s',
        ExpressionAttributeValues: {
          ':f': updateTemplateDto.fields,
          ':b': updateTemplateDto.body,
          ':s': updateTemplateDto.statusName,
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
