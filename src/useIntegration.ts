import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserNavigator, createSafeURL, urlToPath } from '@telegram-apps/sdk';
import type { 
  Path,
  BaseLocationHook,
} from 'wouter';

export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key: string;
}

export interface Navigator {
  go: (delta: number) => void;
  push: (to: Path, state?: any) => void;
  replace: (to: Path, state?: any) => void;
  createHref: (to: Path) => string;
  encodeLocation: (to: Path) => string;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
}

/**
 * Integrates the Mini Apps navigator with Wouter.
 * @param nav - Mini Apps navigator.
 * @returns A tuple containing the current location and a navigator object.
 */
export function useIntegration<State>(nav: BrowserNavigator<State>): [Location, Navigator] {
  const createLocation = useCallback((): Location => ({
    pathname: nav.pathname,
    search: nav.search,
    hash: nav.hash,
    state: nav.state,
    key: nav.id,
  }), [nav]);

  const [location, setLocation] = useState(createLocation);

  const navigate = useCallback((to: Path, options?: NavigationOptions) => {
    const path = typeof to === 'string' ? to : urlToPath(to);
    if (!path) {
      console.error('Invalid path provided to navigate');
      return;
    }
    if (options?.replace) {
      nav.replace(path, options.state);
    } else {
      nav.push(path, options?.state);
    }
  }, [nav]);

  const navigator: Navigator = useMemo(() => ({
    go: (delta) => nav.go(delta),
    push: (to, state) => navigate(to, { state }),
    replace: (to, state) => navigate(to, { replace: true, state }),
    createHref: (to) => nav.renderPath(urlToPath(to)),
    encodeLocation: (to) => createSafeURL(nav.renderPath(urlToPath(to))).toString(),
  }), [nav, navigate]);

  useEffect(() => {
    return nav.on('change', () => setLocation(createLocation()));
  }, [nav, createLocation]);

  return [location, navigator];
}

// Helper function to create a Wouter-compatible location hook
export function createLocationHook<State>(nav: BrowserNavigator<State>): BaseLocationHook {
  return () => {
    const [location, setLocation] = useState(() => nav.pathname + nav.search + nav.hash);

    useEffect(() => {
      const handleChange = () => setLocation(nav.pathname + nav.search + nav.hash);
      nav.on('change', handleChange);
      return () => nav.off('change', handleChange);
    }, []);

    const navigate = useCallback((to: Path, options?: NavigationOptions) => {
      const path = typeof to === 'string' ? to : urlToPath(to);
      if (options?.replace) {
        nav.replace(path, options.state);
      } else {
        nav.push(path, options?.state);
      }
    }, []);

    return [location, navigate];
  };
}

/**
 * Creates a Wouter-compatible location hook.
 * @param nav - Mini Apps navigator.
 * @returns A Wouter-compatible location hook.
 */
export function createRouterConfig<State>(
  nav: BrowserNavigator<State>,
  options?: { base?: string }
): { hook: BaseLocationHook; base: string } {
  const base = options?.base || '/';

  const locationHook: BaseLocationHook = useMemo(() => {
    return () => {
      const [location, setLocation] = useState(() => {
        const fullPath = nav.pathname + nav.search + nav.hash;
        const hashbangPath = fullPath.replace(/^#!/, '');
        return hashbangPath.startsWith(base) ? hashbangPath.slice(base.length) || '/' : hashbangPath;
      });

      useEffect(() => {
        const handleChange = () => {
          const fullPath = nav.pathname + nav.search + nav.hash;
          const hashbangPath = fullPath.replace(/^#!/, '');
          setLocation(hashbangPath.startsWith(base) ? hashbangPath.slice(base.length) || '/' : hashbangPath);
        };
        nav.on('change', handleChange);
        return () => nav.off('change', handleChange);
      }, []);

      const navigate = useCallback((to: Path, options?: NavigationOptions) => {
        const path = typeof to === 'string' ? to : urlToPath(to);
        const fullPath = base === '/' ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
        const hashbangPath = `#!${fullPath}`;
        if (options?.replace) {
          nav.replace(hashbangPath, options.state as State);
        } else {
          nav.push(hashbangPath, options?.state as State);
        }
      }, []);

      return [location, navigate];
    };
  }, [nav, base]);

  return {
    hook: locationHook,
    base,
  };
}