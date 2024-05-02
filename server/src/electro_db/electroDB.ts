/* eslint-disable prettier/prettier */
import { Entity } from "electrodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";


const client = new DocumentClient({
    region: "local", 
    endpoint: 'http://localhost:8000'
});

const table = "Template";

export const TemplateEntity = new Entity({
    model: {
        entity: "Template",
        version: "1",
        service: "electroDB"
    },
    attributes: {
        templateId: {
            type: "string",
            required: true,
            field: "templateId",
        },
        statusName: {
            type: "string",
            required: true,
            field: "statusName",
            validate: (value: string) => {
                if (value == "test3") {
                    return "Should not be test3";
                }
                return false;
            }
        },
        fields: {
            type: "list",
            items: {
                type: "string"
            }
        },
        statusId: {
            type: "string",
            field: "statusId",
        },
        body: {
            type: "string",
            field: "body",
        }
    },
    indexes: {
        templateIndex: {
            pk: {
                field: "templateId",
                composite: ["templateId"],
            },
            sk: {
                field: "statusName",
                composite: ["statusName"],
            }
        },

        statusIndex: {
            index: "GSI_status",
            pk: {
                field: "statusName",
                composite: ["statusName"]
            },
            sk: {
                field: "statusId",
                composite: ["statusId"],
            }
        }
    }
}, {table, client});

