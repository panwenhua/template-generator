### 前言
前端工具层出不穷，在享受第三方库带来便捷的同时，我们如何为自己量身定做一套自己的工具？ 一些常见的 cli 工具如 vue-cli 和 CRA 的核心功能就是快速生成完整的项目结构，开发者只需在这基础上开发，非常高效。

 cli 工具现在已经非常成熟了，因此结合自身的项目的情况，我决定做一个模板创建工具 template-generator ，这篇文章非常适合 nodeJS 工具开发入门学习。

### 整理需求
首先，设计一个工具之前，我们需要明确这个工具是什么？为什么需要？对此我做了如下的分析：
- 是什么？：根据模板生成对应的文件。
- 为什么需要？：在日常前端开发中，重复的需要手动创建目录文件、手动 copy，这些工作都非常的机械，而且，每个人都有一套自己的写法，项目目录和组件规范，我们没法保证。

### 人机交互
我们在使用 npm init 的时候会发现，通过命令来进行人机交互，并生成最终的 package.json 我们可以想一下这其中的逻辑，首先选择配置，其次生成文件。
我们可以借用 Inquirer.js 来做人机交互的部分。

- Inquirer.js 是一个用户与命令行交互的工具
- 能更加方便的配置相关交互。

#### [Inquirer.js 使用](https://github.com/SBoudrias/Inquirer.js)
**（1）基本语法**
```
const inquirer = require('inquirer');

const promptList = [
    // 具体交互内容
];

inquirer.prompt(promptList).then(answers => {
    console.log(answers); // 返回的结果
})
```
**（2）设置具体交互内容**
```
const inquirer = require('inquirer');
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path')) //注册一个遍历src下所有的目录与文件的propmpt

const componentName = {
    type: 'input',
    message: '请设置组件名称:',
    name: 'component',
};
// https://github.com/adelsz/inquirer-fuzzy-path
const placementPath = {
    type: 'fuzzypath',
    name: 'path',
    excludePath: nodePath => nodePath.startsWith('node_modules'),
    // excludePath :: (String) -> Bool
    // excludePath to exclude some paths from the file-system scan
    itemType: 'directory',
    // itemType :: 'any' | 'directory' | 'file'
    // specify the type of nodes to display
    // default value: 'any'
    // example: itemType: 'file' - hides directories from the item list
    rootPath: 'src',
    // rootPath :: String
    // Root search directory
    message: '选择需要存放的位置:',
    default: 'components/',
    suggestOnly: false,
    // suggestOnly :: Bool
    // Restrict prompt answer to available choices or use them as suggestions
};
const promptList = [componentName, placementPath,];

inquirer.prompt(promptList).then(answers => {
    console.log(answers); // 返回的结果
})
```
**（3）交互结果**
```
{ component: 'Home', path: 'src\\views' }
// 拿到结果之后，可以根据结果做其他具体的操作。
```
#### 编写模板文件
既然是根据模板生成具体文件，那自然少不了默认模板，这里我们用txt文档来存模板文件。我们可以新建目录 templates/react-template 来存 React 模板文件。

**（1）js模板**
```
import * as React from 'react';
import { observer } from 'mobx-react';
const styles = require('./index.scss');

interface ${ComponentName}Props {
}

@observer
class ${ComponentName} extends React.PureComponent<${ComponentName}Props, {}> {
    render() {
        return (
                <div className={styles.${component-name}}>
                    ${ComponentName}
                </div>
        );
    }
}
export default ${ComponentName};
```
**（2）css模板**
```
@import "~@assets/style/color";

.${component-name}{

}
```
#### 生成文件
在前面我们获取到了用户配置和模板文件，现在我们需要根据这些信息生成相对应的文件。

**（1）读模板目录**

```
fs.readdir('./templates/react-template', 'utf8', (err, files) => {
    console.log(files); //该目录下所有文件名
})
```
**（2）根据文件名再读取文件**

```
files.forEach(templateName => {
    const data = fs.readFileSync(`./templates/react-template/${templateName}`)
})
```
**（3）替换模板文件的变量**

这里我们可以根据自身情况设定一定的规则
比如：组件名首字母大写、css类名用 - 代替驼峰。

```
// 首字母大写
let ComponentName = component.replace(/^\w/g, a => a.toUpperCase());
// 样式component-name
let className = component.replace(/(\w)([A-Z])/g, '$1-$2').toLowerCase();
    
```
根据规则生成好新的变量之后再替换模板中的变量
```
// 在(2)的时候拿到每个文件流，这时候我们可以把文件流转成string类型
const data = fs
    .readFileSync(`${templateFolderPath}/${templateName}`)
    .toString()
    .replace(/\${ComponentName}/g, ComponentName)
    .replace(/\${component-name}/g, className)
    
```
**（4）生成文件**
```
// 在（1）中获取到了模板的文件名，但是最终生成文件，需要我们使用新的文件名。
// 将模板文件名替换成新的文件名
let newComponentName = templateName.replace(/componentName/g, ComponentName).replace(/.txt/g, '');

// 生成文件
fs.writeFile(`${path}/${newComponentName}`, data, (err) => {
    if (err) throw err;
    console.log(`${newComponentName}文件已生成`);
});
```




### TODO LIST

- [x] 人机交互，获取用户需求。
- [ ] 用户输入的值需要校验格式，过滤掉特殊字符。
- [ ] 支持多套模板自由选择，而不是固定一套。
- [x] 替换模板变量。
- [ ] 支持多个自定义变量，用户可配置。
- [ ] 校验生成文件之前是否存在，避免覆盖。
- [x] 生成最终文件。
- [ ] 支持命令的模式，以插件的形式安装配置。


### 总结
根据模板生成文件的功能已经初步完成了，但是这只是一个雏形，离真正开发使用还有一定的距离，操作稍微不当可能会影响项目中其他文件,但是通过本文，我们至少对于如何开发一个 nodeJS 工具还是非常有帮助的。

参考链接:
- [Inquirer.js文档](https://github.com/SBoudrias/Inquirer.js)
- [nodeJS文档](http://nodejs.cn/api/fs.html)