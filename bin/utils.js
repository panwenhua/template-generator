const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
module.exports = {
    // 获取真实路径
    resolveApp,
    // 获取异常
    catchErr: function (err) {
        if (err) {
            if (err.code === 'ENOENT') {
                // console.error('file 不存在');
                return;
            }
            throw err;
        }
    },
    // 读取配置文件
    readConfig: function (url) {
        try {
            let result = fs.readFileSync(url, 'utf-8');
            result = JSON.parse(result);
            console.log(result);
            return result;
        } catch (err) {
            this.catchErr(err);
        }
    },
    // 
    mkdir: function (filePath) {
        if (fs.existsSync(filePath)) {
            console.log(`${filePath}目录存在，`);
            process.exit();
        };
        return new Promise((resolve, reject) => {
            fs.mkdir(filePath, function (err) {
                console.log(`目录创建成功:${filePath}`)
                resolve()
            })
        })
    },
    // 给Index文件追加内容
    appendIndexFile: function (filePath, data) {
        return new Promise((resolve, reject) => {
            fs.appendFile(filePath, data, 'utf8', function (err) {
                console.log(`追加成功:${filePath}`)
                resolve()
            })
        })
    },

}
