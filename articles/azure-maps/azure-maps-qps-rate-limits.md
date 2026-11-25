---
title: Azure Maps QPS rate limits
description: Azure Maps limitation on the number of Queries Per Second.
author: faterceros
ms.author: aterceros
ms.date: 08/28/2026
ms.topic: quickstart
ms.service: azure-maps
ms.subservice: general
---

# Azure Maps QPS rate limits

Azure Maps doesn't have any maximum daily limits on the number of requests that can be made, however there are limits to the maximum number of queries per second (QPS).

The following table shows the default QPS usage limit for each Azure Maps service.

| Azure Maps service | Default QPS limit |
| ------------------ | :---------------: |
| Copyright service | 10 |
| Geolocation service | 50 |
| Render service - Road tiles | 500 |
| Render service - Satellite tiles | 250 |
| Render service - Static maps | 50 |
| Render service - Traffic tiles | 50 |
| Render service - Weather tiles | 100 |
| Route service - Batch | 10 |
| Route service - single request | 50 |
| Search service - Batch | 10 |
| Search service - single request | 500 |
| Search service - single request reverse | 250 |
| Search service - single request geocode autocomplete | 100 |
| Timezone service | 50 |
| Traffic service | 50 |
| Weather service | 50 |

When you reach a QPS limit, the service returns an HTTP 429 error. To request an increase for an eligible limit, create an Azure Maps *Technical* support request in the [Azure portal].

[Azure portal]: https://portal.azure.com/
