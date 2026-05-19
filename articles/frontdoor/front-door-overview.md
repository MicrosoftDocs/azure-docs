---
title: Azure Front Door Overview
description: This article provides an overview of Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: overview
ms.date: 04/24/2026
ms.custom: portfolio-consolidation-2025
#customer intent: As an IT admin, I want to learn about Azure Front Door and what I can use it for.
---

# What is Azure Front Door?

Whether you're delivering content and files or developing global applications and APIs, Azure Front Door enhances your user experience by providing higher availability, reduced latency, increased scalability, and improved security. It provides these benefits no matter where your users are located.

Azure Front Door is an advanced content delivery network (CDN) for the cloud. It's designed to provide fast, reliable, and secure access to your applications' static and dynamic web content globally. By using Microsoft's extensive global edge network, Azure Front Door provides efficient content delivery through [global and local points of presence (PoPs)](edge-locations-by-region.md) strategically positioned close to both enterprise and consumer users.

:::image type="content" source="./media/overview/front-door-overview.png" alt-text="Diagram of Azure Front Door routing user traffic to endpoints." lightbox="./media/overview/front-door-overview-expanded.png":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

Azure Front Door is one of the services in the category of load-balancing and content delivery services in Azure. Other services in this category include [Azure Load Balancer](../load-balancer/load-balancer-overview.md) and [Azure Application Gateway](../application-gateway/overview.md). Each service has its own unique features and use cases. For more information on this service category, see [What is load balancing and content delivery?](../networking/load-balancer-content-delivery/load-balancing-content-delivery-overview.md)

## Why use Azure Front Door?

> [!VIDEO https://www.youtube.com/embed/-4FQYxV9mAE]

Azure Front Door enables internet-facing applications to:

* *Build and operate modern internet-first architectures* that have dynamic, high-quality digital experiences with highly automated, secure, and reliable platforms.

* *Accelerate and deliver your applications and content globally* at scale to your users wherever they are. This ability creates opportunities for you to compete and quickly adapt to new demand and markets.

* *Help secure your digital estate* against known and new threats with intelligent security that embraces a Zero Trust framework.

## What are the key benefits?

### Global delivery scale through the Microsoft network

Scale out and improve the performance of your applications and content by using Microsoft's global cloud CDN and wide area network (WAN):

* Take advantage of more than [118 edge locations](edge-locations-by-region.md) across 100 metro areas connected to Azure by using a private enterprise-grade WAN. Improve latency for applications by up to three times.

* Accelerate application performance by using the Azure Front Door [anycast](front-door-traffic-acceleration.md#select-the-front-door-edge-location-for-the-request-anycast) network and [split TCP](front-door-traffic-acceleration.md#connect-to-the-front-door-edge-location-split-tcp) connections.

* Terminate SSL offload at the edge and use integrated [certificate management](standard-premium/how-to-configure-https-custom-domain.md).

* Natively support end-to-end IPv6 connectivity and the HTTP/2 protocol.

### Delivery of modern apps and architectures

Modernize your internet-first applications on Azure with cloud-native experiences:

* Integrate with DevOps-friendly command-line tools across SDKs of different languages, Bicep, Azure Resource Manager templates, the Azure CLI, and PowerShell.

* Define your own [custom domain](standard-premium/how-to-add-custom-domain.md) with flexible domain validation.

* Load balance and route traffic across [origins](origin.md). Use intelligent [health probe](health-probes.md) monitoring across apps or content hosted in Azure or anywhere.

* Integrate with other Azure services, such as Azure DNS, the Web Apps feature of Azure App Service, Azure Storage, and many more for domain and origin management.

* Move your routing business logic to the edge with [enhanced rules engine](front-door-rules-engine.md) capabilities, including regular expressions and server variables.

* Analyze [built-in reports](standard-premium/how-to-reports.md) with an all-in-one dashboard for both Azure Front Door and security patterns.

* [Monitor your Azure Front Door traffic in real time](standard-premium/how-to-monitor-metrics.md), and configure alerts that integrate with Azure Monitor.

* [Log each Azure Front Door request](standard-premium/how-to-logs.md) and failed health probes.

### Simplicity and cost-effectiveness

* Unified static and dynamic delivery offered in a single tier to accelerate and scale your application through caching, SSL offload, and layer 3-4 DDoS protection.

* Free, [autorotation-managed SSL certificates](end-to-end-tls.md) that save time and help quickly secure apps and content.

* Low entry fee and a simplified cost model that reduces billing complexity by having fewer meters to plan for.

* Integrated egress pricing that removes the separate egress charge from Azure regions to Azure Front Door. For more information, see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/).

### Intelligent, secure internet perimeter

* Help secure applications with built-in layer 3-4 DDoS protection, a seamlessly attached [WAF](../web-application-firewall/afds/afds-overview.md), and [Azure DNS to help protect your domains](how-to-configure-endpoints.md).

* Help protect your applications against layer 7 DDoS attacks by using a WAF. For more information, see [Application DDoS protection](../web-application-firewall/shared/application-ddos-protection.md).

* Help protect your applications from malicious actors with bot manager rules based on Microsoft Threat Intelligence.

* Privately connect to your origin behind Azure Front Door by using [Azure Private Link](private-link.md), and embrace a Zero Trust access model.

* Provide a centralized security experience for your application via Azure Policy and Azure Advisor that provides consistent security features across apps.

## How do you choose between Azure Front Door tiers?

For a comparison of supported features in Azure Front Door, see [Tier comparison](standard-premium/tier-comparison.md).

## Where is the service available?

Azure Front Door Standard, Premium, and Classic tiers are available in Microsoft Azure (Commercial) and Microsoft Azure Government (US).

## What's the pricing?

For pricing information, see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/). For information about service-level agreement (SLA), see [Microsoft SLA for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## What's new?

Subscribe to the RSS feed, and view the latest Azure Front Door feature updates on the [Azure Updates](https://azure.microsoft.com/updates?filters=%5B%22Azure+Front+Door%22%5D) page.

## Related content

* Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md).
* Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
