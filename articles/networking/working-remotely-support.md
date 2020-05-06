---
title: 'Working remotely using Azure networking services'
description: This page describes how you can use Azure networking services that are available to enable working remotely and how to mitigate traffic issues resulting from increased number of people working remotely.
services: networking
author: rambk

ms.service: virtual-network
ms.topic: article
ms.date: 03/26/2020
ms.author: rambala

---

# Working remotely using Azure networking services

>[!NOTE]
> This article describes how you can leverage Azure networking services, Microsoft network, and the Azure partner ecosystem to work remotely and mitigate network issues that you might be facing because of the COVID-19 crisis.

This article describes the options that are available to organizations to set up remote access for their users or to supplement their existing solutions with additional capacity during periods of peak utilization. Network architects are faced with the following challenges:

- Address an increase in network utilization.
- Provide reliable-secure connectivity to more employees of their company and customers.
- Provide connectivity to remote locations across the globe.

Not all networks (for example, private WAN and corporate core networks) experience congestion from peak remote worker load. The bottlenecks are commonly reported only in home broadband networks and VPN gateways of on-premises networks of corporations.

Network planners can help ease the bottlenecks and alleviate the network congestion by keeping in mind that different traffic types need different network treatment priorities and by some smart load redirection/distribution. For example, real-time tele-medecine traffic of doctor-patient interaction is of high importance and delay/jitter sensitive. Whereas, replication of the same traffic between storages is not delay sensitive. The former traffic must be routed via the most optimal network path with higher quality of service; whereas it is acceptable to route the later traffic via sub-optimal route.



## Sharing our best practices - Azure network is designed for elasticity and high-availability

Azure is designed to withstand sudden changes in the utilization of the resources and can greatly help during periods of peak utilization. Also, Microsoft maintains and operates one of the worlds' largest networks. Microsoft's network has been designed for high availability that can withstand different types of failure: from a single network element failure to failure of an entire region.

The Microsoft network is designed to meet the requirements and provide optimal performance for different types of network traffic including delay sensitive multimedia traffic for Skype and Teams, CDN, real-time big data analysis, Azure storage, Bing, and Xbox. To provide optimal performance for different types of traffic, the Microsoft network attracts all the traffic that is destined to- or wanting to transit through- its resources as close as possible to the origin of the traffic.

>[!NOTE] 
>Using the Azure networking features described below leverages the traffic attraction behavior of the Microsoft global network to provide a better customer networking experience. The traffic attraction behavior of the Microsoft network helps off loading traffic as soon as possible from the first/last mile networks that may experience congestion during periods of peak utilization.
>

## Enable employees to work remotely

Azure VPN gateway supports both Point-to-Site (P2S) and Site-to-Site (S2S) VPN connections. Using the Azure VPN gateway you can scale your employee's connections to securely access both your Azure deployed resources and your on-premises resources. For more information, see [How to enable users to work remotely](../vpn-gateway/work-remotely-support.md). 

If you are using Secure Sockets Tunneling Protocol (SSTP), the number of concurrent connections is limited to 128. To get a higher number of connections, we suggest transitioning to OpenVPN or IKEv2. For more information, see [Transition to OpenVPN protocol or IKEv2 from SSTP](../vpn-gateway/ikev2-openvpn-from-sstp.md
).

To access your resources deployed in Azure, remote developers could use Azure Bastion solution, instead of VPN connection to get secure shell access (RDP or SSH) without requiring public IPs on the VMs being accessed. For more information, see [Work remotely using Azure Bastion](../bastion/work-remotely-support.md).

For aggregating large-scale VPN connection, to support any-to-any connections between resources in different on-premises global locations, in different regional hub and spoke virtual networks, and to optimize utilization of multiple home broadband networks you can use Azure Virtual WAN. For more information, see [Struggling to cater to work from home needs? Here is where Azure Virtual WAN can help](../virtual-wan/work-remotely-support.md).

Another way to support a remote workforce is to deploy a Virtual Desktop Infrastructure (VDI) hosted in your Azure virtual network, secured with an Azure Firewall. For example, Windows Virtual Desktop (WVD) is a desktop and app virtualization service that runs in Azure. With Windows Virtual Desktop, you can set up a scalable and flexible environment in your Azure subscription without the need to run any additional gateway servers. You are only responsible for the WVD virtual machines in your virtual network. For more information, see [Azure Firewall remote work support](../firewall/remote-work-support.md). 

Azure also has a rich set of eco system partners. Our partners Network Virtual Appliances on Azure can also help scale VPN connectivity. For more information, see [Network Virtual Appliance (NVA) considerations for remote work](../vpn-gateway/nva-work-remotely-support.md).

## Extend employees' connection to access globally distributed resources

The following Azure services can help enable employees to access your globally distributed resources. Your resources could be in any of the Azure regions, on-premises networks, or even in other public or private clouds. 

- **Azure virtual network peering**: If you deploy your resources in more than one Azure regions and/or if you aggregate the connectivity of remotely working employees using multiple virtual networks, you can establish connectivity between the multiple Azure virtual networks using virtual network peering. For more information, see [Virtual network peering][VNet-peer].

- **Azure VPN-based solution**: For your remote employees connected to Azure via P2S or S2S VPN, you can enable access to on-premises networks by configuring S2S VPN between your on-premises networks and Azure VPN gateway. For more information, see [Create a Site-to-Site connection][S2S].

- **ExpressRoute**: Using ExpressRoute private peering you can enable private connectivity between your Azure deployments and on-premises infrastructure or your infrastructure in a co-location facility. ExpressRoute, via Microsoft peering, also permits accessing public endpoints in Microsoft from your on-premises network. ExpressRoute connections do not go over the public Internet. They offer secure connectivity, reliability, higher throughput, with lower and consistent latencies than typical connections over the Internet. For more information, see [ExpressRoute overview][ExR]. Leveraging your existing network provider that is already part of our [ExpressRoute partner ecosystem][ExR-eco] can help reduce the time to get large bandwidth connections to Microsoft.  Using [ExpressRoute Direct][ExR-D] you can directly connect your on-premises network to the Microsoft backbone. ExpressRoute Direct offers two different line-rate options of dual 10 Gbps or 100 Gbps. 

- **Azure Virtual WAN**: Azure Virtual WAN allows seamless interoperability between your VPN connections and ExpressRoute circuits. As mentioned earlier, Azure Virtual WAN also support any-to-any connections between resources in different on-prem global locations, in different regional hub and spoke virtual networks

## Scale customer connectivity to frontend resources

During times when more people go online, many corporate websites experience increased customer traffic. Azure Application Gateway can help manage this increased frontend workload. For more information, see [Application Gateway high traffic support](../application-gateway/high-traffic-support.md).

## Microsoft support for multi-cloud traffic

For your deployments in other public clouds, Microsoft can provide global connectivity. Azure Virtual WAN, VPN or ExpressRoute can help in this regard. To extend connectivity from Azure to other clouds, you can configure S2S VPN between the two clouds. You can also establish connectivity from Azure to other public clouds using ExpressRoute. Oracle cloud is part of ExpressRoute partner ecosystem. You can [set up a direct interconnection between Azure and Oracle Cloud Infrastructure][Az-OCI]. Most service providers that are part of the ExpressRoute partner ecosystem also offer private connectivity to other public clouds. Leveraging these service providers, you can establish private connectivity between your deployments in Azure and other clouds via ExpressRoute.

## Next steps

The following articles discuss how different Azure networking features can be used to scale users to work remotely:

| **Article** | **Description** |
| --- | --- |
| [How to enable users to work remotely](../vpn-gateway/work-remotely-support.md) | Review available options to set up remote access for users or to supplement their existing solutions with additional capacity for your organization.|
| [Struggling to cater to work from home needs? Here is where Azure Virtual WAN can help](../virtual-wan/work-remotely-support.md) | Use Azure Virtual WAN to address the remote connectivity needs of your organization.|
| [Application Gateway high traffic support](../application-gateway/high-traffic-support.md) | Use Application Gateway with Web Application Firewall (WAF) for a scalable and secure way to manage traffic to your web applications. |
| [Network Virtual Appliance (NVA) considerations for remote work](../vpn-gateway/nva-work-remotely-support.md)|Review guidance about leveraging NVAs in Azure to provide remote access solutions. |
| [Transition to OpenVPN protocol or IKEv2 from SSTP](https://go.microsoft.com/fwlink/?linkid=2124112) | Overcome the 128 concurrent connection limit of SSTP by transitioning to OpenVPN protocol or IKEv2.|
| [Working remotely using Azure Bastion](../bastion/work-remotely-support.md) | Provide secure and seamless RDP/SSH connectivity to virtual machines within the Azure virtual network, directly in the Azure portal, without the use of a public IP address. |
| [Using Azure ExpressRoute to create hybrid connectivity to support remote users](../expressroute/work-remotely-support.md) | Use ExpressRoute for hybrid connectivity to enable users in your organization to work remotely.|
| [Azure Firewall remote work support](../firewall/remote-work-support.md)|Protect your Azure virtual network resources using Azure Firewall. |

<!--Link References-->
[VNet-peer]: https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview
[S2S]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal
[ExR]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[ExR-eco]: https://docs.microsoft.com/azure/expressroute/expressroute-locations
[ExR-D]: https://docs.microsoft.com/azure/expressroute/expressroute-erdirect-about
[Az-OCI]: https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/configure-azure-oci-networking
