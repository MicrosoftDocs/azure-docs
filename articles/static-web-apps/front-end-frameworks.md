---
title: Configure front-end frameworks with Azure Static Web Apps Preview
description: Settings for popular front-end frameworks needed for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 06/09/2020
ms.author: cshoe
---

# Configure front-end frameworks and libraries with Azure Static Web Apps Preview

The Azure Static Web Apps requires that you have the appropriate configuration values in the [build configuration](github-actions-workflow.md) file for your front-end framework or library.

- The  `app_artifact_location` is the destination folder where production version of the application files are built.
- By default, the build process runs `npm run build` or `npm run azure:build`, but in some cases a custom build command is required.

The following table lists the `app_artifact_location` and the custom build command (when necessary) for an array of front-end frameworks and libraries<sup>1</sup>.

| Framework                                                    | App artifact location     | Custom build command      |
| ------------------------------------------------------------ | ------------------------- | ------------------------- |
| [Alpine.js](https://github.com/alpinejs/alpine/)             | `/`                       |                           |
| [Angular.js](https://angularjs.org/)                         | `/`                       |                           |
| [Angular](https://angular.io/)                               | `dist/<APP_NAME>`         | `npm run build -- --prod` |
| [Angular Universal](https://angular.io/guide/universal)      | `dist/<APP_NAME>/browser` | `npm run prerender`       |
| [Aurelia](https://aurelia.io/)                               | `dist`                    |                           |
| [Backbone.js](https://backbonejs.org/)                       | `/`                       |                           |
| [Ember](https://emberjs.com/)                                | `dist`                    |                           |
| [Flutter](https://flutter.dev/)                              | `build/web`               | `flutter build web`       |
| [Glimmer](https://glimmerjs.com/)                            | `dist`                    |                           |
| [HTML](https://developer.mozilla.org/docs/Web/HTML)          | `/`                       |                           |
| [Hyperapp](https://hyperapp.dev/)                            | `/`                       |                           |
| [JavaScript](https://developer.mozilla.org/docs/Web/javascript) | `/`                       |                           |
| [jQuery](https://jquery.com/)                                | `/`                       |                           |
| [KnockoutJS](https://knockoutjs.com/)                        | `dist`                    |                           |
| [LitElement](https://lit-element.polymer-project.org/)       | `dist`                    |                           |
| [Marko](https://markojs.com/)                                | `public`                  |                           |
| [Meteor](https://www.meteor.com/)                            | `bundle`                  |                           |
| [Mithril](https://mithril.js.org/)                           | `dist`                    |                           |
| [Polymer](https://www.polymer-project.org/)                  | `build/default`           |                           |
| [Preact](https://preactjs.com/)                              | `build`                   |                           |
| [React](https://reactjs.org/)                                | `build`                   |                           |
| [Stencil](https://stenciljs.com/)                            | `www`                     |                           |
| [Svelte](https://svelte.dev/)                                | `public`                  |                           |
| [Three.js](https://threejs.org/)                             | `/`                       |                           |
| [TypeScript](https://www.typescriptlang.org/)                | `dist`                    |                           |
| [Vue](http://vuejs.com/)                                     | `dist`                    |                           |

<sup>1</sup> The above table is not meant to be an exhaustive list of frameworks and libraries that work with Azure Static Web Apps.

## Next steps

- [Build and workflow configuration](github-actions-workflow.md)
