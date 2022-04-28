import React from 'react';
import { GlobalService, useGlobalService } from 'lins-core';

export default (props) => {
  const globalService = useGlobalService();

  return (
    <GlobalService.Provider value={globalService}>
      {props.children}
    </GlobalService.Provider>
  )
}
