/** ForceGraph.tsx
 *  Holds the graph that shows all your songs.
 */

"use client";
import { ForceGraph3D } from "react-force-graph";
import { TrackData, Track } from "./types";
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { renderToStaticMarkup } from "react-dom/server";

const extraRenderers = [new CSS2DRenderer()];

export default function ForceGraph({ data }: { data: TrackData }) {
    return (
        <ForceGraph3D
            //@ts-ignore
            extraRenderers={extraRenderers}
            graphData={data}
            nodeAutoColorBy="track_name"
            nodeThreeObject={(node) => {
                const nodeEl = document.createElement("div");
                const nodeJsx = (
                    <div className="px-4 bg-black bg-opacity-50 rounded-md">
                        <p className="truncate">{node.track_name}</p>
                    </div>
                );
                // nodeEl.textContent = typeof node.id === "string" ? node.id : "";
                nodeEl.style.color = node.color;
                // nodeEl.className = "text-2xl";
                nodeEl.innerHTML = renderToStaticMarkup(nodeJsx);
                return new CSS2DObject(nodeEl);
            }}
            onNodeClick={(node) => {
                console.log(`https://open.spotify.com/track/${node.track_id}`);
                window.open(
                    `https://open.spotify.com/track/${node.track_id}`,
                    "_blank",
                );
            }}
            nodeThreeObjectExtend={true}
        />
    );
}
