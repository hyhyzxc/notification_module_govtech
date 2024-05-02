'use client'
import Image from "next/image";
import {useState, useEffect, createContext} from 'react';
import axios from "axios";
import Link from "next/link";
import * as https from 'https';
import { redirect } from "next/dist/server/api-utils";
import { Any } from "typeorm";

export default function Home() {

  const MessageHistoryContext = createContext(Any);

  const sendAll = ():boolean => {

    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    })

    axiosInstance.post(
     "https://localhost:4000?deadline=20/04/2024"
    ).then(
      res => {
        
        console.log(res);
        
        console.log(res.data);
        
          
        alert("Message sent!");
        return true;
      }
    ).catch(err => {
      console.error(err);
      return false;
    })
    
    return true;
    
  }

  const getMessageHistory = ():any => {
    let result;
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({rejectUnauthorized: false})
    })

    axiosInstance.get(
     'https://localhost:4000'
    ).then(
      res => {
        
        console.log(res);
        
        console.log(res.data);
        
        result = res.data;
      }
    ).catch(err => {
      console.error(err);
    })
    
    return result;
  }


  return (
    
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <button
          onClick={sendAll}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Send Notifications to All{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`ml-3 max-w-[30ch] text-sm opacity-50`}>
            Send message to all users in database.
          </p>
        </button>

        <Link
          href="/modify_users"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"       
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Modify Users{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 m-0`}>
            Add, view, edit or remove users.
          </p>
        </Link>


        <MessageHistoryContext.Provider value = {getMessageHistory}>
        <Link
          href="/message_history"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Get Past 10 Messages{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Get details of past 10 messages sent.
          </p>
        </Link>
        </MessageHistoryContext.Provider>

        {/* <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a> */}
      </div>
    </main>
  );
}
