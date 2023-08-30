type NodeObject$1<NodeType = {}> = NodeType & {
    id?: string | number;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number;
    fy?: number;
    fz?: number;
    [others: string]: any;
};

type LinkObject$1<NodeType = {}, LinkType = {}> = LinkType & {
    source?: string | number | NodeObject$1<NodeType>;
    target?: string | number | NodeObject$1<NodeType>;
    [others: string]: any;
};

export type ShortTrack = {
    artist_name: string;
    track_name: string;
    track_id: string;
    year: number;
    genre: string;
    cover_src: string;
};

export type TrackData = {
    nodes: NodeObject$1[];
    links: LinkObject$1[];
};

export type Track = {
    artist_name: string;
    track_name: string;
    track_id: string;
    popularity: number;
    genre: string;
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    time_signature: number;
    year: number;
    cover_src: string;
    [others: string]: any;
};
