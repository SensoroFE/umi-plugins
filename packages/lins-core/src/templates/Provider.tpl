import React, { useState, useEffect } from 'react';
import { init, App, verifyRoutes, useCore, } from 'lins-core';

import { ApplyPluginsType, history } from 'umi';
import { plugin } from '../core/umiExports';

const config = {{{config}}};
const dicKeys = {{{dictionary}}};

const Children: React.FC = ({
  noLoginPaths = ['/login'],
  loading,
  children
}) => {
  // 状态检查
  {{#stateCheck}}
  const [status, setStatus] = useState('init');
  const { fetchMe, fetchDictionary, getToken, getMeData } = useCore();
  const { pathname } = location;
  const token = getToken();

  const handleFetchData = async () => {
    setStatus('loading');

    await fetchMe();
    await fetchDictionary(dicKeys);

    setStatus('pass');
  }

  useEffect(() => {
    const unlisten = history.listen((e) => {
      const token = getToken();

      // 跳转无需登录页面，直接放行
      if (
        verifyRoutes(noLoginPaths, e.pathname)
      ) {
        setStatus('pass');
        return;
      }

      // 从登录页面跳转而来，必须获取用户信息
      if (
        pathname === '/login' &&
        !verifyRoutes(noLoginPaths, e.pathname)
      ) {
        handleFetchData();
        return;
      }

      // 需要登录信息页面，获取登录信息
      if (
        !verifyRoutes(noLoginPaths, e.pathname) &&
        !meData
      ) {
        handleFetchData();
        return;
      }

      // 无需登录的页面 >> 需要登录的页面
      if (
        verifyRoutes(noLoginPaths, pathname) &&
        !verifyRoutes(noLoginPaths, e.pathname)
      ) {
        if (meData) {
          setStatus('pass');
          return;
        };

        if (token) {
          handleFetchData();
          return;
        }

        history.push('/login')
      }
    });

    const meData = getMeData();

    if (verifyRoutes(noLoginPaths, pathname) || meData) {
      setStatus('pass');
      return;
    }

    if (!verifyRoutes(noLoginPaths, pathname)) {
      if (token) {
        handleFetchData();
      } else {
        history.push('/login');
      }
    }

    return () => {
      unlisten();
    }
  }, []);

  // 需要登录的页面
  if (status === 'loading' && loading) {
    return loading;
  }

  return (
    <>
      {status === 'pass' && children}
    </>
  )
  {{/stateCheck}}

  // 跳过状态检查
  {{#skipStateCheck}}
  const { fetchMe, fetchDictionary, token } = useCore();

  useEffect(async () => {
    await fetchMe();
    await fetchDictionary(dicKeys);
  }, [token]);

  return children;
  {{/skipStateCheck}}
}

export default (props) => {
  const runtimeLinsCore = plugin.applyPlugins({
    key: 'linsCore',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });

  init({ ...config, history: runtimeLinsCore.history })

  return (
    <App>
      <Children {...runtimeLinsCore}>
        {props.children}
      </Children>
    </App>
  )
}

