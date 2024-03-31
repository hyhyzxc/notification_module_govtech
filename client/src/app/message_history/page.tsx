'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import axios from "axios";
import Link from "next/link";
import * as https from 'https';
export default function Message_History_View() {

    type Message = {
        createdAt: string,
        updatedAt: string,
        id: string,
        recipient: string,
        values: any,
        fullMessage: string,
        latestStatus: string,
        templateBodyId: string,
        campaignId: string,
        language: string
    }
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const axiosInstance = axios.create({
            httpsAgent: new https.Agent({rejectUnauthorized: false})
          })
      
          axiosInstance.get(
           'https://localhost:4000'
          ).then(
            res => {
              
              console.log(res);
              
              console.log(res.data);

              const result = res.data;
              
              setMessages(result.data);
            }
          ).catch(err => {
            console.error(err);
          })
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <Link href={"/"} className="p-2 m-5 rounded-2xl absolute top-0 left-0 text-cyan-500">
                Home
            </Link>
            <div className="overflow x-auto relative">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            
                            <th className="py-4 px-6">Created At</th>
                            <th className="py-4 px-6">Updated At</th>
                            <th className="py-4 px-6">Full Message</th>       
                            <th className="py-4 px-6">Language</th>   
                            <th className="py-4 px-6">Latest Status</th>
                            <th className="py-4 px-6">Recipient</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages?.map(message => (
                            <tr key={message.id}>
                                <td className="py-4 px-6">{message.createdAt.slice(0,10)}, {message.createdAt.slice(11,19)}</td>
                                <td className="py-4 px-6">{message.updatedAt.slice(0,10)}, {message.updatedAt.slice(11,19)}</td>
                                <td className="py-4 px-6">{message.fullMessage}</td>
                                <td className="py-4 px-6">{message.language}</td>
                                <td className="py-4 px-6">{message.latestStatus}</td>
                                <td className="py-4 px-6">{message.recipient}</td>
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
