---
title: Azure Front Door Standard/Premium| Microsoft Docs
description: This article provides an overview of Azure Front Door Standard/Premium.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: overview
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: duau
---

# What is Azure Front Door Standard/Premium (Preview)?

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Front Door Standard/Premium is a fast, reliable, and secure modern cloud CDN that uses the Microsoft global edge network and integrates with intelligent threat protection. It combines the capabilities of Azure CDN Standard from Microsoft, Azure Front Door, Azure Web Application Firewall (WAF) into a single service.

With Azure Front Door Standard/Premium, you can transform your global consumer and enterprise applications into secure and high-performing personalized modern applications with contents that reach a global audience with low latency.

   :::image type="content" source="../media/overview/front-door-overview.png" alt-text="Azure Front Door Standard/Premium architecture":::

Front Door works at Layer 7 (HTTP/HTTPS layer) using anycast protocol with split TCP and Microsoft's global network to improve global connectivity. Based on your routing method you can ensure that Front Door will route your client requests to the fastest and most available origin. An application backend is any Internet-facing service hosted inside or outside of Azure. Front Door provides a range of traffic-routing methods and origin health monitoring options to suit different application needs and automatic failover scenarios. Similar to Traffic Manager, Front Door is resilient to failures, including failures to an entire Azure region.

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios.
>
> * If you are looking to do DNS based global routing and do **not** have requirements for Transport Layer Security (TLS) protocol termination ("SSL offload"), per-HTTP/HTTPS request or application-layer processing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md).
> * If you want to load balance between your servers in a region at the application layer, review [Application Gateway](../application-gateway/overview.md)
> * To do network layer load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md).
>
> Your end-to-end scenarios may benefit from combining these solutions as needed.
> For an Azure load-balancing options comparison, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).

## Why use Azure Front Door Standard/Premium (Preview)?

Azure Front Door Standard/Premium (Preview) provides a single unified platform for static content and dynamic application acceleration, with enhanced security capabilities. Front Door also enables you to define, manage, and monitor the global routing for your app.

Key features included with Azure Front Door Standard/Premium (Preview):

* Accelerated application performance by using split TCP-based anycast protocol.

* Intelligent **[health probe](concept-health-probes.md)** monitoring and load balancing among **[origins](concept-origin)**.

* Define your own custom domain with flexible domain validation.

* Application security with integrated Web Application Firewall (WAF).

* SSL offload and integrated certificate management.

* Secure your origins with **[Private Link](../../private-link/private-link-overview.md)**.  

* Customizable traffic routing and optimizations via **[Rule Set](concept-rule-set)**.

* **[Built-in reports](concept-reports.md)** with all-in-one dashboard for both Front Door and security patterns.

* **[Real-time monitoring](how-to-monitoring-metrics)** and alerts that integrate with Azure Monitoring.

* **[Logging](how-to-logging.md)** for each Front Door request and failed health probes.

* Native support of end-to-end IPv6 connectivity and **[HTTP/2 protocol](../front-door-http2.md)**.

## Pricing

Azure Front Door Standard/Premium has two SKUs, Standard and Premium. For pricing information, see [Front Door Pricing](https://azure.microsoft.com/pricing/details/frontdoor/). See [SLA for Azure Front Door](https://azure.microsoft.com/en-us/support/legal/sla/frontdoor/v1_0/).

## What's new?

Subscribe to the RSS feed and view the latest Azure Front Door feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=Azure%20Front%20Door) page.

## Next steps

* Learn how to [create a Front Door](create-front-door-portal.md).
