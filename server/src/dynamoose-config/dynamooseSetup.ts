/* eslint-disable prettier/prettier */

import * as dynamoose from "dynamoose";

export const dynamooseClient = () => {
    const connection = new dynamoose.aws.ddb.DynamoDB({
    region: 'local',
    endpoint: 'http://localhost:8000',
  });

  dynamoose.aws.ddb.set(connection);

  const TemplateSchema = new dynamoose.Schema({
    templateId: {
      type: String,
      hashKey: true,
    },
    statusName: {
      type: String,
      rangeKey: true,
    },
    fields: {
      type: Array,
      schema: [String],
    },
    statusId: String,
    body: String,
  }, {
    validate: (obj) => {
      console.log(obj);
      if (obj.statusName == "test2") {
        throw new Error("wrong status name");
      }
      return true;
    }
  });

  const template = dynamoose.model('Template', TemplateSchema, {
    create: false,
  });

  return template;
}