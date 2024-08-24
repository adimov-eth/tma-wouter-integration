# Wouter Integration for Telegram Mini Apps

This package provides a seamless integration between [Wouter](https://github.com/molefrog/wouter), a minimal routing library for React, and the Telegram Mini Apps SDK. It allows you to use Wouter's simple and intuitive routing in your Telegram Mini Apps while leveraging the navigation capabilities of the Telegram platform.

## Features

- Easy integration with Telegram Mini Apps SDK
- Support for base path configuration
- Consistent navigation behavior with Telegram's native navigation
- TypeScript support
- Minimal overhead and easy to use API

## Installation

To install the wouter-integration package, run the following command in your project directory:

```bash
npm install @telegram-apps/wouter-integration wouter
```

Or if you're using yarn:

```bash
yarn add @telegram-apps/wouter-integration wouter
```

## Usage

Here's a basic example of how to use the wouter-integration in your Telegram Mini App:

```jsx
import React, { useMemo, useEffect } from 'react';
import { Router, Route } from 'wouter';
import { initNavigator } from '@telegram-apps/sdk-react';
import { createRouterConfig } from '@telegram-apps/wouter-integration';

function App() {
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const routerConfig = useMemo(() => createRouterConfig(navigator, { base: '/app' }), [navigator]);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  return (
    <Router {...routerConfig}>
      <Route path="/" component={Home} />
      <Route path="/users" component={Users} />
      <Route path="/about" component={About} />
    </Router>
  );
}

export default App;
```

## API Reference

### `createRouterConfig(nav, options?)`

Creates a Wouter-compatible router configuration object.

- `nav`: The Telegram Mini Apps `BrowserNavigator` instance.
- `options`: An optional object with the following property:
  - `base`: A string representing the base path for your app (default: '/').

Returns an object with `hook` and `base` properties to be spread into Wouter's `Router` component.

### `useIntegration(nav)`

A hook that provides access to the current location and navigator.

- `nav`: The Telegram Mini Apps `BrowserNavigator` instance.

Returns a tuple `[location, navigator]` where:
- `location` is an object containing `pathname`, `search`, `hash`, `state`, and `key`.
- `navigator` is an object with methods `go`, `push`, `replace`, `createHref`, and `encodeLocation`.

### `createLocationHook(nav)`

Creates a Wouter-compatible location hook.

- `nav`: The Telegram Mini Apps `BrowserNavigator` instance.

Returns a function that can be used as Wouter's location hook.

## Important Notes

- Make sure to attach the Telegram Mini Apps navigator in a `useEffect` hook to properly integrate with the platform's navigation.
- The base path option in `createRouterConfig` allows you to serve your app from a subdirectory without changing your route definitions.
- This integration ensures that Wouter's navigation works in harmony with Telegram's native navigation, providing a seamless user experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.