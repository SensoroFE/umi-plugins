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
      default: {

      },
      schema(joi) {
        return joi.object({
        });
      },
    },
    // enableBy: api.EnableBy.register,
  });

  api.onGenerateFiles(async () => {
    // lins-core.tsx
    const coreTpl = readFileSync(
      join(winPath(__dirname), 'templates', 'Provider.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: `${pluginDir}/Provider.tsx`,
      content: Mustache.render(coreTpl, {}),
    });

    // runtime.tsx
    const runtimeTpl = readFileSync(
      join(__dirname, 'templates', 'runtime.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: `${pluginDir}/runtime.tsx`,
      content: Mustache.render(runtimeTpl, {

      }),
    });
  });

  api.addRuntimePlugin(() => `../${pluginDir}/runtime.tsx`);
}
