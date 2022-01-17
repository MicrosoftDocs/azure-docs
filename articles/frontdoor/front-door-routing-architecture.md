---
title: Azure Front Door - routing architecture | Microsoft Docs
description: This article helps you understand the global view aspect of Front Door's architecture.
services: front-door
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/17/2022
ms.author: duau
---

# Routing architecture overview

Front Door traffic routing takes place over multiple stages. First, traffic is routed from the client to Front Door. Then, Front Door uses the configuration of your profile to determine the origin to send the traffic to. The Front Door web application firewall, rule set, and caching configuration all affect the routing process.

## Routing process

The routing process includes the following steps:

- A Front Door environment is selected for the request.
- The client opens the connection to the selected Front Door environment.
- Front Door matches the traffic to a Front Door profile based on the request's Host header.
- A TLS connection is established.
- Web application firewall (WAF) rules are evaluated.
- A route is selected for the request based on the Front Door profile's configuration, and an origin group is selected for the request.
- A rule set can optionally override the origin group.
- If caching is enabled and a response is available in the cache, the cached response is returned.
- An origin within the origin group is selected for the request.
- The request is forwarded to the origin.

Each step is described in detail below.

This diagram illustrates the routing architecture:

![Flowchart illustrating the Front Door routing architecture, including each step and decision point.](media/front-door-routing-architecture/flowchart.png)

## <a name = "anycast"></a>Select the Front Door environment for the request (Anycast)

Front Door has over 150 environments globally, located in many countries and regions. Every Front Door environment can serve traffic for any request.

Traffic routed to the Azure Front Door environments uses [Anycast](https://en.wikipedia.org/wiki/Anycast) for both DNS (Domain Name System) and HTTP (Hypertext Transfer Protocol) traffic, which allows for user requests to reach the closest environment in the fewest network hops. This architecture offers better round-trip times for end users by maximizing the benefits of Split TCP. Front Door organizes its environments into primary and fallback "rings". The outer ring has environments that are closer to users, offering lower latencies.  The inner ring has environments that can handle the failover for the outer ring environment in case any issues happen. The outer ring is the preferred target for all traffic and the inner ring is to handle traffic overflow from the outer ring. Each frontend host or domain served by Front Door gets assigned a primary VIP (Virtual Internet Protocol addresses), which gets announced by environments in both the inner and outer ring. A fallback VIP is only announced by environments in the inner ring. 

This architecture ensures that requests from your end users always reach the closest Front Door environment. Even if the preferred Front Door environment is unhealthy all traffic automatically moves to the next closest environment.

## <a name = "splittcp"></a>Connect to Front Door environment (Split TCP)

[Split TCP](https://en.wikipedia.org/wiki/Performance-enhancing_proxy) is a technique to reduce latencies and TCP problems by breaking a connection that would incur a high round-trip time into smaller pieces. With Front Door environments closer to end users, TCP connections terminates inside the Front Door environment. A TCP connection that has a large round-trip time (RTT) to the application backend gets split into two separate connections. The "short connection" between the end user and the Front Door environment means the connection gets established over three short roundtrips instead of three long round trips, which results in saving latency. The "long connection" between the Front Door environment and the backend can be pre-established and then reused across other end users requests save connectivity time. The effect of Split TCP is multiplied when establishing a SSL/TLS (Transport Layer Security) connection as there are more round trips to secure a connection.

## Match request to a Front Door profile

The request's `Host` header is used to match the request to the Front Door profile. If the request is using a [custom domain name](front-door-custom-domain.md), the domain name must be registered with Front Door to enable requests to be matched to your profile.

The client and server perform a TLS handshake using the TLS certificate you've configured for your custom domain name, or by using the Front Door-provided wildcard certificate when the `Host` header ends with `*.azurefd.net`.

## Evaluate WAF rules

If your domain has enabled the Web Application Firewall, the WAF rules are evaluated. If a rule has been violated, Front Door returns an error to the client and the request processing stops.

## Match a routing rule

Front Door matches the request to a route. Learn more about the [route matching process](front-door-route-matching.md).

The route specifies the [origin group](standard-premium/concept-origin.md) that the request should be sent to.

## Process rule sets

Azure Front Door evaluates whether or not you have any [rule sets](front-door-rules-engine.md) defined for the route. If there are rule sets defined, they are executed in the order they're configured. [Rule sets can override the origin group](front-door-rules-engine-actions.md#route-configuration-overrides) specified in a route.

## Return cached response

If the Front Door route has enabled [caching](standard-premium/concept-caching.md) enabled, and the Front Door environment's cache includes a valid response for the request, then Front Door returns the cached response. If caching is disabled or no response is available, the request is forwarded to the origin.

## Select origin

Front Door selects an origin to use within the origin group. Origin selection is based on several factors, including:

- The health of each origin, which Front Door monitors by using [health probes](front-door-health-probes.md).
- The [routing method](front-door-routing-methods.md) for your origin group.
- Whether you have enabled [session affinity](front-door-routing-methods.md#affinity).

## Forward request to origin

Finally, the request is forwarded to the origin.

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
