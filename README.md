# 基于vue + webpack + gulp 的前端项目

### 目录说明
/bak 旧代码备份
/src  静态资源
  common/ 公共模块
       img/  公共图片文件
       components/ 公共功能组件
       utils/ 工具类函数
  module1 业务模块1
/views html模板目录
/dist  打包后可上线的代码
/images dockerfile 文件
package.json 项目包信息
webpack.config.js webpack配置文件
.babelrc babel配置文件
.eslintrc.js 代码检查配置
app.js node服务启动文件,暂时无用

### 环境要求
node 6.9.2 npm 3.10.9，如果不是可通过 n 工具升级

### 安装 
` npm install `

### 本地开发启动
` npm run start `
访问路径配置：
配置host 127.0.0.1 dev.m.zhe800.comm
http://dev.m.zhe800.com:8080/dist/views/xxx/xxx.html

### 打包测试环境代码
` npm run build-test `

### 打包生产环境代码
` npm run build `





TODO:

地理位置
外部pm2.5
