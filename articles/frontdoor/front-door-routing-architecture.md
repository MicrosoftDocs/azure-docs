---
title: Azure Front Door - routing architecture | Microsoft Docs
description: This article helps you understand the global view aspect of Front Door's architecture.
services: front-door
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# Routing architecture overview

The Azure Front Door when it receives your client requests then it either answers them (if caching is enabled) or forwards them to the appropriate application backend (as a reverse proxy).

</br>There are opportunities to optimize the traffic when routing to Azure Front Door as well as when routing to backends.

## <a name = "anycast"></a>Selecting the Front Door environment for traffic routing (Anycast)

Routing to the Azure Front Door environments leverages [Anycast](https://en.wikipedia.org/wiki/Anycast) for both DNS (Domain Name System) and HTTP (Hypertext Transfer Protocol) traffic, so user traffic will go to the closest environment in terms of network topology (fewest hops). This architecture typically offers better round-trip times for end users (maximizing the benefits of Split TCP). Front Door organizes its environments into primary and fallback "rings".  The outer ring has environments that are closer to users, offering lower latencies.  The inner ring has environments that can handle the failover for the outer ring environment in case an issue happens. The outer ring is the preferred target for all traffic, but the inner ring is necessary to handle traffic overflow from the outer ring. In terms of VIPs (Virtual Internet Protocol addresses), each frontend host, or domain served by Front Door is assigned a primary VIP, which is announced by environments in both the inner and outer ring, as well as a fallback VIP, which is only announced by environments in the inner ring. 

</br>This overall strategy ensures that requests from your end users always reach the closest Front Door environment and that even if the preferred Front Door environment is unhealthy then traffic automatically moves to the next closest environment.

## <a name = "splittcp"></a>Connecting to Front Door environment (Split TCP)

[Split TCP](https://en.wikipedia.org/wiki/Performance-enhancing_proxy) is a technique to reduce latencies and TCP problems by breaking a connection that would incur a high round-trip time into smaller pieces.  By placing the Front Door environments closer to end users and terminating TCP connections inside the Front Door environment, one TCP connection with a large round-trip time (RTT) to application backend is split into two TCP connections. The short connection between the end user and the Front Door environment means the connection gets established over three short roundtrips instead of three long round trips, saving latency.  The long connection between the Front Door environment and the backend can be pre-established and reused across multiple end-user calls, again saving the TCP connection time.  The effect is multiplied when establishing a SSL/TLS (Transport Layer Security) connection as there are more round trips to secure the connection.

## Processing request to match a routing rule
After establishing a connection and doing a TLS handshake, when a request lands on a Front Door environment, matching a routing rule is the first step. This match basically is determining from all the configurations in Front Door, which particular routing rule to match the request to. Read about how Front Door does [route matching](front-door-route-matching.md) to learn more.

## Identifying available backends in the backend pool for the routing rule
Once Front Door has a match for a routing rule based on the incoming request and if there is no caching, then the next step is to pull the health probe status for the backend pool associated with the matched route. Read about how Front Door monitors backend health using [Health Probes](front-door-health-probes.md) to learn more.

## Forwarding the request to your application backend
Finally, assuming there is no caching configured, the user request is forwarded to the "best" backend based on your [Front Door routing method](front-door-routing-methods.md) configuration.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
