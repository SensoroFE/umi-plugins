import { IApi } from 'umi';
import { join } from 'path';
import { readFileSync } from 'fs';

const absPluginDir = 'plugin-lins-core';

export default (api: IApi) => {
  const {
    utils: { winPath, Mustache, },
  } = api;

  api.describe({
    key: 'linsCore',
    config: {
      schema(joi) {
        return joi.object();
      },
      default: {},
    },
    // enableBy: api.EnableBy.config,
  });

  api.addRuntimePluginKey(() => 'linsCore');

  api.onGenerateFiles(async () => {
    // lins-core.tsx
    const coreTpl = readFileSync(
      join(winPath(__dirname), 'templates', 'Provider.tpl'),
      'utf-8',
    );
    const { dictionary = [], skipStateCheck = false, ...rest } = api.config.linsCore ?? {};

    api.writeTmpFile({
      path: `${absPluginDir}/Provider.tsx`,
      content: Mustache.render(coreTpl, {
        config: JSON.stringify(rest ?? {}),
        dictionary: JSON.stringify(dictionary),
        skipStateCheck: skipStateCheck === true,
        stateCheck: skipStateCheck !== true
      }),
    });

    // runtime.tsx
    const runtimeTpl = readFileSync(
      join(__dirname, 'templates', 'runtime.tpl'),
      'utf-8',
    );

    api.writeTmpFile({
      path: `${absPluginDir}/runtime.tsx`,
      content: Mustache.render(runtimeTpl, {}),
    });
  });

  api.addRuntimePlugin(() => `../${absPluginDir}/runtime.tsx`);
}
