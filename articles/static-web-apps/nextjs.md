---
title: "Next.js support on Azure Static Web Apps"
description: "An overview of the support of Next.js on Azure Static Web Apps"
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 10/12/2022
ms.author: aapowell
ms.custom: devx-track-js
---

# Deploy Next.js websites on Azure Static Web Apps

Next.js support on Azure Static Web Apps can be categorized as two deployment models, [Static HTML Export](https://nextjs.org/docs/advanced-features/static-html-export) Next.js applications, and _hybrid_ rendering, which covers [Server-Side Rendering](https://nextjs.org/docs/advanced-features/react-18/streaming) and [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration).

## Static HTML export

You can deploy a Next.js static site using the [static HTML export](https://nextjs.org/docs/advanced-features/static-html-export) feature of Next.js. This configuration generates static HTML files during the build, which are cached and reused for all requests.

To enable static export of a Next.js application, add `next export` the to `build` npm script in _package.json_.

```json
{
    "scripts": {
        "build": "next build && next export"
    }
}
```

If you're using custom build scripts, set `IS_STATIC_EXPORT` to `true` in the Static Web Apps task of the GitHub Actions/Azure DevOps YAML file.

The following example shows the GitHub Actions job that is enabled for static exports.

```yaml
      - name: Build And Deploy
        id: swa
        uses: azure/static-web-apps-deploy@latest
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
          action: "upload"
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "public" # Built app content directory - optional
        env: # Add environment variables here
          IS_STATIC_EXPORT: true
```

Follow the [deploy static-rendered Next.js websites](deploy-nextjs-static-export.md) tutorial to learn how to deploy a statically exported Next.js application to Azure.

## Hybrid Next.js applications (preview)

Static Web Apps supports deploying hybrid Next.js websites where you can choose between static generation and server-side rendering (SSR) on a **per page basis**. Static Generation is often used over SSR for performance reasons.



Key features that are available in the preview are:

- [Server side rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Image optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [Authentication](https://nextjs.org/docs/authentication)
- [Output File Tracing](https://nextjs.org/docs/advanced-features/output-file-tracing)

Follow the [deploy hybrid Next.js applications](deploy-nextjs-hybrid.md) tutorial to learn how to deploy a hybrid Next.js application to Azure.

[!INCLUDE [Unsupported Next.js features](../../includes/static-web-apps-nextjs-unsupported.md)]
