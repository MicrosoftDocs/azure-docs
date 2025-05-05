---
title: Include file
description: Include file
author: greg-lindsay
ms.topic: include
ms.date: 05/05/2025
ms.author: greglin
ms.custom: include file
---

#### Resource limits

| Resource | Limit |
| --- | --- |
| Profiles per subscription |200 <sup>1</sup> |
| Endpoints per profile |200 |

<sup>1</sup>If you need to increase these limits, contact Azure Support.

#### Default throttling limits

To ensure reliable performance and fair usage, Azure Traffic Manager enforces throttling on control plane APIs. These limits are applied per Azure subscription, typically over a 20-second interval. 

Exceeding limits returns an HTTP 429 (too many requests) with a `retry-after` header.  

Throttling does not affect health checks or traffic routing. 

##### Profiles

| Operation | Limit (per minute) |
| --- | --- |
| Create/update | 600 |
| Get | 450 |
| Delete | 150 |
| List in resource group or subscription | 450 |
| Check DNS name availability | 300 |

##### Endpoints

| Operation | Limit (per minute) |
| --- | --- |
| Create/update/delete | 300 |
| Get | 1500 |

##### Metrics & heatmap

| Operation | Limit (per minute) |
| --- | --- |
| Get/create/delete user metrics key | 150 |
| Get heat map | 150 |

##### Geo hierarchy

| Operation | Limit (per minute) |
| --- | --- |
| Get | 150 |