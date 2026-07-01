---
title: API Management gateway runtime limits
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 04/08/2026
ms.author: danlep
ms.custom: Include file
---

<!-- Constraints - API Management gateways  -->


| Runtime limit | Classic | V2 | Consumption |
| ---------| ----------- | ----------- | ----------- |
| Concurrent back-end connections<sup>1</sup> per HTTP authority | 2,048<sup>2</sup> per unit | 2,048 | Unlimited |
| Cached response size | 2 MiB | 2 MiB | 2 MiB |
| Policy document size  | 512 KiB | 512 KiB | 16 KiB |
| Request payload size | Unlimited | 1 GiB | 1 GiB |
| Buffered payload size | 500 MiB | 2 MiB | 2 MiB |
| Request/response payload size in diagnostic logs | 8,192 bytes | 8,192 bytes | 8,192 bytes |
| Request URL size<sup>3</sup> | Unlimited | 16,384 bytes | 16,384 bytes |
| Length of URL path segment | 1,024 characters | 1,024 characters | 1,024 characters |
| Length of named value | 4,096 characters | 4,096 characters | 4,096 characters |
| Size of request or response body in [validate-content policy](/azure/api-management/validate-content-policy) | 100 KiB | 100 KiB | 100 KiB |
| Size of API schema used by [validation policy](/azure/api-management/validation-policies) | 4 MB | 4 MB | 4 MB |
| Total request duration | Unlimited | 30 seconds | 30 seconds |
| Active WebSocket connections per unit<sup>4</sup> | 5,000 | 5,000 | N/A |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Limit is 1,024 in the Developer tier.<br/>
<sup>3</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>4</sup> Up to a maximum of 60,000 connections per service instance.

