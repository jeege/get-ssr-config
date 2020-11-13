const path = require("path");
const os = require("os");

const defaultSavePath = path.resolve(
    os.homedir(),
    "ssr-config"
);

const defaultSource = "https://github.com/Alvin9999/new-pac/wiki/ss%E5%85%8D%E8%B4%B9%E8%B4%A6%E5%8F%B7"

module.exports = {
    defaultSavePath,
    defaultSource
}