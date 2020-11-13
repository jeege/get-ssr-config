const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { program } = require("commander");
const chalk = require("chalk");
const cheerio = require("cheerio");
const { spawn } = require("child_process");
const { isUrl, formatTime, random } = require("./utils.js");
const cfg = require("./config.js");
const request = require("./request");

const savePath = program.path || cfg.defaultSavePath;

const getSourceUrl = (sourceUrl) => {
    return !isUrl(sourceUrl) ? cfg.defaultSource : sourceUrl;
};

const getShadowsocksConfig = (str) => {
    const ssLink = [];
    const ssConfig = { configs: [] };
    const cfgReg = /(ssr?:\/\/[^ \f\n\r\t\v<]+)/g;
    const $ = cheerio.load(str);
    let res;
    while ((res = cfgReg.exec(str))) {
        ssLink.push(res[0]);
    }
    if ($("tbody tr").length) {
        $("tbody tr").each((i, el) => {
            const textArr = $(el).text().slice(1, -1);
            if (textArr) {
                const item = textArr.split("\n");
                ssConfig.configs.push({
                    enable: true,
                    remarks: item[0],
                    server: item[1],
                    server_port: +item[2],
                    password: item[3],
                    method: item[4],
                    protocol: item[5],
                    obfs: item[6],
                    group: formatTime(Date.now(), "YYYY-MM-DD"),
                });
            }
        });
    }
    if (!fs.existsSync(savePath)) {
        mkdirp.sync(savePath);
    }
    const fileName = path.resolve(
        savePath,
        `ssconfig_${formatTime(Date.now(), "YYYYMMDD")}_${random(4)}.json`
    );
    fs.writeFileSync(fileName, JSON.stringify(ssConfig));
    return {
        ssLink,
        fileName,
    };
};

const setupConfig = (cfgs) => {
    console.log(`${chalk.greenBright("检测到可用的ssr/ss链接，尝试导入客户端")}`);
    const openCommand = spawn("open", [cfgs.join(";")]);
    openCommand.stdout.on("data", (data) => {
        console.log(`${data}`);
    });
    openCommand.stderr.on("data", () => {
        console.log("导入失败");
    });
    openCommand.on("close", () => {
        console.log(`已结束`);
    });
};

const download = async (sourceUrl) => {
    const url = getSourceUrl(sourceUrl);
    const res = await request(url, {
        defaultHandle: false,
    }).catch((err) => {
        console.log(err);
    });
    const { ssLink, fileName } = getShadowsocksConfig(res);
    console.log(
        `\n已导出配置文件\n\n${chalk.yellow.underline(fileName)}\n\n可以在SSR/SS客户端中批量导入服务器配置\n`
    );
    if (ssLink.length) {
        // setupConfig(ssLink);
        console.log("也可以通过复制以下shadowsocks链接在客户端中快速导入\n");
        ssLink.forEach((item, index) => {
            console.log(`${chalk.bold(index + 1)}：${chalk.greenBright.underline(item)}\n`);
        });
    }
    console.log(
        `如果没有下载客户端，可以通过以下链接下载\n\nMac SSR客户端\n${chalk.yellow.underline(
            "https://github.com/paradiseduo/ShadowsocksX-NG-R8/releases"
        )}\n\nWindows SSR客户端\n${chalk.yellow.underline(
            "https://github.com/shadowsocksr-backup/shadowsocksr-csharp/releases"
        )}\n\nWindows SS客户端\n${chalk.yellow.underline(
            "https://github.com/shadowsocks/shadowsocks-windows/releases"
        )}\n\nAndroid SSR客户端\n${chalk.yellow.underline(
            "https://github.com/shadowsocksr-backup/shadowsocksr-android/releases"
        )}\n\n其他相关下载\n${chalk.yellow.underline(
            "https://www.mediafire.com/folder/sfqz8bmodqdx5/shadowsocks相关客户端"
        )}`
    );
};

module.exports = download;
