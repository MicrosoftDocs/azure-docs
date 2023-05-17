---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 10/26/2022
ms.author: cshoe
---

### Unsupported features in preview

During the preview, the following features of Static Web Apps are unsupported for Next.js with server-side rendering:

- APIs using Azure Functions, Azure AppService, Azure Container Apps or Azure API Management.
- Deployment via the SWA CLI.
- Static Web Apps provided Authentication and Authorization.
  - Instead, you can use the Next.js [Authentication](https://nextjs.org/docs/authentication) feature.
- The `staticwebapp.config.json` file.
  - Features such as custom headers and routing can be controlled using the `next.config.js` file.
- `skip_app_build` and `skip_api_build` can't be used.
- Incremental static regeneration (ISR) does not support caching images and [on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation)

> [!NOTE]
> The maximum app size for the hybrid Next.js application is 100 MB. Use [standalone](../articles/static-web-apps/deploy-nextjs-hybrid.md#enable-standalone-feature) feature by Next.js for optimized app sizes. If this is not sufficient, consider using [Static HTML exported Next.js](../articles/static-web-apps/deploy-nextjs-static-export.md) if your app size requirement is more than 100 MB.
