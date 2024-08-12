---
title: 'Using ExpressRoute for Microsoft 365 Services | Microsoft Docs'
description: This document discusses objectively on using ExpressRoute circuit for Microsoft 365 SaaS services.
services: expressroute
author: rambk
manager: tracsman
ms.service: azure-expressroute
ms.topic: article
ms.date: 6/11/2024
ms.author: rambala
---

# Using ExpressRoute for routing Microsoft 365 traffic

> [!NOTE]
> We **don't recommend** ExpressRoute for Microsoft 365 because it doesn't provide the best connectivity model for the service in most circumstances. As such, Microsoft authorization is required to use this connectivity model. We review every customer request and authorize ExpressRoute for Microsoft 365 only in the rare scenarios where it is necessary. For more information, see the [ExpressRoute for Microsoft 365 guide](https://aka.ms/erguide) and review the document with your productivity, network, and security teams before working with your Microsoft account team to submit an exception as required. If you try to create a route filter for Microsoft 365 without an authorized subscription you will receive an [error message](https://support.microsoft.com/kb/3181709).

An ExpressRoute circuit provides private connectivity to the Microsoft backbone network.

* It offers *Private peering* to connect to private endpoints of your IaaS deployment in Azure regions. 
* Also, it offers *Microsoft peering* to connect to public endpoints of IaaS, PaaS, and SaaS services in the Microsoft network. 

For more information about ExpressRoute, see the [Introduction to ExpressRoute][ExR-Intro] article.

Often time there's confusion about whether or not ExpressRoute can be used for routing Microsoft 365 SaaS traffic. ExpressRoute offers Microsoft peering, which allows you to access most public endpoints in the Microsoft network. With the use of a *Route Filter*, you can select Microsoft 365 service prefixes that you want to advertise over Microsoft peering to your on-premises network. These routes enable routing Microsoft 365 service traffic over the ExpressRoute circuit.

In this article, you learn about when it's necessary to use ExpressRoute to route Microsoft 365 traffic.

## Network requirements of Microsoft 365 traffic

Microsoft 365 services often include real-time traffic such as voice & video calls, online meetings, and real-time collaboration. This real-time traffic has stringent network performance requirements in terms of latency and jitter. Within certain limits of network latency, jitter can be effectively handled by using a buffer at the client device. Network latency is a function of physical distance traffic need to travel, the link bandwidth, and the network processing latency. 

## Network optimization features of Microsoft 365 

Microsoft strives to optimize network performance of all the cloud applications both in terms of architecture and features. To start, Microsoft owns one of the largest global networks, which is optimized to achieve the core objective of offering the best network performance. Microsoft's network is software defined, and uses a method called "cold potato" routing. In a "cold potato" traffic ingress and egress as close as possible to client-device/customer-network. Microsoft's network is designed with redundancy and is highly available. For more information about architecture optimization, see [How Microsoft builds its fast and reliable global network][MGN].

To address the stringent network latency requirements, Microsoft 365 shortens route length by:
* Dynamically routing the end-user connection to the nearest Microsoft 365 entry point. 
* From the entry point, traffic is efficiently routed within the Microsoft's global network to the nearest Microsoft 365 data center.

Microsoft 365 entry points get serviced by Azure Front Door. Azure Front Door is a widely distributed service present at Microsoft global edge network that creates a fast, secure, and highly scalable SaaS applications. For more information about how Azure Front Door accelerates web application performance, see [What is Azure Front Door?][AFD]. When selecting the nearest Microsoft 365 data center, Microsoft takes into consideration data sovereignty regulations within the geo-political region.

## What is geo-pinning connections?

When you force a client-server to pass traffic through certain network device(s) located in a geographical location that is referred to as geo-pinning the network connection. In a traditional network architecture, the underlying design principle is that the clients-servers are statically located which commonly geo-pins connections.

For example, when you force your enterprise Internet connections to traverse through your corporate network. The egress is from a central location, typically via a set of proxy-servers or firewalls, you're geo-pinning the Internet connections. Another example of geo-pinning is when you have a SaaS application architecture that you force traffic through an intermediate datacenter in a region or using one or more intermediate network devices.

## When is ExpressRoute not appropriate for Microsoft 365?

Microsoft 365 has the ability to dynamically shorten the route length and dynamically choose the closest server datacenter depending on the location of the clients. Microsoft 365 is said to be designed for the Internet. 
Some Microsoft 365 traffic can only be routed through the Internet.
When you have your SaaS clients widely distributed across a region or globally, and you're geo-pinning the connections to a particular location then you're forcing your clients further away from the geo-pined location to experience higher network latency. The higher network latency can result in suboptimal network performance and poor application performance.

Therefore, in scenarios where you have widely distributed SaaS clients or clients that are mostly mobile, you don't want to geo-pin connections by any means including forcing the traffic through an ExpressRoute circuit in a specific peering location.

## When to use ExpressRoute for Microsoft 365?

We no longer recommend the use of ExpressRoute for Microsoft 365 traffic. For more information, see [Azure ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute?view=o365-worldwide).

## Next steps

* To understand how Microsoft Teams calls flow and how to optimize the network connectivity in different scenarios including while using Express Route for best results, see [Microsoft Teams call flows][Teams].
* If you want to test to understand Microsoft 365 connectivity issues for individual office locations, see [Microsoft 365 network connectivity test][Microsoft 365-Test].
* To establish baseline and performance history to help detect emerging issues of Microsoft 365 performance, see [Office 365 performance tuning using baselines and performance history][Microsoft 365perf].

<!--Link References-->
[ExR-Intro]: ./expressroute-introduction.md
[CreatePeering]: ./expressroute-howto-routing-portal-resource-manager.md
[MGN]: https://azure.microsoft.com/blog/how-microsoft-builds-its-fast-and-reliable-global-network/
[AFD]: ../frontdoor/front-door-overview.md
[ExRRF]: ./how-to-routefilter-portal.md
[Teams]: /microsoftteams/microsoft-teams-online-call-flows
[Microsoft 365-Test]: https://connectivity.office.com/
[Microsoft 365perf]: /microsoft-365/enterprise/performance-tuning-using-baselines-and-history
