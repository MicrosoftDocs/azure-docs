---
title: What is Azure Application Gateway
description: Learn how you can use an Azure application gateway to manage web traffic to your application.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: overview
ms.custom: mvc
ms.date: 11/15/2022
ms.author: greglin
#Customer intent: As an IT administrator, I want to learn about Azure Application Gateways and what I can use them for.
---

# What is Azure Application Gateway?

Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. Traditional load balancers operate at the transport layer (OSI layer 4 - TCP and UDP) and route traffic based on source IP address and port, to a destination IP address and port.

Application Gateway can make routing decisions based on additional attributes of an HTTP request, for example URI path or host headers. For example, you can route traffic based on the incoming URL. So if `/images` is in the incoming URL, you can route traffic to a specific set of servers (known as a pool) configured for images. If `/video` is in the URL, that traffic is routed to another pool that's optimized for videos.

![imageURLroute](./media/application-gateway-url-route-overview/figure1-720.png)

This type of routing is known as application layer (OSI layer 7) load balancing. Azure Application Gateway can do URL-based routing and more.

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. 
> * If you're looking to do DNS based global routing and do **not** have requirements for Transport Layer Security (TLS) protocol termination ("SSL offload"), per-HTTP/HTTPS request or application-layer processing, review [Traffic Manager](../traffic-manager/traffic-manager-overview.md). 
> * If you need to optimize global routing of your web traffic and optimize top-tier end-user performance and reliability through quick global failover, see [Front Door](../frontdoor/front-door-overview.md).
> * To do transport layer load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md). 
> 
> Your end-to-end scenarios may benefit from combining these solutions as needed.
> For an Azure load-balancing options comparison, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).


## Features

To learn about Application Gateway features, see [Azure Application Gateway features](features.md).

## Infrastructure

To learn about Application Gateway infrastructure, see [Azure Application Gateway infrastructure configuration](configuration-infrastructure.md).

## Pricing and SLA

For Application Gateway pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

For Application Gateway SLA information, see [Application Gateway SLA](https://azure.microsoft.com/support/legal/sla/application-gateway/v1_2/).

## What's new

To learn what's new with Azure Application Gateway, see [Azure updates](https://azure.microsoft.com/updates/?category=networking&query=Application%20Gateway).

## Next steps

Depending on your requirements and environment, you can create a test Application Gateway using either the Azure portal, Azure PowerShell, or Azure CLI.

- [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md)
- [Quickstart: Direct web traffic with Azure Application Gateway - Azure PowerShell](quick-create-powershell.md)
- [Quickstart: Direct web traffic with Azure Application Gateway - Azure CLI](quick-create-cli.md)
- [Learn module: Introduction to Azure Application Gateway](/training/modules/intro-to-azure-application-gateway)
- [How an application gateway works](how-application-gateway-works.md)
- [Frequently asked questions about Azure Application Gateway](application-gateway-faq.yml)
