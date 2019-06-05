const inquirer = require('inquirer');
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path')) //注册一个遍历src下所有的目录与文件的propmpt
const paths = require('./paths');

const { rootPath } = paths.templateConfig;
module.exports = () => {
    const componentName = {
        type: 'input',
        message: '请设置组件名称:',
        name: 'component',
    };
    // https://github.com/adelsz/inquirer-fuzzy-path
    const placementPath = {
        type: 'fuzzypath',
        name: 'destinationPath',
        excludePath: nodePath => nodePath.startsWith('node_modules'),
        // excludePath :: (String) -> Bool
        // excludePath to exclude some paths from the file-system scan
        itemType: 'directory',
        // itemType :: 'any' | 'directory' | 'file'
        // specify the type of nodes to display
        // default value: 'any'
        // example: itemType: 'file' - hides directories from the item list
        rootPath: rootPath || 'src',
        // rootPath :: String
        // Root search directory
        message: '选择需要存放的位置:',
        default: 'src/components/',
        suggestOnly: false,
        // suggestOnly :: Bool
        // Restrict prompt answer to available choices or use them as suggestions
    };
    const promptList = [componentName, placementPath];
    return new Promise(async (resolve, reject) => {
        let answers = await inquirer.prompt(promptList);
        resolve(answers)
    });
}