import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  setFailed,
  setOutput,
} from "@actions/core";
import {
  FeiJiPanClient,
  LanZouYClient,
  LanZouYClientOptions,
  logger,
} from "@netdrive-sdk/ilanzou";
import { paths, unmatchedPatterns } from "./utils";
import path from "path";

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
  const uuid = getInput("uuid", { required: false });
  const debug = getBooleanInput("debug", { required: false });
  const options: LanZouYClientOptions = {
    username,
    password,
    uuid,
  };
  logger.configure({
    isDebugEnabled: debug,
    fileOutput: !!process.env.FILE_OUTPUT,
  });
  const client =
    driveType === "feijipan"
      ? new FeiJiPanClient(options)
      : new LanZouYClient(options);
  const files = paths(inputFiles);
  const folderId = await client.ensureFolderPath(destPath);

  const uploadFile = async (filePath: string) => {
    try {
      const fileName = path.basename(filePath);
      const fileList = await client.getFileList({
        folderId,
        type: 1,
        limit: 100,
      });

      const existsFiles = fileList.list?.filter(
        (file) => file.fileName === fileName
      );

      if (existsFiles && existsFiles.length > 0) {
        console.log(`♻️ Deleting previously uploaded ${fileName}...`);
        await client.deleteFile({
          fileIds: existsFiles.map((file) => file.fileId),
        });
      }
      console.log(`⬆️ Uploading ${filePath}...`);
      const res = await client.uploadFile(filePath, folderId);
      console.log(`✅ Uploaded ${filePath}`);
      return {
        path: filePath,
        id: res,
      };
    } catch (e) {
      console.log(`❌ Failed to upload ${filePath}. \n${JSON.stringify(e)}`);
      return {
        path: filePath,
      };
    }
  };
  const assets = await Promise.all(files.map(uploadFile));
  setOutput("assets", assets);
}

run();
