---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 10/26/2022
ms.author: cshoe
---

### Unsupported features in preview

The following features of Static Web Apps are unsupported for Next.js with hybrid rendering:

- Linked APIs using Azure Functions, Azure App Service, Azure Container Apps, or Azure API Management.
- SWA CLI local emulation and deployment.
- Partial support for `staticwebapp.config.json` file.
  - Navigation fallback is unsupported.
  - Route rewrites to routes within the Next.js application must be configured within `next.config.js`.
  - The configuration within the `staticwebapp.config.json` file takes precedence over the configuration within `next.config.js`.
  - Configuration for the Next.js site should be handled using `next.config.js` for full feature compatibility.
- `skip_app_build` and `skip_api_build` can't be used within the `Azure/static-web-apps-deploy@v1` deployment image.
- Incremental static regeneration (ISR) doesn't support caching images.

> [!NOTE]
> The maximum app size for the hybrid Next.js application is 250 MB. Use [standalone](../articles/static-web-apps/deploy-nextjs-hybrid.md#enable-standalone-feature) feature by Next.js for optimized app sizes. If this is not sufficient, consider using [Static HTML exported Next.js](../articles/static-web-apps/deploy-nextjs-static-export.md) if your app size requirement is more than 250 MB.
