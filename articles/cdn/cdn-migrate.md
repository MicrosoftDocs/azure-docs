---
title: Migrate Azure Content Delivery Network profile from Edgio Standard to Edgio Premium
description: Learn about the details of migrating a profile from Edgio Standard to Edgio Premium.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Migrate an Azure Content Delivery Network profile from Standard Edgio to Premium Edgio

When you create an Azure Content Delivery Network profile to manage your endpoints, Azure Content Delivery Network offers four different products for you to choose from. For information about the different products and their available features, see [Compare Azure Content Delivery Network product features](cdn-features.md).

If you've create an **Azure CDN Standard from Edgio** profile and are using it to manage your content delivery network endpoints, you can upgrade it to an **Azure CDN Premium from Edgio** profile. When you upgrade, your content delivery network endpoints and all of your data gets preserved.

> [!IMPORTANT]
> Once you've upgraded to an **Azure CDN Premium from Edgio** profile, you cannot later convert it back to an **Azure CDN Standard from Edgio** profile.
>

To upgrade an **Azure CDN Standard from Edgio** profile, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

## Profile comparison

**Azure CDN Premium from Edgio** profiles have the following key differences from **Azure CDN Standard from Edgio** profiles:
- For certain Azure Content Delivery Network features such as [compression](cdn-improve-performance.md), [caching rules](cdn-caching-rules.md), and [geo filtering](cdn-restrict-access-by-country-region.md), you can't use the Azure content delivery network interface, you must use the Edgio portal via the **Manage** button.
- API: Unlike with Standard Edgio, you can't use the API to control those features that are accessed from the Premium Edgio portal. However, you can use the API to control other common features, such as creating/deleting an endpoint, purging/load cached assets, and enabling/disable a custom domain.
- Pricing: Premium Edgio has a different pricing structure for data transfers than Standard Edgio. For more information, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

**Azure CDN Premium from Edgio** profiles have the following extra features:
- [Token authentication](cdn-token-auth.md): Allows users to obtain and use a token to fetch secure resources.
- [Rules engine](./cdn-verizon-premium-rules-engine.md): Enables you to customize how HTTP requests are handled.
- Advanced analytics tools:
   - [Detailed HTTP analytics](cdn-advanced-http-reports.md)
   - [Edge performance analytics](cdn-edge-performance.md)
   - [Real-time analytics](cdn-real-time-alerts.md)

## Next steps

To learn more about the rules engine, see [Azure Content Delivery Network rules engine reference](./cdn-verizon-premium-rules-engine-reference.md).
