import wordle from "./wordle";

test("wordle", () => {
    const knownData = {
        greens: ["J", "", "Z", "", "Y"],
        yellows: [[""], [""], [""], [""], [""]],
        greys: []
    }
    expect(wordle(knownData, ["happy", "jazzy"])).toStrictEqual(["jazzy"])
})

test("wordle 2", () => {
    const knownData = {
        greens: ["", "", "", "", "Y"],
        yellows: [["A", "F"], [""], [""], [""], [""]],
        greys: []
    }
    expect(wordle(knownData, ["happy", "jazzy", "taffy"])).toStrictEqual(["taffy"])
})