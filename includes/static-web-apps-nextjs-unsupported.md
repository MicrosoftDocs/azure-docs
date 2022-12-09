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
- The `staticwebapps.config.json` file.
  - Features such as custom headers and routing can be controlled using the `next.config.js` file.
- `skip_app_build` and `skip_api_build` can't be used.
- The maximum app size for the hybrid Next.js application is 100 MB. Consider using Static HTML exported Next.js apps if your requirement is more than 100 MB.
- Incremental static regeneration (ISR) does not support caching images
