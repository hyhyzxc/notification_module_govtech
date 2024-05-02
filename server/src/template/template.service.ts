import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { v4 as uuid } from 'uuid';
import { dynamoDBClient } from 'src/aws-config/dynamoDBClient';
import { dynamooseClient } from 'src/dynamoose-config/dynamooseSetup';
import { TemplateEntity } from 'src/electro_db/electroDB';
import { table } from 'console';
import { Template } from './entities/template.entity';
@Injectable()
export class TemplateService {
  // async create(createTemplateDto: CreateTemplateDto) {
  //   const templateId = uuid();
  //   const statusId = uuid();
  //   return await dynamoDBClient()
  //     .put({
  //       TableName: 'Template',
  //       Item: {
  //         templateId: templateId,
  //         statusId: statusId,
  //         fields: createTemplateDto.fields,
  //         statusName: createTemplateDto.statusName,
  //         body: createTemplateDto.body,
  //       },
  //     })
  //     .promise();
  // }

  async create(createTemplateDto: CreateTemplateDto) {
    // const Template = dynamooseClient();

    // const templateId = uuid();
    // const statusId = uuid();

    // const template = new Template({
    //     templateId: templateId,
    //     statusId: statusId,
    //     fields: createTemplateDto.fields,
    //     statusName: createTemplateDto.statusName,
    //     body: createTemplateDto.body,
    // });

    // return await template.save();
    const templateId = uuid();
    const statusId = uuid();
    return TemplateEntity.put({
      templateId: templateId,
      statusId: statusId,
      fields: createTemplateDto.fields,
      statusName: createTemplateDto.statusName,
      body: createTemplateDto.body,
    }).go({ ignoreOwnership: true });
}

  async findAll() {
    // const results = await dynamoDBClient()
    //   .scan({
    //     TableName: 'Template',
    //   })
    //   .promise();
    // return results.Items;

    // const template = dynamooseClient();
    // return template.scan().exec();
    
    
    return await TemplateEntity.find({
        // templateId: '883d63fc-46db-4366-9b37-927dc7209845',
        // statusName: 'test',
      })
      .go({ ignoreOwnership: true });
  }

  async findByStatusName(statusName: string) {
    // const results = await dynamoDBClient()
    //   .scan({
    //     TableName: 'Template',
    //     FilterExpression: 'statusName = :statusName',
    //     ExpressionAttributeValues: {
    //       ':statusName': statusName,
    //     },
    //   })
    //   .promise();
    // return results.Items;

    return await TemplateEntity.query
      .statusIndex({
      statusName: statusName,
      })
      .go({ ignoreOwnership: true });
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

  async remove(templateId: string, statusName: string) {
    return await dynamoDBClient()
      .delete({
        TableName: 'Template',
        Key: { templateId: templateId, statusName: statusName },
      })
      .promise();
  }
}
