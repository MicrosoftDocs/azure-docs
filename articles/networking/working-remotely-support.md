---
title: 'Working remotely using Azure networking services'
description: This page describes how you can use Azure networking services that are available to enable working remotely and how to mitigate traffic issues resulting from increased number of people working from home due to the COVID-19 crisis.
services: networking
author: rambk

ms.service: virtual-network
ms.topic: article
ms.date: 03/26/2020
ms.author: rambala

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

## Extend employees' connection to access globally distributed resources

Following Azure services can be leveraged to enable employees connected to Azure access your globally distributed resources. Your resources could be in any of the Azure regions, on-premise networks across the globe, or even in other public or private clouds. Microsoft support for multi-cloud traffic is discussed later in this article.

Azure VNet-peering: If you deploy your resources in more than one Azure regions and/or if you aggregate the connectivity of remotely working employees using multiple virtual networks (VNet), you can establish cross connectivity between the multiple Azure Vnets using virtual network peering. For more information, see [Virtual network peering][VNet-peer].

Azure VPN based solution: For your remote employees connected to Azure via P2S or S2S VPN, you can enable access to on-premises networks by configuring S2S VPN between your on-premises networks and Azure VPN gateway. For more information, see [Create a Site-to-Site connection][S2S].

ExpressRoute: Using ExpressRoute private peering you can enable private connectivity between your Azure deployments and infrastructure that's on your premises or in a colocation facility. ExpressRoute, via Microsoft peering, also permits accessing public endpoints in Microsoft from your on-premises network. ExpressRoute connections do not go over the public Internet. They offer secure connectivity, reliability, higher throughput, with lower and consistent latencies than typical connections over the Internet. For more information, see [ExpressRoute overview][ExR]. Leveraging your existing network provider that is already part of our [ExpressRoute partner ecosystem][ExR-eco] can help reduce the time to get large bandwidth connections to Microsoft.  Using [ExpressRoute Direct][ExR-D] you can directly connect your on-premises network to Microsoft backbone. ExpressRoute Direct offers two different line-rate options of dual 10 Gbps or 100 Gbps. 

Azure Virtual WAN: Azure Virtual WAN allows seemless interoperability between your VPN connections and ExpressRoute circuits. As mentioned earlier, Azure Virtual WAN also support any-to-any connections between resources in different on-prem global locations, in different regional hub and spoke virtual networks

## Scale customer connectivity to frontend resources

Covid-19 is also creating a need for people to go online more. Even those who are not used to online transactions are now forced to do so. This results in increased customer traffic to many corporate websites Azure Application Gateway can help managing this increased frontend workload. For more information, see[Application Gateway COVID-19 Update](https://go.microsoft.com/fwlink/?linkid=2123940).

## Microsoft support for multi-cloud traffic

Even for your deployments in other public clouds, Microsoft can provide global connectivity. Azure Virtual WAN, VPN or ExpressRoute can help in this regard. To extend connectivity from Azure to other clouds, you can configure S2S VPN between the two clouds. You can also establish connectivity from Azure to other public clouds using ExpressRoute. Oracle cloud is part of ExpressRoute partner ecosystem. So you can [set up a direct interconnection between Azure and Oracle Cloud Infrastructure][Az-OCI]. Most service providers, who are part of ExpressRoute partner ecosystem, also offer private connectivity to other public clouds like Amazon's AWS and Google's GCP. Leveraging these service provider, you can establish private connectivity between your deployments in Azure and AWS/GCP via ExpressRoute.

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
| [Azure Firewall remote work support](../firewall/remote-work-support.md)|March 25, 2020|

<!--Link References-->
[VNet-peer]: https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview
[S2S]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal
[ExR]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[ExR-eco]: https://docs.microsoft.com/azure/expressroute/expressroute-locations
[ExR-D]: https://docs.microsoft.com/azure/expressroute/expressroute-erdirect-about
[Az-OCI]: https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/configure-azure-oci-networking