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
    console.log(query);
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

    console.log(messageList);

    for(let i = 0; i < messageList.length; i++) {
      const msg = messageList[i];
      const key : string = msg['userId#statusId'];
      const index_hash = key.indexOf('#');
      const userId = key.slice(0, index_hash);
      const statusId = key.slice(index_hash+1);
      const statusName = msg.statusName;
      const message = msg.message;
      const userName = msg.userName;
      const userNumber = msg.userNumber;
      const applicationRef = msg.applicationRef;
      
      const templateAPICall = await firstValueFrom(this.httpService.get(
        `https://localhost:4000/template/${statusId}`, 
        {
          httpsAgent: httpsAgent,
        }
      ));

      const templateData = templateAPICall.data[0];
      console.log(templateData);
      const templateId = templateData.templateId;
      const fields : string[] = templateData.fields;
      let body = templateData.body;
      for (const field of fields) {
        console.log(field);
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
        `https://localhost:4000/message/${applicationRef}/${key}`, 
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
    console.log(responses);
    return responses;
  }

  
  
  

  // async sendAll(query: any): Promise<any[]>{
  //   console.log(query);
     

    


    


    

  //   //fetch all users
  //   const usersAPICall = await firstValueFrom(this.httpService.get(
  //     'https://localhost:4000/users', {
  //       httpsAgent: httpsAgent
  //     }
  //   ));
  //   const usersList = usersAPICall.data;

  //   for (let i = 0; i < usersList.length; i++) {
  //     const user = usersList[i];
  //     const userId = user.id;

  //     const userMessageDataAPICall = await firstValueFrom(this.httpService.get(
  //       `https://localhost:4000/users/messageDetails/${userId}`, {
  //         httpsAgent: httpsAgent
  //       }
  //     ))

  //     const userMessageData = userMessageDataAPICall.data[0];

  //     const username = userMessageData.username;
  //     const number = userMessageData.number;
  //     let body = `Hi ${username}! `  + userMessageData.body + '.';

  //     const templateId = userMessageData.templateid;
  //     console.log(templateId);

  //     const templateAPICall = await firstValueFrom(this.httpService.get(
  //       `https://localhost:4000/template/${templateId}`, {
  //         httpsAgent: httpsAgent
  //       }
  //     ))

  //     const templateData = templateAPICall.data;

  //     const fields = templateData.fields;
  //     console.log(fields);
      

      

  //     const response = await sendPostmanMessage(reqBody);
      
  //     const msg_rsp : Message_Response = {
  //       createdAt: response.createdAt,
  //       updatedAt: response.updatedAt,
  //       id: response.id,
  //       recipient: response.recipient,
  //       values: response.values,
  //       fullMessage: response.fullMessage,
  //       latestStatus: response.latestStatus,
  //       templateBodyId: response.templateBodyId,
  //       campaignId: response.campaignId,
  //       language: response.language
  //     }
  //     responses.push(msg_rsp);

  //   }
  //   return responses;


    // return new Promise<any[]>(resolve => {
    //   userMessageData.subscribe({
    //     next(x) {
    //       //console.log(typeof x[0]);
    //       userData = userData.concat(x);
    //     },
    //     error(err) {
    //       console.error(err);
    //       return [{
    //         error: "Error sending messages."
    //       }];
    //     },
    //     async complete(){
          
    //       const httpsAgent = new https.Agent({
    //         rejectUnauthorized: false,
    //       });
    //       for (const obj of userData) {
    //         console.log(obj);
    //         const username = obj.username;
    //         const number = obj.number;
    //         const statusname = obj.statusname;
    //         const fieldname = obj.fieldname;
    //         const body = obj.body.replace("{", "").replace("}","").replace(fieldname, deadline)

    //         console.log(body);
    //         const reqBody = {
    //           recipient: number,
    //           language: "english",
    //           values: {
    //             body: body
    //           }
    //         }
            
            
            
  
  
    //       }
    //       //console.log(responses);
    //       resolve(responses);
          
    //     }
    //   });   
      
    // })
      
  


  // async getAll():Promise<any> {
  //   interface Message_Response {
  //     createdAt : string,
  //     updatedAt: string,
  //     id: string,
  //     recipient: string,
  //     values: object,
  //     fullMessage: string,
  //     latestStatus: string,
  //     templateBodyId: string,
  //     campaignId: string,
  //     language: string
  //   }

  //   const httpsAgent = new https.Agent({
  //     rejectUnauthorized: false, // Add this line to ignore SSL certificate errors
  //   });
  //   const campaignid = process.env.CAMPAIGN_ID;
  //   const api_key = process.env.API_KEY;
  //   try {
  //     const data = this.httpService.get(
  //       `https://test.postman.gov.sg/api/v2/campaigns/${campaignid}/messages?limit=10`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${api_key}`,
  //         },
  //         httpsAgent, // Add this line to use the custom agent
  //       }
  //     );
  //     const response = await firstValueFrom(data);
  //     console.log(response);
  //     return response.data;
  //   }catch(err) {
  //     console.error(err, "postman prob");
  //   }

  
}
