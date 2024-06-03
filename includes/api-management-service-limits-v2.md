---
title: API Management service limits - v2 tiers
description: Include file
services: api-management
author: dlepow

ms.service: api-management
ms.topic: include
ms.date: 05/15/2024
ms.author: danlep
ms.custom: Include file
---

<!-- Limits - API Management v2 tiers  -->

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/options/).

| Resource | Basic v2 | Standard v2 |
| ---------| ----------- | ----------- |
| Maximum number of scale units | 10 | 10 |
| Maximum cache size per service instance  | 250 MB | 1 GB |
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
| Maximum number of GraphQL resolvers per service instance | 100 | 100 |
| Maximum number of GraphQL resolvers per API | 100 | 100 |
| Maximum number of APIs per product | 100 | 100 |
| Maximum number of APIs per subscription | 100 | 100 |
| Maximum number of products per subscription | 100 | 100 |
| Maximum number of groups per product | 100 | 100 |
| Maximum number of tags per product | 100 | 100 |
| Concurrent back-end connections<sup>1</sup> per HTTP authority | 2,048 | 2,048 |
| Maximum cached response size | 2 MiB | 2 MiB |
| Maximum policy document size  | 256 KiB | 256 KiB |
| Maximum total request duration | 30 seconds | 30 seconds |
| Maximum request payload size | 1 GiB | 1 GiB |
| Maximum buffered payload size | 2 MiB | 2 MiB |
| Maximum request/response payload size in diagnostic logs | 8,192 bytes | 8,192 bytes | 
| Maximum request URL size<sup>2</sup> | 16,384 bytes | 16,384 bytes |
| Maximum length of URL path segment | 1,024 characters | 1,024 characters  |
| Maximum size of request or response body in [validate-content policy](../articles/api-management/validate-content-policy.md) | 100 KiB |  100 KiB |
| Maximum size of API schema used by [validation policy](../articles/api-management/validation-policies.md) | 4 MB | 4 MB |
| Maximum number of active WebSocket connections per unit<sup>3</sup> | 5,000 | 5,000 |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>3</sup> Up to a maximum of 60,000 connections per service instance.



