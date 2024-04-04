/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import * as https from 'https';
import { Observable, first, firstValueFrom } from 'rxjs';
import { map } from 'rxjs';
import axios from 'axios';
import { send } from 'process';
import { TemplateController } from './template/template.controller';
@Injectable()
export class AppService {
  
  constructor(private readonly httpService: HttpService) {}

  async sendAll(query: any): Promise<any[]>{
    //console.log(query);
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Add this line to ignore SSL certificate errors
    });


    interface Message_Response {
      createdAt : string,
      updatedAt: string,
      id: string,
      recipient: string,
      values: object,
      fullMessage: string,
      latestStatus: string,
      templateBodyId: string,
      campaignId: string,
      language: string
    }

    const responses : Message_Response[] = [];

    const sendPostmanMessage = async (reqBody) => {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // Add this line to ignore SSL certificate errors
      });
      const campaignid = process.env.CAMPAIGN_ID;
      const api_key = process.env.API_KEY;
      try {
        const data = this.httpService.post(
          `https://test.postman.gov.sg/api/v2/campaigns/${campaignid}/messages`,
          reqBody,
          {
            headers: {
              Authorization: `Bearer ${api_key}`,
            },
            httpsAgent, // Add this line to use the custom agent
          }
        );
        const response = await firstValueFrom(data);
        
        return response.data;
      }catch(err) {
        console.error(err, "postman prob");
        return responses;
      }
      
    }

    const messageAPICall = await firstValueFrom(this.httpService.get(
      'https://localhost:4000/message', {
        httpsAgent: httpsAgent,
      }
    ));
    const messageList = messageAPICall.data;

    for(let i = 0; i < messageList.length; i++) {
      const msg = messageList[i];
      const userId = msg.userId;
      const statusName = msg.statusName;
      const message = msg.message;
      const userName = msg.userName;
      const userNumber = msg.userNumber;
      const applicationRef = msg.applicationRef;
      
      const templateAPICall = await firstValueFrom(this.httpService.get(
        `https://localhost:4000/template/${statusName}`, 
        {
          httpsAgent: httpsAgent,
        }
      ));

      const templateData = templateAPICall.data[0];
      //console.log(templateData);
      const templateId = templateData.templateId;
      const fields : string[] = templateData.fields;
      let body = templateData.body;
      for (const field of fields) {
        //console.log(field);
        if (field === "name") {
          body = body.replace("{", "").replace("}", "").replace("name", userName);
        } else {
          body = body.replace("{", "").replace("}","").replace(field, query[field]);
        }
      }
      const reqBody = {
        recipient: userNumber,
        language: "english",
        values: {
          body: body
        }
      }

      const response = await sendPostmanMessage(reqBody);
            
      const msg_rsp : Message_Response = {
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        id: response.id,
        recipient: response.recipient,
        values: response.values,
        fullMessage: response.fullMessage,
        latestStatus: response.latestStatus,
        templateBodyId: response.templateBodyId,
        campaignId: response.campaignId,
        language: response.language
      }
      responses.push(msg_rsp);

      message.push(msg_rsp);

      const updateMessageAPICall = await firstValueFrom(this.httpService.patch(
        `https://localhost:4000/message/${applicationRef}/${userId}`, 
        {
          userName: userName,
          message: message,
          statusName: statusName,
          userNumber: userNumber,
        },
        {
          httpsAgent: httpsAgent,
        }

      ));
      
      const updateMessageData = updateMessageAPICall.data;
      console.log(updateMessageData);
    }
    //console.log(responses);
    return responses;
  }

  
  async getAll(): Promise<any> {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Add this line to ignore SSL certificate errors
    });

    interface Message_Response {
      createdAt : string,
      updatedAt: string,
      id: string,
      recipient: string,
      values: object,
      fullMessage: string,
      latestStatus: string,
      templateBodyId: string,
      campaignId: string,
      language: string
    }

    const responses = [];

    const campaignid = process.env.CAMPAIGN_ID;
    const api_key = process.env.API_KEY;

    const messageAPICall = await firstValueFrom(this.httpService.get(
      `https://localhost:4000/message`, {
        httpsAgent: httpsAgent
      }
    ));

    const messages = messageAPICall.data;

    const postmanAPICall = await firstValueFrom(this.httpService.get(
      `https://test.postman.gov.sg/api/v2/campaigns/${campaignid}/messages?limit=100`, 
      {
        headers: {
          Authorization: `Bearer ${api_key}`,
        },
        httpsAgent, // Add this line to use the custom agent
      }
    ))

    const messageHistory = postmanAPICall.data.data;

    const messageHistoryMap = new Map<string, any>();

    for(const message of messageHistory) {
      messageHistoryMap.set(message.id, message);
    }


    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const userMessageList = msg.message;
      for (const userMessage of userMessageList) {
        console.log(userMessage.latestStatus);
        //console.log(userMessage);
        //console.log(campaignid);
        if (userMessage.latestStatus == 'created') {
            const pastMessage = messageHistoryMap.get(userMessage.id);
            
            userMessage.latestStatus = pastMessage.latestStatus;
            
        }
        responses.push(userMessage);
      }
      const updateMessageAPICall = await firstValueFrom(this.httpService.patch(
        `https://localhost:4000/message/${msg.applicationRef}/${msg.userId}`,
          {
            userName: msg.userName,
            message: userMessageList,
            statusName: msg.statusName,
            userNumber: msg.userNumber,
          },
          {
            httpsAgent: httpsAgent,
          }
      ));
      console.log(updateMessageAPICall.data);
      
    }
    //console.log(responses);
    return responses;
  }
  
  


  // async getAll():Promise<any> {
    

  //   const httpsAgent = new https.Agent({
  //     rejectUnauthorized: false, // Add this line to ignore SSL certificate errors
  //   });
    
  //   try {
  //     const data = this.httpService.get(
  //       `https://test.postman.gov.sg/api/v2/campaigns/${campaignid}/messages?limit=10`,
        
  //     );
  //     const response = await firstValueFrom(data);
  //     console.log(response);
  //     return response.data;
  //   }catch(err) {
  //     console.error(err, "postman prob");
  //   }

  
}
