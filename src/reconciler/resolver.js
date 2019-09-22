import { createProxyForType, getProxyByType, isProxyType, isTypeBlacklisted } from './proxies';
import {
  getComponentDisplayName,
  isCompositeComponent,
  isContextType,
  isForwardType,
  isLazyType,
  isMemoType,
} from '../internal/reactUtils';
import configuration, { internalConfiguration } from '../configuration';

const shouldNotPatchComponent = type => isTypeBlacklisted(type);

export function resolveUtility(type) {
  // all "utility" types are resolved to their __initial__ shapes
  // that enables to never change reference to them, and gives the ability to maintain React Tree on HMR

  // all operations could be skipped with react-hot-dom enabled

  if (typeof type === 'object') {
    if (configuration.integratedComparator) {
      return type;
    }
    const element = { type };
    if (isLazyType(element) || isMemoType(element) || isForwardType(element) || isContextType(element)) {
      return getProxyByType(type) || type;
    }
  }

  return undefined;
}

export function resolveComponent(type, options = {}) {
  const existingProxy = getProxyByType(type);

  // cold API
  if (shouldNotPatchComponent(type)) {
    return existingProxy ? existingProxy.getCurrent() : type;
  }

  if (!existingProxy && configuration.onComponentCreate) {
    configuration.onComponentCreate(type, getComponentDisplayName(type));
    if (shouldNotPatchComponent(type)) {
      return type;
    }
  }

  const proxy = internalConfiguration.disableProxyCreation ? existingProxy : createProxyForType(type, options);

  return proxy ? proxy.get() : undefined;
}

export function resolveProxy(type) {
  if (isProxyType(type)) {
    return type;
  }

  return undefined;
}

export function resolveNotComponent(type) {
  if (!isCompositeComponent(type)) {
    return type;
  }

  return undefined;
}

export const getLatestTypeVersion = type => {
  const existingProxy = getProxyByType(type);
  return existingProxy && existingProxy.getCurrent && existingProxy.getCurrent();
};

export const resolveSimpleType = type => {
  if (!type) {
    return type;
  }

  const simpleResult = resolveProxy(type) || resolveUtility(type) || resolveNotComponent(type);
  if (simpleResult) {
    return simpleResult;
  }

  const lastType = getLatestTypeVersion(type);

  // only lazy loaded components any now failing into this branch

  // if (lastType && lastType !== type) {
  //   console.warn('RHL: used type', type, 'is obsolete. Something is wrong with HMR.');
  // }

  return lastType || type;
};

export const resolveType = (type, options = {}) => {
  if (!type) {
    return type;
  }

  return (
    resolveProxy(type) || resolveUtility(type) || resolveNotComponent(type) || resolveComponent(type, options) || type
  );
};
