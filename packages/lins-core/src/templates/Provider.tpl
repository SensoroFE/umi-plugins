import React, { useEffect } from 'react';
import { init, App, verifyRoutes, useCore, useCoreState } from 'lins-core';

import { ApplyPluginsType, history } from 'umi';
import { plugin } from '../core/umiExports';

init({{{config}}})

const dictionaryKeys = {{{dictionary}}};

const Children: React.FC = ({
  noLoginPaths = ['/login'],
  loading,
  children
}) => {
  // 状态检查
  {{#stateCheck}}
  const { refreshMe, getToken, dictionaryRun } = useCore();

  const running = useCoreState();
  const token = getToken();
  const { pathname } = location ?? {};

  useEffect(() => {
    if (!verifyRoutes(noLoginPaths, pathname)) {
      if (token) {
        refreshMe();
        dictionaryRun(dictionaryKeys)
      } else {
        history.push('/login');
        location.reload()
      }
    }

    const unlisten = history.listen((location) => {
      const token = getToken();
      // 无需登录的页面 >> 需要登录的页面
      if (
        verifyRoutes(noLoginPaths, pathname) &&
        !verifyRoutes(noLoginPaths, location.pathname)
      ) {
        if (token) {
          refreshMe();
          dictionaryRun(dictionaryKeys)
          return;
        }

        history.push('/login')
      }
    });

    return () => {
      unlisten();
    }
  }, [])

  // 无需登录页面直接放行
  if (verifyRoutes(noLoginPaths, pathname)) {
    return children;
  }

  // 需要登录的页面
  if (!running && loading) {
    return loading;
  }

  return (
    <>
      {running && children}
    </>
  )
  {{/stateCheck}}

  // 跳过状态检查
  {{#skipStateCheck}}
  const { refreshMe, toekn, dictionaryRun } = useCore();

  const running = useCoreState();
  useEffect(
    () => {
      if (toekn) {
        refreshMe();
        ictionaryRun();
      }
    },
    [toekn]
  );

  return children;
  {{/skipStateCheck}}
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

