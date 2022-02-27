---
title: Azure Front Door - routing limits | Microsoft Docs
description: This article helps you understand the composite limits around routing for Azure Front Door.
services: front-door
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/27/2022
ms.author: jodowns
---

# Front Door routing limits

Each Front Door profile has a *composite route limit*.

Your Front Door profile's composite route metric is derived from the number of routes, as well as the front end domains, protocols, and paths associated with that route.

The composite route metric for each Front Door profile can't exceed 5000.

Most Front Door deployments don't approach this limit. However, if you have a large Front Door deployment, consider whether you could exceed the limit.

## Calculate your composite route metric

Use the following formula to calculate the composite route metric for your Front Door profile:

```
Composite route metric = [Route1 [HTTP (#Domains * #Paths)] + Route1 [HTTPS (#Domains * #Paths)] + Route2 [HTTP (#Domains * #Paths)]+ HTTPS(#Domains * #Paths)] +… [RouteN [HTTP (#Domains * #Paths)]+ RouteN [HTTPS (#Domains * #Paths)]
```

### Example

Suppose you have have two routes in your Front Door profile. The routes are named *Route1* and *Route2*. You want to configure the routes as follows:
* *Route1* will have 50 domains associated to it, and requires HTTPS for all inbound requests. *Route1* specifies 80 paths.
* *Route2* will have 25 domains associated to it. *Route2* specifies 25 paths, and supports both the HTTP and HTTPS protocols.

The following calculation illustrates how to determine the composite route metric for this scenario:

```
= Route1 [HTTPS(50 Domains*80 Paths)] + Route2 [HTTP (25 Domains*25 Paths) + HTTPS(25 Domains*25 Paths)]

= (50*80) + [(25*25) + (25*25)]

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
