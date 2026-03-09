---
title: API Management gateway runtime limits
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 02/05/2026
ms.author: danlep
ms.custom: Include file
---

<!-- Constraints - API Management gateways  -->


| Runtime limit | Value | 
| ---------| ----------- | 
| Concurrent back-end connections<sup>1</sup> per HTTP authority | 2,048 |
| Cached response size | 2 MiB |
| Policy document size  | 256 KiB |
| Request payload size | 1 GiB |
| Buffered payload size | 2 MiB |
| Request/response payload size in diagnostic logs | 8,192 bytes |
| Request URL size<sup>2</sup> | 16,384 bytes |
| Length of URL path segment | 1,024 characters |
| Character length of named value | 4,096 characters |
| Size of request or response body in [validate-content policy](/azure/api-management/validate-content-policy) | 100 KiB |
| Size of API schema used by [validation policy](/azure/api-management/validation-policies) | 4 MB |
| Active WebSocket connections per unit<sup>3</sup> | 5,000 |

<sup>1</sup> Connections are pooled and reused unless explicitly closed by the backend.<br/>
<sup>2</sup> Includes an up to 2048-bytes long query string.<br/>
<sup>3</sup> Up to a maximum of 60,000 connections per service instance.



