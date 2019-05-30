
const utils = require('./utils');



// 获取默认配置
const getTemplateConfig = () => {
  let config = {};
  // 获取template.json的配置
  let templateConfig = utils.readConfig(utils.resolveApp('template.json'));
  // 获取package.json的配置
  let packageConfig = utils.readConfig(utils.resolveApp('package.json')).templateConfig;
  if (templateConfig) {
    config = templateConfig;
  } else if (packageConfig) {
    config = packageConfig;
  }
  return config;
}

module.exports = {
  templateConfig: getTemplateConfig(),
};
