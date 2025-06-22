---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 04/25/2025
ms.author: cephalin
---

## What happens to outdated runtimes in App Service?

Outdated runtimes are deprecated by the maintaining organization or found to have significant vulnerabilities. Accordingly, they're removed from the create and configure pages in the portal. When an outdated runtime is hidden from the portal, any app that's still using that runtime continues to run. 

If you want to create an app with an outdated runtime version that's no longer shown on the portal, use the Azure CLI, ARM template, or Bicep. These deployment alternatives let you create deprecated runtimes that have been removed in the portal, but are still being supported.

If a runtime is fully removed from the App Service platform, your Azure subscription owner receives an email notice before the removal.
