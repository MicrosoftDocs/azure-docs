---
title: API Management service limits - classic tiers
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 09/09/2025
ms.author: danlep
ms.custom: Include file
---

<!-- Limits - API Management classic tiers -->

Starting March 2026, Azure API Management will apply updated limits to instances in the Classic tiers. 

[!INCLUDE [api-management-service-limits-mitigation](api-management-service-limits-mitigation.md)]

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
| CA certificates<sup>5</sup> | N/A | 10 | 10 | 10 | 10 |
| Client certificates<sup>6</sup> | 50 | 100 | 100 | 100 | 100 |
| APIs (including versions and revisions)<sup>6</sup> | 50 | 150 | 150 | 500 | 2,500 |
| API releases<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| API operations<sup>6</sup> | 1,000 | 3,000 | 3,000 | 10,000 | 20,000 |
| API operations per API<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| API version sets<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| API tags<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| API tags per API<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| API tag descriptions<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| API tag descriptions per API<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| APIs per product<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Backends<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Products<sup>6</sup> | 50 | 50 | 50 | 200 | 400 |
| Subscriptions<sup>6</sup> | N/A | 500 | 500 | 2,000 | 4,000 |
| Subscriptions per user<sup>6</sup> | N/A | 100 | 100 | 100 | 100 |
| Subscriptions per product<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Groups<sup>6</sup> | N/A | 20 | 20 | 100 | 200 |
| Groups per product<sup>6</sup> | N/A | 100 | 100 | 100 | 100 |
| Groups per user<sup>6</sup> | N/A | 100 | 100 | 100 | 100 |
| Users<sup>6</sup> | N/A | 300 | 300 | 2,000 | 4,000 |
| Users per product<sup>6</sup> | N/A | 100 | 100 | 100 | 100 |
| Loggers<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Policy fragments<sup>6</sup> | 50 | 50 | 50 | 50 | 100 |
| Named values<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Private endpoints<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Total request duration | 30 seconds | Unlimited | Unlimited | Unlimited | Unlimited |
| Request payload size | 1 GiB | Unlimited | Unlimited | Unlimited | Unlimited | 
| Buffered payload size | 2 MiB | 500 MiB | 500 MiB | 500 MiB | 500 MiB |
| Request/response payload size in diagnostic logs | 8,192 bytes | 8,192 bytes | 8,192 bytes | 8,192 bytes | 8,192 bytes |
| Request URL size<sup>2</sup> | 16,384 bytes | Unlimited | Unlimited | Unlimited | Unlimited |
| Character length of URL path segment | 1,024  | 1,024  | 1,024  | 1,024  | 1,024  |
| Character length of named value | 4,096  | 4,096  | 4,096  | 4,096  | 4,096  |
| Size of API schema used by [validation policy](../articles/api-management/api-management-policies.md#content-validation) | 4 MB | 4 MB | 4 MB | 4 MB | 4 MB |
| [Schemas](../articles/api-management/validate-content-policy.md#schemas-for-content-validation)<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Schemas per API<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Self-hosted gateways<sup>3</sup> | N/A | 25 | N/A | N/A | 25 |
| OpenID Connect providers | 10 | 10 | 10 | 10 | 10 |
| Active WebSocket connections per unit<sup>4</sup> | N/A | 2,500 | 5,000 | 5,000 | 5,000 |
| Tags<sup>6</sup> | 100| 100 | 100 | 100 | 100 |
| Tags per product<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| Credential providers| 1,000 | 1,000 | 1,000 | 1,000 | 1,000 |
| Connections per credential provider| 10,000 | 10,000 | 10,000 | 10,000 | 10,000 |
| Access policies per connection | 100 | 100 | 100 | 100 | 100 |
| Authorization servers | 10 | 10 | 10 | 500 | 500 |
| Authorization requests per minute per connection | 250 | 250 | 250 | 250 | 250 |
| GraphQL resolvers<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| GraphQL resolvers per API<sup>6</sup> | 100 | 100 | 100 | 100 | 100 |
| [Workspaces](../articles/api-management/workspaces-overview.md) | N/A | N/A | N/A | N/A | 100 |
| APIs per [workspace](../articles/api-management/workspaces-overview.md#workspace-gateway) | N/A | N/A | N/A | N/A | 50 |
| Workspaces per [workspace gateway premium](../articles/api-management/workspaces-overview.md#workspace-gateway) | N/A | N/A | N/A | N/A | 30 |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>3</sup> The number of nodes (or replicas) associated with a self-hosted gateway resource is unlimited in the Premium tier and capped at a single node in the Developer tier.<br/>
<sup>4</sup> Up to a maximum of 60,000 connections.<br/>
<sup>5</sup> This is a hard limit and cannot be adjusted.<br/>
<sup>6</sup> Limit introduced starting March 2026. Existing services that already exceed the limit are not impacted.

