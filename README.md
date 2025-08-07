# action-netdrive-upload

## 简介

该 [GitHub Action](https://help.github.com/cn/actions) 用于调用分享网盘sdk [netdrive-sdk](https://github.com/wes-lin/netdrive-sdk) 工具，实现文件的批量上传、下载、删除等操作。

## workflow 示例

在目标仓库中创建 `.github/workflows/xxx.yml` 即可，文件名任意，配置参考如下：

```yaml
name: Test

on:
  workflow_dispatch:

jobs:
  upload:
    name: "Test upload"
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Upload to Netdrive
        uses: wes-lin/action-netdrive-upload@main
        with:
          username: ${{ secrets.NET_DRIVE_USERNAME }}
          password: ${{ secrets.NET_DRIVE_PASSWORD }}
          debug: ${{ vars.DEBUG }}
          drive-type: feijipan
          dest-path: 测试目录/缓存
          files: |
            dist/*.txt
```

其中 `${{ secrets.NET_DRIVE_XXX}}` 是调用 settings 配置的密钥，防止公开代码将权限密钥暴露，添加方式如下：

![](https://static.zkqiang.cn/images/20200118171056.png-slim)

## 相关参数

| 参数       | 是否必传 | 备注                                                       |
| ---------- | -------- | ---------------------------------------------------------- |
| username   | 是       | 网盘账号                                                   |
| password   | 是       | 网盘密码                                                   |
| uuid       | 否       | uuid |
| debug      | 否       | 是否开启调试日志,用于排错                                  |
| drive-type | 是       | 网盘类型,现支持小飞机网盘(feijipan)/蓝奏云优享(ilanzou)    |
| dest-path  | 是       | 上传到网盘的路径                                           |
| files      | 是       | 上传的目标文件,支持正则表达式筛选                          |
