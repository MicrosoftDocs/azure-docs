---
title: Configure front-end frameworks with Azure Static Web Apps
description: Settings for popular front-end frameworks needed for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 07/18/2020
ms.author: cshoe
---

# Configure front-end frameworks and libraries with Azure Static Web Apps

The Azure Static Web Apps requires that you have the appropriate configuration values in the [build configuration file](build-configuration.md) for your front-end framework or library.

## Configuration

The following table lists the settings for a series of frameworks and libraries<sup>1</sup>.

The intent of the table columns is explained by the following items:

- **App artifact location (output location)**: Lists the value for `output_location`, which is the [folder for built versions of application files](build-configuration.md).

- **Custom build command**: When the framework requires  a command different from `npm run build` or `npm run azure:build`, you can define a [custom build command](build-configuration.md#custom-build-commands).

| Framework | App artifact location | Custom build command |
|--|--|--|
| [Alpine.js](https://github.com/alpinejs/alpine/) | `/` | n/a <sup>2</sup> |
| [Angular](https://angular.io/) | `dist/<APP_NAME>` <br><br>If you do not include an `<APP_NAME>`, remove the trailing slash. | `npm run build -- --configuration production` |
| [Angular Universal](https://angular.io/guide/universal) | `dist/<APP_NAME>/browser` | `npm run prerender` |
| [Astro](https://astro.build) | `dist` | n/a |
| [Aurelia](https://aurelia.io/) | `dist` | n/a |
| [Backbone.js](https://backbonejs.org/) | `/` | n/a |
| [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor) | `wwwroot` | n/a |
| [Ember](https://emberjs.com/) | `dist` | n/a |
| [Flutter](https://flutter.dev/) | `build/web` | `flutter build web` |
| [Framework7](https://framework7.io/) | `www` | `npm run build-prod` |
| [Glimmer](https://glimmerjs.com/) | `dist` | n/a |
| [HTML](https://developer.mozilla.org/docs/Web/HTML) | `/` | n/a |
| [Hugo](https://gohugo.io/) | `public` | n/a |
| [Hyperapp](https://hyperapp.dev/) | `/` | n/a |
| [JavaScript](https://developer.mozilla.org/docs/Web/javascript) | `/` | n/a |
| [jQuery](https://jquery.com/) | `/` | n/a |
| [KnockoutJS](https://knockoutjs.com/) | `dist` | n/a |
| [LitElement](https://lit-element.polymer-project.org/) | `dist` | n/a |
| [Marko](https://markojs.com/) | `public` | n/a |
| [Meteor](https://www.meteor.com/) | `bundle` | n/a |
| [Mithril](https://mithril.js.org/) | `dist` | n/a |
| [Next.js](https://nextjs.org/) (Static HTML Export) | `out` | n/a |
| [Next.js](https://nextjs.org/) (Hybrid Rendering) | n/a | n/a |
| [Polymer](https://www.polymer-project.org/) | `build/default` | n/a |
| [Preact](https://preactjs.com/) | `build` | n/a |
| [React](https://reactjs.org/) | `build` | n/a |
| [RedwoodJS](https://redwoodjs.com/) | `web/dist` | `yarn rw build web` |
| [Stencil](https://stenciljs.com/) | `www` | n/a |
| [Svelte](https://svelte.dev/) | `public` | n/a |
| [Three.js](https://threejs.org/) | `/` | n/a |
| [TypeScript](https://www.typescriptlang.org/) | `dist` | n/a |
| [Vue.js](https://vuejs.org/) | `dist` | n/a |

<sup>1</sup> The above table is not meant to be an exhaustive list of frameworks and libraries that work with Azure Static Web Apps.

<sup>2</sup> Not applicable

## Next steps

- [Build and workflow configuration](build-configuration.md)
