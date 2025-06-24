---
title: API Management service limits - classic tiers
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 06/24/2025
ms.author: danlep
ms.custom: Include file
---

<!-- Limits - API Management classic tiers -->

<!-- For certain API Management resources, limits are set only in the Consumption tier; in other API Management classic tiers, where indicated, these resources are unlimited. However, your practical upper limit depends on service configuration including pricing tier, service capacity, number of scale units, policy configuration, API definitions and types, number of concurrent requests, and other factors.  -->

Limits in the following table are being introduced starting July 2025.

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/options/).

| Resource | Consumption | Developer | Basic | Standard | Premium |
| ---------| ----------- | ----------- | ----------- | ----------- | ------------ |
| Scale units | N/A (automatic scaling) | 1 | 2 | 4 | 31 per region |
| Service instances per Azure subscription | 20 | Unlimited | Unlimited | Unlimited | Unlimited |
| Caches | 100 | 100 | 100 | 100 | 100 |
| Cache size (per unit)  | External only | 10 MiB | 50 MiB | 1 GiB | 5 GiB |
| Concurrent back-end connections<sup>1</sup> per HTTP authority | Unlimited | 1,024 | 2,048 per unit | 2,048 per unit | 2,048 per unit |
| Cached response size | 2 MiB | 2 MiB | 2 MiB | 2 MiB | 2 MiB |
| Policy document size  | 16 KiB | 256 KiB | 256 KiB | 256 KiB | 256 KiB |
| Custom gateway domains | N/A | 20 | N/A | N/A | 20 |
| CA certificates | N/A | 10 | 10 | 10 | 10 |
| Client certificates | 50 | 100 | 100 | 100 | 100 |
| APIs (including revisions) | 150 | 150 | 150 | 500 | 2,500 |
| API releases | 100 | 100 | 100 | 100 | 100 |
| API operations | 3,000 | 3,000 | 3,000 | 10,000 | 20,000 |
| API operations per API | 100 | 100 | 100 | 100 | 100 |
| API version sets | 100 | 100 | 100 | 100 | 100 |
| API tags | 100 | 100 | 100 | 100 | 100 |
| API tags per API | 100 | 100 | 100 | 100 | 100 |
| API tag descriptions | 100 | 100 | 100 | 100 | 100 |
| API tag descriptions per API | 100 | 100 | 100 | 100 | 100 |
| APIs per product | 100 | 100 | 100 | 100 | 100 |
| Backends | 100 | 100 | 100 | 100 | 100 |
| Products | 50 | 50 | 50 | 200 | 400 |
| Subscriptions | N/A | 500 | 500 | 2,000 | 4,000 |
| Subscriptions per user | N/A | 100 | 100 | 100 | 100 |
| Subscriptions per product | 100 | 100 | 100 | 100 | 100 |
| Groups | N/A | 20 | 20 | 100 | 200 |
| Groups per product | N/A | 100 | 100 | 100 | 100 |
| Groups per user | N/A | 100 | 100 | 100 | 100 |
| Users | N/A | 300 | 300 | 2,000 | 4,000 |
| Users per product | N/A | 100 | 100 | 100 | 100 |
| Loggers | 100 | 100 | 100 | 100 | 100 |
| Policy fragments | 50 | 50 | 50 | 50 | 100 |
| Named values | 100 | 100 | 100 | 100 | 100 |
| Private endpoints | 100 | 100 | 100 | 100 | 100 |
| Total request duration | 30 seconds | Unlimited | Unlimited | Unlimited | Unlimited |
| Request payload size | 1 GiB | Unlimited | Unlimited | Unlimited | Unlimited | 
| Buffered payload size | 2 MiB | 500 MiB | 500 MiB | 500 MiB | 500 MiB |
| Request/response payload size in diagnostic logs | 8,192 bytes | 8,192 bytes | 8,192 bytes | 8,192 bytes | 8,192 bytes |
| Request URL size<sup>2</sup> | 16,384 bytes | Unlimited | Unlimited | Unlimited | Unlimited |
| Character length of URL path segment | 1,024  | 1,024  | 1,024  | 1,024  | 1,024  |
| Character length of named value | 4,096  | 4,096  | 4,096  | 4,096  | 4,096  |
| Size of API schema used by [validation policy](../articles/api-management/validation-policies.md) | 4 MB | 4 MB | 4 MB | 4 MB | 4 MB |
| [Schemas](../articles/api-management/validate-content-policy.md#schemas-for-content-validation) | 100 | 100 | 100 | 100 | 100 |
| Schemas per API | 100 | 100 | 100 | 100 | 100 |
| Size of request or response body in [validate-content policy](../articles/api-management/validate-content-policy.md) | 100 KiB | 100 KiB | 100 KiB | 100 KiB | 100 KiB |
| Self-hosted gateways<sup>3</sup> | N/A | 25 | N/A | N/A | 25 |
| OpenID Connect providers | 10 | 10 | 10 | 10 | 10 |
| Active WebSocket connections per unit<sup>4</sup> | N/A | 2,500 | 5,000 | 5,000 | 5,000 |
| Tags | 100| 100 | 100 | 100 | 100 |
| Tags per product | 100 | 100 | 100 | 100 | 100 |
| Credential providers| 1,000 | 1,000 | 1,000 | 1,000 | 1,000 |
| Connections per credential provider| 10,000 | 10,000 | 10,000 | 10,000 | 10,000 |
| Access policies per connection | 100 | 100 | 100 | 100 | 100 |
| Authorization servers | 10 | 10 | 10 | 500 | 500 |
| Authorization requests per minute per connection | 250 | 250 | 250 | 250 | 250 |
| GraphQL resolvers | 100 | 100 | 100 | 100 | 100 |
| GraphQL resolvers per API | 100 | 100 | 100 | 100 | 100 |
| [Workspaces](../articles/api-management/workspaces-overview.md) | N/A | N/A | N/A | N/A | 100 |
| APIs per [workspace](../articles/api-management/workspaces-overview.md#workspace-gateway) | N/A | N/A | N/A | N/A | 50 |
| Workspaces per [workspace gateway premium](../articles/api-management/workspaces-overview.md#workspace-gateway) | N/A | N/A | N/A | N/A | 30 |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>3</sup> The number of nodes (or replicas) associated with a self-hosted gateway resource is unlimited in the Premium tier and capped at a single node in the Developer tier.<br/>
<sup>4</sup> Up to a maximum of 60,000 connections.

<!-- Uncliear limits in table:

APIs (including revisions)?
APIs per product
Operations
-->