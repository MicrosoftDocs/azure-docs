---

title: Include file
description: Include file
services: api-management
author: dlepow

ms.service: api-management
ms.topic: include
ms.date: 06/27/2023
ms.author: danlep
ms.custom: Include file
---

| Resource | Limit |
| ---------------------------------------------------------------------- | -------------------------- |
| Maximum number of scale units | 12 per region<sup>1</sup> |
| Cache size | 5 GiB per unit<sup>2</sup> |
| Concurrent back-end connections<sup>3</sup> per HTTP authority | 2,048 per unit<sup>4</sup> |
| Maximum cached response size | 2 MiB |
| Maximum policy document size | 256 KiB<sup>5</sup> |
| Maximum custom gateway domains per service instance<sup>6</sup> | 20 |
| Maximum number of CA certificates per service instance<sup>7</sup> | 10 |
| Maximum number of service instances per subscription<sup>8</sup> | 20 |
| Maximum number of subscriptions per service instance<sup>8</sup> | 500 |
| Maximum number of client certificates per service instance<sup>8</sup> | 50 |
| Maximum number of APIs per service instance<sup>8</sup> | 50 |
| Maximum number of API management operations per service instance<sup>8</sup> | 1,000 |
| Maximum total request duration<sup>8</sup> | 30 seconds |
| Maximum request payload size<sup>8</sup> | 1 GiB |
| Maximum buffered payload size<sup>8</sup> | 2 MiB |
| Maximum request/response payload size in diagnostic logs | 8,192 bytes |
| Maximum request URL size<sup>9</sup> | 16,384 bytes |
| Maximum length of URL path segment<sup>10</sup> | 1,024 characters |
| Maximum size of API schema used by [validation policy](../articles/api-management/validation-policies.md)<sup>10</sup> | 4 MB |
| Maximum number of [schemas](../articles/api-management/validate-content-policy.md#schemas-for-content-validation)<sup>10</sup> | 100 |
| Maximum size of request or response body in [validate-content policy](../articles/api-management/validate-content-policy.md)<sup>10</sup> | 100 KB |
| Maximum number of self-hosted gateways<sup>11</sup> | 25 |
| Maximum number of active WebSocket connections per unit | 5,000<sup>12</sup> |
| Maximum number of tags supported by an API Management resource|15|
| Maximum number of authorization providers per service instance| 1,000 |
| Maximum number of authorizations per authorization provider| 10,000 |
| Maximum number of access policies per authorization | 100 |
| Maximum number of authorization requests per minute per authorization | 250 |
| Maximum number of [workspaces](../articles/api-management/workspaces-overview.md) per service instance<sup>10</sup> | 100 |

<sup>1</sup> Scaling limits depend on the pricing tier. For details on the pricing tiers and their scaling limits, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).<br/>
<sup>2</sup> Per unit cache size depends on the pricing tier. To see the pricing tiers and their scaling limits, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).<br/>
<sup>3</sup> Connections are pooled and reused unless explicitly closed by the back end.<br/>
<sup>4</sup> This limit is per unit of the Basic, Standard, and Premium tiers. The Developer tier is limited to 1,024. This limit doesn't apply to the Consumption tier.<br/>
<sup>5</sup> This limit applies to the Basic, Standard, and Premium tiers. In the Consumption tier, policy document size is limited to 16 KiB.<br/>
<sup>6</sup> Multiple custom domains are supported in the Developer and Premium tiers only.<br/>
<sup>7</sup> CA certificates are not supported in the Consumption tier.<br/>
<sup>8</sup> This limit applies to the Consumption tier only. There are no specific limits in other tiers but depends on service infrastructure, policy configuration, number of concurrent requests, and other factors.<br/>
<sup>9</sup> Applies to the Consumption tier only. Includes an up to 2048-bytes long query string.<br/>
<sup>10</sup> To increase this limit, contact [support](https://azure.microsoft.com/support/options/).<br/>
<sup>11</sup> Self-hosted gateways are supported in the Developer and Premium tiers only. The limit applies to the number of [self-hosted gateway resources](/rest/api/apimanagement/current-ga/gateway). To raise this limit contact [support](https://azure.microsoft.com/support/options/). Note, that the number of nodes (or replicas) associated with a self-hosted gateway resource is unlimited in the Premium tier and capped at a single node in the Developer tier.<br/>
<sup>12</sup> This limit does not apply to Developer tier. In the Developer tier, the limit is 2,500.
