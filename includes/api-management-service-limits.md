---
title: API Management service limits - classic tiers
description: Include file
services: api-management
author: dlepow

ms.service: api-management
ms.topic: include
ms.date: 03/15/2024
ms.author: danlep
ms.custom: Include file
---

<!-- Limits - API Management classic tiers -->

For certain API Management resources, limits are set only in the Consumption tier; in other API Management classic tiers, where indicated, these resources are unlimited. However, your practical upper limit depends on service configuration including pricing tier, service capacity, number of scale units, policy configuration, API definitions and types, number of concurrent requests, and other factors.

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/options/).

| Resource | Consumption | Developer | Basic | Standard | Premium |
| ---------| ----------- | ----------- | ----------- | ----------- | ------------ |
| Maximum number of scale units | N/A (automatic scaling) | 1 | 2 | 4 | 31 per region |
| Cache size (per unit)  | External only | 10 MiB | 50 MiB | 1 GiB | 5 GiB |
| Concurrent back-end connections<sup>1</sup> per HTTP authority | Unlimited | 1,024 | 2,048 per unit | 2,048 per unit | 2,048 per unit |
| Maximum cached response size | 2 MiB | 2 MiB | 2 MiB | 2 MiB | 2 MiB |
| Maximum policy document size  | 16 KiB | 256 KiB | 256 KiB | 256 KiB | 256 KiB |
| Maximum custom gateway domains per service instance | N/A | 20 | N/A | N/A | 20 |
| Maximum number of CA certificates per service instance | N/A | 10 | 10 | 10 | 10 |
| Maximum number of service instances per Azure subscription | 20 | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum number of subscriptions per service instance | 500 | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum number of client certificates per service instance | 50 | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum number of APIs per service instance | 50 | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum number of API operations per service instance | 1,000 | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum total request duration | 30 seconds | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum request payload size | 1 GiB | Unlimited | Unlimited | Unlimited | Unlimited | 
| Maximum buffered payload size | 2 MiB | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum request/response payload size in diagnostic logs | 8,192 bytes | 8,192 bytes | 8,192 bytes | 8,192 bytes | 8,192 bytes |
| Maximum request URL size<sup>2</sup> | 16,384 bytes | Unlimited | Unlimited | Unlimited | Unlimited |
| Maximum character length of URL path segment | 1,024  | 1,024  | 1,024  | 1,024  | 1,024  |
| Maximum size of API schema used by [validation policy](../articles/api-management/validation-policies.md) | 4 MB | 4 MB | 4 MB | 4 MB | 4 MB |
| Maximum number of [schemas](../articles/api-management/validate-content-policy.md#schemas-for-content-validation) | 100 | 100 | 100 | 100 | 100 |
| Maximum size of request or response body in [validate-content policy](../articles/api-management/validate-content-policy.md) | 100 KiB |  100 KiB | 100 KiB |  100 KiB |  100 KiB |
| Maximum number of self-hosted gateways<sup>3</sup> | N/A | 25 | N/A | N/A | 25 |
| Maximum number of active WebSocket connections per unit<sup>4</sup> | N/A | 2,500 | 5,000 | 5,000 | 5,000 |
| Maximum number of tags supported by an API Management resource|15| 15 | 15 | 15 | 15 |
| Maximum number of credential providers per service instance| 1,000 | 1,000 | 1,000 | 1,000 | 1,000 |
| Maximum number of connections per credential provider| 10,000 | 10,000 | 10,000 | 10,000 | 10,000 |
| Maximum number of access policies per connection | 100 | 100 | 100 | 100 | 100 |
| Maximum number of authorization requests per minute per connection | 250 | 250 | 250 | 250 | 250 |
| Maximum number of [workspaces](../articles/api-management/workspaces-overview.md) per service instance | N/A | N/A | N/A | N/A | 100 |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>3</sup> The number of nodes (or replicas) associated with a self-hosted gateway resource is unlimited in the Premium tier and capped at a single node in the Developer tier.<br/>
<sup>4</sup> Up to a maximum of 60,000 connections per service instance.

