'use strict';

var path = require('path'),
    SourceNode = require('source-map').SourceNode,
    SourceMapConsumer = require('source-map').SourceMapConsumer,
    makeIdentitySourceMap = require('./makeIdentitySourceMap');

module.exports = function (source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  var resourcePath = this.resourcePath;
  if (resourcePath.indexOf('/node_modules/react/') > -1 ||
      resourcePath.indexOf('/node_modules/webpack/') > -1) {
    // Skip internals
    return this.callback(null, source, map);
  }

  var acceptUpdates = this.query !== '?manual',
      filename = path.basename(resourcePath),
      separator = '\n\n',
      prependText,
      appendText,
      node,
      result;

  prependText = [
    '/* REACT HOT LOADER */',
    'if (module.hot) {',
      '(function () {',
        'var reactHotApi = require(' + JSON.stringify(require.resolve('react-hot-api')) + '),',
        '    getRootInstances = require(' + JSON.stringify(require.resolve('./getRootInstances')) + ');',
        '',
        'if (typeof reactHotApi === "function" && typeof getRootInstances === "function") {',
          'module.makeHot = module.hot.data ? module.hot.data.makeHot : reactHotApi(getRootInstances);',
        '}',
      '})();',
    '}'
  ].join(' ');

  appendText = [
    '/* REACT HOT LOADER */',
    'if (module.hot) {',
      acceptUpdates ? [
        'module.hot.accept(function (err) {',
          'if (err) {',
            'console.error("Cannot not apply hot update to " + ' + JSON.stringify(filename) + ' + ": " + err.message);',
          '}',
        '});'
      ].join(' ') : '',
      'module.hot.dispose(function (data) {',
      '  data.makeHot = module.makeHot;',
      '});',
      'if (module.exports && module.makeHot) {',
      '  module.exports = module.makeHot(module.exports, "__MODULE_EXPORTS")',
      '}',
    '}'
  ].join(' ');

  if (this.sourceMap === false) {
    return this.callback(null, [
      prependText,
      source,
      appendText
    ].join(separator));
  }

  if (!map) {
    map = makeIdentitySourceMap(source, this.resourcePath);
  }

  node = new SourceNode(null, null, null, [
    new SourceNode(null, null, this.resourcePath, prependText),
    SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
    new SourceNode(null, null, this.resourcePath, appendText)
  ]).join(separator);

  result = node.toStringWithSourceMap();

  this.callback(null, result.code, result.map.toString());
};
