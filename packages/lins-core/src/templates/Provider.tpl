import React from 'react';
import { init, App, verifyRoutes, useCoreState, useRequestDictionary } from 'lins-core';

import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

init({{{config}}})

const Children: React.FC = ({
  noLoginPaths = ['/login'],
  loading,
  children
}) => {
  const running = useCoreState();
  const dictionaryRunning = useRequestDictionary({{{dictionary}}});
  const { pathname } = location;

  // 无需登录页面直接放行
  if (verifyRoutes(noLoginPaths, pathname)) {
    return children;
  }

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

