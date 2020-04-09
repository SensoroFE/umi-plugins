import { dirname } from 'path';
import { IApi } from 'umi';

interface SensoroDesignOpts {
  firstLibrarie?: boolean;
}

export default (api: IApi) => {

  api.describe({
    key: 'sensoroDesign',
    config: {
      default: {
        firstLibrarie: true
      },
      schema(joi) {
        return joi.object({
          dafirstLibrarierk: joi.boolean()
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

  if (opts?.firstLibrarie) {
    api.addProjectFirstLibraries(() => [
      {
        name: '@sensoro/sensoro-design',
        path: dirname(require.resolve('@sensoro/sensoro-design/package.json')),
      }
    ]);
  }
};
