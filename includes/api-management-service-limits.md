---
title: API Manaqement service limits
description: Include file
services: api-management
author: dlepow

ms.service: api-management
ms.topic: include
ms.date: 03/15/2024
ms.author: danlep
ms.custom: Include file
---

### Limits - API Management classic tiers

For certain resources, limits are set only in the Consumption tier; in other API Management classic tiers, API Management doesn't set a limit, indicated by "no limit". However, your practical upper limit depends on service configuration including pricing tier, service capacity, number of scale units, policy configuration, API definitions and types, number of concurrent requests, and other factors.

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/options/).

| Resource | Consumption | Developer | Basic | Standard | Premium |
| ---------| ----------- | ----------- | ----------- | ----------- | ------------ |
| Maximum number of scale units | N/A (automatic scaling) | 1 | 2 | 4 | 31 per region |
| Cache size (per unit)  | External only | 10 MiB | 50 MiB | 1 GiB | 5 GiB | 5 GiB |
| Concurrent back-end connections<sup>3</sup>  per HTTP authority | no limit | 1,024 | 2,048 per unit | 2,048 per unit | 2,048 per unit |
| Maximum cached response size | 2 MiB | 2 MiB | 2 MiB | 2 MiB | 2 MiB |
| Maximum policy document size  | 16 KiB | 256 KiB | 256 KiB | 256 KiB | 256 KiB |
| Maximum custom gateway domains per service instance | 1 | 20 | 1 | 1 | 20 |
| Maximum number of CA certificates per service instance | N/A | 10 | 10 | 10 | 10 |
| Maximum number of service instances per Azure subscription | 20 | no limit | no limit | no limit | no limit |
| Maximum number of subscriptions per service instance | 500 | no limit | no limit | no limit | no limit |
| Maximum number of client certificates per service instance | 50 | no limit | no limit | no limit | no limit |
| Maximum number of APIs per service instance | 50 | no limit | no limit | no limit | no limit |
| Maximum number of API operations per service instance | 1,000 | no limit | no limit | no limit | no limit |
| Maximum total request duration | 30 seconds | no limit | no limit | no limit | no limit |
| Maximum request payload size | 1 GiB | no limit | no limit | no limit | no limit | 
| Maximum buffered payload size | 2 MiB | no limit | no limit | no limit | no limit |
| Maximum request/response payload size in diagnostic logs | 8,192 bytes |
| Maximum request URL size | 16,384 bytes | no limit | no limit | no limit | no limit |
| Maximum character length of URL path segment<sup>10</sup> | 1,024  | 1,024  | 1,024  | 1,024  | 1,024  |
| Maximum size of API schema used by [validation policy](../articles/api-management/validation-policies.md)<sup>10</sup> | 4 MB | 4 MB | 4 MB | 4 MB | 4 MB |
| Maximum number of [schemas](../articles/api-management/validate-content-policy.md#schemas-for-content-validation)<sup>10</sup> | 100 | 100 | 100 | 100 | 100 |
| Maximum size of request or response body in [validate-content policy](../articles/api-management/validate-content-policy.md)<sup>10</sup> | 100 KiB |  100 KiB | 100 KiB |  100 KiB |  100 KiB |
| Maximum number of self-hosted gateways<sup>11</sup> | 0 | 25 | 0 | 0 | 25 |
| Maximum number of active WebSocket connections per unit | 5,000 | 2,500 | 5,000 | 5,000 | 5,000 |
| Maximum number of tags supported by an API Management resource|15| 15 | 15 | 15 | 15 |
| Maximum number of credential providers per service instance| 1,000 | 1,000 | 1,000 | 1,000 | 1,000 |
| Maximum number of connections per credential provider| 10,000 | 10,000 | 10,000 | 10,000 | 10,000 |
| Maximum number of access policies per connection | 100 | 100 | 100 | 100 | 100 |
| Maximum number of authorization requests per minute per connection | 250 | 250 | 250 | 250 | 250 |
| Maximum number of [workspaces](../articles/api-management/workspaces-overview.md) per service instance | 0 | 0 | 0 | 0 | 100 |

<sup>3</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>10</sup> To increase this limit, contact [support](https://azure.microsoft.com/support/options/).<br/>
<sup>11</sup> To raise this limit contact [support](https://azure.microsoft.com/support/options/). Note, that the number of nodes (or replicas) associated with a self-hosted gateway resource is unlimited in the Premium tier and capped at a single node in the Developer tier.<br/>

### Limits - API Management v2 tiers

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/options/).

| Resource | Basic v2 | Standard v2 |
| ---------| ----------- | ----------- |
| Maximum number of APIs per service instance | 150 | 500 |
| Maximum number of API operations per service instance | 3,000 | 10,000 |
| Maximum number of subscriptions per service instance | 500 | 2,000 |
| Maximum number of products per service instance | 50 | 200 |
| Maximum number of users per service instance | 300 | 2,000 |
| Maximum number of groups per service instance | 20 | 100 |
| Maximum number of authorization servers per service instance | 10 | 500 |
| Maximum number of policy fragments per service instance | 50 | 50 |
| Maximum number of OpenID Connect providers per service instance | 10 | 10 |
| Maximum number of certificates per service instance | 100 | 100 |
| Maximum number of backends per service instance | 100 | 100 |
| Maximum number of caches per service instance | 100 | 100 |
| Maximum number of named values per service instance | 100 | 100 |
| Maximum number of loggers per service instance | 100 | 100 |
| Maximum number of schemas per service instance | 100 | 100 |
| Maximum number of schemas per API | 100 | 100 |
| Maximum number of tags per service instance | 100 | 100 |
| Maximum number of tags per API | 100 | 100 |
| Maximum number of version sets per service instance | 100 | 100 |
| Maximum number of releases per API | 100 | 100 |
| Maximum number of operations per API | 100 | 100 |
| Maximum number of subscriptions per API | 100 | 100 |
| Maximum number of GraphQL resolvers per service instance | 100 | 100 |
| Maximum number of GraphQL resolvers per API | 100 | 100 |
| Maximum number of APIs per product | 100 | 100 |
| Maximum number of groups per product | 100 | 100 |
| Maximum number of tags per product | 100 | 100 |
| Maximum policy document size  | 256 KiB | 256 KiB |






