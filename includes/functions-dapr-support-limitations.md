---
author: greenie-msft
ms.service: azure-functions
ms.topic: include
ms.date: 10/14/2026
ms.author: nigreenf
ms.reviewer: hannahhunter
---

> [!WARNING]
> The Dapr extension for Azure Functions retires on April 20, 2027, and is scheduled for removal from extension bundles on that date. The removal applies to main extension bundle version 4.42.0 and later and preview extension bundle version 4.60.0 and later.
>
> This removal also applies to those bundle versions preinstalled or cached in Linux hosting images or distributed through Windows hosting.
>
> Migrate to [Dapr client SDKs](https://docs.dapr.io/developing-applications/sdks/) or [Dapr HTTP APIs](https://docs.dapr.io/reference/api/) directly from your function code, and replace Dapr triggers with HTTP-triggered functions that receive Dapr callbacks. Existing apps can temporarily pin the main bundle to `[4.*, 4.42.0)` or the preview bundle to `[4.*, 4.60.0)` in `host.json`. .NET apps can continue using the corresponding Dapr extension NuGet packages directly. Neither pinning an older bundle nor continuing to use the NuGet packages extends support beyond April 20, 2027, or changes the removal date.