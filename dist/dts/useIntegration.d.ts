import { BrowserNavigator } from '@telegram-apps/sdk';
import { Path, BaseLocationHook } from 'wouter';

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
export declare function useIntegration<State>(nav: BrowserNavigator<State>): [Location, Navigator];
export declare function createLocationHook<State>(nav: BrowserNavigator<State>): BaseLocationHook;
/**
 * Creates a Wouter-compatible location hook.
 * @param nav - Mini Apps navigator.
 * @returns A Wouter-compatible location hook.
 */
export declare function createRouterConfig<State>(nav: BrowserNavigator<State>, options?: {
    base?: string;
}): {
    hook: BaseLocationHook;
    base: string;
};
