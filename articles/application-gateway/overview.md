---
title: What is Azure Application Gateway
description: Learn how you can use an Azure application gateway to manage web traffic to your application.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: overview
ms.custom: mvc, portfolio-consolidation-2025
ms.date: 12/09/2025
ms.author: mbender
#Customer intent: As an IT administrator, I want to learn about Azure Application Gateways and what I can use them for.
# Customer intent: "As an IT administrator, I want to understand how to use a web traffic load balancer for managing application routing, so that I can optimize traffic distribution based on HTTP request attributes and enhance application performance."
---

# What is Azure Application Gateway?

Azure Application Gateway is a web traffic load balancer that helps you manage traffic to your web applications. Unlike traditional load balancers that route traffic based on IP address and port, Application Gateway makes intelligent routing decisions based on HTTP request attributes like URL paths and host headers.

For example, you can route requests with `/images` in the URL to servers optimized for images, while routing `/video` requests to servers optimized for video content. This application layer routing gives you more control over how traffic flows to your applications.

:::image type="content" source="./media/application-gateway-url-route-overview/figure1-720.png" alt-text="Screenshot of URL-based routing diagram showing traffic distribution based on incoming URL paths.":::

Application Gateway operates at the application layer (OSI layer 7) and provides features like SSL/TLS termination, autoscaling, zone redundancy, and integration with Web Application Firewall for security.

> [!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. 
> * If you want to do DNS based global routing and don't need Transport Layer Security (TLS) protocol termination ("SSL offload"), per-HTTP/HTTPS request, or application-layer processing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md). 
> * If you need to optimize global routing of your web traffic and optimize top-tier end-user performance and reliability through quick global failover, see [Front Door](../frontdoor/front-door-overview.md).
> * To do transport layer load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md). 
> 
> Your end-to-end scenarios can benefit from combining these solutions as needed.
> For an overview of the load balancing and content delivery services in Azure, see [Load Balancing and Content Delivery](../networking/load-balancer-content-delivery/load-balancing-content-delivery-overview.md).


## Features

To learn about Application Gateway features, see [Azure Application Gateway features](features.md).

## Infrastructure

To learn about Application Gateway infrastructure, see [Azure Application Gateway infrastructure configuration](configuration-infrastructure.md).

## Security

* Protect your applications against L7 layer DDoS protection by using WAF. For more information, see [Application DDoS protection](../web-application-firewall/shared/application-ddos-protection.md).

* Protect your apps from malicious actors with Bot manager rules based on Microsoft’s own Threat Intelligence.

* Secure applications against L3 and L4 DDoS attacks with [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) plan.

* Privately connect to your backend behind Application Gateway with [Private Link](private-link.md) and embrace a zero-trust access model.

* Eliminate risk of data exfiltration and control privacy of communication from within the virtual network with a fully [Private-only Application Gateway deployment](application-gateway-private-deployment.md).

* Provide a centralized security experience for your application via Azure Policy, Azure Advisor, and Microsoft Sentinel integration that ensures consistent security features across apps.


## Pricing and SLA

For Application Gateway pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

For Application Gateway SLA information, see [Application Gateway SLA](https://azure.microsoft.com/support/legal/sla/application-gateway/v1_2/).

## What's new

To learn what's new with Azure Application Gateway, see [Azure updates](https://azure.microsoft.com/updates?filters=%5B%22Application+Gateway%22%5D).

## Next steps

Depending on your requirements and environment, you can create a test Application Gateway by using the Azure portal, Azure PowerShell, or Azure CLI.

- [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)
- [Quickstart: Direct web traffic with Azure Application Gateway - Azure PowerShell](quick-create-powershell.md)
- [Quickstart: Direct web traffic with Azure Application Gateway - Azure CLI](quick-create-cli.md)
- [Learn module: Introduction to Azure Application Gateway](/training/modules/intro-to-azure-application-gateway)
- [How an application gateway works](how-application-gateway-works.md)
- [Frequently asked questions about Azure Application Gateway](application-gateway-faq.yml)
