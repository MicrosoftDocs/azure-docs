---
title: Azure Front Door Service | Microsoft Docs
description: This article provides an overview of Azure Front Door. Find out if it is the right choice for load balancing user traffic for your application.
services: frontdoor
documentationcenter: ''
author: sharad4u
editor: ''
ms.service: frontdoor
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/29/2018
ms.author: sharadag
# customer intent: As an IT admin, I want to learn about Front Door and what I can use it for. 
---

# What is Azure Front Door Service?
Azure Front Door Service enables you to define, manage, and monitor the global routing for your web traffic by optimizing for best performance and instant global failover for high availability. With Front Door, you can transform your global (multi-region) consumer and enterprise applications into robust, high-performance personalized modern applications, APIs, and content that reach a global audience with Azure.

Front Door works at Layer 7 or HTTP/HTTPS layer and uses anycast protocol with split TCP and Microsoft's global network for improving global connectivity. So, per your routing method selection in the configuration, you can ensure that Front Door is routing your client requests to the fastest and most available application backend. An application backend is any Internet-facing service hosted inside or outside of Azure. Front Door provides a range of [traffic-routing methods](front-door-routing-methods.md) and [backend health monitoring options](front-door-health-probes.md) to suit different application needs and automatic failover models. Similar to [Traffic Manager](../traffic-manager/traffic-manager-overview.md), Front Door is resilient to failures, including the failure of an entire Azure region.

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. If you are looking for a DNS based global routing and do **not** have requirements for Transport Layer Security (TLS) protocol termination ("SSL offload") or per-HTTP/HTTPS request, application-layer processing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md). If you are looking for load balancing between your servers in a region, for application layer, review [Application Gateway](../application-gateway/application-gateway-introduction.md) and for network layer load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md). Your end-to-end scenarios might benefit from combining these solutions as needed.

The following features are included with Front Door:

## Accelerate application performance
Using split TCP-based anycast protocol, Front Door ensures that your end users promptly connect to the nearest Front Door POP (Point of Presence). Using Microsoft's global network for connecting to your application backends from Front Door POPs, ensure higher availability and reliability while maintaining performance. This connectivity to your backend is also based on least network latency. Learn more about Front Door routing techniques like [Split TCP](front-door-routing-architecture.md#splittcp) and [Anycast protocol](front-door-routing-architecture.md#anycast).

## Increase application availability with smart health probes

Front Door delivers high availability for your critical applications using its smart health probes, monitoring your backends for both latency and availability and providing instant automatic failover when a backend goes down. So, you can run planned maintenance operations on your applications without downtime. Front Door directs traffic to alternative backends while the maintenance is in progress.

## URL-based routing
URL Path Based Routing allows you to route traffic to backend pools based on URL paths of the request. One of the scenarios is to route requests for different content types to different backend pools.

For example, requests for `http://www.contoso.com/users/*` are routed to UserProfilePool, and `http://www.contoso.com/products/*` are routed to ProductInventoryPool.  Front Door allows even more complex route matching scenarios using best match algorithm and so if none of the path patterns match then your default routing rule for `http://www.contoso.com/*` is selected and the traffic is directed to default catch-all routing rule. Learn more at [Route Matching](front-door-route-matching.md).

## Multiple-site hosting
Multiple-site hosting enables you to configure more than one web site on the same Front Door configuration. This feature allows you to configure a more efficient topology for your deployments by adding different web sites to a single Front Door configuration. Based on your application's architecture, you can configure Azure Front Door Service to either direct each web site to its own backend pool or have various web sites directed to the same backend pool. For example, Front Door can serve traffic for `images.contoso.com` and `videos.contoso.com` from two backend pools called ImagePool and VideoPool. Alternatively you can configure both the front-end hosts to direct traffic to a single backend pool called MediaPool.

Similarly, you can have two different domains `www.contoso.com` and `www.fabrikam.com` configured on the same Front Door.

## Session affinity
The cookie-based session affinity feature is useful when you want to keep a user session on the same application backend. By using Front Door managed cookies, subsequent traffic from a user session gets directed to the same application backend for processing. This feature is important in cases where session state is saved locally on the backend for a user session.

## Secure Sockets Layer (SSL) termination
Front Door supports SSL termination at the edge that is, individual users can set up SSL connection with Front Door environments instead of establishing it over long haul connections with the application backend. Additionally, Front Door supports both HTTP as well as HTTPS connectivity between Front Door environments and your backends. So, you can also set up end-to-end SSL encryption. For example, if Front Door for your application workload receives over 5000 requests in a minute, due to warm connection reuse, for active services, it will only establish say about 500 connections with your application backend, thereby reducing significant load from your backends.

## Custom domains and certificate management
When you use Front Door to deliver content, a custom domain is necessary if you would like your own domain name to be visible in your Front Door URL. Having a visible domain name can be convenient for your customers and useful for branding purposes.
Front Door also supports HTTPS for custom domain names. Use this feature by either choosing Front Door managed certificates for your traffic or uploading your own custom SSL certificate.

## Application layer security
Azure Front Door allows you to author custom web application firewall (WAF) rules for access control to protect your HTTP/HTTPS workload from exploitation based on client IP addresses, country code, and http parameters. Additionally, Front Door also enables you to create rate limiting rules to battle malicious bot traffic. 

Front Door platform itself is protected by [Azure DDoS Protection](../virtual-network/ddos-protection-overview.md) Basic. For further protection, Azure DDoS Protection Standard may be enabled at your VNETs and safeguard resources from network layer (TCP/UDP) attacks via auto tuning and mitigation. Front Door is a layer 7 reverse proxy, it only allows web traffic to pass through to backends and block other types of traffic by default.

## URL rewrite
Front Door supports [URL rewrite](front-door-url-rewrite.md) by allowing you to configure an optional Custom Forwarding Path to use when constructing the request to forward to the backend. Front Door further allows you to configure Host header to be sent when forwarding the request to your backend.

## Protocol support - IPv6 and HTTP/2 traffic
Azure Front Door natively supports end-to-end IPv6 connectivity and also HTTP/2 protocol. 

The HTTP/2 protocol enables full-duplex communication between application backends and a client over a long-running TCP connection. HTTP/2 allows for a more interactive communication between the backend and the client, which can be bidirectional without the need for polling as required in HTTP-based implementations. HTTP/2 protocol has low overhead, unlike HTTP, and can reuse the same TCP connection for multiple request or responses resulting in a more efficient utilization of resources. Learn more about [HTTP/2 support in Azure Front Door Service](front-door-http2.md).

## Pricing

For pricing information, see [Front Door Pricing](https://azure.microsoft.com/pricing/details/frontdoor/).

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
