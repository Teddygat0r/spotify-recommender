"use client";

import { useState } from "react";
import Image from "next/image";

export default function ForceComponent({ node }: { node: any }) {
    const [renderPopup, setRenderPopup] = useState(false);

    const handleClick = () => {
        setRenderPopup(!renderPopup);
        console.log(renderPopup);
    };

    return (
        <div className="relative w-full px-4 py-2 mx-auto rounded-md text-slate-400 bg-slate-900">
            <button className="flex w-full gap-4" onClick={() => handleClick()}>
                <Image
                    width="64"
                    height="64"
                    src={node.cover_src}
                    alt={node.track_name}
                    className="rounded-md"
                />
                <div className="flex flex-col w-full gap-1 m-auto overflow-clip">
                    <p className="my-auto font-bold text-left truncate">
                        {node.track_name}
                    </p>
                    <div className="flex gap-2">
                        <p className="text-xs">{node.artist_name}</p>
                        <p className="text-xs">-</p>
                        <p className="text-xs">{node.year}</p>
                    </div>
                </div>
            </button>
            <iframe
                src={`https://open.spotify.com/embed/track/${node.track_id}?utm_source=generator&theme=0`}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className={`z-10 h-64 p-0 m-auto mt-8 rounded-md w-fit ${
                    renderPopup ? "visible" : "hidden"
                }`}
            ></iframe>
        </div>
    );
}
