import { IApi } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';

const pluginDir = 'plugin-lins-core';

export default (api: IApi) => {
  const {
    utils: { winPath, Mustache, },
  } = api;

  api.describe({
    key: 'linsCore',
    config: {
      schema(joi) {
        return joi.object({
          baseUrl: joi.string(),
          scoketUrl: joi.string(),
          request: joi.object(),
          service: joi.object({
            prefix: joi.string(),
          }),
        });
      },
    },
    // enableBy: api.EnableBy.config,
  });

  api.onGenerateFiles(async () => {
    // lins-core.tsx
    const coreTpl = readFileSync(
      join(winPath(__dirname), 'templates', 'Provider.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: `${pluginDir}/Provider.tsx`,
      content: Mustache.render(coreTpl, {
        config: api.config.linsCore ?? {}
      }),
    });

    // runtime.tsx
    const runtimeTpl = readFileSync(
      join(__dirname, 'templates', 'runtime.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: `${pluginDir}/runtime.tsx`,
      content: Mustache.render(runtimeTpl, {}),
    });
  });

  api.addRuntimePlugin(() => `../${pluginDir}/runtime.tsx`);
}
