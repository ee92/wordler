import type { NextPage } from 'next'
import { useState } from 'react'
import wordle from "../utils/wordle";

const LETTERS_IN_WORD = 5;

const initArray = (len: number, val: any) => [...Array(len)].map(_ => val);

const Home: NextPage = () => {
  const [greens, setGreens] = useState<string[]>(initArray(LETTERS_IN_WORD, ""));
  const [yellows, setYellows] = useState<string[][]>(initArray(LETTERS_IN_WORD, [""]));
  const [grey, setGreys] = useState("");
  const [results, setResults] = useState<string[]>([]);

  function isAlphaKey(key: string) {
    return /^[a-zA-Z]$/.test(key)
  }

  return (
    <div>
      <div>Greens</div>
      <div className="flex gap-1">
        {greens.map((cell, i) => (
          <input
            key={i}
            className={`w-10 h-10 rounded  text-center ${cell ? "bg-green-300" : "bg-green-200"}`}
            value={cell}
            onKeyDown={(e) => {
              // TODO: handle delete
              if (isAlphaKey(e.key)) {
                setGreens([...greens.slice(0, i), e.key.toUpperCase(), ...greens.slice(i + 1)])
              }
            }}
          />
        ))}
      </div>
      <div>Yellows</div>
      <div className="flex gap-1">
        {yellows.map((cell, i) => (
          <div className="flex flex-col gap-1">
            {cell.map((letter, j) => {
              if (j + 1 > LETTERS_IN_WORD) return null;
              return (
                <input
                  key={j}
                  className={`w-10 h-10 rounded text-center ${letter ? "bg-yellow-300" : "bg-yellow-200"}`}
                  value={letter}
                  onKeyDown={(e) => {
                    // TODO: handle delete / tab / enter
                    if (isAlphaKey(e.key)) {
                      const updatedCell = [
                        ...cell.slice(0, j),
                        e.key.toUpperCase(),
                        ""
                      ]
                      setYellows([
                        ...yellows.slice(0, i),
                        updatedCell,
                        ...yellows.slice(i + 1)
                      ])
                    }
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div>Greys</div>
      <div className="flex gap-1">
        <input
          className={`w-[13.5rem] h-10 rounded text-center ${grey ? "bg-gray-200" : "bg-gray-100"}`}
          value={grey}
          onChange={(e) => {
            setGreys(e.target.value.replace(/[^A-Za-z]/ig, '').toUpperCase());
          }}
        />
      </div>
      <div>
        <button
          className="rounded-full bg-blue-600 text-white my-2 py-2 w-[13.5rem]"
          onClick={async () => {
            const knownData = { greens, yellows, greys: grey.split("") }
            console.log(knownData)
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
