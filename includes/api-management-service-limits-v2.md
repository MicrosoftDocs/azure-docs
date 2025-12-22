---
title: API Management service limits - v2 tiers
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 08/12/2025
ms.author: danlep
ms.custom: Include file
---

<!-- Limits - API Management v2 tiers  -->
[!INCLUDE [api-management-service-limits-mitigation](api-management-service-limits-mitigation.md)]


| Resource | Basic v2 | Standard v2 | Premium v2 |
| ---------| ----------- | ----------- | ----------- |
| Scale units | 10 | 10 | 30 |
| Cache size   | 250 MB | 1 GB | 5 GB |
| APIs  (including versions and revisions) | 150 | 500 | 2,500 |
| API operations  | 3,000 | 10,000 | 20,000 |
| Subscriptions  | 500 | 2,000 | 4,000 |
| Products  | 50 | 200 | 400 |
| Users  | 300 | 2,000 | 4,000 |
| Groups  | 20 | 100 | 200 |
| Authorization servers  | 10 | 500 | 500 |
| Policy fragments  | 50 | 50 | 100 |
| OpenID Connect providers  | 10 | 10 | 20 |
| Certificates  | 100 | 100 | 100 |
| Backends  | 100 | 100 | 100 |
| Caches  | 100 | 100 | 100 |
| Named values  | 100 | 100 | 100 |
| Loggers  | 100 | 100 | 100 |
| Schemas  | 100 | 100 | 100 |
| Schemas per API | 100 | 100 | 100 |
| Tags  | 100,000 | 100,000 | 100,000 |
| Tags per API | 500 | 500 | 500 |
| Version sets  | 100 | 100 | 100 |
| Releases per API | 100 | 100 | 100 |
| Operations per API | 100 | 300 | 500 |
| GraphQL resolvers  | 100 | 100 | 100 |
| GraphQL resolvers per API | 100 | 100 | 100 |
| APIs per product | 100 | 100 | 100 |
| Subscriptions per API | 100 | 100 | 100 |
| Subscriptions per product | 100 | 100 | 100 |
| Groups per product | 100 | 100 | 100 |
| Tags per product | 100 | 100 | 100 |
| Concurrent back-end connections<sup>1</sup> per HTTP authority | 2,048 | 2,048 | 2,048 |
| Cached response size | 2 MiB | 2 MiB | 2 MiB |
| Policy document size  | 256 KiB | 256 KiB | 256 KiB |
| Request payload size | 1 GiB | 1 GiB | 1 GiB |
| Buffered payload size | 2 MiB | 2 MiB | 2 MiB |
| Request/response payload size in diagnostic logs | 8,192 bytes | 8,192 bytes | 8,192 bytes | 
| Request URL size<sup>2</sup> | 16,384 bytes | 16,384 bytes | 16,384 bytes |
| Length of URL path segment | 1,024 characters | 1,024 characters  | 1,024 characters |
| Character length of named value | 4,096 characters | 4,096 characters | 4,096 characters |
| Size of request or response body in [validate-content policy](/azure/api-management/validate-content-policy) | 100 KiB |  100 KiB | 100 KiB |
| Size of API schema used by [validation policy](/azure/api-management/validation-policies) | 4 MB | 4 MB | 4 MB |
| Active WebSocket connections per unit<sup>3</sup> | 5,000 | 5,000 | 5,000 |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>3</sup> Up to a maximum of 60,000 connections per service instance.



