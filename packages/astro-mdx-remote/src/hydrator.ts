import React, { ComponentType } from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as userComponents from 'virtual:mdx-components';

const dataAttribute = 'data-island-slot';
const islandSelector = '.remote-island';

export function hydrateIslands() {
  const islands = Array.from(document.querySelectorAll(islandSelector));

  sortIslands(islands).forEach((island: Element) => {
    const componentName = island.getAttribute('data-component');
    if (!componentName) return;

    const entry = (userComponents as any).default[componentName];
    if (!entry) return;

    const Component = entry.Component || entry;

    const props = JSON.parse(island.getAttribute('data-props') || '{}');
    const slot = getIslandSlotElement(island);

    hydrateIsland(island, Component, props, slot);
  });
}

function hydrateIsland(
  island: Element,
  Component: ComponentType,
  props: Record<string, any>,
  slot: Element | null,
) {
  hydrateRoot(
    island,
    React.createElement(
      Component,
      props,
      slot
        ? React.createElement('div', {
            [dataAttribute]: '',
            suppressHydrationWarning: true,
            dangerouslySetInnerHTML: { __html: slot.innerHTML },
          })
        : undefined,
    ),
  );
}

function sortIslands(islands: Element[]) {
  return islands.sort((a, b) => (a.contains(b) ? 1 : b.contains(a) ? -1 : 0));
}

function getIslandSlotElement(island: Element): Element | null {
  return island.querySelector(`[${dataAttribute}]`);
}
