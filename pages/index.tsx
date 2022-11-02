import type { NextPage } from "next";
import { useEffect, useState } from "react";
import wordle from "../utils/wordle";

const LETTERS_IN_WORD = 5;

type Letter = {
  value: string;
  autoFocus?: boolean;
};

const defaultLetter = {
  value: "",
};

const initArray = (len: number, val: any) => [...Array(len)].map((_) => val);

const Home: NextPage = () => {
  const [greens, setGreens] = useState<Letter[]>(
    initArray(LETTERS_IN_WORD, defaultLetter)
  );
  const [yellows, setYellows] = useState<Letter[][]>(
    initArray(LETTERS_IN_WORD, [defaultLetter])
  );
  const [grey, setGreys] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<string>();

  function focusEl(el: HTMLElement | null) {
    el && el.focus();
  }

  // this is lame, but whenever the yellows change, make sure there is an empty string in each slot
  // the logic for doing this on every yellow input change was harder to keep track of
  useEffect(() => {
    yellows.forEach((slot, i) => {
      const isSlotFull = slot.length === LETTERS_IN_WORD - 1;
      const hasEmpty = slot[slot.length - 1].value === "";
      if (!isSlotFull && !hasEmpty) {
        const lastLetterIndex = slot.length - 1;
        const shouldGetFocus =
          document.getElementById(`yellow-${i}-${lastLetterIndex}`) ===
          document.activeElement;
        const emptyLetter = { value: "", autoFocus: shouldGetFocus };
        const updatedSlot = [...slot, emptyLetter];
        setYellows([
          ...yellows.slice(0, i),
          updatedSlot,
          ...yellows.slice(i + 1),
        ]);
      }
    });
  }, [yellows]);

  // remove animation so it can run again when added the next time, also lame.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (invalid) {
      timeout = setTimeout(() => {
        setInvalid(undefined);
      }, 300); // animation duration
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [invalid]);

  return (
    <div className="flex flex-col justify-center">
      <h1 className="mb-8 text-center text-4xl">Wordler 🤓📚</h1>
      <div className="my-0 mx-auto">
        <div>Greens</div>
        <div className="flex">
          <div className="flex gap-1">
            {greens.map((letter, i) => (
              <input
                key={i}
                className={`h-10 w-10 rounded text-center ${
                  invalid === `green-${i}` ? "animate-shake" : ""
                } ${letter.value ? "bg-green-300" : "bg-green-200"}`}
                value={letter.value}
                onKeyDown={(e: any) => {
                  if (e.key === "Backspace") {
                    setGreens([
                      ...greens.slice(0, i),
                      defaultLetter,
                      ...greens.slice(i + 1),
                    ]);
                  }
                  if (e.key === "Backspace" || e.key === "ArrowLeft") {
                    focusEl(e.target.previousElementSibling);
                  }
                  if (
                    e.key === "Enter" ||
                    e.key === "ArrowRight" ||
                    e.key === " "
                  ) {
                    focusEl(e.target.nextElementSibling);
                  }
                }}
                onChange={(e: any) => {
                  const input = e.target.value.trim();
                  if (input && !/^[a-zA-Z]+$/.test(input)) {
                    setInvalid(`green-${i}`);
                    return;
                  }
                  const text = input.replace(/[^A-Za-z]/gi, "");
                  const letter = text && text[text.length - 1].toUpperCase();
                  const alreadyExists =
                    letter && greens.some((g) => g.value === letter);
                  if (letter && !alreadyExists) {
                    const updatedLetter = { value: letter };
                    setGreens([
                      ...greens.slice(0, i),
                      updatedLetter,
                      ...greens.slice(i + 1),
                    ]);
                    focusEl(e.target.nextElementSibling);
                  } else if (input) {
                    setInvalid(`green-${i}`);
                  }
                }}
              />
            ))}
          </div>
          <button
            className="m-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 outline-offset-2"
            onClick={() => {
              setGreens(initArray(LETTERS_IN_WORD, defaultLetter));
            }}
          >
            -
          </button>
        </div>
        <div>Yellows</div>
        <div className="flex">
          <div className="flex gap-1">
            {yellows.map((slot, i) => (
              <div key={i} id={`yellow-${i}`} className="flex flex-col gap-1">
                {slot.map((letter, j) => {
                  const id = `yellow-${i}-${j}`;
                  const maxLetters = LETTERS_IN_WORD - 1; // if you have all letter you won 😁
                  const isLastLetterInSlot = j + 1 === maxLetters;
                  const isSlotFull = j + 1 > maxLetters;
                  if (isSlotFull) return null;
                  return (
                    <input
                      key={id}
                      id={id}
                      autoFocus={letter.autoFocus}
                      className={`h-10 w-10 rounded text-center ${
                        invalid === id ? "animate-shake" : ""
                      } ${letter.value ? "bg-yellow-300" : "bg-yellow-200"}`}
                      value={letter.value}
                      onKeyDown={(e: any) => {
                        if (e.key === "Backspace" && letter.value) {
                          let updatedSlot;
                          if (j === 0) {
                            //first
                            updatedSlot =
                              slot.length === 1
                                ? [defaultLetter]
                                : slot.slice(1);
                          } else if (isLastLetterInSlot) {
                            // last
                            updatedSlot = [...slot.slice(0, j), defaultLetter];
                          } else {
                            updatedSlot = [
                              ...slot.slice(0, j),
                              ...slot.slice(j + 1),
                            ];
                          }
                          setYellows([
                            ...yellows.slice(0, i),
                            updatedSlot,
                            ...yellows.slice(i + 1),
                          ]);
                        }
                        /*
													what are all the things an input can do?
													focus next letter, focus next slot, focus previous slot
													maybe make an object/component with those abilities
												*/
                        // focus handling
                        if (e.key === "Backspace") {
                          if (j > 0) {
                            focusEl(e.target.previousElementSibling);
                          } else if (i > 0) {
                            // focus last slot for previous slot
                            focusEl(
                              document.getElementById(
                                `yellow-${i - 1}-${yellows[i - 1].length - 1}`
                              )
                            );
                          }
                        }
                        if (e.key === "Enter" || e.key == " ") {
                          if (e.target.value) {
                            focusEl(e.target.nextElementSibling);
                          } else {
                            focusEl(
                              document.getElementById(`yellow-${i + 1}-0`)
                            );
                          }
                        }
                        if (e.key === "ArrowLeft") {
                          // TODO
                        }
                        if (e.key === "ArrowRight") {
                          // TODO
                        }
                      }}
                      onChange={(e: any) => {
                        console.log(e);
                        const input = e.target.value.trim();
                        if (input && !/^[a-zA-Z]+$/.test(input)) {
                          setInvalid(`yellow-${i}-${j}`);
                          return;
                        }
                        const text = input.replace(/[^A-Za-z]/gi, "");
                        const letter =
                          text && text.charAt(text.length - 1).toUpperCase();
                        if (!letter) return;
                        const alreadyExists =
                          letter && slot.some((l) => l.value === letter);
                        if (alreadyExists) {
                          setInvalid(`yellow-${i}-${j}`);
                          return;
                        }
                        if (!alreadyExists) {
                          let updatedLetter = { value: letter };
                          let updatedSlot = [
                            ...slot.slice(0, j),
                            updatedLetter,
                            ...slot.slice(j + 1),
                          ];
                          setYellows([
                            ...yellows.slice(0, i),
                            updatedSlot,
                            ...yellows.slice(i + 1),
                          ]);
                          // focus next input in slot if possible (not possible for last letter in slot)
                          // auto focus attribute handles focus when the additional inputs mount
                          focusEl(
                            document.getElementById(`yellow-${i}-${j + 1}`)
                          );
                          if (isLastLetterInSlot) {
                            focusEl(
                              document.getElementById(`yellow-${i + 1}-0`)
                            );
                          }
                        }
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <button
            className="m-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 outline-offset-2"
            onClick={() => {
              setYellows(initArray(LETTERS_IN_WORD, [defaultLetter]));
            }}
          >
            -
          </button>
        </div>
        <div>Greys</div>
        <div className="flex">
          <input
            className={`h-10 w-[13.5rem] rounded text-center ${
              invalid === "grey" ? "animate-shake" : ""
            } ${grey ? "bg-gray-200" : "bg-gray-100"}`}
            value={grey}
            onChange={(e) => {
              const input = e.target.value;
              if (input && !/^[a-zA-Z]+$/.test(input)) {
                setInvalid("grey");
                return;
              }
              setGreys(input.replace(/[^A-Za-z]/gi, "").toUpperCase());
            }}
          />
          <button
            className="m-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 outline-offset-2"
            onClick={() => {
              setGreys("");
            }}
          >
            -
          </button>
        </div>
        <div>
          <button
            className="my-2 w-[13.5rem] rounded-full bg-blue-600 py-2 text-white"
            onClick={async () => {
              const knownData = {
                greens: greens.map((g) => g.value),
                yellows: yellows.map((y) => y.map((l) => l.value)),
                greys: grey.split(""),
              };
              const words = wordle(knownData);
              setResults(words);
            }}
          >
            Find Matches
          </button>
        </div>
      </div>
      <div className="font-mono">
        {results.length > 0 && (
          <div className="m-2 text-center">{`Matching words: ${results.length}`}</div>
        )}
        <div>
          {results.slice(0, 20).map((result, i) => (
            <span
              key={`result-${i}`}
              className="m-2 inline-block rounded border-2 border-blue-600 p-2"
            >
              {result}
            </span>
          ))}
          {results.length > 20 && (
            <button
              key="moreResults"
              className="m-2 inline-block rounded border-2 border-white bg-blue-600 p-2 text-white"
            >
              more...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
