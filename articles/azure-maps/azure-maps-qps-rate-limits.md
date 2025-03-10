---
title: Azure Maps QPS rate limits
description: Azure Maps limitation on the number of Queries Per Second.
author: faterceros
ms.author: aterceros
ms.date: 8/8/2024
ms.topic: quickstart
ms.service: azure-maps
ms.subservice: general
---

# Azure Maps QPS rate limits

Azure Maps doesn't have any maximum daily limits on the number of requests that can be made, however there are limits to the maximum number of queries per second (QPS).

> [!NOTE]
>
> **Azure Maps Gen1 pricing tier retirement**
>
> Gen1 pricing tier is now deprecated and will be retired on 9/15/26. Gen2 pricing tier replaces Gen1 (both S0 and S1) pricing tier. If your Azure Maps account has Gen1 pricing tier selected, you can switch to Gen2 pricing tier before it’s retired, otherwise it will automatically be updated. For more information, see [Manage the pricing tier of your Azure Maps account].

The following list shows the QPS usage limits for each Azure Maps service by Pricing Tier.

| Azure Maps service | QPS Limit: Gen 2 Pricing Tier | QPS Limit: Gen 1 S1 Pricing Tier | QPS Limit: Gen 1 S0 Pricing Tier |
|  ----------------- |  :--------------------------: | :------------------------------: | :------------------------: |
| Copyright service | 10 | 10 | 10 |
| Creator - Alias (Deprecated<sup>1</sup>) | 10 | Not Available | Not Available |
| Creator - Conversion, Dataset, Feature State, Features, Map Configuration, Style, Routeset, TilesetDetails, Wayfinding (Deprecated<sup>1</sup>) | 50 | Not Available | Not Available |
| Data registry service (Deprecated<sup>1</sup>) | 50 | 50 |  Not Available  |
| Geolocation service | 50 | 50 | 50 |
| Render service - Road tiles | 500 | 500 | 50 |
| Render service - Satellite tiles | 250 | 250 | Not Available |
| Render service - Static maps | 50 | 50 | 50 |
| Render service - Traffic tiles | 50 | 50 | 50 |
| Render service - Weather tiles | 100 | 100 | 50 |
| Route service - Batch | 10 | 10 | Not Available |
| Route service - Non-Batch | 50 | 50 | 50 |
| Search service - Batch | 10 | 10 | Not Available |
| Search service - Non-Batch | 500 | 500 | 50 |
| Search service - Non-Batch Reverse | 250 | 250 | 50 |
| Spatial service (Deprecated<sup>1</sup>) | 50 | 50 |  Not Available  |
| Timezone service | 50 | 50 | 50 |
| Traffic service | 50 | 50 | 50 |
| Weather service | 50 | 50 | 50 |

<sup>1</sup> Azure Maps Creator, and the Data registry and Spatial services are now deprecated and will be retired on 9/30/25.

When QPS limits are reached, an HTTP 429 error is returned. If you're using the Gen 2 or Gen 1 S1 pricing tiers, you can create an Azure Maps *Technical* Support Request in the [Azure portal] to increase a specific QPS limit if needed. QPS limits for the Gen 1 S0 pricing tier can't be increased.

[Azure portal]: https://portal.azure.com/
[Manage the pricing tier of your Azure Maps account]: how-to-manage-pricing-tier.md
[v1]: /rest/api/maps/data?view=rest-maps-1.0&preserve-view=true
[v2]: /rest/api/maps/data
[Data Registry]: /rest/api/maps/data-registry
[How to create data registry]: how-to-create-data-registries.md
