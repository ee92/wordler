import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import wordle from "../utils/wordle";

const LETTERS_IN_WORD = 5;

const initArray = (len: number, val: any) => [...Array(len)].map(_ => val);

const Home: NextPage = () => {
	const [greens, setGreens] = useState<string[]>(initArray(LETTERS_IN_WORD, ""));
	const [yellows, setYellows] = useState<string[][]>(initArray(LETTERS_IN_WORD, [""]));
	const [grey, setGreys] = useState("");
	const [results, setResults] = useState<string[]>([]);
	const [focusEl, setFocusEl] = useState<HTMLInputElement>();

	// force focus after new input box has rendered
	useEffect(() => {
		const next = (focusEl?.value ? focusEl?.nextElementSibling : focusEl?.previousElementSibling) as HTMLElement;
		next && next.focus();
	}, [focusEl])

	return (
		<div>
			<div>Greens</div>
			<div className="flex">
				<div className="flex gap-1">
					{greens.map((cell, i) => (
						<input
							key={i}
							className={`w-10 h-10 rounded text-center ${cell ? "bg-green-300" : "bg-green-200"}`}
							value={cell}
							onKeyDown={(e: any) => {
								if (e.key === "Backspace") {
									setGreens([...greens.slice(0, i), "", ...greens.slice(i + 1)]);
									setFocusEl(e.target);
								}
							}}
							onChange={(e: any) => {
								const input = e.target.value.replace(/[^A-Za-z]/ig, '');
								const updatedCell = input.charAt(input.length - 1).toUpperCase();
								if (input) {
									setGreens([...greens.slice(0, i), updatedCell, ...greens.slice(i + 1)]);
									setFocusEl(e.target);
								}
							}}
						/>
					))}
				</div>
				<button
					className='w-6 h-6 m-2 rounded-full border-2 border-blue-600 text-blue-600 flex justify-center items-center'
					onClick={() => {
						setGreens(initArray(LETTERS_IN_WORD, ""));
					}}
				>
					-
				</button>
			</div>
			<div>Yellows</div>
			<div className="flex">
				<div className="flex gap-1">
					{yellows.map((cell, i) => (
						<div key={i} className="flex flex-col gap-1">
							{cell.map((letter, j) => {
								const isCellFull = j + 1 > LETTERS_IN_WORD
								if (isCellFull) return null;
								return (
									<input
										key={j}
										id={`yellow-${i}-${j}`}
										className={`w-10 h-10 rounded text-center ${letter ? "bg-yellow-300" : "bg-yellow-200"}`}
										value={letter}
										onKeyDown={(e: any) => {
											console.log("on keydown", e)
											if (e.key === "Backspace") {
												const updatedCell = [...cell.slice(0, j), ""];
												setYellows([...yellows.slice(0, i), updatedCell, ...yellows.slice(i + 1)]);
												setFocusEl(e.target);
											}
										}}
										onChange={(e: any) => {
											console.log("on change", e)
											const input = e.target.value.replace(/[^A-Za-z]/ig, '');
											const letter = input && input.charAt(input.length - 1).toUpperCase();
											if (letter && !cell.includes(letter)) {
												const updatedCell = [...cell.slice(0, j), letter, ""];
												setYellows([...yellows.slice(0, i), updatedCell, ...yellows.slice(i + 1)]);
												setFocusEl(e.target);
											}
										}}
									/>
								)
							})}
						</div>
					))}
				</div>
				<button
					className='w-6 h-6 m-2 rounded-full border-2 border-blue-600 text-blue-600 flex justify-center items-center'
					onClick={() => {
						setYellows(initArray(LETTERS_IN_WORD, [""]));
					}}
				>
					-
				</button>
			</div>
			<div>Greys</div>
			<div className="flex">
				<input
					className={`w-[13.5rem] h-10 rounded text-center ${grey ? "bg-gray-200" : "bg-gray-100"}`}
					value={grey}
					onChange={(e) => setGreys(e.target.value.replace(/[^A-Za-z]/ig, '').toUpperCase())}
				/>
				<button
					className='w-6 h-6 m-2 rounded-full border-2 border-blue-600 text-blue-600 flex justify-center items-center'
					onClick={() => {
						setGreys("");
					}}
				>
					-
				</button>
			</div>
			<div>
				<button
					className="rounded-full bg-blue-600 text-white my-2 py-2 w-[13.5rem]"
					onClick={async () => {
						const knownData = { greens, yellows, greys: grey.split("") }
						const words = wordle(knownData)
						setResults(words);
					}}
				>
					Find Matches
				</button>
			</div>
			{results.length > 0 && `Matching words: ${results.length}`}
			{results.map((result, i) => (
				<div key={i}>
					{result}
				</div>
			))}
		</div>
	)
}

export default Home
