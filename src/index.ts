import * as core from "@actions/core";
import { getLines, writeLines, updateFile, isChanged, write } from "./markdown";

async function run() {
  const sort = core.getInput("sort").toLowerCase() === "true";
  const maxEntry = parseInt(core.getInput("max_entry"), 10) || 1;
  if (maxEntry < 0) {
    core.setFailed("Cannot set `maxEntry` to lower than 0");
    return;
  }

  const startFlag =
    core.getInput("start_flag") || "<!-- notification start -->";
  const endFlag = core.getInput("end_flag") || "<!-- notification end -->";

  const nowrite = core.getInput("nowrite").toLowerCase() === "true";

  const retry = parseInt(core.getInput("retry"), 10) || 3;

  if (retry < 0) {
    core.setFailed("Cannot set `retry` to lower than 0");
    return;
  }

  const path = core.getInput("path") || "";
  const paths: string[] = path.split("\n").filter((x) => x || false);
  paths.forEach((p) => core.setSecret(p));

  if (!paths.length) {
    core.setFailed("path is missing");
    return;
  }

  const file = core.getInput("file");

  if (!file) {
    if (!nowrite) {
      core.warning("File is missing, but nowrite is set. Continueing... ");
    } else {
      core.setFailed("File is missing");
      return;
    }
  }

  // ger current markdown, parse it
  let lines: string[] = [];
  if (file) {
    try {
      lines = await getLines(file);
    } catch (e: any) {
      core.setFailed(`failed to read file: ${e.message}`);
      return;
    }
  }
  const allItems: [] = [];

  const items = allItems.slice(0, maxEntry);

  const newLines = items;
  const joinedNewLines = newLines.join("\n");

  core.startGroup("Dump feeds block");
  core.info(joinedNewLines);
  core.endGroup();

  const result = updateFile(lines, newLines, startFlag, endFlag);
  const joinedResult = result.join("\n");
  core.startGroup("Dump result document");
  core.info(joinedResult);
  core.endGroup();

  // write result to file if nowrite is not set
  if (!nowrite) {
    try {
      await write(file, joinedResult);
    } catch (e: any) {
      core.setFailed(`failed to write file: ${e.message}`);
      return;
    }
  }

  core.info("Generating outputs...");
  core.setOutput("items", items);
  core.setOutput("newlines", joinedNewLines);
  core.setOutput("result", joinedResult);
  core.setOutput("changed", isChanged(lines, result) ? "1" : "0");
  core.info("Done!");
}

run();
