---
title: Enable remote work by using Azure networking services
description: Learn how to use Azure networking services to enable remote work and how to mitigate traffic issues that result from an increased number of people who work remotely.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 04/09/2023
ms.author: allensu

---

# Enable remote work by using Azure networking services

This article presents the different options available for organizations to establish remote access for their users. It also covers ways to supplement their existing solutions with extra capacity during periods of peak utilization.

Network architects are faced with the following challenges:

- Address an increase in network utilization.

- Provide reliable and secure connectivity to more employees of their company and customers.

- Provide connectivity to remote locations across the globe.

Not all networks (for example, private WAN and corporate core networks) experience congestion from peak loads of remote workers. The bottlenecks are commonly reported only in home broadband networks and in VPN gateways of on-premises networks of corporations.

Network planners can help ease bottlenecks and alleviate network congestion by keeping in mind that different traffic types need different network treatment priorities. Some traffic requires smart load redirection or redistribution.

For example, real-time telemedicine traffic of doctor/patient interaction has a high importance and is sensitive to delay or jitter. Replication of traffic between storage solutions isn't delay sensitive. Telemedicine traffic must be routed via the most optimal network path with a high quality of service, whereas it's acceptable to use a suboptimal route for traffic between storage solutions.

## Elasticity and high availability in the Microsoft network

Azure is designed to withstand sudden changes in resource utilization and to keep systems running during periods of peak utilization.

Microsoft maintains and operates one of the world's largest networks. The Microsoft network has been designed for high availability to withstand various types of failures, from failure of a single network element to failure of an entire region.

The Microsoft network is also designed to handle various types of network traffic. This traffic can include delay-sensitive multimedia traffic for Skype and Teams, content delivery networks, real-time big data analysis, Azure Storage, Bing, and Xbox. For optimal performance, Microsoft's network directs traffic intended for its resources or passing through them to be routed as close as possible to the traffic's point of origin.

>[!NOTE]
>Using the Azure networking features described in this article takes advantage of the traffic attraction behavior of the Microsoft global network to provide a better networking experience for customers. The traffic attraction behavior of the Microsoft network helps offload traffic as soon as possible from the first-mile and last-mile networks that might experience congestion during periods of peak utilization.

## Enable employees to work remotely

Azure VPN Gateway supports both point-to-site (P2S) and site-to-site (S2S) VPN connections. By using Azure VPN Gateway, you can scale your employees' connections to securely access both your Azure-deployed resources and your on-premises resources. For more information, see [Remote work using Azure VPN Gateway point-to-site](../vpn-gateway/work-remotely-support.md).

If you're using Secure Socket Tunneling Protocol (SSTP), the number of concurrent connections is limited to 128. To get a higher number of connections, we suggest transitioning to OpenVPN or IKEv2. For more information, see [Transition to OpenVPN protocol or IKEv2 from SSTP](../vpn-gateway/ikev2-openvpn-from-sstp.md).

To access your resources deployed in Azure, remote developers can use Azure Bastion instead of a VPN connection. That solution can provide secure shell access (RDP or SSH) without requiring public IP addresses on the VMs that are being accessed. For more information, see [Enable remote work by using Azure Bastion](../bastion/work-remotely-support.md).

You can use Azure Virtual WAN to:

- Aggregate large-scale VPN connections.

- Support any-to-any connections between resources in different on-premises global locations and in different regional hub-and-spoke virtual networks.

- Optimize utilization of multiple home broadband networks.

For more information, see [Azure Virtual WAN and supporting remote work](../virtual-wan/work-remotely-support.md).

Another way to support a remote workforce is to deploy a virtual desktop infrastructure (VDI) hosted in your Azure virtual network, secured with Azure Firewall. For example, Azure Virtual Desktop is a desktop and app virtualization service that runs in Azure. With Virtual Desktop, you can set up a scalable and flexible environment in your Azure subscription without the need to run any extra gateway servers. You're responsible only for the Virtual Desktop virtual machines in your virtual network. For more information, see [Azure Firewall remote work support](../firewall/remote-work-support.md).

Azure also has a rich set of ecosystem partners. Their network virtual appliances (NVAs) on Azure can also help scale VPN connectivity. For more information, see [NVA considerations for remote work](../vpn-gateway/nva-work-remotely-support.md).

## Extend employee connections to access globally distributed resources

The following Azure solutions can help enable employees to access your globally distributed resources. Your resources could be in any of the Azure regions, in on-premises networks, or even in other public or private clouds.

- **Azure virtual network peering**: You can connect virtual networks together by using virtual network peering. Virtual network peering is useful if your resources are in more than one Azure region or if you need to connect multiple virtual networks to support remote workers. For more information, see [Virtual network peering][VNet-peer].

- **Azure VPN-based solution**: For remote employees connected to Azure, you can provide them with access to your on-premises networks by establishing a S2S VPN connection. This connection is between your on-premises networks and Azure VPN Gateway. For more information, see [Create a site-to-site connection][S2S].

- **Azure ExpressRoute**: By using ExpressRoute private peering, you can enable private connectivity between your Azure deployments and on-premises infrastructure or your infrastructure in a colocation facility. ExpressRoute, via Microsoft peering, also permits accessing public endpoints at Microsoft from your on-premises network.

  ExpressRoute connections don't go over the public internet. They offer secure connectivity, reliability, and higher throughput, with lower and more consistent latencies than typical connections over the internet. For more information, see [ExpressRoute overview][ExR].

  Using an existing network provider that's already part of the [ExpressRoute partner ecosystem][ExR-eco] can help reduce the time to get large-bandwidth connections to Microsoft. By using [ExpressRoute Direct][ExR-D], you can directly connect your on-premises network to the Microsoft backbone. ExpressRoute Direct offers two line-rate options: dual 10 Gbps or 100 Gbps.

- **Azure Virtual WAN**: Azure Virtual WAN allows seamless interoperability between your VPN connections and ExpressRoute circuits. As mentioned earlier, Azure Virtual WAN also supports any-to-any connections between resources in different on-premises global locations and in different regional hub-and-spoke virtual networks.

## Scale customer connectivity to front-end resources

During times when more people go online, many corporate websites experience increased customer traffic. Azure Application Gateway can help manage this increased front-end workload. For more information, see [Application Gateway high-traffic support](../application-gateway/high-traffic-support.md).

## Microsoft support for multicloud traffic

For your deployments in other public clouds, Microsoft can provide global connectivity. Azure Virtual WAN, VPN Gateway, or ExpressRoute can help in this regard. To extend connectivity from Azure to other clouds, you can configure S2S VPN between the two clouds. You can also establish connectivity from Azure to other public clouds by using ExpressRoute.

Oracle Cloud is part of the ExpressRoute partner ecosystem. You can [set up a direct interconnection between Azure and Oracle Cloud Infrastructure][Az-OCI].

Most service providers that are part of the ExpressRoute partner ecosystem also offer private connectivity to other public clouds. By using these service providers, you can establish private connectivity between your deployments in Azure and other clouds via ExpressRoute.

## Next steps

The following articles discuss how you can use Azure networking features to scale users to work remotely:

| **Article** | **Description** |
| --- | --- |
| [Remote work using Azure VPN Gateway point-to-site](../vpn-gateway/work-remotely-support.md) | Review available options to set up remote access for users or to supplement their existing solutions with extra capacity for your organization.|
| [Azure Virtual WAN and supporting remote work](../virtual-wan/work-remotely-support.md) | Use Azure Virtual WAN to address the remote connectivity needs of your organization.|
| [Application Gateway high-traffic support](../application-gateway/high-traffic-support.md) | Use Azure Application Gateway with web application firewall (WAF) for a scalable and secure way to manage traffic to your web applications. |
| [Working remotely: NVA considerations for remote work](../vpn-gateway/nva-work-remotely-support.md)|Review guidance about using NVAs in Azure to provide remote access solutions. |
| [Transition to OpenVPN protocol or IKEv2 from SSTP](../vpn-gateway/ikev2-openvpn-from-sstp.md) | Overcome the limit of 128 concurrent connections for SSTP by transitioning to OpenVPN protocol or IKEv2.|
| [Enable remote work by using Azure Bastion](../bastion/work-remotely-support.md) | Provide RDP/SSH connectivity to virtual machines within the Azure virtual network, directly in the Azure portal, without the use of a public IP address. |
| [Using Azure ExpressRoute to create hybrid connectivity to support remote users](../expressroute/work-remotely-support.md) | Use ExpressRoute for hybrid connectivity to enable users in your organization to work remotely.|
| [Azure Firewall remote work support](../firewall/remote-work-support.md)|Help protect your Azure virtual network resources by using Azure Firewall. |

<!--Link References-->
[VNet-peer]: ../virtual-network/virtual-network-peering-overview.md
[S2S]: ../vpn-gateway/tutorial-site-to-site-portal.md
[ExR]: ../expressroute/expressroute-introduction.md
[ExR-eco]: ../expressroute/expressroute-locations.md
[ExR-D]: ../expressroute/expressroute-erdirect-about.md
[Az-OCI]: ../virtual-machines/workloads/oracle/configure-azure-oci-networking.md
