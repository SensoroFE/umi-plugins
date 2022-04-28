import { join } from 'path';
import { existsSync } from 'fs';
import { chokidar } from '@umijs/utils';
import { IApi } from 'umi';

interface APIConf {
  baseURL: string;
}

export default function(api: IApi) {
  let watcher: chokidar.FSWatcher;
  const localFile = join(api.cwd, '.local.config.ts');

  function getLocalApiUrl(filePath: string): APIConf {
    let localServerConfig = {
      baseURL: '',
    };
    if (existsSync(filePath)) {
      localServerConfig = require(filePath);
    }
    return {
      baseURL: localServerConfig.baseURL,
    };
  }

  function getApiUrl(): APIConf {
    // 获取CI设置的环境变量
    return {
      baseURL: process.env.API_BASE_URL as string,
    };
  }

  // 开发服务启动之后 监听配置文件
  api.onDevCompileDone(({ isFirstCompile }) => {
    if (isFirstCompile) {
      watcher = chokidar.watch(localFile).on('all', event => {
        if (event === 'change') {
          api.restartServer();
        }
      });
    }
  });

  api.onExit(() => {
    // 微信产品吱声的功能及服务
    watcher && watcher.close();
  });

  const apiConf =
    api.env === 'development' ? getLocalApiUrl(localFile) : getApiUrl();

  api.addHTMLHeadScripts(() => {
    return [
      {
        content: `
        window.BASE_URL = "${apiConf.baseURL}"
        `,
      },
    ];
  });
}
