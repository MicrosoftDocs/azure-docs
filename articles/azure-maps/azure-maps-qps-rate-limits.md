---
title: Azure Maps QPS rate limits
description: Azure Maps limitation on the number of Queries Per Second.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/15/2021
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
ms.custom: mode-other
---

# Azure Maps QPS rate limits

Azure Maps does not have any maximum daily limits on the number of requests that can be made, however there are limits to the maximum number of queries per second (QPS).

Below are the QPS usage limits for each Azure Maps service by Pricing Tier.

| Azure Maps Service | QPS Limit: Gen 2 Pricing Tier | QPS Limit: Gen 1 S1 Pricing Tier | QPS Limit: Gen 1 S0 Pricing Tier |
|  ----------------- |  :--------------------------: | :------------------------------: | :------------------------: |
| Copyright Service | 10 | 10 | 10 |
| Creator - Alias, TilesetDetails | 10 | Not Available | Not Available |
| Creator - Conversion, Dataset, Feature State, WFS | 50 | Not Available | Not Available |
| Data Service | 50 | 50 |  Not Available  |
| Elevation Service | 50 | 50 |  Not Available  |
| Geolocation Service | 50 | 50 | 50 |
| Render Service - Contour tiles, Digital Elevation Model (DEM) tiles and Customer tiles | 50 | 50 | Not Available |
| Render Service - Traffic tiles and Static maps | 50 | 50 | 50 |
| Render Service - Road tiles | 500 | 500 | 50 |
| Render Service - Satellite tiles | 250 | 250 | Not Available |
| Render Service - Weather tiles | 100 | 100 | 50 |
| Route Service - Batch | 10 | 10 | Not Available |
| Route Service - Non-Batch | 50 | 50 | 50 |
| Search Service - Batch | 10 | 10 | Not Available |
| Search Service - Non-Batch | 500 | 500 | 50 |
| Search Service - Non-Batch Reverse | 250 | 250 | 50 |
| Spatial Service | 50 | 50 |  Not Available  |
| Timezone Service | 50 | 50 | 50 |
| Traffic Service | 50 | 50 | 50 |
| Weather Service | 50 | 50 | 50 |

When QPS limits are reached, an HTTP 429 error will be returned. If you are using the Gen 2 or Gen 1 S1 pricing tiers, you can create an Azure Maps *Technical* Support Request in the [Azure portal](https://portal.azure.com/) to increase a specific QPS limit if needed. QPS limits for the Gen 1 S0 pricing tier cannot be increased.
