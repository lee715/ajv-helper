Ajv schema tool
========================


## 安装
```
npm i -g ajv-helper
```

## CLI

```
ajvp -h

Usage: ajvp <command>

Options:
  -V, --version      output the version number
  -h, --help         output usage information

Commands:
  build|b [options]  Build schema json file
```

### 生成ajv schema文件
```
ajvp build

Options:
  -o, --output   指定输出json文件地址
```

## API
### addKeyword(String name, Object schema, Function matchFn)
schema: 验证的ajv schema片段
matchFn: 匹配关键字的函数
默认支持3种keyword
host： host或hosts结尾的key，value验证为url类型
avatar： avatar或avatars或logo或logos结尾的key，value验证为url类型
email： email或emails结尾的key，value验证为email类型
```
// demo
const AjvParser = require('ajv-helper')
const ins = new AjvParser()
// host或hosts结尾的key，value应为url格式
ins.addKeyword('host', {
  type: 'string',
  format: 'url'
}, function (str) {
  return /hosts?$/i.test(str)
})
// {"webHost": "xxx"} => {"webHost": {type: 'string', format: 'url'}}
// {"mail": {host: "xxx"}}
//  => 
// {"mail": {
//   type: 'object',
//   properties: {
//     "host": {
//       type: 'string', format: 'url'
//     }
//   }
// }}
```
