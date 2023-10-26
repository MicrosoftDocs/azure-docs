---
title: Azure Front Door
description: This article provides an overview of Azure Front Door.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: overview
ms.workload: infrastructure-services
ms.date: 10/12/2023
ms.author: duau
# Customer intent: As an IT admin, I want to learn about Front Door and what I can use it for. 
---

# What is Azure Front Door?

Whether you’re delivering content and files or building global apps and APIs, Azure Front Door can help you deliver higher availability, lower latency, greater scale, and more secure experiences to your users wherever they are.  

Azure Front Door is Microsoft’s modern cloud Content Delivery Network (CDN) that provides fast, reliable, and secure access between your users and your applications’ static and dynamic web content across the globe. Azure Front Door delivers your content using Microsoft’s global edge network with hundreds of [global and local points of presence (PoPs)](edge-locations-by-region.md) distributed around the world close to both your enterprise and consumer end users.

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Azure Front Door routing user traffic to endpoints." lightbox="./media/overview/front-door-overview-expanded.png":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

## Why use Azure Front Door?

> [!VIDEO https://www.youtube.com/embed/-4FQYxV9mAE]

Azure Front Door enables internet-facing application to:

* **Build and operate modern internet-first architectures** that have dynamic, high-quality digital experiences with highly automated, secure, and reliable platforms.

* **Accelerate and deliver your app and content globally** at scale to your users wherever they're creating opportunities for you to compete, weather change, and quickly adapt to new demand and markets.

* **Intelligently secure your digital estate** against known and new threats with intelligent security that embrace a **_Zero Trust_** framework.

## Key Benefits

### Global delivery scale using Microsoft’s network

Scale out and improve performance of your applications and content using Microsoft’s global Cloud CDN and WAN.

* Leverage over [118 edge locations](edge-locations-by-region.md) across 100 metro cities connected to Azure using a private enterprise-grade WAN and improve latency for apps by up to 3 times.

* Accelerate application performance by using Front Door’s [anycast](front-door-traffic-acceleration.md#select-the-front-door-edge-location-for-the-request-anycast) network and [split TCP](front-door-traffic-acceleration.md#connect-to-the-front-door-edge-location-split-tcp) connections.

* Terminate SSL offload at the edge and use integrated [certificate management](standard-premium/how-to-configure-https-custom-domain.md).

* Natively support end-to-end IPv6 connectivity and the HTTP/2 protocol.

### Deliver modern apps and architectures

Modernize your internet first applications on Azure with Cloud Native experiences

* Integrate with DevOps friendly command line tools across SDKs of different languages, Bicep, ARM templates, CLI and PowerShell.

* Define your own [custom domain](standard-premium/how-to-add-custom-domain.md) with flexible domain validation.

* Load balance and route traffic across [origins](origin.md) and use intelligent [health probe](health-probes.md) monitoring across apps or content hosted in Azure or anywhere.

* Integrate with other Azure services such as DNS, Web Apps, Storage and many more for domain and origin management.

* Move your routing business logic to the edge with [enhanced rules engine](front-door-rules-engine.md) capabilities including regular expressions and server variables.

* Analyze [built-in reports](standard-premium/how-to-reports.md) with an all-in-one dashboard for both Front Door and security patterns.

* [Monitoring your Front Door traffic in real time](standard-premium/how-to-monitor-metrics.md), and configure alerts that integrate with Azure Monitor.

* [Log each Front Door request](standard-premium/how-to-logs.md) and failed health probes.

### Simple and cost-effective

* Unified static and dynamic delivery offered in a single tier to accelerate and scale your application through caching, SSL offload, and layer 3-4 DDoS protection.

* Free, [autorotation managed SSL certificates](end-to-end-tls.md) that save time and quickly secure apps and content.

* Low entry fee and a simplified cost model that reduces billing complexity by having fewer meters needed to plan for.

* Azure to Front Door integrated egress pricing that removes the separate egress charge from Azure regions to Azure Front Door. Refer to [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) for more details.

### Intelligent secure internet perimeter

* Secure applications with built-in layer 3-4 DDoS protection, seamlessly attached [Web Application Firewall (WAF)](../web-application-firewall/afds/afds-overview.md), and [Azure DNS to protect your domains](how-to-configure-endpoints.md).

* Protect your applications against layer 7 DDoS attacks using WAF. For more information, see [Application DDoS protection](../web-application-firewall/shared/application-ddos-protection.md).

* Protect your applications from malicious actors with Bot manager rules based on Microsoft’s own Threat Intelligence.

* Privately connect to your backend behind Azure Front Door with [Private Link](private-link.md) and embrace a zero-trust access model.

* Provide a centralized security experience for your application via Azure Policy and Azure Advisor that ensures consistent security features across apps.


## How to choose between Azure Front Door tiers?

For a comparison of supported features in Azure Front Door, see [Tier comparison](standard-premium/tier-comparison.md).

## Where is the service available?

Azure Front Door Classic/Standard/Premium SKUs are available in Microsoft Azure (Commercial) and Azure Front Door Classic SKU is available in Microsoft Azure Government (US).

## Pricing

For pricing information, see [Front Door Pricing](https://azure.microsoft.com/pricing/details/frontdoor/). For information about service-level agreements, See [SLA for Azure Front Door](https://azure.microsoft.com/support/legal/sla/frontdoor/v1_0/).

## What's new?

Subscribe to the RSS feed and view the latest Azure Front Door feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=Azure%20Front%20Door) page.

## Next steps

* Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md)
* Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
* [Learn module: Introduction to Azure Front Door](/training/modules/intro-to-azure-front-door/).
