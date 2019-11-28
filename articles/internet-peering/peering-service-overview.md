---
title: Microsoft Azure Peering Service
description: Microsoft Azure Peering Service
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: overview
ms.date: 11/27/2019
ms.author: prmitiki
---

# What is Peering Service?
Peering Service is a partnership program with key service providers to provide best-in-class public Internet connectivity to their enterprise users. Partners who are part of the program will have direct, highly available, geo-redundant connections and optimized routing to Microsoft. Peering Service is an addition to the Microsoft connectivity portfolio:
*	ExpressRoute for private connectivity to IaaS or PaaS resources (support for private IP space)
	*	Partner based connectivity
	*	Direct 100G connectivity to Microsoft
*	IPSEC over the Internet for VPN connectivity to the cloud
*	SD-WAN connectivity to Azure through Virtual WAN

The target segment for Peering Service is SaaS connectivity, SD-WAN customers willing to do internet breakout at the branch and any customers having a dual strategy MPLS and enterprise-grade Internet.

The primary goal when connecting to Microsoft Cloud should be to minimize latency by reducing the round-trip time (RTT) from a user site to the Microsoft Global Network ,which is Microsoft's public network backbone that interconnects all of Microsoft's datacenters and multiple cloud application entry points. See [Getting the best connectivity and performance in Office 365](https://techcommunity.microsoft.com/t5/Office-365-Blog/Getting-the-best-connectivity-and-performance-in-Office-365/ba-p/124694).

![Image of distributed access](./media/distributed-access.png)

In the figure above each branch office of a global enterprise connects to the nearest possible Microsoft edge location possible through hte partner's network.

**Key customer Benefits**
* Best public routing over internet to Microsoft Cloud Services for optimal performance and reliability.
* Ability to select the preferred SP to connect to Microsoft Cloud.
* Traffic insights such as latency reporting, and prefix monitoring.
* Optimum Network Hops (AS Hops) from Microsoft Cloud.
* Route analytics and statistics - Events for Border Gateway Protocol ([BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol)) route anomalies (leak/hijack detection), and suboptimal routing.

**Key partnership requirements**
* Connectivity to Microsoft Cloud at a location nearest to user. A partner SP will route user traffic to Microsoft edge closest to user. Similarly, on traffic towards the user, Microsoft will route traffic (using BGP tag) to the edge location closest to the user and SP will deliver the traffic to the user.
* Partner will maintain high available, high throughput, and geo-redundant connectivity with Microsoft Global Network.
* Partner can utilize their existing peering to support Peering Service if it meets the requirement

## Create Direct Peering for Peering Service
Service Providers can expand their geographical reach by creating new Direct Peering that support Peering Service. To accomplish this,
1. Become a Peering Service partner if not already
1. Follow the instructions to [Create or modify a Direct Peering using Portal](peering-howto-directpeering-arm-portal.md). Ensure it meets high-availability requirement.
1. Then, follow steps to [Enable Peering Service on a Direct Peering using Portal](peering-howto-peering-service-portal.md) 


## Use legacy Direct Peering to support Peering Service
If you have legacy Direct Peering that you want to use to support Peering Service,
1. Become a Peering Service partner if not already.
1. Follow the instructions to [Convert a legacy Direct Peering to Azure Resource using Portal](peering-howto-legacydirect-arm-portal.md). If required, order additional circuits to meet high-availability requirement.
1. Then, follow steps to [Enable Peering Service on a Direct Peering using Portal](peering-howto-peering-service-portal.md).


<!--
**Steps to Use existing peering Connectivity for Peering Service**
1. Become a Peering Service partner if not already
2. If required order additional circuit to meet high-availability requirement
3. Indicate that the peering connectivity will be used to support Peering Service 

<br />Tutorial for using existing peering that meets high-availability requirement
<br />Tutorial for using existing peering that doesnt meets high-availability requirement

**Steps to create new peering Connectivity for Peering Service**
As partners expand their geographical reach they can create new peering connectivity to support Peering Service.
1. Step 1: Become a Peering Service partner if not already
2. Step 2: Order circuits in the desired Microsoft edge location that meet high-availability requirement
3. Step 3: Indicate that the peering connectivity will be used to support Peering Service

<br /> [Tutorial for creating new peering to support Peering Service](peering-direct.md)
-->

## FAQ
For frequently asked questions, see [Peering Service - FAQ](peering-service-faqs.md).

## Next steps

* Learn more about customer benefits with [Peering Service](https://docs.microsoft.com/azure/peering-service/).
* Learn about some of the other Azure key [networking capabilities](https://docs.microsoft.com/azure/networking/networking-overview).
