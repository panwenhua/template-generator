const fs = require('fs');
const path = require('path');
const utils = require('./utils');

class Generator {
    constructor(answers) {
        this.answers = answers;
    }
    readTemplateFolder() {
        const { templateFolderPath } = this.answers;
        console.log(templateFolderPath, 'templateFolderPath');
        return new Promise((resolve, reject) => {
            fs.readdir(templateFolderPath, 'utf8', (err, files) => {
                resolve(files);
            })
        });
    }
    writeFile(files) {
        return new Promise((resolve, reject) => {
            const { component, destinationPath, templateFolderPath } = this.answers;
            console.log(destinationPath);
            // 首字母大写
            let ComponentName = component.replace(/^\w/g, a => a.toUpperCase());
            // 样式component-name
            let kebabCase = component.replace(/(\w)([A-Z])/g, '$1-$2').toLowerCase();
            // 组件目标目录路径
            const componentPath = `${path.resolve(destinationPath)}/${kebabCase}`;
            // 创建目录
            utils.mkdir(componentPath);
            files.forEach(templateName => {
                // 生成文件的名称
                let newComponentName = templateName.replace(/componentName/g, ComponentName).replace(/.txt/g, '');
                // 组件目标路径
                const componentFileName = `${destinationPath}/${kebabCase}/${newComponentName}`;
                const data = fs.readFileSync(`${templateFolderPath}/${templateName}`, 'utf8').replace(/\${ComponentName}/g, ComponentName).replace(/\${component-name}/g, kebabCase);
                fs.writeFileSync(componentFileName, data, 'utf8')
                console.log(`${newComponentName}文件已生成`);
            })
            // 目录索引文件路径
            const indexPath = `${path.resolve(destinationPath)}/index.js`;
            utils.appendIndexFile(indexPath, `export { default as ${ComponentName} } from './${kebabCase}';  // ${ComponentName}' \r\n`);
            resolve(files);
        });

    }
    async create() {
        let files = await this.readTemplateFolder();
        this.writeFile(files);
    }
}

module.exports = {
    Generator
}