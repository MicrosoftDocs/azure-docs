---
title: 'Working remotely using Azure networking services'
description: This page describes how you can use Azure networking services that are available to enable working remotely and how to mitigate traffic issues resulting from increased number of people working from home due to the COVID-19 crisis.
services: networking
author: rambk

ms.service: virtual-network
ms.topic: article
ms.date: 03/23/2020
ms.author: kumud

---

# Working remotely using Azure networking services

This article describes how you can leverage Azure networking services to enable working remotely and how to mitigate traffic issues resulting from increased number of people working from home due to the COVID-19 crisis.

The Covid-19 (Corona virus) contagion has created unprecedented global crisis, resulting in lockdown of many cities and countries across the globe. This crisis has forced most people across a wide range of industries to work from home. We need to stop the contagion spreading, to help the first-responders battle the disease and cure those who have got infected, to maintain the productivity and availability of the necessities all over the world.

Network architects everywhere are faced with the following challenges:

- address the steep increase in network utilization
- provide reliable-secure connectivity to all the employees of their company and customers,
- provide connectivity to remote locations across the globe. 

The pre- and post- Covid-19 lockdown Internet traffic analysis reveal that  as more people are settling down to work from home on a regular basis, the home broadband network usage is experiencing significant increase in utilization. The traffic patterns are also changing, the usual weekend and night-time network troughs are vanishing. For example, in the Seattle area, in the beginning of March (after several companies in area requested employees to work from home), the Internet traffic has gone up by 40% compared to the usage in the area in January of this year. The night-time network usage trough in March is greater than the average day-time usage in January. Similar analysis in Italy shows a 30% increase. The trend is similar in all the lockdown areas.

However, not all network segments (for example, the Internet backbone), private WAN, and corporate core networks are experiencing the pinch. The bottlenecks are commonly reported in home broadband networks and more particularly in the neighborhoods served by lower cable connections, VPN gateways of on-premises networks of corporations/enterprises.

Network planners can help ease the bottlenecks and alleviate the network congestion by keeping in mind that different traffic types need different network treatment priorities and by some smart load redirection/distribution. For example, real-time tele-medecine traffic of doctor-patient interaction is of high importance and delay/jitter sensitive. Whereas replication of the same traffic between storages is not delay sensitive. The former traffic must be routed via the most optimal network path with higher quality of service; whereas it is acceptable to route the later traffic via sub-optimal route.

>[!NOTE] 
>Towards the end of this article, links for Covid-19 preparation articles leveraging different Azure networking features and ecosystems are listed.
>

## Azure is designed for elasticity and high-availability

Azure is designed to withstand sudden changes in the utilization of the resources and can greatly help at the time of crisis like this. Also, Microsoft maintains and operates one of the worlds' largest network. Microsoft's network has been designed for high availability that can withstand different types of failure: from a single network element failure to failure of an entire region.

Microsoft network is designed to meet the requirements and provide optimal performance for different types of network traffic. Microsoft network is used to service from Teams delay sensitive multimedia traffic to CDN traffic; from real-time big data analysis traffic to Azure storage traffic; from Xbox traffic to Bing traffic. To provide optimal performance for different types of traffic, Microsoft network attracts all the traffic that is destined to- or wanting to transit through- its resources as close as possible to the traffic origination.

Using any of features in Azure described below leverages the traffic attraction edge behavior of the Microsoft world-wide network; thereby, off loading traffic from the critically congested first/last mile networks as soon as possible.

## Enable employees to work remotely

Azure scalable VPN gateway support both Point-to-Site (P2S) and Site-to-Site (S2S) VPN connections. Using Azure VPN gateway you can scale your employee's connections to securely access both your Azure deployed resources and your on-premises resources. For more information, see [How to enable users to work remotely](https://go.microsoft.com/fwlink/?linkid=2123770). 

If you are using SSTP, the number of concurrent connections would be limited to 128. To overcome this limitation we suggest transitioning to OpenVPN or IKEv2. For more information, see [Transition to OpenVPN protocol or IKEv2 from SSTP](https://go.microsoft.com/fwlink/?linkid=2124112).

To access your resources deployed in Azure, remote employees could use Azure Bastion solution, instead of VPN connection. For more information, see [Azure Bastion COVID-19 update](https://go.microsoft.com/fwlink/?linkid=2123939) for further details.

For aggregating large-scale VPN connection, to support any-to-any connections between resources in different on-prem global locations, in different regional hub and spoke virtual networks, and to optimize utilization of multiple home broadband networks you can use Azure Virtual WAN. For more information, see [Struggling to cater to work from home needs? Here is where Azure Virtual WAN can help](https://go.microsoft.com/fwlink/?linkid=2123769).

Azure also has a rich set of eco system partners. Our partners Network Virtual Appliances on Azure can also help scale VPN connectivity. For more information, see [Network Virtual Appliance (NVA) Considerations during COVID-19](https://go.microsoft.com/fwlink/?linkid=2123771).

## Enable employees to access globally distributed on-premises resources

Use ExpressRoute Global Reach, Azure VPN gateway, or Azure Virtual WAN services to establish connectivity between your different on-premises network across globe.

## Scale customer connectivity to frontend resources

Lockdown is forcing people to go online. Even those who are not used to online transactions are now forced to do so. This results in increased customer traffic to many corporate websites Azure Application Gateway can help managing this increased frontend workload. For more information, see[Application Gateway COVID-19 Update](https://go.microsoft.com/fwlink/?linkid=2123940).

## Microsoft support for multi-cloud traffic

Even for your deployments in other public clouds, Microsoft can provide global connectivity. Azure Virtual WAN or ExpressRoute Global Reach can help in this regard. Also Azure Application Gateway can help scale and distribute load to websites that are hosted in on-prem networks and in other public clouds.


## Next steps

Following are the Covid-19 preparation articles leveraging different Azure networking features:

| **Article** | **Last update** |
| --- | --- |
| [How to enable users to work remotely](https://go.microsoft.com/fwlink/?linkid=2123770) | March 23, 2020 |
| [Struggling to cater to work from home needs? Here is where Azure Virtual WAN can help](https://go.microsoft.com/fwlink/?linkid=2123769) | March 23, 2020 |
| [Application Gateway COVID-19 update](https://go.microsoft.com/fwlink/?linkid=2123940) | March 23, 2020 |
| [Network Virtual Appliance (NVA) considerations during COVID-19](https://go.microsoft.com/fwlink/?linkid=2123771)| March 23, 2020 |
| [Transition to OpenVPN protocol or IKEv2 from SSTP](https://go.microsoft.com/fwlink/?linkid=2124112) | March 23, 2020 |
| [Azure Bastion COVID-19 update](https://go.microsoft.com/fwlink/?linkid=2123939) | March 23, 2020 |
| [COVID update - ExpressRoute][https://go.microsoft.com/fwlink/?linkid=2123768] | March 23, 2020 |
