/** SearchQuery.tsx
 *  Fetches song list from /public/data/tracks.json, then loads SearchBar.tsx
 */
import { ShortTrack } from "./types";
import SearchBar from "./SearchBar";

export default async function SearchQuery() {
    const res = await fetch(
        "http://localhost:3000/data/tracks_modified_2.json",
    );
    const tracks: ShortTrack[] = await res.json();
    return <SearchBar SongList={tracks}></SearchBar>;
}
