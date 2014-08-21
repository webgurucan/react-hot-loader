# react-hot-loader

This is a **stable for daily use in development** implementation of [React live code editing](http://www.youtube.com/watch?v=pw4fKkyPPg8). It works on top of [webpack-dev-server](https://github.com/webpack/webpack-dev-server) and can be run directly or through a Grunt or Gulp task. It marries React with Webpack [Hot Module Replacement](http://webpack.github.io/docs/hot-module-replacement.html) by wrapping `React.createClass` calls in a custom function that updates components' prototypes when the changes come in. Inspired by [react-proxy-loader](https://github.com/webpack/react-proxy-loader).

* Get inspired by a **[real project video demo](https://vimeo.com/100010922).**

* Read **[how it works](http://gaearon.github.io/react-hot-loader/).**

* For barebone example, check out **[React tutorial app](http://facebook.github.io/react/docs/tutorial.html)** **[forked to use Webpack and react-hot-loader](https://github.com/gaearon/react-tutorial-hot)** and **[integration walkthrough](http://gaearon.github.io/react-hot-loader/#integration).**

* If you're into CoffeeScript, check out **[coffee-react-quickstart](https://github.com/KyleAMathews/coffee-react-quickstart)** that uses react-hot-loader with Gulp.

* Run `npm install && npm start` to have fun with the bundled example:

![](http://f.cl.ly/items/0d0P3u2T0f2O163K3m1B/2014-07-14%2014_09_02.gif)

![](http://f.cl.ly/items/3T3u3N1d2U30380Z2k2D/2014-07-14%2014_05_49.gif)

## Installation

`npm install react-hot-loader`

## Usage

#### **[Read the walkthrough!](http://gaearon.github.io/react-hot-loader/#integration)**

Seriously! It covers:

* porting a project to use Webpack;
* enabling Hot Module Replacement;
* integrating react-hot-loader.

Also check out **[coffee-react-quickstart](https://github.com/KyleAMathews/coffee-react-quickstart)** for an integration example with Gulp and CoffeeScript.

### Exceptions

Hot reload is disabled for modules that contain no `React.createClass` calls and/or don't export a valid React class. For example, in the sample project, `app.jsx` doesn't get live updates because it is assumed to have side-effects.

Several components in one file will work as long as their `displayName`s are different.

## Running Example

```
npm install
npm start
open http://localhost:8080/webpack-dev-server/bundle
```

Then edit `example/a.jsx` and `example/b.jsx`.
Your changes should be displayed live, without unmounting components or destroying their state.

## Implementation Notes

Currently, it keeps a list of mounted instances and updates their prototypes when an update comes in.

A better approach may be to make monkeypatch `createClass` to return a proxy object [as suggested by Pete Hunt](https://github.com/webpack/webpack/issues/341#issuecomment-48372300):

>The problem is that references to component descriptors could be stored in any number of places. What we could do is wrap all components in "proxy" components which look up the "real" component in some mapping

## Changelog

#### 0.4.0

* Ignore files that contain no `createClass` calls (fixes **[#17]**(https://github.com/gaearon/react-hot-loader/issues/17))
* Remove the need for pitch loader (fixes **[#19](https://github.com/gaearon/react-hot-loader/issues/19)**)
* Improve performance by only using one loader instead of two
* Now that performance is acceptable, remove desktop notifications and `notify` option
* It is now recommended that you use `devtool: 'eval'` because it's much faster and has no downsides anymore

#### 0.3.1

* Avoid warnings on old browsers with missing `Notification` API
* Errors don't cause page reload anymore

#### 0.3.0

* Use React 0.11

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
