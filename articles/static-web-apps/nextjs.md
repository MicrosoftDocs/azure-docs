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
# Deploy Next.js websites on Azure Static Web Apps
Next.js support on Azure Static Web Apps can be categorised as two deployment models, statically exported Next.js and hybrid Next.js.

## Static HTML export


Next.js can be deployed as a static site using the [static HTML export](https://nextjs.org/docs/advanced-features/static-html-export) feature of Next.js. This will generate static HTML files at build time which are cached and reused for all requests.

To enable static export of a Next.js application, add `next export` the to `build` npm script in the package.json:

```json
{
    "scripts": {
        "build": "next build && next export"
    }
}
```

If you're using custom build scripts, set `IS_STATIC_EXPORT` to `true` in the Static Web Apps task of the GitHub Actions/Azure DevOps YAML file.

Here is an example of the GitHub Actions job that is enabled for static exports:

```yaml
      - name: Build And Deploy
        id: swa
        uses: azure/static-web-apps-deploy@latest
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "public" # Built app content directory - optional
        env: # Add environment variables here
          IS_STATIC_EXPORT: true
```

Follow the [deploy static-rendered Next.js websites](deploy-nextjs-ssg.md) tutorial to learn how to deploy a statically exported Next.js application to Azure.

## Hybrid Next.js applications (preview)

Static Web Apps supports deploying hybrid Next.js websites where you can choose between static generation and server-side rendering (SSR) on a per page basis. It is recommended to use Static Generation over SSR for performance reasons.


Key features that are available in the preview are:


- [Server side rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Image optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [Authentication](https://nextjs.org/docs/authentication)

> [!NOTE]
> When using Hybrid Rendering, Azure Functions is unavailable as this functionality is replaced by Next.js API Routes.

Follow the [deploy hybrid Next.js applications](deploy-nextjs-hybrid.md) tutorial to learn how to deploy a hybrid Next.js application to Azure.
