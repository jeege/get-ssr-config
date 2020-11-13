#!/usr/bin/env node

const { program } = require("commander")
const version = require("../package.json").version
const download = require("../lib/download.js")

program
    .version(version)
    .description("输入查询可用服务器的地址")
    .arguments("[url]")
    .action(download)
    .option("-p, --path <save-path>", "设置保存的路径")
    .parse(process.argv);

program