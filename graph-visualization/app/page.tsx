import SearchQuery from "@/components/SearchQuery";

export default function Page() {
    return (
        <main className="flex flex-col w-full text-white align-middle bg-slate-900 justify-evenly">
            <div className="absolute mb-4 text-6xl font-bold top-[20%] text-center w-full">
                <h1>Visualize Your Music</h1>
            </div>
            <div className="flex flex-col gap-2 m-auto text-center">
                <h2 className="px-20 text-2xl text-slate-200">
                    Enter a Song to Begin:
                </h2>
                <SearchQuery></SearchQuery>
            </div>
            <div className="h-[30%]"></div>
        </main>
    );
}
