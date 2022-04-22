---
title: "Next.js support on Azure Static Web Apps"
description: "An overview of the support of Next.js on Azure Static Web Apps"
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic:  overview
ms.date: 04/22/2022
ms.author: aapowell
ms.custom: devx-track-js
---

Next.js support on Azure Static Web Apps can be categorised as two deployment models, statically exported Next.js and hybrid Next.js.

## Statically exported Next.js

Next.js can be deployed as a static site using the [static HTML export](https://nextjs.org/docs/advanced-features/static-html-export) feature of Next.js. This will generate static HTML files from the Next.js application during the deployment process and allows Next.js to be deployed with no backend APIs.

To enable static export of a Next.js application, add `next export` the to `build` npm script in the package.json:

```json
{
    "scripts": {
        "build": "next export"
    }
}
```

Or set `is_static_export` to `true` in the Static Web Apps set of the GitHub Actions/Azure DevOps YAML file.

Follow the [deploy static-rendered Next.js websites](deploy-nextjs-ssg.md) tutorial to learn how to deploy a statically exported Next.js application to Azure.

## Hybrid Next.js applications (preview)

Static Web Apps supports deploying a Next.js application that leverages the hybrid application features to create the application on the server when the page is requested, rather than at build time. This allows the application to inject real-time data into the response.

As hybrid applications features that are available in the preview are:

- [Server side rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Image optimization](https://nextjs.org/docs/basic-features/image-optimization)

Follow the [deploy hybrid Next.js applications](deploy-nextjs-hybrid.md) tutorial to learn how to deploy a hybrid Next.js application to Azure.
