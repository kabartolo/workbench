import React from 'react';
import type { ComponentType } from 'react';

/**
 * Renders a React component to static HTML and wraps it in a hydration island.
 * The wrapper div stores the component name and serialized props as data attributes,
 * which MdxHydrator uses to rehydrate the component on the client.
 * @param name - The component's registered name, used by the client to look up the component
 * @param Component - The React component to render
 * @param props - Props to pass to the component
 */
export function renderIsland(
  name: string,
  Component: ComponentType<any>,
  props: any,
) {
  const { children, ...serializableProps } = props;

  const wrappedChildren = children
    ? React.createElement('div', { 'data-island-slot': '' }, children)
    : undefined;

  const element = React.createElement(
    Component,
    wrappedChildren ? { ...props, children: wrappedChildren } : props,
  );

  return React.createElement(
    'div',
    {
      className: 'remote-island',
      'data-component': name,
      'data-props': JSON.stringify(serializableProps),
    },
    element,
  );
}
