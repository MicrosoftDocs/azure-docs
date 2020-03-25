---
title: 'Working remotely using Azure networking services'
description: This page describes how you can use Azure networking services that are available to enable working remotely and how to mitigate traffic issues resulting from increased number of people working from home due to the COVID-19 crisis.
services: networking
author: rambk

ms.service: virtual-network
ms.topic: article
ms.date: 03/25/2020
ms.author: kumud

---

# Working remotely using Azure networking services

This article describes how you can leverage Azure networking services to enable working remotely. Covid-19 is creating a need for organizations to support more remote workers. As a result, network architects are faced with the following challenges:

- address an increased in network utilization
- provide reliable-secure connectivity to more employees of their company and customers,
- provide connectivity to remote locations across the globe. 

Not all networks (for example, the Internet backbone, private WAN, and corporate core networks) are experiencing congestion because of Covid-19. The bottlenecks are commonly reported only in home broadband networks and VPN gateways of on-premises networks of corporations.

Network planners can help ease the bottlenecks and alleviate the network congestion by keeping in mind that different traffic types need different network treatment priorities and by some smart load redirection/distribution. For example, real-time tele-medecine traffic of doctor-patient interaction is of high importance and delay/jitter sensitive. Whereas replication of the same traffic between storages is not delay sensitive. The former traffic must be routed via the most optimal network path with higher quality of service; whereas it is acceptable to route the later traffic via sub-optimal route.

>[!NOTE] 
>Towards the end of this article, links for Covid-19 preparation articles leveraging different Azure networking features and ecosystems are listed.
>

## Sharing our best practices - Azure network is designed for elasticity and high-availability

Azure is designed to withstand sudden changes in the utilization of the resources and can greatly help at the time of crisis like this. Also, Microsoft maintains and operates one of the worlds' largest network. Microsoft's network has been designed for high availability that can withstand different types of failure: from a single network element failure to failure of an entire region.

Microsoft network is designed to meet the requirements and provide optimal performance for different types of network traffic. Microsoft network is used to service from Teams delay sensitive multimedia traffic to CDN traffic; from real-time big data analysis traffic to Azure storage traffic; from Xbox traffic to Bing traffic. To provide optimal performance for different types of traffic, Microsoft network attracts all the traffic that is destined to- or wanting to transit through- its resources as close as possible to the traffic origination.

>[!NOTE] 
>Using any of features in Azure described below leverages the traffic attraction edge behavior of the Microsoft world-wide network; thereby, off loading traffic from the critically congested first/last mile networks as soon as possible.
>

## Enable employees to work remotely

Azure scalable VPN gateway support both Point-to-Site (P2S) and Site-to-Site (S2S) VPN connections. Using Azure VPN gateway you can scale your employee's connections to securely access both your Azure deployed resources and your on-premises resources. For more information, see [How to enable users to work remotely](https://go.microsoft.com/fwlink/?linkid=2123770). 

If you are using SSTP, the number of concurrent connections would be limited to 128. To overcome this limitation we suggest transitioning to OpenVPN or IKEv2. For more information, see [Transition to OpenVPN protocol or IKEv2 from SSTP](https://go.microsoft.com/fwlink/?linkid=2124112).

To access your resources deployed in Azure, remote employees could use Azure Bastion solution, instead of VPN connection. For more information, see [Azure Bastion COVID-19 update](https://go.microsoft.com/fwlink/?linkid=2123939) for further details.

For aggregating large-scale VPN connection, to support any-to-any connections between resources in different on-prem global locations, in different regional hub and spoke virtual networks, and to optimize utilization of multiple home broadband networks you can use Azure Virtual WAN. For more information, see [Struggling to cater to work from home needs? Here is where Azure Virtual WAN can help](https://go.microsoft.com/fwlink/?linkid=2123769).

Another way to support a remote workforce is to deploy a Virtual Desktop Infrastructure (VDI) hosted in your Azure virtual network, secured with an Azure Firewall. For example, Windows Virtual Desktop (WVD) is a desktop and app virtualization service that runs in Azure. With Windows Virtual Desktop, you can set up a scalable and flexible environment in your Azure subscription without the need to run any additional gateway servers. You are only responsible for the WVD virtual machines in your virtual network. For more information, see [Azure Firewall remote work support](../firewall/remote-work-support.md). 

Azure also has a rich set of eco system partners. Our partners Network Virtual Appliances on Azure can also help scale VPN connectivity. For more information, see [Network Virtual Appliance (NVA) Considerations during COVID-19](https://go.microsoft.com/fwlink/?linkid=2123771).

## Enable employees to access globally distributed on-premises resources

Use ExpressRoute Global Reach, Azure VPN gateway, or Azure Virtual WAN services to establish connectivity between your different on-premises network across globe.

## Scale customer connectivity to frontend resources

Covid-19 is also creating a need for people to go online more. Even those who are not used to online transactions are now forced to do so. This results in increased customer traffic to many corporate websites Azure Application Gateway can help managing this increased frontend workload. For more information, see[Application Gateway COVID-19 Update](https://go.microsoft.com/fwlink/?linkid=2123940).

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
| [COVID update - ExpressRoute](https://go.microsoft.com/fwlink/?linkid=2123768) | March 23, 2020 |
|[Azure Firewall remote work support](../firewall/remote-work-support.md)|March 25, 2020|
