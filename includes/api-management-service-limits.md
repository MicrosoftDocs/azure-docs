---
title: include file
description: include file
services: api-management
author: vladvino

ms.assetid: 1b813833-39c8-46be-8666-fd0960cfbf04
ms.service: api-management
ms.topic: include
ms.date: 03/22/2018
ms.author: vlvinogr
ms.custom: include file

---

| Resource | Limit |
| --- | --- |
| Units of scale | 10 per region<sup>1</sup> |
| Cache | 5 GB per unit<sup>1</sup> |
| Concurrent backend connections<sup>2</sup> per HTTP authority | 2048 per unit<sup>3</sup> |
| Maximum cached response size | 10MB |
| Maximum policy document size | 256KB |
| Maximum custom gateway domains | 20 per service instance<sup>4</sup> |


<sup>1</sup>API Management limits are different for each pricing tier. To see the pricing tiers and their scaling limits go to  [API Management Pricing](https://azure.microsoft.com/pricing/details/api-management/).
<sup>2</sup> Connections are pooled and re-used, unless explicitly closed by the backend.
<sup>3</sup> Per unit of Basic, Standard and Premium tiers. Developer tier is limited to 1024.
<sup>4</sup> Available in Premium tier only.


