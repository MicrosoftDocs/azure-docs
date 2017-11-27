---
title: Azure Internal Load Balancer overview | Microsoft Docs
description: How an internal load balancer works in Azure and scenarios for configuring internal endpoints.
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: tysonn

ms.assetid: 36065bfe-0ef1-46f9-a9e1-80b229105c85
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: kumud
---

# Overview of Azure Internal Load Balancer

[!INCLUDE [load-balancer-basic-sku-include.md](../../includes/load-balancer-basic-sku-include.md)]

Azure Internal Load Balancer (ILB) only directs traffic to resources that are inside a cloud service or that use a VPN to access Azure infrastructure. In this respect, ILB differs from an internet-facing load balancer. Azure infrastructure restricts access to the load-balanced virtual IP (VIP) addresses of a cloud service or to a virtual network. VIP addresses and virtual networks are never directly exposed to an internet endpoint. Internal line-of-business applications run in Azure and are accessed from within Azure or from on-premises resources.

## Why you might need an internal load balancer

Internal Load Balancer provides load balancing between virtual machines (VMs) that reside inside a cloud service or a virtual network with a regional scope. For information about virtual networks with a regional scope, see [Regional virtual networks](https://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/) in the Azure blog. Existing virtual networks that are configured for an affinity group cannot use ILB.

ILB enables the following types of load balancing:

* Within a cloud service: Load balancing from VMs to a set of VMs that reside within the same cloud service. See this <a href="#figure1">example</a>.
* Within a virtual network: Load balancing from VMs in the virtual network to a set of VMs that reside within the same cloud service of the virtual network. See this <a href="#figure2">example</a>.
* For a cross-premises virtual network: Load balancing from on-premises computers to a set of VMs that reside within the same cloud service of the virtual network. See this <a href="#figure3">example</a>.
* For multi-tier applications: Load balancing for internet-facing multi-tier applications where the back-end tiers are not internet-facing. The back-end tiers require traffic load balancing from the internet-facing tier.
* For line-of-business applications: Load balancing for line-of-business applications that are hosted in Azure without additional load balancer hardware or software. This scenario includes on-premises servers that are in the set of computers whose traffic is load-balanced.

## Load balancing for internet-facing multi-tier applications

The web tier has internet-facing endpoints for internet clients and is part of a load-balanced set. ILB distributes incoming traffic from web clients for TCP port 443 (HTTPS) to the web servers.

The database servers are behind an ILB endpoint that the web servers use for storage. The ILB endpoint is a database service load-balanced endpoint. Traffic is load-balanced across the database servers in the ILB set.

The following image shows internal load balancing for the internet-facing multi-tier application within the same cloud service.

<a name="figure1"></a>
![Internet-facing multi-tier application](./media/load-balancer-internal-overview/IC736321.png)

Another scenario is available for multi-tier applications. The load balancer is deployed to a different cloud service from the one that consumes the service for the ILB.

Cloud services that use the same virtual network can access the ILB endpoint. The following image shows front-end web servers that are in a different cloud service from the database back-end. The front-end servers use the ILB endpoint within the same virtual network as the back-end.

<a name="figure2"></a>
![Front-end servers in a different cloud service](./media/load-balancer-internal-overview/IC744147.png)

## Load balancing for intranet line-of-business applications

Traffic from clients on the on-premises network is load-balanced across the set of line-of-business servers that use a VPN connection to the Azure network.

The client machine can access an IP address from the Azure VPN service by using a point-to-site VPN. The line-of-business application can be hosted behind the ILB endpoint.

<a name="figure3"></a>
![Line-of-business application hosted behind ILB endpoint](./media/load-balancer-internal-overview/IC744148.png)

Another scenario for line-of-business applications is a site-to-site VPN to the virtual network where the ILB endpoint is configured. On-premises network traffic is routed to the ILB endpoint.

<a name="figure4"></a>
![On-premises network traffic routed to ILB endpoint](./media/load-balancer-internal-overview/IC744150.png)

## Limitations

Internal Load Balancer configurations don't support SNAT. In this article, SNAT refers to scenarios that involve port-masquerading source network address translation. A VM in a load balancer pool must reach the front-end IP address of the respective internal load balancer. Connection failures occur when the flow is load-balanced to the VM that originated the flow. These scenarios are not supported for ILB. A proxy-style load balancer must be used instead.

## Next steps

* [Azure Resource Manager support for Azure Load Balancer](load-balancer-arm.md)
* [Get started with configuring an internet-facing load balancer](load-balancer-get-started-internet-arm-ps.md)
* [Get started with configuring an internal load balancer](load-balancer-get-started-ilb-arm-ps.md)
* [Configure load balancer distribution mode](load-balancer-distribution-mode.md)
* [Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
