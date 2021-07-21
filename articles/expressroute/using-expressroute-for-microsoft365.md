---
title: 'Using ExpressRoute for Microsoft 365 Services | Microsoft Docs'
description: This document discusses objectively on using ExpressRoute circuit for Microsoft 365 SaaS services.
documentationcenter: na
services: expressroute
author: rambk
manager: tracsman

ms.service: expressroute
ms.topic: article
ms.workload: infrastructure-services
ms.date: 4/29/2021
ms.author: rambala

---

# Using ExpressRoute for routing Microsoft 365 traffic

An ExpressRoute circuit provides private connectivity to Microsoft backbone network. 
* It offers *Private peering* to connect to private endpoints of your IaaS deployment in Azure regions 
* Also, it offers *Microsoft peering* to connect to public endpoints of IaaS, PaaS, and SaaS services in Microsoft network. 

For more information about ExpressRoute, see the [Introduction to ExpressRoute][ExR-Intro] article.


Often there's a confusion whether ExpressRoute can be used or not for routing Microsoft 365 SaaS traffic. 

* One side argument: ExpressRoute does offer Microsoft peering, using which you can reach most of the public endpoints in Microsoft network. 
In fact, using a *Route Filter* you can select Microsoft 365 service prefixes that need to be advertised via Microsoft peering to your on-premises network. 
These routes advertisement enables routing Microsoft 365 service traffic over the ExpressRoute circuit. 
* The counter argument: Microsoft 365 is a distributed service. It is designed to enable customers all over the world to connect to the service using the Internet. 
So, it's recommended not to use ExpressRoute for Microsoft 365.

The goals of this article are: 
* to provide technical reasoning for the arguments, and 
* objectively discuss when to use ExpressRoute for routing Microsoft 365 traffic and when not to use it.

## Network requirements of Microsoft 365 traffic
Microsoft 365 service often includes real-time traffic such as voice & video calls, online meetings, and real-time collaboration. This real-time traffic has stringent network performance requirements in terms of latency and jitter. Within certain limits of network latency, jitter can be effectively handled using buffer at the client device. Network latency is a function of physical distance traffic need to travel, link bandwidth, and network processing latency. 

## Network optimization features of Microsoft 365 

Microsoft strives to optimize network performance of all the cloud applications both in terms of architecture and features. To begin with, Microsoft owns one of the largest global networks, which is optimized to achieve the core objective of offering best network performance. Microsoft network is software defined, and it's a "Cold Potato" network. "Cold Potato" network in the sense, it attracts and egress traffic as close as possible to client-device/customer-network. Besides, Microsoft network is highly redundant and highly available. For more information about architecture optimization, see [How Microsoft builds its fast and reliable global network][MGN].

To address the stringent network latency requirements, Microsoft 365 shortens route length by:
* dynamically routing the end-user connection to the nearest Microsoft 365 entry point, and 
* from the entry point efficiently routing them within the Microsoft global network to the nearest (and authorized) Microsoft 365 data center.

The Microsoft 365 entry points are serviced by Azure Front Door (AFD). AFD is a widely distributed service present at Microsoft global edge network and it helps to create fast, secure, and highly scalable SaaS applications. To further understand how AFD accelerates web application performance, see [What is Azure Front Door?][AFD]. While choosing the nearest Microsoft 365 data center, Microsoft does take into consideration data sovereignty regulations within the geo-political region.

## What is geo-pinning connections?

Between a client-server when you force the traffic to flow through certain network device(s) located in a geographical location, then it's referred to as geo-pinning the network connections. Traditional network architecture, with the underlying design principle that the clients-servers are statically located, commonly geo-pins the connections.
For example, when you force your enterprise Internet connections traverse through your corporate network, and egress from a central location (typically via a set of proxy-servers or firewalls), you're geo-pinning the Internet connections.  

Similarly, in SaaS application architecture if you force route the traffic through an intermediate datacenter (for example, cloud security) in a region or via one or more intermediate network devices (for example, ExpressRoute) in a specific location then you're geo-pinning the SaaS connections.

## When not to use ExpressRoute for Microsoft 365?

Because of its ability to dynamically shorten the route length and dynamically choose the closest server datacenter depending on the location of the clients, Microsoft 365 is said to be designed for the Internet. 
Besides, certain Microsoft 365 traffic is routed only through the Internet.
When you have your SaaS clients widely distributed across a region or globally, and if you geo-pin the connections to a particular location then you are forcing the clients further away from the geo-pined location to experience higher network latency. 
Higher network latency results in suboptimal network performance and poor application performance.

Therefore, in scenarios where you have widely distributed SaaS clients or clients that are highly mobile, you don't want to geo-pin connections by any means including forcing the traffic through an ExpressRoute circuit in a specific peering location.


## When to use ExpressRoute for Microsoft 365?

The following are some of the reasons why you may want to use ExpressRoute for routing Microsoft 365 traffic:
* Your SaaS clients are concentrated in a geo-location and the most optimal way to connect to Microsoft global network is via ExpressRoute circuits
* Your SaaS clients are concentrated in multiple global locations and each location has its own ExpressRoute circuits that provide optimal connectivity to Microsoft global network
* You're required by law to route cloud-bound traffic via private connections
* You're required to route all the SaaS traffic to a geo-pinned centralized location (be it a private or a public datacenter) and the optimal way to connect the centralized location to the Microsoft global network is via ExpressRoute
* For some of your static SaaS clients only ExpressRoute provides optimal connectivity, while for the other clients you use Internet

While you use ExpressRoute, you can apply the route filter associated with Microsoft peering of ExpressRoute to route only a subset of Microsoft 365 services and/or Azure PaaS services over the ExpressRoute circuit. For more information, see [Tutorial: Configure route filters for Microsoft peering][ExRRF].

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