import wordle from "./wordle";

test("wordle greens", () => {
    const knownData = {
        greens: ["J", "", "Z", "", "Y"],
        yellows: [[""], [""], [""], [""], [""]],
        greys: []
    }
    expect(wordle(knownData, ["happy", "jazzy"])).toStrictEqual(["jazzy"])
})

test("wordle yellows", () => {
    const knownData = {
        greens: ["", "", "", "", "Y"],
        yellows: [["A", "F"], [""], [""], [""], [""]],
        greys: []
    }
    expect(wordle(knownData, ["happy", "jazzy", "taffy"])).toStrictEqual(["taffy"])
})