import ForceComponent from "@/components/ForceComponent";
import ForceGraph from "@/components/ForceGraph";
import { TrackData, Track } from "@/components/types";

type Link = {
    source: string;
    target: string;
};

const euclideanDistance = (
    track1: Track,
    track2: Track,
    minValues: Track,
    maxValues: Track,
): number => {
    const normalizedTrack1 = normalizeProperties(track1, minValues, maxValues);
    const normalizedTrack2 = normalizeProperties(track2, minValues, maxValues);

    const numericProperties = [
        "popularity",
        "danceability",
        "energy",
        "key",
        "loudness",
        "mode",
        "speechiness",
        "acousticness",
        "instrumentalness",
        "liveness",
        "valence",
        "tempo",
        "time_signature",
    ];

    let sumOfSquaredDifferences = 0;
    for (const prop of numericProperties) {
        const diff = normalizedTrack1[prop] - normalizedTrack2[prop];
        sumOfSquaredDifferences += diff * diff;
    }
    return Math.sqrt(sumOfSquaredDifferences);
};

const parseResponseData = (data: {
    columns: string[];
    index: number[];
    data: (number | string)[][];
}): Track[] => {
    const processedData: Track[] = [];
    data.data.forEach((item) => {
        const tempObject: Track = {
            artist_name: "",
            track_name: "",
            track_id: "",
            popularity: 0,
            genre: "",
            danceability: 0,
            energy: 0,
            key: 0,
            loudness: 0,
            mode: 0,
            speechiness: 0,
            acousticness: 0,
            instrumentalness: 0,
            liveness: 0,
            valence: 0,
            tempo: 0,
            time_signature: 0,
            year: 0,
            cover_src: "",
        };
        for (let i = 0; i < data.columns.length; i++) {
            const columnName = data.columns[i];
            tempObject[columnName as keyof Track] = item[i];
        }
        processedData.push(tempObject);
    });
    return processedData;
};

const calculateMinMaxValues = (tracks: Track[]): { min: Track; max: Track } => {
    const numericProperties = [
        "popularity",
        "danceability",
        "energy",
        "key",
        "loudness",
        "mode",
        "speechiness",
        "acousticness",
        "instrumentalness",
        "liveness",
        "valence",
        "tempo",
        "time_signature",
    ];

    const minValues: Track = {
        artist_name: "",
        track_name: "",
        track_id: "",
        popularity: 0,
        genre: "",
        danceability: 0,
        energy: 0,
        key: 0,
        loudness: 0,
        mode: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0,
        tempo: 0,
        time_signature: 0,
        year: 0,
        cover_src: "",
    };
    const maxValues: Track = {
        artist_name: "",
        track_name: "",
        track_id: "",
        popularity: 0,
        genre: "",
        danceability: 0,
        energy: 0,
        key: 0,
        loudness: 0,
        mode: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0,
        tempo: 0,
        time_signature: 0,
        year: 0,
        cover_src: "",
    };

    for (const prop of numericProperties) {
        const propValues = tracks.map((track) => track[prop]);
        minValues[prop] = Math.min(...propValues);
        maxValues[prop] = Math.max(...propValues);
    }
    return { min: minValues, max: maxValues };
};

const normalizeProperties = (
    track: Track,
    minValues: Track,
    maxValues: Track,
): Track => {
    const numericProperties = [
        "popularity",
        "danceability",
        "energy",
        "key",
        "loudness",
        "mode",
        "speechiness",
        "acousticness",
        "instrumentalness",
        "liveness",
        "valence",
        "tempo",
        "time_signature",
    ];

    const normalizedTrack: Track = { ...track };

    for (const prop of numericProperties) {
        const min = minValues[prop];
        const max = maxValues[prop];
        normalizedTrack[prop] =
            max - min !== 0 ? (track[prop] - min) / (max - min) : 0;
    }
    return normalizedTrack;
};

const processedDataToGraphData = (processedData: Track[]): TrackData => {
    const graphData: TrackData = {
        nodes: [],
        links: [],
    };

    graphData.nodes = processedData.map((item) => {
        return {
            id: item.track_name,
            ...item,
        };
    });
    const { min, max } = calculateMinMaxValues(processedData);
    const links: Link[] = [];
    const euclideanDistanceCalculated: number[][] = new Array(
        processedData.length,
    );

    for (let i = 0; i < processedData.length; i++) {
        euclideanDistanceCalculated[i] = new Array(processedData.length);
        for (let j = 0; j < processedData.length; j++) {
            if (i == j) euclideanDistanceCalculated[i][j] = 0;
            else {
                euclideanDistanceCalculated[i][j] = euclideanDistance(
                    processedData[i],
                    processedData[j],
                    min,
                    max,
                );
            }
        }
    }

    for (let i = 0; i < processedData.length; i++) {
        const valuesAboveIndex = euclideanDistanceCalculated[i].slice(i + 1);
        valuesAboveIndex
            .map((value, index) => ({ value, index: index + i + 1 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 2)
            .map((item) => item.index)
            .forEach((index) => {
                links.push({
                    source: processedData[i].track_name,
                    target: processedData[index].track_name,
                });
            });
    }
    graphData.links = links;

    return graphData;
};

export default async function Page({
    params,
}: {
    params: { song_id: string };
}) {
    const data = await fetch(
        `http://127.0.0.1:5000/id?song=${params.song_id}`,
        { next: { revalidate: 5000 } },
    );

    const jsonData = await data.json();
    const graphData = processedDataToGraphData(parseResponseData(jsonData));
    return (
        <div className="relative">
            <ForceGraph data={graphData}></ForceGraph>
            <div className="absolute z-10 w-[20%] bg-black h-full top-0 left-[80%] flex flex-col gap-4 overflow-y-scroll p-4 overflow-x-clip">
                <p className="py-2 m-auto text-2xl font-bold text-center text-white">
                    Top Songs
                </p>
                {graphData.nodes.map((node, index) => {
                    return (
                        <ForceComponent
                            node={node}
                            key={index}
                        ></ForceComponent>
                    );
                })}
            </div>
        </div>
    );
}
