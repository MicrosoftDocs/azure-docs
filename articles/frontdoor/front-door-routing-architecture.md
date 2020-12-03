---
title: Azure Front Door - routing architecture | Microsoft Docs
description: This article helps you understand the global view aspect of Front Door's architecture.
services: front-door
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/28/2020
ms.author: duau
---

# Routing architecture overview

When Azure Front Door receives your client requests, it will do one of two things. Either answers them if you enable caching or forwards them to the appropriate application backend as a reverse proxy.

## <a name = "anycast"></a>Selecting the Front Door environment for traffic routing (Anycast)

Traffic routed to the Azure Front Door environments uses [Anycast](https://en.wikipedia.org/wiki/Anycast) for both DNS (Domain Name System) and HTTP (Hypertext Transfer Protocol) traffic, which allows for user requests to reach the closest environment in the fewest network hops. This architecture offers better round-trip times for end users by maximizing the benefits of Split TCP. Front Door organizes its environments into primary and fallback "rings". The outer ring has environments that are closer to users, offering lower latencies.  The inner ring has environments that can handle the failover for the outer ring environment in case any issues happen. The outer ring is the preferred target for all traffic and the inner ring is to handle traffic overflow from the outer ring. Each frontend host or domain served by Front Door gets assigned a primary VIP (Virtual Internet Protocol addresses), which gets announced by environments in both the inner and outer ring. A fallback VIP is only announced by environments in the inner ring. 

This architecture ensures that requests from your end users always reach the closest Front Door environment. Even if the preferred Front Door environment is unhealthy all traffic automatically moves to the next closest environment.

## <a name = "splittcp"></a>Connecting to Front Door environment (Split TCP)

[Split TCP](https://en.wikipedia.org/wiki/Performance-enhancing_proxy) is a technique to reduce latencies and TCP problems by breaking a connection that would incur a high round-trip time into smaller pieces. With Front Door environments closer to end users, TCP connections terminates inside the Front Door environment. A TCP connection that has a large round-trip time (RTT) to the application backend gets split into two separate connections. The "short connection" between the end user and the Front Door environment means the connection gets established over three short roundtrips instead of three long round trips, which results in saving latency. The "long connection" between the Front Door environment and the backend can be pre-established and then reused across other end users requests save connectivity time. The effect of Split TCP is multiplied when establishing a SSL/TLS (Transport Layer Security) connection as there are more round trips to secure a connection.

## Processing request to match a routing rule
After establishing a connection and completing a TLS handshake, the first step after a request lands on a Front Door environment is to  match it to routing rule. The matching is determined by configurations on Front Door to which particular routing rule to match the request to. Read about how Front Door does [route matching](front-door-route-matching.md) to learn more.

## Identifying available backends in the backend pool for the routing rule
Once Front Door has matched a routing rule for an incoming request, the next step is to get health probe status for the backend pool associated with the routing rule if there's no caching. Read about how Front Door monitors backend health using [Health Probes](front-door-health-probes.md) to learn more.

## Forwarding the request to your application backend
Finally, assuming caching isn't configured, the user request is forwarded to the "best" backend based on your [routing method](front-door-routing-methods.md) configuration.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
