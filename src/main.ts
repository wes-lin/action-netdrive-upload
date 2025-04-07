import { env } from "process";
import { getInput} from "@actions/core";
import { FileTokenStore, LanZouYClient } from '@netdrive-sdk/ilanzou'
import * as fs from 'node:fs'
import * as crypto from 'crypto'
import path from 'node:path'

async function run() {
  console.log('Available INPUT env vars:');
  Object.keys(env)
    .filter(k => k.startsWith('INPUT_'))
    .forEach(k => console.log(`${k}=${process.env[k]}`));
  // const files = getInput('files', { required: true })
  const driveType = getInput('driveType ', { required: true })
  // const username = getInput('user-name', { required: true });
  // const passowrd = getInput('password', { required: true });
  // const folderId = getInput('folde-id');
}

run();