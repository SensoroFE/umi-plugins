import React from 'react';
import { init, App, useCoreState, useRequestDictionary } from 'lins-core';

import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

init({{{config}}})

const Children: React.FC = ({
  noLoginPaths = [],
  loading,
  children
}) => {
  const running = useCoreState();
  const dictionaryRunning = useRequestDictionary({{{dictionary}}});
  const { pathname } = location;

  // 需要登录的页面
  if ((!running || !dictionaryRunning) && loading) {
    return loading;
  }

  return (
    <>
      {running && dictionaryRunning && children}
    </>
  )
}

export default (props) => {
  const runtimeLinsCore = plugin.applyPlugins({
    key: 'linsCore',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });

  return (
    <App>
      <Children {...runtimeLinsCore}>
        {props.children}
      </Children>
    </App>
  )
}

