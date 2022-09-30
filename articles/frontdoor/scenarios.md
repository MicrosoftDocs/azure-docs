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
ms.date: 09/15/2022
ms.author: jodowns
---

# Accelerate and secure your web application with Azure Front Door

Azure Front Door is...

Consider deploying Front Door in conjunction with any publicly facing web application.

## Well-architected solutions on Azure

The [Azure Well-Architected Framework](/azure/architecture/framework/) describes five pillars of architectural excellence. Azure Front Door helps you to address each of the five pillars by using its built-in features and capabilities.

### Performance efficiency

Front Door provides a powerful content delivery network (CDN) to [cache content at the network edge](front-door-caching.md). Almost all web applications contain cacheable content. Static assets like images and JavaScript files are cacheable. Also, many APIs return responses that can be cached, even for a short duration. Caching helps to improve the performance of your application, and to reduce the load on your application servers.

Additionally, Front Door's global traffic acceleration capabilities help to [improve the performance of dynamic web applications](front-door-traffic-acceleration.md) by routing requests through Microsoft's high-speed backbone network.

### Security

Front Door's web application firewall (WAF) provides a range of security capabilities to your application. [Managed rule sets](../web-application-firewall/afds/waf-front-door-drs.md) scan incoming requests for suspicious content. [Bot protection rules](../web-application-firewall/afds/afds-overview.md#bot-protection-rule-set) identify and respond to traffic from bots. [Geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md) and [rate limiting](../web-application-firewall/afds/waf-front-door-rate-limit.md) features protect your application servers from unexpected traffic.

Because of Front Door's architecture, it can also absorb large [distributed denial of service attacks](front-door-ddos.md) and prevent the traffic from reaching your application.

[Private Link integration](private-link.md) helps you to protect your backend applications, ensuring that traffic can only reach your application by passing through Front Door and its security protections.

### Reliability

Front Door is a global load balancer. Front Door monitors the health of your origin servers, and if an origin becomes unavailable, [Front Door can route requests to an alternative origin](routing-methods.md). You can also use Front Door to spread traffic across your origins to reduce the load on any one origin server.

By using the Front Door cache, you reduce the load on your application servers. If your servers are unavailable, Front Door may be able to continue to serve cached responses until your application recovers.

### Cost optimization

Front Door can help you to reduce the cost of running your Azure solution by using caching. Cached content is returned from global Front Door edge nodes, reducing global bandwidth charges, and reducing the load on - and resources required by - your application server.

### Operational excellence

Front Door can help you to modernize your legacy applications with [HTTP/2 support](front-door-http2.md). The Front Door [rules engine](front-door-rules-engine.md) enables you to change the internal architecture of your solution without affecting your clients.

You can also deploy and configure Front Door by using infrastructure as code (IaC) technologies including Bicep, Terraform, ARM templates, Azure PowerShell, and the Azure CLI.

## Solution architecture

When you deploy a solution that uses Azure Front Door, you should consider...

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Azure Front Door routing user traffic to endpoints." lightbox="./media/overview/front-door-overview-expanded.png" border="false":::
<!-- TODO redo this diagram -->



### Client to Front Door

### Front Door to origin

## Next steps

TODO
