'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import axios from "axios";
import Link from "next/link";
import PopupTable from "./popuptable";

export default function Modify_Users_Home() {
    const [isPopUpTableOpen, setPopUpTableOpen] = useState(false);

    const togglePopUp = () => {
        setPopUpTableOpen(!isPopUpTableOpen);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
        

        <div className="mb-32 grid grid-cols-5 text-center">
            <Link
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            href = "/"
            >
            <h2 className={`mb-3 text-2xl font-semibold `}>
                Home{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                </span>
            </h2>
            
            </Link>
            <button
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                onClick = {togglePopUp}
            >
            <h2 className={`mb-3 text-2xl font-semibold`}>
                View Users{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                </span>
                {isPopUpTableOpen && <PopupTable onClose={() => {togglePopUp()}}></PopupTable>}
            </h2>
            
            </button>

            <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
            >
            <h2 className={`mb-3 text-2xl font-semibold`}>
                Add User{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                </span>
            </h2>
            
            </a>

            <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
            >
            <h2 className={`mb-3 text-2xl font-semibold`}>
                Edit Users{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                </span>
            </h2>
            
            </a>

            <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
            >
            <h2 className={`mb-3 text-2xl font-semibold`}>
                Remove User{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                </span>
            </h2>
            
            </a>
        </div>
        </main>
    );
}
