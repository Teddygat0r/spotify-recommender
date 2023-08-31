"use client";

import Link from "next/link";
import { useState } from "react";

export default function SelectEmbedding({ song_id }: { song_id: string }) {
    const [expand, setExpand] = useState(false);

    const handleClick = () => {
        setExpand(!expand);
    };

    const embeddings = ["cosine", "euclidean", "manhattan"];

    return (
        <div className="absolute z-10 ">
            <button
                className="flex flex-col gap-1 px-4 py-2 m-4 text-white duration-150 rounded-md bg-slate-800 hover:bg-slate-700"
                onClick={() => handleClick()}
            >
                <div className="flex gap-1">
                    <p className="m-auto">Select Embedding</p>
                    <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`m-auto duration-150 ${
                            expand ? "-rotate-90" : "rotate-0"
                        }`}
                    >
                        <rect x="0" fill="none" width="24" height="24" />
                        <g>
                            <path fill="white" d="M7 10l5 5 5-5" />
                        </g>
                    </svg>
                </div>
                <div className={`w-full ${expand ? "visible" : "hidden"}`}>
                    {embeddings.map((val) => {
                        return (
                            <div className="w-full p-2 text-sm duration-150 border-b hover:font-bold border-slate-600">
                                <Link href={`/songs/${song_id}/${val}`}>
                                    <p className="text-left">
                                        {val.charAt(0).toUpperCase() +
                                            val.slice(1)}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </button>
        </div>
    );
}
