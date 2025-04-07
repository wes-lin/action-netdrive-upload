import { env } from "process";
import { getInput } from "@actions/core";
import { FileTokenStore, LanZouYClient } from "@netdrive-sdk/ilanzou";
import * as fs from "node:fs";
import * as crypto from "crypto";
import path from "node:path";

async function run() {
  const files = getInput("files", { required: true });
  const driveType = getInput("drive-type", { required: true });
  const username = getInput("username", { required: true });
  const password = getInput("password", { required: true });
  const client = new LanZouYClient({
    username,
    password,
  });
  const res = await client.ensureFolderPath("店群助手/1.0.0");
  console.log(res);
  const res1 = await client.ensureFolderPath("店群助手/1.0.1");
  console.log(res1);
  const res2 = await client.ensureFolderPath("店群助手/1.0.3/xxx");
  console.log(res2);
  // const folderId = getInput('folde-id');
}

run();
