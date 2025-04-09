import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  setFailed,
  setOutput,
} from "@actions/core";
import {
  FileTokenStore,
  FeiJiPanClient,
  LanZouYClient,
  LanZouYClientOptions,
} from "@netdrive-sdk/ilanzou";
import { paths, unmatchedPatterns } from "./utils";

async function run() {
  const inputFiles = getMultilineInput("files", { required: true });
  const patterns = unmatchedPatterns(inputFiles);
  patterns.forEach((pattern) => {
    console.warn(`🤔 Pattern '${pattern}' does not match any files.`);
  });
  if (!patterns) {
    setFailed("Does not match any files.");
    return;
  }
  const driveType = getInput("drive-type", { required: true });
  if (!["feijipan", "ilanzou"].includes(driveType)) {
    setFailed("Does not match any driveType.");
    return;
  }
  const username = getInput("username", { required: true });
  const password = getInput("password", { required: true });
  const destPath = getInput("dest-path", { required: false });
  const debug = getBooleanInput("debug", { required: false });
  const options: LanZouYClientOptions = {
    username,
    password,
    tokenStore: new FileTokenStore(`.token/${driveType}/${username}.token`),
    logConfig: {
      isDebugEnabled: debug,
      fileOutput: !!process.env.FILE_OUTPUT,
    },
  };
  const client =
    driveType === "feijipan"
      ? new FeiJiPanClient(options)
      : new LanZouYClient(options);
  const files = paths(inputFiles);
  const folderId = await client.ensureFolderPath(destPath);
  const uploadFile = (path: string) => {
    return client.uploadFile(path, folderId);
  };
  const assets = await Promise.all(files.map(uploadFile));
  setOutput("assets", assets);
}

run();
