import * as React from 'react';
import { Nav } from './Nav';
import { Content } from './Content';
import { Header } from './Header';
import { Logo } from './Logo';
import { Modal } from './Modal';
import { Shutdown } from './Shutdown';

export const Layout: React.FC = function Layout() {
  return (
    <React.Fragment>
      <div className="grid grid-cols-[14rem_1fr] gap-0 w-screen h-screen primary">
        <aside className="grid grid-rows-[4rem_1fr_4rem] h-screen sidebar  shadow-[5px_0px_5px_2px_#666666] dark:shadow-none z-[2]">
          <Logo className="" />
          <Nav className="" />
          <Shutdown />
        </aside>
        <div className="grid grid-rows-[4rem_1fr] z-[1]">
          <Header className="header shadow-lg px-4 h-[4rem]" />
          <Content className="h-[calc(100vh-4rem)] overflow-auto pl-4 pt-4" />
        </div>
        {/* <Loading /> */}
        {/* <Disconnected /> */}
      </div>
      <Modal />
    </React.Fragment>
  );
};
