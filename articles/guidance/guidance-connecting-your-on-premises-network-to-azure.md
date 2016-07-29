<properties
   pageTitle="Connecting your on-premises network to Azure. | Microsoft Azure"
   description="Explains and compares the different methods available for connecting to Microsoft cloud services such as Azure, Office 365, and Dynamics CRM Online."
   services=""
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor=""
   tags=""/>
<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/28/2016"
   ms.author="jdial"/>
   
# Connecting your on-premises network to Azure

Microsoft provides several types of cloud services. While you can connect to all of the services over the public Internet, you can also connect to some of the services using a virtual private network (VPN) tunnel over the Internet or over a direct, private connection to Microsoft. This article helps you determine which connectivity option will best meet your needs based on the types of Microsoft cloud services that you consume. Most organizations utilize multiple connection types described below.

## Connecting over the public Internet

This connection type provides access to Microsoft cloud services directly over the Internet. It is usually the first connectivity type used for connecting to cloud services. This type has no connectivity or bandwidth costs since you use your existing Internet connection. The table below lists pros and cons of this connection type.



| **Pros**| **Cons**|
|---------|---------|
|Requires no modification to your on-premises network as long as all client devices have unlimited access to all IP addresses and ports on the Internet.|Though traffic is often encrypted using HTTPS, it can be intercepted in transit since it traverses the public Internet.|
|Can connect to all Microsoft cloud services exposed to the public Internet.|Unpredictable latency because the connection traverses the Internet.|
|Uses your existing Internet connection.||
|Doesn't require management of any connectivity devices.||

## Connecting with a point-to-site connection

This connection type provides access to some Microsoft cloud services through a Secure Socket Tunneling Protocol (SSTP) tunnel over the Internet, as shown below.

![P2S](./media/guidance-connecting-your-on-premises-network-to-azure/p2s.png "Point-to-site connection")

Though the connection is made over your existing Internet connection, it requires use of the Azure [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) service, with its associated [pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) and outbound data transfer [pricing](https://azure.microsoft.com/pricing/details/data-transfers). The table below lists pros and cons of this connection type.

| **Pros**| **Cons**|
|---------|---------|
|Requires no modification to your on-premises network as long as all client devices have unlimited access to all IP addresses and ports on the Internet.|Though traffic is encrypted using IPSec, it can be intercepted in transit since it traverses the public Internet.|
|Uses your existing Internet connection.|Unpredictable latency because the connection traverses the Internet.|
|[Throughput](../vpn-gateway/vpn-gateway-about-vpngateways.md#aggthroughput) up to 200 Mb/s per gateway.|Requires creation and management of separate connections between each device on your on-premises network and each gateway each device needs to connect to.|
|Can be used to connect to Azure services that can be connected to an Azure [Virtual Network](../virtual-network/virtual-networks-overview.md) (VNet) such as [Windows](../virtual-machines/virtual-machines-windows-about.md) or [Linux](../virtual-machines/virtual-machines-linux-azure-overview.md) Azure Virtual Machines and Azure [Cloud Services](../cloud-services/cloud-services-choose-me.md).|Requires minimal ongoing administration of an Azure VPN Gateway.|
||Cannot be used to connect to Microsoft Office 365 or Dynamics CRM Online.
||Cannot be used to connect to Azure services that cannot be connected to a VNet.|

## Connecting with a site-to-site connection

This connection type provides access to some Microsoft cloud services through an IPSec tunnel over the Internet, as shown below.

![S2S](./media/guidance-connecting-your-on-premises-network-to-azure/s2s.png "Site-to-site connection")

Though the connection is made over your existing Internet connection, it requires use of the [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) service, with its associated [pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) and outbound data transfer [pricing](https://azure.microsoft.com/pricing/details/data-transfers). The table below lists pros and cons of this connection type.

| **Pros**| **Cons**|
|---------|---------|
|All devices on your on-premises network can communicate with Azure services connected to a VNet so there’s no need to configure individual connections for each device.|Though traffic is encrypted using IPSec, it can be intercepted in transit since it traverses the public Internet.|
|Uses your existing Internet connection.|Unpredictable latency because the connection traverses the Internet.|
|Can be used to connect to Azure services that can be connected to a VNet such as Virtual Machines and Cloud Services.|Must configure and manage a [validated VPN device](../vpn-gateway/vpn-gateway-about-vpn-devices.md#validated-vpn-devices) on-premises.|
|[Throughput](../vpn-gateway/vpn-gateway-about-vpngateways.md#aggthroughput) up to 200 Mb/s per gateway.|Requires minimal ongoing administration of an Azure VPN Gateway.|
|Can force outbound traffic initiated from cloud virtual machines through the on-premises network for inspection and logging using [user-defined routes](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) or the [Border Gateway Protocol](../vpn-gateway/vpn-gateway-bgp-overview.md) (BGP).|Cannot be used to connect to Microsoft Office 365 or Dynamics CRM Online.|
||Cannot be used to connect to Azure services that cannot be connected to a VNet.|
||May necessitate a firewall between the on-premises network and Azure if using services that initiate connections back to on-premises devices.|

## Connecting with a dedicated private connection

This connection type provides access to all Microsoft cloud services over a dedicated private connection to Microsoft that does not traverse the Internet, as shown below.

![ER](./media/guidance-connecting-your-on-premises-network-to-azure/er.png "ExpressRoute connection")

The connection requires use of the ExpressRoute service with its associated [pricing](https://azure.microsoft.com/pricing/details/expressroute/), [connectivity provider](../expressroute/expressroute-locations.md#connectivity-provider-locations) costs, as well as a VPN Gateway and it's associated [pricing](https://azure.microsoft.com/pricing/details/vpn-gateway), if you connect the circuit to Microsoft VNets. The table below lists pros and cons of this connection type.

| **Pros**| **Cons**|
|---------|---------|
|Traffic cannot be intercepted in transit over the public Internet since a dedicated connection through a service provider is used.|Requires on-premises router management.|
|[Bandwidth](..expressroute/expressroute-introduction#supported-bandwidth-options.md) up to 10 Gb/s per ExpressRoute circuit and [throughput](../vpn-gateway/vpn-gateway-about-vpngateways.md#aggthroughput) up to 2 Gb/s to each gateway.|Requires a dedicated connection to a connectivity provider.|
|Predictable latency because it’s a dedicated connection to Microsoft that does not traverse the Internet.|May require minimal ongoing administration of one or more Azure VPN Gateways (if connecting the circuit to VNets).|
|Does not require encrypted communication though you can encrypt the traffic, if desired.|May necessitate a firewall between the on-premises network and Azure if using cloud services that initiate connections back to on-premises devices.|
|Can directly connect to all Microsoft cloud services, with a few [exceptions](../expressroute/expressroute-faqs.md#supported-services).|Requires [network address translation](../expressroute/expressroute-nat.md) (NAT) of on-premises IP addresses entering the Microsoft data centers for services other than those that can be connected to a VNet.|
|Can force outbound traffic initiated from cloud virtual machines through the on-premises network for inspection and logging using BGP.|


## Additional considerations

Several of the options above have various maximum limits they can support for VNet connections, gateway connections, and other criteria. It’s recommend that you review the Azure [networking limits](../azure-subscription-service-limits.md#networking-limits) to understand if any of them impact the connectivity type(s) you choose to use. You can connect a gateway from a site-to-site VPN connection to the same VNet as an ExpressRoute gateway, but if you plan to do this you should familiarize yourself with important [constraints](../expressroute/expressroute-howto-coexist-resource-manager.md#limits-and-limitations) first.

## Next steps

Now that you have a better understanding of the available connectivity option(s) and have determined which best meet your requirements, you might be interested in viewing the resources below, which provide tested implementation steps for the connectivity options discussed above.

-    [Implement a point-to-site connection](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)
-   [Implement a site-to-site connection](guidance-hybrid-network-vpn.md)
-   [Implement a dedicated private connection](guidance-hybrid-network-expressroute.md)
-   [Implement a dedicated private connection with a site-to-site connection for high availability](guidance-hybrid-network-expressroute-vpn-failover.md)
