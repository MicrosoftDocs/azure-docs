---
title: Configure front-end frameworks with Azure Static Web Apps Preview
description: Settings for popular front-end frameworks needed for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 06/10/2020
ms.author: cshoe
---

# Configure front-end frameworks and libraries with Azure Static Web Apps Preview

The Azure Static Web Apps requires that you have the appropriate configuration values in the [build configuration file](github-actions-workflow.md) for your front-end framework or library.

## Configuration

The following table lists the settings for a series of frameworks and libraries<sup>1</sup>.

The intent of the table columns is explained by the following items:

- **App artifact location**: Lists the value for `app_artifact_location`, which is the [folder for built versions of application files](github-actions-workflow.md#build-and-deploy).

- **Custom build command**: When the framework requires  a command different from `npm run build` or `npm run azure:build`, you can define a [custom build command](github-actions-workflow.md#custom-build-commands).

| Framework | App artifact location | Custom build command |
|--|--|--|
| [Alpine.js](https://github.com/alpinejs/alpine/) | `/` | n/a <sup>2</sup> |
| [Angular](https://angular.io/) | `dist/<APP_NAME>` | `npm run build -- --prod` |
| [Angular Universal](https://angular.io/guide/universal) | `dist/<APP_NAME>/browser` | `npm run prerender` |
| [Aurelia](https://aurelia.io/) | `dist` | n/a |
| [Backbone.js](https://backbonejs.org/) | `/` | n/a |
| [Ember](https://emberjs.com/) | `dist` | n/a |
| [Flutter](https://flutter.dev/) | `build/web` | `flutter build web` |
| [Glimmer](https://glimmerjs.com/) | `dist` | n/a |
| [HTML](https://developer.mozilla.org/docs/Web/HTML) | `/` | n/a |
| [Hyperapp](https://hyperapp.dev/) | `/` | n/a |
| [JavaScript](https://developer.mozilla.org/docs/Web/javascript) | `/` | n/a |
| [jQuery](https://jquery.com/) | `/` | n/a |
| [KnockoutJS](https://knockoutjs.com/) | `dist` | n/a |
| [LitElement](https://lit-element.polymer-project.org/) | `dist` | n/a |
| [Marko](https://markojs.com/) | `public` | n/a |
| [Meteor](https://www.meteor.com/) | `bundle` | n/a |
| [Mithril](https://mithril.js.org/) | `dist` | n/a |
| [Polymer](https://www.polymer-project.org/) | `build/default` | n/a |
| [Preact](https://preactjs.com/) | `build` | n/a |
| [React](https://reactjs.org/) | `build` | n/a |
| [Stencil](https://stenciljs.com/) | `www` | n/a |
| [Svelte](https://svelte.dev/) | `public` | n/a |
| [Three.js](https://threejs.org/) | `/` | n/a |
| [TypeScript](https://www.typescriptlang.org/) | `dist` | n/a |
| [Vue](http://vuejs.com/) | `dist` | n/a |

<sup>1</sup> The above table is not meant to be an exhaustive list of frameworks and libraries that work with Azure Static Web Apps.

<sup>2</sup> Not applicable

## Next steps

- [Build and workflow configuration](github-actions-workflow.md)
