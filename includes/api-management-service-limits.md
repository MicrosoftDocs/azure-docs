---

title: include file
description: include file
services: api-management
author: vladvino

ms.assetid: 1b813833-39c8-46be-8666-fd0960cfbf04
ms.service: api-management
ms.topic: include
ms.date: 01/10/2020
ms.author: vlvinogr
ms.custom: include file
---

| Resource | Limit |
| ---------------------------------------------------------------------- | -------------------------- |
| Maximum number of scale units | 10 per region<sup>1</sup> |
| Cache size | 5 GiB per unit<sup>2</sup> |
| Concurrent back-end connections<sup>3</sup> per HTTP authority | 2,048 per unit<sup>4</sup> |
| Maximum cached response size | 2 MiB |
| Maximum policy document size | 256 KiB<sup>5</sup> |
| Maximum custom gateway domains per service instance<sup>6</sup> | 20 |
| Maximum number of CA certificates per service instance | 10 |
| Maximum number of service instances per subscription<sup>7</sup> | 20 |
| Maximum number of subscriptions per service instance<sup>7</sup> | 500 |
| Maximum number of client certificates per service instance<sup>7</sup> | 50 |
| Maximum number of APIs per service instance<sup>7</sup> | 50 |
| Maximum number of API operations per service instance<sup>7</sup> | 1,000 |
| Maximum total request duration<sup>7</sup> | 30 seconds |
| Maximum buffered payload size<sup>7</sup> | 2 MiB |
| Maximum request URL size<sup>8</sup> | 4096 bytes |

<sup>1</sup>Scaling limits depend on the pricing tier. To see the pricing tiers and their scaling limits, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).<br/>
<sup>2</sup>Per unit cache size depends on the pricing tier. To see the pricing tiers and their scaling limits, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).<br/>
<sup>3</sup>Connections are pooled and reused unless explicitly closed by the back end.<br/>
<sup>4</sup>This limit is per unit of the Basic, Standard, and Premium tiers. The Developer tier is limited to 1,024. This limit doesn't apply to the Consumption tier.<br/>
<sup>5</sup>This limit applies to the Basic, Standard, and Premium tiers. In the Consumption tier, policy document size is limited to 4 KiB.<br/>
<sup>6</sup>This resource is available in the Premium tier only.<br/>
<sup>7</sup>This resource applies to the Consumption tier only.<br/>
<sup>8</sup>Applies to the Consumption tier only. Includes an up to 2048 bytes long query string.<br/>
