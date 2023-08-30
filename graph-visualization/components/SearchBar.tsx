/** SearchBar.tsx
 *  Hosts Autosuggest search bar.
 */
"use client";

import { ShortTrack } from "./types";
import Autosuggest from "react-autosuggest";
import { useState } from "react";
import theme from "./theme.module.css";
import Image from "next/image";
import Link from "next/link";

const renderSuggestion = (suggestion: ShortTrack) => {
    return (
        <div className="relative flex gap-4 p-4 border-b-2 border-slate-400 bg-slate-700 hover:bg-slate-800 border-x-2">
            <div className="w-16 h-16 my-auto">
                <Image
                    src={suggestion.cover_src}
                    alt={suggestion.track_name}
                    width="64"
                    height="64"
                    className="w-16 h-16 m-auto"
                ></Image>
            </div>
            <div className="flex-grow">
                <h1 className="text-lg font-bold text-left text-white">
                    {suggestion.track_name}
                </h1>
                <div className="flex justify-between w-full text-sm text-slate-300">
                    <div className="flex gap-2">
                        <p className="text-sm">{suggestion.artist_name}</p>
                        <p>-</p>
                        <p className="">{suggestion.year}</p>
                    </div>
                    <p className="font-bold text-purple-300">
                        {suggestion.genre}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function SearchBar({ SongList }: { SongList: ShortTrack[] }) {
    const [value, setValue] = useState("");
    const [selectedTrack, setSelectedTrack] = useState("");
    const [suggestions, setSuggestions] = useState<ShortTrack[]>([]);

    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : SongList.filter(
                  (song: ShortTrack) =>
                      song.track_name.toLowerCase().slice(0, inputLength) ===
                      inputValue,
              ).slice(0, 5);
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    const getSuggestionValue = (suggestion: ShortTrack) => {
        setSelectedTrack(suggestion.track_id);
        return suggestion.track_name;
    };

    const onSuggestionsFetchRequested = ({ value }: any) => {
        setSuggestions(getSuggestions(value));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onChange = (
        event: React.FormEvent<HTMLElement>,
        { newValue }: any,
    ) => {
        setValue(newValue);
    };

    const inputProps = {
        placeholder: "Enter Track",
        value,
        onChange: onChange,
    };

    return (
        <>
            <div className="flex gap-2 text-black">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    theme={theme}
                />
                <Link
                    className="px-2 py-1 font-bold duration-300 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-900"
                    href={selectedTrack ? `/songs/${selectedTrack}` : ""}
                >
                    Search
                </Link>
            </div>
        </>
    );
}
