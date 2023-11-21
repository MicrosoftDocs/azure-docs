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

Azure Static Web Apps requires that you have the appropriate configuration values in the [build configuration file](build-configuration.md) for your front-end framework or library.

## Configuration

The following table lists the settings for a series of frameworks and libraries<sup>1</sup>.

The intent of the table columns is explained by the following items:

- **Output location (App artifact location)**: Lists the value for `output_location`, which is the [folder for built static website files](build-configuration.md).
- **API artifact location (api location)**: Lists the value for `api_location`, which is the folder containing the built managed Azure Functions for frameworks that require server-side hosting. 
- **Custom build command**: When the framework requires  a command different from `npm run build` or `npm run azure:build`, you can define a [custom build command](build-configuration.md#custom-build-commands).

> [!NOTE]
> Static Web Apps includes support for frameworks that feature server-side rendering. These frameworks compile your project into static assets and Azure Functions, which are deployed to a static web app by indicating the output and API artifact locations as listed below.

| Framework | Output location (App artifact location) | API artifact location | Custom build command |
|--|--|--|--|
| [Alpine.js](https://github.com/alpinejs/alpine/) | `/`  | n/a | n/a <sup>2</sup> |
| [Angular](https://angular.dev/) | `dist/<APP_NAME>/browser` |  n/a | n/a |
| [Angular Universal](https://angular.io/guide/universal) | `dist/<APP_NAME>/browser` | n/a |  `npm run prerender` |
| [Astro](https://astro.build) | `dist` | n/a  | n/a |
| [Aurelia](https://aurelia.io/) | `dist` | n/a |  n/a |
| [Backbone.js](https://backbonejs.org/) | `/` | n/a | n/a |
| [Blazor (WASM)](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor) | `wwwroot` | n/a | n/a |
| [Ember](https://emberjs.com/) | `dist` | n/a | n/a |
| [Flutter](https://flutter.dev/) | `build/web` | n/a | `flutter build web` |
| [Framework7](https://framework7.io/) | `www` | n/a | `npm run build-prod` |
| [Glimmer](https://glimmerjs.com/) | `dist` | n/a | n/a |
| [HTML](https://developer.mozilla.org/docs/Web/HTML) | `/` | n/a | n/a |
| [Hugo](https://gohugo.io/) | `public` | n/a | n/a |
| [Hyperapp](https://hyperapp.dev/) | `/` | n/a | n/a |
| [JavaScript](https://developer.mozilla.org/docs/Web/javascript) | `/` | n/a | n/a |
| [jQuery](https://jquery.com/) | `/` | n/a | n/a |
| [KnockoutJS](https://knockoutjs.com/) | `dist` | n/a | n/a |
| [LitElement](https://lit-element.polymer-project.org/) | `dist` | n/a | n/a |
| [Marko](https://markojs.com/) | `public` | n/a | n/a |
| [Meteor](https://www.meteor.com/) | `bundle` | n/a | n/a |
| [Mithril](https://mithril.js.org/) | `dist` | n/a | n/a |
| [Next.js](https://nextjs.org/) (Static HTML Export) | `out` | n/a | n/a |
| [Next.js](https://nextjs.org/) (Hybrid Rendering) | `/` | n/a | n/a |
| [Nuxt 2](https://v2.nuxt.com/) | `/` | n/a | n/a |
| [Nuxt 3](https://nuxt.com/) | `output/public` | `output/server` | n/a |
| [Polymer](https://www.polymer-project.org/) | `build/default` | n/a | n/a |
| [Preact](https://preactjs.com/) | `build` | n/a | n/a |
| [React](https://reactjs.org/) | `build` | n/a | n/a |
| [RedwoodJS](https://redwoodjs.com/) | `web/dist` | n/a | `yarn rw build web` |
| [Stencil](https://stenciljs.com/) | `www` | n/a |  n/a |
| [Svelte](https://svelte.dev/) | `public` | n/a | n/a |
| [SvelteKit](https://kit.svelte.dev/) | `build/static` | `build/server` | n/a |
| [Three.js](https://threejs.org/) | `/` | n/a | n/a |
| [TypeScript](https://www.typescriptlang.org/) | `dist` | n/a | n/a |
| [Vue.js](https://vuejs.org/) | `dist` | n/a | n/a |

<sup>1</sup> The above table is not meant to be an exhaustive list of frameworks and libraries that work with Azure Static Web Apps.

<sup>2</sup> Not applicable

## Next steps

- [Build and workflow configuration](build-configuration.md)
