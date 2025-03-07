---
title: Azure Front Door (classic) overview
description: This article provides an overview of the Azure Front Door (classic) service.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: overview
ms.date: 11/15/2024
ms.author: duau
# Customer intent: As an IT admin, I want to learn about Front Door and what I can use it for.
---

# What is Azure Front Door (classic)?

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

Azure Front Door (classic) is a global, scalable entry-point that uses the Microsoft global edge network to deliver fast, secure, and highly scalable web applications. It enables you to transform your global consumer and enterprise applications into robust, high-performing, and personalized modern applications that reach a global audience through Azure.

:::image type="content" source="./media/front-door-overview/front-door-visual-diagram.png" alt-text="Diagram of Azure Front Door (classic) routing user traffic to endpoints.":::

Front Door (classic) operates at Layer 7 (HTTP/HTTPS layer) using anycast protocol with split TCP and Microsoft's global network to enhance global connectivity. Depending on your routing method, Front Door (classic) ensures that client requests are routed to the fastest and most available application backend. An application backend can be any Internet-facing service hosted inside or outside of Azure. Front Door (classic) offers various [traffic-routing methods](front-door-routing-methods.md) and [backend health monitoring options](front-door-health-probes.md) to meet different application needs and support automatic failover scenarios. Similar to [Traffic Manager](../traffic-manager/traffic-manager-overview.md), Azure Front Door (classic) is resilient to failures, including failures affecting an entire Azure region.

> [!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for various scenarios:
> * For DNS-based global routing without the need for Transport Layer Security (TLS) protocol termination ("SSL offload") or per-HTTP/HTTPS request/application-layer processing, consider [Traffic Manager](../traffic-manager/traffic-manager-overview.md).
> * For application layer load balancing within a region, consider [Application Gateway](../application-gateway/overview.md).
> * For network layer load balancing, consider [Load Balancer](../load-balancer/load-balancer-overview.md).
> 
> Combining these solutions may benefit your end-to-end scenarios. For a comparison of Azure load-balancing options, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).

## Why use Azure Front Door (classic)?

Azure Front Door (classic) allows you to build, operate, and scale dynamic web applications and static content efficiently. It optimizes global web traffic routing for top-tier end-user performance and reliability through quick global failover. Key features include:

* Accelerated application performance using **[split TCP](front-door-traffic-acceleration.md?pivots=front-door-classic#connect-to-the-front-door-edge-location-split-tcp)** and **[anycast protocol](front-door-traffic-acceleration.md?pivots=front-door-classic#select-the-front-door-edge-location-for-the-request-anycast)**.
* Intelligent **[health probe](front-door-health-probes.md)** monitoring for backend resources.
* **[URL-path based](front-door-route-matching.md?pivots=front-door-classic)** routing for requests.
* Hosting multiple websites for efficient application infrastructure.
* Cookie-based **[session affinity](front-door-routing-methods.md#affinity)**.
* **[SSL offloading](front-door-custom-domain-https.md)** and certificate management.
* Custom **[domain](front-door-custom-domain.md)** definition.
* Application security with integrated **[Web Application Firewall (WAF)](../web-application-firewall/overview.md)**.
* HTTP to HTTPS redirection with **[URL redirect](front-door-url-rewrite.md?pivots=front-door-classic)**.
* Custom forwarding paths with **[URL rewrite](front-door-url-rewrite.md?pivots=front-door-classic)**.
* Native support for end-to-end IPv6 connectivity and **[HTTP/2 protocol](front-door-http2.md)**.

## Pricing

For pricing details, see [Front Door Pricing](https://azure.microsoft.com/pricing/details/frontdoor/). For service level agreements, see [SLA for Azure Front Door](https://azure.microsoft.com/support/legal/sla/frontdoor/v1_0/).

## What's new?

Subscribe to the RSS feed and view the latest Azure Front Door feature updates on the [Azure Updates](https://azure.microsoft.com/updates?filters=%5B%22Azure+Front+Door%22%5D) page.

## Next steps

- Learn how to [create a Front Door (classic)](quickstart-create-front-door.md).
- Learn about [how Front Door (classic) works](front-door-routing-architecture.md?pivots=front-door-classic).
