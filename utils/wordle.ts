const words = require('../words');

interface KnownData { greens: string[], yellows: string[][], greys: string[] }

export default function wordle(data: KnownData, dictionary = words): string[] {
    const { greens, yellows, greys } = data;

    const result = dictionary.filter((word: string) => {
        word = word.toUpperCase();

        let validateGreens = true;
        for (let i = 0; i < greens.length; i++) {
            if (greens[i] && greens[i] !== word[i]) {
                validateGreens = false;
                break;
            }
        }

        let validateYellows = true;
        for (let i = 0; i < yellows.length; i++) {
            for (let j = 0; j < yellows[i].length; j++) {
                const letter = yellows[i][j];
                const letterMissing = letter && !word.includes(letter);
                const letterInWrongSlot = letter && word.indexOf(letter) === i;
                if (letterMissing || letterInWrongSlot) {
                    validateYellows = false;
                    break;
                }
            }
        }

        const validateGreys = greys.every(letter => {
            return !word.includes(letter);
        });

        return validateGreens && validateYellows && validateGreys;
    })

    return result
}