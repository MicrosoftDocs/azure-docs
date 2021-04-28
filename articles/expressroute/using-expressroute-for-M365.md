---
title: 'Using ExpressRoute for M365 Services | Microsoft Docs'
description: This document discusses objectively on using ExpressRoute circuit for M365 SaaS services.
documentationcenter: na
services: expressroute
author: rambk
manager: tracsman

ms.service: expressroute
ms.topic: article
ms.workload: infrastructure-services
ms.date: 4/27/2021
ms.author: rambala

---
# Using ExpressRoute for Routing Microsoft 365 Traffic
Often there is a confusion whether ExpressRoute can be used or not for routing Microsoft 365 (M365) SaaS traffic. The for argument is: ExpressRoute does offer *Microsoft peering*, using which you can reach most of the public endpoints in Microsoft network, and infact you can select BGP communities corresponding to M365 services in a *Route Filter* associated with a Microsoft Peering to receive prefixes belonging to M365 services and thereby you can route M365 service traffic over an ExpressRoute circuite. The against argument is: M365 is a distributed service and designed to enable customers all over the world to connect to the service using an Internet connection; so, it is recommended not to use ExpressRoute for M365.

The objective of this article is to provide technical reasoning and objectively discuss when to use ExpressRoute for routing M365 traffic and when not to use it.
## What is ExpressRoute?

An ExpressRoute circuit provides private connectivity to Microsoft backbone network. It offers private peering to connect to private endpoints of your IaaS deployement in Azure regions and Microsoft peering to connect to public endpoints of IaaS, PaaS, and SaaS services in Microsoft network.

For further details about ExpressRoute, see the [Introduction to ExpressRoute][ExR-Intro] article.

## Network Requirements of M365 Traffic
M365 service often include real time traffic such as voice & video calls, online meetings, and real time collaboration. These real-time traffic has stringent network performance requirements in terms of latency and jitter. Within certain limits of network latency, jitter can be effectively handled using buffer at the client device (most modern realtime application does this). Network latency is a function of physical distance traffic need to travel, link bandwidth, and network processing latency. 

## Network Optimization Features for M365 

Microsoft strives to optimize network performance of all the cloud applications both in terms of architecture and features. To begin with, Microsoft owns one of the largest global network, which is optimized to acheive the core objective of offering best network performance. Microsoft network is software defined, and it is a "Cold Potato" network. "Cold Potato" network in the sense, it attracts and egress traffic as close as possible to client-device/customer-network. Besides, Microsoft network is highly redundant and highly available. For further details regarding architecture optimization, see [How Microsoft builds its fast and reliable global network][MGN].

To address the stringent network latency requirements, M365 shortens route length by:
* dynamically routing the end user connection to the nearest M365 entry point, and 
* from the entry point efficiently routing them within the Microsoft global network to the nearest (and authorized) M365 data center.

The M365 entry point are serviced by Azure Front Door (AFD). AFD is a widely distributed service present at Microsoft global edge network and it helps to create fast, secure, and highly scalable SaaS applications. To further understand how AFD accelerate web application performance, see [What is Azure Front Door?][AFD]. While choosing the nearest M365 data center, Microsoft do take into consideration data sovereignty regulations within the geo-political region.

## What is Geo-Pinning Connections?

Between a client-server when you force the traffic to flow through one or more network devices located in certain geographical location, then it is referred to as geo-pinning the network connections. Traditional network architecture, with the underlying design principle that the client-server are statically located, commonly geo-pins the connections.
For example, when you force your enterpise Internet connections traverse through your corporate network, and egress from a central location (typically via a set of proxy-servers/firewalls), you are geo-pinning the Internet connections.  

Similarly, in SaaS application architecture if you force route the traffic through an intermediate datacenter (e.g. cloud security) in a region or via an intermediate network devices (e.g. ExpressRoute) in a specific location then you are geo-pinning the SaaS connections.

## When not to use ExpressRoute for M365?

Because of its ability to dynamically shorten the route length and dynamically choose the closest server datacenter depending on the location of the clients, M365 is said to be designed for the Internet. When you have your SaaS clients widely distributed across a region or globally, and if you geo-pin the connections to a particular location then you are forcing the clients further away from the geo-pined location to experience higher network latency. Higher network latency results in suboptimal network performance and poor application performance.

Therefore, in scenarios where you have widely distributed SaaS clients or clients that are highly mobile, you do not want to geo-pin connections by any means including forcing the traffic through an ExpressRoute circuit in a specific peering location.


## When to use ExpressRoute for M365?

The following are some of the reasons why you may want to use ExpressRoute for routing M365 traffic:
* Your SaaS clients are concentrated in a geo-location and the most optimal way to connect to Microsoft global network is via ExpressRoute circuits
* Your SaaS clients are concentrated in multiple global locations and each locations has its own ExpressRoute circuits that provides optimal connectivity to Microsoft global network
* You are required by law to route cloud-bound traffic via private connections
* You are required to route all the SaaS traffic to a geo-pinned centralized location (be it a private or a public datacenter) and the optimal way to connect the centralized location to the Microsoft global network is via ExpressRoute
* For some of your static SaaS clients only ExpressRoute provides optimal connectivity, while for the other clients you use Internet

While you use ExpressRoute you can leverage the route filter associated with Microsoft peering of ExpressRoute to route only a subset of M365 services and/or Azure PaaS services over the ExpressRoute circuit. For further information, see [Tutorial: Configure route filters for Microsoft peering][ExRRF].

## Next Steps

* To understand how Microsoft Teams call flows and how to opimize the network connectivity in different scenarios including while using Express Route for best results, see [Microsoft Teams call flows][Teams].
* If you want to test to understand M365 connectiviy issues for individual office locations, see [Microsoft 365 network connectiviy test][M365-Test].
* To establish baseline and performance history to help detect emerging issues of M365 performance, see [Office 365 performance tuning using baselines and performance history][M365perf].

<!--Link References-->
[ExR-Intro]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction 
[CreatePeering]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-routing-portal-resource-manager
[MGN]: https://azure.microsoft.com/blog/how-microsoft-builds-its-fast-and-reliable-global-network/
[AFD]: https://docs.microsoft.com/azure/frontdoor/front-door-overview
[ExRRF]: https://docs.microsoft.com/azure/expressroute/how-to-routefilter-portal
[Teams]: https://docs.microsoft.com/microsoftteams/microsoft-teams-online-call-flows
[M365-Test]: https://connectivity.office.com/
[M365perf]: https://docs.microsoft.com/microsoft-365/enterprise/performance-tuning-using-baselines-and-history?view=o365-worldwide


