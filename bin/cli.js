#!/usr/bin/env node
const inquirers = require('./inquirers');
const paths = require('./paths');
const { Generator } = require('./Generator');

(async () => {
    // 获取answers
    let answers = await inquirers();
    // 获取默认配置
    Object.assign(answers, paths.templateConfig)
    let generator = new Generator(answers);
    generator.create();
})();
