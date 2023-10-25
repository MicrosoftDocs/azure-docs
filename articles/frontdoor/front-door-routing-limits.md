---
title: Routing limits
titleSuffix: Azure Front Door
description: This article helps you understand the composite limits around routing for Azure Front Door.
services: front-door
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 12/08/2022
ms.author: jodowns
---

# Front Door routing limits

Each Front Door profile has a *composite route limit*.

Your Front Door profile's composite route metric is derived from the number of routes, as well as the front end domains, protocols, and paths associated with that route.

The composite route metric for each Front Door profile can't exceed 5000.

> [!TIP]
> Most Front Door profiles don't approach the composite route limit. However, if you have a large Front Door profiles, consider whether you could exceed the limit and plan accordingly.

The number of origin groups, origins, and endpoints don't affect your composite routing limit. However, there are other limits that apply to these resources. For more information, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits).

## Calculate your profile's composite route metric

Follow these steps to calculate the composite route metric for your Front Door profile:

1. Select a route from your profile.
   1. Multiply the number of HTTP domains by the number of HTTP paths.
   1. Multiply the number of HTTPS domains by the number of HTTPS paths.
   1. Add the results of steps 1a and 1b together to give the composite route metric for this individual route.
1. Repeat these steps for each route in your profile.

Add together all of the composite route metrics for each route. This is your profile's composite route metric.

### Example

Suppose you have have two routes in your Front Door profile. The routes are named *Route 1* and *Route 2*. You plan to configure the routes as follows:
* *Route 1* will have 50 domains associated to it, and requires HTTPS for all inbound requests. *Route 1* specifies 80 paths.
* *Route 2* will have 25 domains associated to it. *Route 2* specifies 25 paths, and supports both the HTTP and HTTPS protocols.

The following calculation illustrates how to determine the composite route metric for this scenario:

```
Profile composite route metric = Route 1 composite route metric + Route 2 composite route metric
= Route 1 [HTTPS (50 Domains * 80 Paths)] + Route 2 [HTTP (25 Domains * 25 Paths) + HTTPS(25 Domains * 25 Paths)]
= [50 * 80] + [(25 * 25) + (25 * 25)]
= 5250
```

The calculated metric of 5250 exceeds the limit of 5000, so you can't configure a Front Door profile in this way.

## Mitigation

If your profile's composite route metric exceed 5000, consider the following mitigation strategies:

- Deploy multiple Front Door profiles, and spread your routes across them. The composite route limit applies within a single profile.
- Use [wildcard domains](front-door-wildcard-domain.md) instead of specifying subdomains individually, which might help to reduce the number of domains in your profile.
- Require HTTPS for inbound traffic, which reduces the number of HTTP routes in your profile and also improves your solution's security.

## Next steps

Learn how to [create a Front Door](quickstart-create-front-door.md).
