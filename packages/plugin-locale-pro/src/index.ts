import { dirname } from 'path';
import { IApi as Api } from 'umi';

export default (api: Api) => {
  api.modifyBabelPresetOpts(opts => {
    return {
      ...opts,
      import: (opts.import || []).concat([
        { libraryName: '@sensoro/sensoro-design', libraryDirectory: 'es', style: true }
      ]),
    };
  });

  api.addProjectFirstLibraries(() => [
    {
      name: '@sensoro/sensoro-design',
      path: dirname(require.resolve('@sensoro/sensoro-design/package.json')),
    }
  ]);
}
