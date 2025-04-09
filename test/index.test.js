const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const generateRandomFile = () => {
  const size = 1024 * 1024; // 1MB
  const randomData = crypto.randomBytes(size); // 生成随机数据
  const filePath = `.cache/${crypto.randomUUID()}.bin`;
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  // 将随机数据写入文件
  const stream = fs.createWriteStream(filePath);
  stream.write(randomData);
  stream.end();
  return filePath;
};

generateRandomFile();
