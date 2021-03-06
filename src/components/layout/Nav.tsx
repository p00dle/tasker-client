import * as React from 'react';
import { useReducer, useEffect } from 'react';
import { navigation } from '../../nav';
import { useRouter } from '../../router';
import { NavItem } from '../../lib/navFactory';
import { Link } from '../_common/Link';

interface NavLinkProps extends NavItem<any, any> {
  isExpanded: boolean;
  isSelected: boolean;
  subMenu?: NavLinkProps[];
}

type NavAction = { type: 'update-route'; payload: { route: string } } | { type: 'toggle-expand'; payload: { name: string } };

function selectNavLink(navLinks: NavLinkProps[], route: string): [NavLinkProps[], boolean] {
  let selected = false;
  const updatedNavLinks = navLinks.map((navLink) => {
    if (navLink.subMenu) {
      const [subMenu, childSelected] = selectNavLink(navLink.subMenu, route);
      selected = childSelected;
      return { ...navLink, subMenu, isExpanded: childSelected || navLink.isExpanded };
    } else {
      const isSelected = navLink.route === route;
      if (isSelected) selected = true;
      return { ...navLink, isSelected };
    }
  });
  return [updatedNavLinks, selected];
}

function mapNavItems(navItems: NavItem<any, any>[]): NavLinkProps[] {
  return navItems.map((navItem) => {
    if (navItem.subMenu) {
      return { ...navItem, subMenu: mapNavItems(navItem.subMenu), isExpanded: false, isSelected: false };
    } else {
      return { ...navItem, isExpanded: false, isSelected: false, subMenu: undefined };
    }
  });
}

function setNavigation(navItems: NavItem<any, any>[], route: string): NavLinkProps[] {
  const navLinks = mapNavItems(navItems);
  const [updatedNavLinks] = selectNavLink(navLinks, route);
  return updatedNavLinks;
}

function toggleExpand(navLinks: NavLinkProps[], name: string): [NavLinkProps[], boolean] {
  let navLinkFound = false;
  const updatedNavLinks = navLinks.map((navLink) => {
    if (navLinkFound) {
      return { ...navLink };
    } else if (navLink.name === name) {
      navLinkFound = true;
      return { ...navLink, isExpanded: !navLink.isExpanded };
    } else if (navLink.subMenu) {
      const [subMenu, childFound] = toggleExpand(navLink.subMenu, name);
      if (childFound) {
        navLinkFound = true;
      }
      return { ...navLink, subMenu };
    }
    return { ...navLink };
  });
  return [updatedNavLinks, navLinkFound];
}

function navReducer(state: { navLinks: NavLinkProps[]; route: string }, action: NavAction): { navLinks: NavLinkProps[]; route: string } {
  switch (action.type) {
    case 'update-route': {
      const route = action.payload.route;
      const [navLinks] = selectNavLink(state.navLinks, route);
      return { route, navLinks };
    }
    case 'toggle-expand': {
      const [navLinks] = toggleExpand(state.navLinks, action.payload.name);
      return { route: state.route, navLinks };
    }
    default:
      return state;
  }
}

const NavLink: React.FC<NavLinkProps & { toggleExpand: (name: string) => void; depth?: number }> = function NavLink({
  name,
  route,
  routeParams,
  subMenu,
  isExpanded,
  isSelected,
  toggleExpand,
  depth = 0,
}) {
  if (route) {
    return (
      <li className={depth ? '' : 'last:border-b-2 border-inherit'}>
        <Link
          route={route}
          params={routeParams}
          className={
            'transition-all h-12 text-lg border-t-2 border-inherit grid grid-cols-[1fr_1rem] px-4 items-center sidebar-hover ' +
            (isSelected ? 'sidebar-active' : '')
          }
        >
          <span>{name}</span>
        </Link>
      </li>
    );
  } else if (Array.isArray(subMenu)) {
    return (
      <li className={depth ? '' : 'last:border-b-2 border-inherit'}>
        <div
          onClick={() => toggleExpand(name)}
          className={
            'transition-all h-12 text-lg border-t-2 border-inherit grid grid-cols-[1fr_1rem] px-4 items-center sidebar-hover cursor-pointer'
          }
        >
          <span>{name}</span>
          <span className="">{isExpanded ? '\u25BC' : '\u25B2'}</span>
        </div>
        <ul>
          {isExpanded
            ? subMenu.map((navLink) => <NavLink {...navLink} key={navLink.name} toggleExpand={toggleExpand} depth={depth + 1} />)
            : null}
        </ul>
      </li>
    );
  }
  return null;
};

export const Nav: React.FC<{ className?: string }> = function Nav({ className = '' }) {
  const { route } = useRouter();
  const [navState, dispatch] = useReducer(navReducer, { navLinks: setNavigation(navigation, route), route });
  useEffect(() => {
    dispatch({ type: 'update-route', payload: { route } });
  }, [route]);

  function toggleExpand(name: string) {
    dispatch({ type: 'toggle-expand', payload: { name } });
  }
  return (
    <nav>
      <ul className={'select-none' + ' ' + className}>
        {navState.navLinks.map((navLink) => (
          <NavLink {...navLink} key={navLink.name} toggleExpand={() => toggleExpand(navLink.name)} />
        ))}
      </ul>
    </nav>
  );
};
