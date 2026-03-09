---
title: API Management service limits - classic and v2 tiers
description: Include file
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: include
ms.date: 02/12/2026
ms.author: danlep
ms.custom: Include file
---

<!-- Limits - API Management classic and v2 tiers -->

> [!NOTE]
> * Limits are per service instance unless stated otherwise.
>
> * When counting the number of API-related resources (such as API operations and tags), API Management also includes API versions and revisions.
>

| Entity/Resource | Consumption | Developer | Basic/<br/>Basic v2 | Standard/<br/>Standard v2 | Premium/<br/>Premium v2 |
|-----------------|-------------|-----------|-------|----------|---------| 
| API operations | 3,000 | 3,000 | 10,000 | 50,000 | 75,000 |
| API tags | 1,500 | 1,500 | 1,500 | 2,500 | 15,000 |
| Named values | 5,000 | 5,000 | 5,000 | 10,000 | 18,000 |
| Loggers | 100 | 100 | 100 | 200 | 400 |
| Products | 100 | 100 | 200 | 500 | 2,000 |
| Subscriptions | N/A | 10,000 | 15,000 | 25,000 | 75,000 |
| Users | N/A | 20,000 | 20,000 | 50,000 | 75,000 |
| Workspaces per workspace gateway | N/A | N/A | N/A | N/A | 30 |
| Self-hosted gateways | N/A | 5 | N/A | N/A | 100<sup>1</sup> |

<sup>1</sup> Applies to Premium tier only.
