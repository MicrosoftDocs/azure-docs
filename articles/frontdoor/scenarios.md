---
title: Accelerate and secure your web application with Azure Front Door - Azure Front Door | Microsoft Docs
description: This article explains how Front Door can help you to build a well architected solution on Azure.
services: front-door
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/28/2022
ms.author: jodowns
---

# Accelerate and secure your web application with Azure Front Door

Azure Front Door is a globally distributed entry point to your application. Front Door provides a wide range of features including content delivery network, traffic acceleration, load balancing, and security.

Consider deploying Front Door in front of any publicly facing web application.

## Well-architected solutions on Azure

The [Azure Well-Architected Framework](/azure/architecture/framework/) describes five pillars of architectural excellence. Azure Front Door helps you to address each of the five pillars by using its built-in features and capabilities.

### Performance efficiency

Front Door provides a powerful content delivery network (CDN) to [cache content at the network edge](front-door-caching.md). Almost all web applications contain cacheable content. Static assets like images and JavaScript files are cacheable. Also, many APIs return responses that can be cached, even for a short duration. Caching helps to improve the performance of your application, and to reduce the load on your application servers.

Additionally, Front Door's global traffic acceleration capabilities help to [improve the performance of dynamic web applications](front-door-traffic-acceleration.md) by routing requests through Microsoft's high-speed backbone network.

### Security

Front Door's web application firewall (WAF) provides a range of security capabilities to your application. [Managed rule sets](../web-application-firewall/afds/waf-front-door-drs.md) scan incoming requests for suspicious content. [Bot protection rules](../web-application-firewall/afds/afds-overview.md#bot-protection-rule-set) identify and respond to traffic from bots. [Geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md) and [rate limiting](../web-application-firewall/afds/waf-front-door-rate-limit.md) features protect your application servers from unexpected traffic.

Because of Front Door's architecture, it can also absorb large [distributed denial of service (DDoS) attacks](front-door-ddos.md) and prevent the traffic from reaching your application.

[Private Link integration](private-link.md) helps you to protect your backend applications, ensuring that traffic can only reach your application by passing through Front Door and its security protections.

### Reliability

Front Door is a global load balancer. Front Door monitors the health of your origin servers, and if an origin becomes unavailable, [Front Door can route requests to an alternative origin](routing-methods.md). You can also use Front Door to spread traffic across your origins to reduce the load on any one origin server.

By using the Front Door cache, you reduce the load on your application servers. If your servers are unavailable, Front Door might be able to continue to serve cached responses until your application recovers.

### Cost optimization

Front Door can help you to reduce the cost of running your Azure solution by using caching. Cached content is returned from global Front Door edge nodes, reducing global bandwidth charges, and reducing the load on - and resources required by - your application server.

### Operational excellence

Front Door can help you to modernize your legacy applications with [HTTP/2 support](front-door-http2.md). The Front Door [rules engine](front-door-rules-engine.md) enables you to change the internal architecture of your solution without affecting your clients.

You can also deploy and configure Front Door by using infrastructure as code (IaC) technologies including Bicep, Terraform, ARM templates, Azure PowerShell, and the Azure CLI.

## Solution architecture

When you deploy a solution that uses Azure Front Door, you should consider how your traffic flows from your client to Front Door, and from Front Door to your origins.

The following diagram illustrates a generic solution architecture using Front Door:

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Azure Front Door routing user traffic to endpoints." lightbox="./media/overview/front-door-overview-expanded.png" border="false":::
<!-- TODO redo this diagram -->

### Client to Front Door

Traffic from your clients first arrives at a Front Door point of presence (PoP). Front Door has a [large number of PoPs](edge-locations-by-region.md) distributed worldwide.

Requests to your application are received by Front Door's PoP, and the clients' TCP and TLS connections terminate. The PoP performs many functions based on the configuration you specify in your Front Door profile, including:
- Protecting your solution against many types of [DDoS attacks](front-door-ddos.md).
- Using your [custom domain name](front-door-custom-domain.md).
- Terminating the [TLS connection](end-to-end-tls.md), and using either a Front Door-managed TLS certificate or a custom TLS certificate.
- Scanning the request for known vulnerabilties, by using the [Front Door WAF](web-application-firewall.md).
- Returning [cached responses](front-door-caching.md), if they're stored at the Front Door PoP and are valid for the request.
- Returning [HTTP redirect responses](front-door-url-redirect.md).
- Selecting the best origin to receive the traffic based on the [routing architecture](front-door-routing-architecture.md).
- Modifying a request by using the [rules engine](front-door-rules-engine.md).

After Front Door finishes processing the inbound request, it either responds directly to the client (for example, when it returns a cached result) or forwards the request to the origin.

### Front Door to origin

Front Door can send traffic to your origin in two different ways: by using Private Link, and by using public IP addresses.

The premium SKU of Front Door supports sending traffic to some origin types by using Private Link. When you configure Private Link for your origin, traffic uses private IP addresses. This approach can be used to ensure that your origin only accepts traffic from your specific Front Door instance, and you can block traffic that came from the internet.

When the Front Door PoP sends requests to your origin by using a public IP address, it initiates a new TCP connection. Because of this behavior, your origin server sees the request originating from Front Door's IP address instead of the client.

Whichever approach you use to send traffic to your origin, it's usually a good practice to configure your origin to expect traffic from your Front Door profile, and to block traffic that doesn't flow through Front Door. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md).

## Response processing

Front Door's PoP also processes the outbound response. Response processing might include the following steps:
- Saving a response to the PoP's cache to accelerate later requests.
- Modifying a response header by using the [rules engine](front-door-rules-engine-actions.md#modify-response-header).

## Next steps

Learn how to [create a Front Door profile](create-front-door-portal.md).
