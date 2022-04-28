import { dirname } from 'path';
import { IApi } from 'umi';

interface SensoroDesignOpts {
  firstLibrary?: boolean;
}

export default (api: IApi) => {

  api.describe({
    key: 'sensoroDesign',
    config: {
      default: {
        firstLibrary: true
      },
      schema(joi) {
        return joi.object({
          firstLibrary: joi.boolean()
        });
      },
    },
  });

  const opts: SensoroDesignOpts = api.userConfig.sensoroDesign || {};

  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        { libraryName: '@sensoro/sensoro-design', libraryDirectory: 'es', style: true }
      ])
    };
  });

  if (opts?.firstLibrary) {
    api.addProjectFirstLibraries(() => [
      {
        name: '@sensoro/sensoro-design',
        path: dirname(require.resolve('@sensoro/sensoro-design/package.json')),
      }
    ]);
  }
};
