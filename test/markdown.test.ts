import { updateFile, isChanged } from "../src/markdown";

const newLines = [
  "<!-- newline start -->",
  "newline 1",
  "newline 2",
  "newline 3",
  "<!-- newline end -->",
];
const startFlag = "<!-- notification start -->";
const endFlag = "<!-- notification end -->";

describe("insertLines", () => {
  test("both start and end", () => {
    const lines = [
      "line 1",
      "line 2",
      "<!-- notification start -->",
      "<!-- notification end -->",
      "line 3",
    ];
    const want = [
      "line 1",
      "line 2",
      "<!-- newline start -->",
      "newline 1",
      "newline 2",
      "newline 3",
      "<!-- newline end -->",
      "line 3",
    ];
    const got = updateFile(lines, newLines, startFlag, endFlag);
    expect(got).toStrictEqual(want);
  });

  test("both start and end, has previous feeds", () => {
    const lines = [
      "line 1",
      "line 2",
      "<!-- notification start -->",
      "feed 1",
      "feed 2",
      "feed 3",
      "<!-- notification end -->",
      "line 3",
    ];
    const want = [
      "line 1",
      "line 2",
      "<!-- newline start -->",
      "newline 1",
      "newline 2",
      "newline 3",
      "<!-- newline end -->",
      "line 3",
    ];
    const got = updateFile(lines, newLines, startFlag, endFlag);
    expect(got).toStrictEqual(want);
  });

  test("only start", () => {
    const lines = ["line 1", "line 2", "<!-- notification start -->", "line 3"];
    const want = [
      "line 1",
      "line 2",
      "<!-- newline start -->",
      "newline 1",
      "newline 2",
      "newline 3",
      "<!-- newline end -->",
      "line 3",
    ];
    const got = updateFile(lines, newLines, startFlag, endFlag);
    expect(got).toStrictEqual(want);
  });

  test("only end", () => {
    const lines = ["line 1", "line 2", "<!-- notification end -->", "line 3"];
    const want = [
      "line 1",
      "line 2",
      "<!-- newline start -->",
      "newline 1",
      "newline 2",
      "newline 3",
      "<!-- newline end -->",
      "line 3",
    ];
    const got = updateFile(lines, newLines, startFlag, endFlag);
    expect(got).toStrictEqual(want);
  });

  test("neither start nor end", () => {
    const lines = ["line 1", "line 2", "line 3"];
    const want = [
      "line 1",
      "line 2",
      "line 3",
      "<!-- newline start -->",
      "newline 1",
      "newline 2",
      "newline 3",
      "<!-- newline end -->",
    ];
    const got = updateFile(lines, newLines, startFlag, endFlag);
    expect(got).toStrictEqual(want);
  });

  test("start and end are reversed", () => {
    const lines = [
      "line 1",
      "line 2",
      "<!-- notification end -->",
      "<!-- notification start -->",
      "line 3",
    ];
    const want = [
      "line 1",
      "line 2",
      "<!-- notification end -->",
      "<!-- newline start -->",
      "newline 1",
      "newline 2",
      "newline 3",
      "<!-- newline end -->",
      "line 3",
    ];
    const got = updateFile(lines, newLines, startFlag, endFlag);
    expect(got).toStrictEqual(want);
  });
});

describe("isChanged", () => {
  test("default", () => {
    const orig = ["line 1", "line 2", "line 3"];
    const curr = ["line 1", "line 2", "line 3"];
    const got = isChanged(orig, curr);
    expect(got).toBe(false);
  });

  test("different length", () => {
    const orig = ["line 1", "line 2", "line 3"];
    const curr = ["line 1", "line 2"];
    const got = isChanged(orig, curr);
    expect(got).toBe(true);
  });

  test("different content", () => {
    const orig = ["line 1", "line 2", "line 3"];
    const curr = ["line 1", "line 2 ", "line 3"];
    const got = isChanged(orig, curr);
    expect(got).toBe(true);
  });

  test("has empty line", () => {
    const orig = ["", "line 1", "line 2", "line 3", "", ""];
    const curr = ["", "line 1", "line 2", "line 3", "", ""];
    const got = isChanged(orig, curr);
    expect(got).toBe(false);
  });
});
