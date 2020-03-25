import { dirname } from 'path';
import { IApi } from 'umi';

interface SensoroDesignOpts {
  dark?: boolean;
  compact?: boolean;
}

export default (api: IApi) => {

  api.describe({
    key: 'sensoroDesign',
    config: {
      schema(joi) {
        return joi.object({
          dark: joi.boolean(),
          compact: joi.boolean(),
        });
      },
    },
  });

  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        { libraryName: '@sensoro/sensoro-design', libraryDirectory: 'es', style: true }
      ])
    };
  });

  api.addProjectFirstLibraries(() => [
    {
      name: '@sensoro/sensoro-design',
      path: dirname(require.resolve('@sensoro/sensoro-design/package.json')),
    }
  ]);
};
