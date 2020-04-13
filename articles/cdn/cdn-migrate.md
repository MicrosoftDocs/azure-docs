---
title: Migrate Azure CDN profile from Verizon Standard to Verizon Premium
description: Learn about the details of migrating a profile from Verizon Standard to Verizon Premium.
services: cdn
documentationcenter: ''
author: asudbring
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/21/2018
ms.author: allensu
ms.custom: 

---
# Migrate an Azure CDN profile from Standard Verizon to Premium Verizon

When you create an Azure Content Delivery Network (CDN) profile to manage your endpoints, Azure CDN offers four different products for you to choose from. For information about the different products and their available features, see [Compare Azure CDN product features](cdn-features.md).

If you've create an **Azure CDN Standard from Verizon** profile and are using it to manage your CDN endpoints, you have the option to upgrade it to an **Azure CDN Premium from Verizon** profile. When you upgrade, your CDN endpoints and all of your data will be preserved. 

> [!IMPORTANT]
> Once you've upgraded to an **Azure CDN Premium from Verizon** profile, you cannot later convert it back to an **Azure CDN Standard from Verizon** profile.
> 

To upgrade an **Azure CDN Standard from Verizon** profile, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

## Profile comparison
**Azure CDN Premium from Verizon** profiles have the following key differences from **Azure CDN Standard from Verizon** profiles:
- For certain Azure CDN features such as [compression](cdn-improve-performance.md), [caching rules](cdn-caching-rules.md), and [geo filtering](cdn-restrict-access-by-country.md), you cannot use the Azure CDN interface, you must use the Verizon portal via the **Manage** button.
- API: Unlike with Standard Verizon, you cannot use the API to control those features that are accessed from the Premium Verizon portal. However, you can use the API to control other common features, such as creating/deleting an endpoint, purging/loading cached assets, and enabling/disabling a custom domain.
- Pricing: Premium Verizon has a different pricing structure for data transfers  than Standard Verizon. For more information, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

**Azure CDN Premium from Verizon** profiles have the following additional features:
- [Token authentication](cdn-token-auth.md): Allows users to obtain and use a token to fetch secure resources.
- [Rules engine](cdn-rules-engine.md): Enables you to customize how HTTP requests are handled.
- Advanced analytics tools:
   - [Detailed HTTP analytics](cdn-advanced-http-reports.md)
   - [Edge performance analytics](cdn-edge-performance.md)
   - [Real-time analytics](cdn-real-time-alerts.md)


## Next steps
To learn more about the rules engine, see [Azure CDN rules engine reference](cdn-rules-engine-reference.md).

