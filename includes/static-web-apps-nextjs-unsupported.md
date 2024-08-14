---
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: include
ms.date: 06/12/2024
ms.author: cshoe
---

### Unsupported features in preview

The following features of Static Web Apps are unsupported for Next.js with hybrid rendering:

- **Select Azure services**: Linked APIs using Azure Functions, Azure App Service, Azure Container Apps, or Azure API Management.
- **SWA CLI features**: SWA CLI local emulation and deployment.
- **Partial features support**: The following properties in `staticwebapp.config.json` file aren't supported:
  - Navigation fallback is unsupported.
  - Route rewrites to routes within the Next.js application must be configured within `next.config.js`.
  - The configuration within the `staticwebapp.config.json` file takes precedence over the configuration within `next.config.js`.
  - Configuration for the Next.js site should be handled using `next.config.js` for full feature compatibility.
- **Build skipping**: The `skip_app_build` and `skip_api_build` features aren't supported in the `Azure/static-web-apps-deploy@v1` deployment image.
- **Incremental static regeneration (ISR)**: Image caching isn't supported.

> [!NOTE]
> The maximum app size for the hybrid Next.js application is 250 MB. Use [standalone](../articles/static-web-apps/deploy-nextjs-hybrid.md#enable-standalone-feature) feature by Next.js for optimized app sizes. If this is not sufficient, consider using [Static HTML exported Next.js](../articles/static-web-apps/deploy-nextjs-static-export.md) if your app size requirement is more than 250 MB.
