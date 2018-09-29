---
title: Azure ExpressRoute FAQ | Microsoft Docs
description: The ExpressRoute FAQ contains information about Supported Azure Services, Cost, Data and Connections, SLA, Providers and Locations, Bandwidth, and additional Technical Details.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: cherylmc

---
# ExpressRoute FAQ

## What is ExpressRoute?

ExpressRoute is an Azure service that lets you create private connections between Microsoft datacenters and infrastructure that’s on your premises or in a colocation facility. ExpressRoute connections do not go over the public Internet, and offer higher security, reliability, and speeds with lower latencies than typical connections over the Internet.

### What are the benefits of using ExpressRoute and private network connections?

ExpressRoute connections do not go over the public Internet. They offer higher security, reliability, and speeds, with lower and consistent latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between on-premises devices and Azure can yield significant cost benefits.

### Where is the service available?

See this page for service location and availability: [ExpressRoute partners and locations](expressroute-locations.md).

### How can I use ExpressRoute to connect to Microsoft if I don’t have partnerships with one of the ExpressRoute-carrier partners?

You can select a regional carrier and land Ethernet connections to one of the supported exchange provider locations. You can then peer with Microsoft at the provider location. Check the last section of [ExpressRoute partners and locations](expressroute-locations.md) to see if your service provider is present in any of the exchange locations. You can then order an ExpressRoute circuit through the service provider to connect to Azure.

### How much does ExpressRoute cost?

Check [pricing details](https://azure.microsoft.com/pricing/details/expressroute/) for pricing information.

### If I pay for an ExpressRoute circuit of a given bandwidth, does the VPN connection I purchase from my network service provider have to be the same speed?

No. You can purchase a VPN connection of any speed from your service provider. However, your connection to Azure is limited to the ExpressRoute circuit bandwidth that you purchase.

### If I pay for an ExpressRoute circuit of a given bandwidth, do I have the ability to burst up to higher speeds if necessary?

Yes. ExpressRoute circuits are configured to allow you to burst up to two times the bandwidth limit you procured for no additional cost. Check with your service provider to see if they support this capability.

### Can I use the same private network connection with virtual network and other Azure services simultaneously?

Yes. An ExpressRoute circuit, once set up, allows you to access services within a virtual network and other Azure services simultaneously. You connect to virtual networks over the private peering path, and to other services over the Microsoft  peering path.

### Does ExpressRoute offer a Service Level Agreement (SLA)?

For information, see the [ExpressRoute SLA](https://azure.microsoft.com/support/legal/sla/) page.

## Supported services

ExpressRoute supports [three routing domains](expressroute-circuit-peerings.md) for various types of services.

### Private peering

* Virtual networks, including all virtual machines and cloud services

### Public peering

>[!NOTE]
>Public peering has been disabled on new ExpressRoute circuits. Azure services are available on Microsoft peering.
>

* Power BI
* Dynamics 365 for Finance and Operations (formerly known as Dynamics AX Online)
* Most of the Azure services are supported. Please check directly with the service that you want to use to verify support.<br>
  The following services are NOT supported:
    * CDN
    * Azure DevOps Services Load Testing
    * Multi-factor Authentication
    * Traffic Manager

### Microsoft peering

* [Office 365](http://aka.ms/ExpressRouteOffice365)
* Dynamics 365 
* Power BI
* Azure Active Directory
* Azure DevOps Services Load Testing
* Most of the Azure services are supported. Please check directly with the service that you want to use to verify support.<br>The following services are **not supported**:
    * CDN
    * Azure DevOps Services Load Testing
    * Multi-factor Authentication
    * Traffic Manager

## Data and connections

### Are there limits on the amount of data that I can transfer using ExpressRoute?

We do not set a limit on the amount of data transfer. Refer to [pricing details](https://azure.microsoft.com/pricing/details/expressroute/) for information on bandwidth rates.

### What connection speeds are supported by ExpressRoute?

Supported bandwidth offers:

50 Mbps, 100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps, 10 Gbps

### Which service providers are available?

See [ExpressRoute partners and locations](expressroute-locations.md) for the list of service providers and locations.

## Technical details

### What are the technical requirements for connecting my on-premises location to Azure?

See [ExpressRoute prerequisites page](expressroute-prerequisites.md) for requirements.

### Are connections to ExpressRoute redundant?

Yes. Each ExpressRoute circuit has a redundant pair of cross connections configured to provide high availability.

### Will I lose connectivity if one of my ExpressRoute links fail?

You will not lose connectivity if one of the cross connections fails. A redundant connection is available to support the load of your network and provide high availability of your ExpressRoute circuit. You can additionally create a circuit in a different peering location to achieve circuit-level resilience.

### How do I ensure high availability on a virtual network connected to ExpressRoute?

You can achieve high availability by connecting ExpressRoute circuits in different peering locations (for example, Singapore, Singapore2) to your virtual network. If one ExpressRoute circuit goes down, connectivity will fail over to another ExpressRoute circuit. By default, traffic leaving your virtual network is routed based on Equal Cost Multi-path Routing (ECMP). You can use Connection Weight to prefer one circuit to another. For more information, see [Optimizing ExpressRoute Routing](expressroute-optimize-routing.md).

### <a name="onep2plink"></a>If I'm not co-located at a cloud exchange and my service provider offers point-to-point connection, do I need to order two physical connections between my on-premises network and Microsoft?

If your service provider can establish two Ethernet virtual circuits over the physical connection, you only need one physical connection. The physical connection (for example, an optical fiber) is terminated on a layer 1 (L1) device (see the image). The two Ethernet virtual circuits are tagged with different VLAN IDs, one for the primary circuit, and one for the secondary. Those VLAN IDs are in the outer 802.1Q Ethernet header. The inner 802.1Q Ethernet header (not shown) is mapped to a specific [ExpressRoute routing domain](expressroute-circuit-peerings.md).

![](./media/expressroute-faqs/expressroute-p2p-ref-arch.png)

### Can I extend one of my VLANs to Azure using ExpressRoute?

No. We do not support layer 2 connectivity extensions into Azure.

### Can I have more than one ExpressRoute circuit in my subscription?

Yes. You can have more than one ExpressRoute circuit in your subscription. The default limit is set to 10. You can contact Microsoft Support to increase the limit, if needed.

### Can I have ExpressRoute circuits from different service providers?

Yes. You can have ExpressRoute circuits with many service providers. Each ExpressRoute circuit is associated with one service provider only. 

### I see two ExpressRoute peering locations in the same metro, for example, Singapore and Singapore2. Which peering location should I choose to create my ExpressRoute circuit?
If your service provider offers ExpressRoute at both sites, you can work with your provider and pick either site to set up ExpressRoute. 

### Can I have multiple ExpressRoute circuits in the same metro? Can I link them to the same virtual network?

Yes. You can have multiple ExpressRoute circuits with the same or different service providers. If the metro has multiple ExpressRoute peering locations and the circuits are created at different peering locations, you can link them to the same virtual network. If the circuits are created at the same peering location, you can’t link them to the same virtual network. Each location name in Azure portal or in PowerShell/CLI API represents one peering location. For example, you can select the peering locations "Singapore" and "Singapore2" and connect circuits from each to the same virtual network. 

### How do I connect my virtual networks to an ExpressRoute circuit

The basic steps are:

* Establish an ExpressRoute circuit and have the service provider enable it.
* You, or the provider, must configure the BGP peering(s).
* Link the virtual network to the ExpressRoute circuit.

For more information, see [ExpressRoute workflows for circuit provisioning and circuit states](expressroute-workflows.md).

### Are there connectivity boundaries for my ExpressRoute circuit?

Yes. The [ExpressRoute partners and locations](expressroute-locations.md) article provides an overview of the connectivity boundaries for an ExpressRoute circuit. Connectivity for an ExpressRoute circuit is limited to a single geopolitical region. Connectivity can be expanded to cross geopolitical regions by enabling the ExpressRoute premium feature.

### Can I link to more than one virtual network to an ExpressRoute circuit?

Yes. You can have up to 10 virtual networks connections on a standard ExpressRoute circuit, and up to 100 on a [premium ExpressRoute circuit](#expressroute-premium). 

### I have multiple Azure subscriptions that contain virtual networks. Can I connect virtual networks that are in separate subscriptions to a single ExpressRoute circuit?

Yes. You can authorize up to 10 other Azure subscriptions to use a single ExpressRoute circuit. This limit can be increased by enabling the ExpressRoute premium feature.

For more information, see [Sharing an ExpressRoute circuit across multiple subscriptions](expressroute-howto-linkvnet-arm.md).

### I have multiple Azure subscriptions associated to different Azure Active Directory tenants or Enterprise Agreement enrollments. Can I connect virtual networks that are in separate tenants and enrollments to a single ExpressRoute circuit not in the same tenant or enrollment?

Yes. ExpressRoute authorizations can span subscription, tenant, and enrollment boundaries with no additional configuration required. 

For more information, see [Sharing an ExpressRoute circuit across multiple subscriptions](expressroute-howto-linkvnet-arm.md).

### Are virtual networks connected to the same circuit isolated from each other?

No. From a routing perspective, all virtual networks linked to the same ExpressRoute circuit are part of the same routing domain and are not isolated from each other. If you need route isolation, you need to create a separate ExpressRoute circuit.

### Can I have one virtual network connected to more than one ExpressRoute circuit?

Yes. You can link a single virtual network with up to four ExpressRoute circuits. They must be ordered through four different [ExpressRoute locations](expressroute-locations.md).

### Can I access the Internet from my virtual networks connected to ExpressRoute circuits?

Yes. If you have not advertised default routes (0.0.0.0/0) or Internet route prefixes through the BGP session, you can connect to the Internet from a virtual network linked to an ExpressRoute circuit.

### Can I block Internet connectivity to virtual networks connected to ExpressRoute circuits?

Yes. You can advertise default routes (0.0.0.0/0) to block all Internet connectivity to virtual machines deployed within a virtual network and route all traffic out through the ExpressRoute circuit.

If you advertise default routes, we force traffic to services offered over Microsoft peering (such as Azure storage and SQL DB) back to your premises. You will have to configure your routers to return traffic to Azure through the Microsoft peering path or over the Internet. If you've enabled a service endpoint for the service, the traffic to the service is not forced to your premises. The traffic remains within the Azure backbone network. To learn more about service endpoints, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md?toc=%2fazure%2fexpressroute%2ftoc.json)

### Can virtual networks linked to the same ExpressRoute circuit talk to each other?

Yes. Virtual machines deployed in virtual networks connected to the same ExpressRoute circuit can communicate with each other.

### Can I use site-to-site connectivity for virtual networks in conjunction with ExpressRoute?

Yes. ExpressRoute can coexist with site-to-site VPNs.

### Can I move a virtual network from site-to-site / point-to-site configuration to use ExpressRoute?

Yes. You will have to create an ExpressRoute gateway within your virtual network. There is a small downtime associated with the process.

### Why is there a public IP address associated with the ExpressRoute gateway on a virtual network?

The public IP address is used for internal management only, and does not constitute a security exposure of your virtual network.

### Are there limits on the number of routes I can advertise?

Yes. We accept up to 4000 route prefixes for private peering and 200 for Microsoft peering. You can increase this to 10,000 routes for private peering if you enable the ExpressRoute premium feature.

### Are there restrictions on IP ranges I can advertise over the BGP session?

We do not accept private prefixes (RFC1918) for the Microsoft peering BGP session.

### What happens if I exceed the BGP limits?

BGP sessions will be dropped. They will be reset once the prefix count goes below the limit.

### What is the ExpressRoute BGP hold time? Can it be adjusted?

The hold time is 180. The keep-alive messages are sent every 60 seconds. These are fixed settings on the Microsoft side that cannot be changed. It is possible for you to configure different timers, and the BGP session parameters will be negotiated accordingly.

### Can I change the bandwidth of an ExpressRoute circuit?

Yes, you can attempt to increase the bandwidth of your ExpressRoute circuit in the Azure portal, or by using PowerShell. If there is capacity available on the physical port on which your circuit was created, your change succeeds. 

If your change fails, it means either there isn’t enough capacity left on the current port and you need to create a new ExpressRoute circuit with the higher bandwidth, or that there is no additional capacity at that location, in which case you won't be able to increase the bandwidth. 

You will also have to follow up with your connectivity provider to ensure that they update the throttles within their networks to support the bandwidth increase. You cannot, however, reduce the bandwidth of your ExpressRoute circuit. You have to create a new ExpressRoute circuit with lower bandwidth and delete the old circuit.

### How do I change the bandwidth of an ExpressRoute circuit?

You can update the bandwidth of the ExpressRoute circuit using the REST API or PowerShell cmdlet.

## ExpressRoute premium

### What is ExpressRoute premium?

ExpressRoute premium is a collection of the following features:

* Increased routing table limit from 4000 routes to 10,000 routes for private peering.
* Increased number of VNets that can be connected to the ExpressRoute circuit (default is 10). For more information, see the [ExpressRoute Limits](#limits) table.
* Connectivity to Office 365 and Dynamics 365.
* Global connectivity over the Microsoft core network. You can now link a VNet in one geopolitical region with an ExpressRoute circuit in another region.<br>
    **Examples:**

    *  You can link a VNet created in Europe West to an ExpressRoute circuit created in Silicon Valley. 
    *  On the Microsoft peering, prefixes from other geopolitical regions are advertised such that you can connect to, for example, SQL Azure in Europe West from a circuit in Silicon Valley.


### <a name="limits"></a>How many VNets can I link to an ExpressRoute circuit if I enabled ExpressRoute premium?

The following tables show the ExpressRoute limits and the number of VNets per ExpressRoute circuit:

[!INCLUDE [ExpressRoute limits](../../includes/expressroute-limits.md)]

### How do I enable ExpressRoute premium?

ExpressRoute premium features can be enabled when the feature is enabled, and can be shut down by updating the circuit state. You can enable ExpressRoute premium at circuit creation time, or can call the REST API / PowerShell cmdlet.

### How do I disable ExpressRoute premium?

You can disable ExpressRoute premium by calling the REST API or PowerShell cmdlet. You must make sure that you have scaled your connectivity needs to meet the default limits before you disable ExpressRoute premium. If your utilization scales beyond the default limits, the request to disable ExpressRoute premium fails.

### Can I pick and choose the features I want from the premium feature set?

No. You can't pick the features. We enable all features when you turn on ExpressRoute premium.

### How much does ExpressRoute premium cost?

Refer to [pricing details](https://azure.microsoft.com/pricing/details/expressroute/) for cost.

### Do I pay for ExpressRoute premium in addition to standard ExpressRoute charges?

Yes. ExpressRoute premium charges apply on top of ExpressRoute circuit charges and charges required by the connectivity provider.

## ExpressRoute for Office 365

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

### How do I create an ExpressRoute circuit to connect to Office 365 services?

1. Review the [ExpressRoute prerequisites page](expressroute-prerequisites.md) to make sure you meet the requirements.
2. To ensure that your connectivity needs are met, review the list of service providers and locations in the [ExpressRoute partners and locations](expressroute-locations.md) article.
3. Plan your capacity requirements by reviewing [Network planning and performance tuning for Office 365](http://aka.ms/tune/).
4. Follow the steps listed in the workflows to set up connectivity [ExpressRoute workflows for circuit provisioning and circuit states](expressroute-workflows.md).

> [!IMPORTANT]
> Make sure that you have enabled ExpressRoute premium add-on when configuring connectivity to Office 365 services.
> 
> 

### Can my existing ExpressRoute circuits support connectivity to Office 365 services and Dynamics 365?

Yes. Your existing ExpressRoute circuit can be configured to support connectivity to Office 365 services. Make sure that you have sufficient capacity to connect to Office 365 services and that you have enabled premium add-on. [Network planning and performance tuning for Office 365](http://aka.ms/tune/) helps you plan your connectivity needs. Also, see [Create and modify an ExpressRoute circuit](expressroute-howto-circuit-classic.md).

### What Office 365 services can be accessed over an ExpressRoute connection?

Refer to [Office 365 URLs and IP address ranges](http://aka.ms/o365endpoints) page for an up-to-date list of services supported over ExpressRoute.

### How much does ExpressRoute for Office 365 services cost?

Office 365 services require premium add-on to be enabled. See the [pricing details page](https://azure.microsoft.com/pricing/details/expressroute/) for costs.

### What regions is ExpressRoute for Office 365 supported in?

See [ExpressRoute partners and locations](expressroute-locations.md) for information.

### Can I access Office 365 over the Internet, even if ExpressRoute was configured for my organization?

Yes. Office 365 service endpoints are reachable through the Internet, even though ExpressRoute has been configured for your network. Please check with your organization's networking team if the network at your location is configured to connect to Office 365 services through ExpressRoute.

### How can I plan for high availability for Office 365 network traffic on Azure ExpressRoute?
See the recommendation for [High availability and failover with Azure ExpressRoute](https://aka.ms/erhighavailability)

### Can I access Office 365 US Government Community (GCC) services over an Azure US Government ExpressRoute circuit?

Yes. Office 365 GCC service endpoints are reachable through the Azure US Government ExpressRoute. However, you first need to open a support ticket on the Azure portal to provide the prefixes you intend to advertise to Microsoft. Your connectivity to Office 365 GCC services will be established after the support ticket is resolved. 

## Route filters for Microsoft peering

### I am turning on Microsoft peering for the first time, what routes will I see?

You will not see any routes. You have to attach a route filter to your circuit to start prefix advertisements. For instructions, see [Configure route filters for Microsoft peering](how-to-routefilter-powershell.md).

### I turned on Microsoft peering and now I am trying to select Exchange Online, but it is giving me an error that I am not authorized to do it.

When using route filters, any customer can turn on Microsoft peering. However, for consuming Office 365 services, you still need to get authorized by Office 365.

### Do I need to get authorization for turning on Dynamics 365 over Microsoft peering?

No, you do not need authorization for Dynamics 365. You can create a rule and select Dynamics 365 community without authorization.

### I enabled Microsoft peering prior to August 1, 2017, how can I take advantage of route filters?

Your existing circuit will continue advertising the prefixes for Office 365 and Dynamics 365. If you want to add Azure public prefixes advertisements over the same Microsoft peering, you can create a route filter, select the services you need advertised (including the Office 365 service(s) you need and Dynamics 365), and attach the filter to your Microsoft peering. For instructions, see [Configure route filters for Microsoft peering](how-to-routefilter-powershell.md).

### I have Microsoft peering at one location, now I am trying to enable it at another location and I am not seeing any prefixes.

* Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through Microsoft peering, even if route filters are not defined.

* Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit. You will see no prefixes by default.

## <a name="expressRouteDirect"></a>ExpressRoute Direct (Preview)

[!INCLUDE [ExpressRoute Direct](../../includes/expressroute-direct-faq-include.md)]

## <a name="globalreach"></a>Global Reach (Preview)

[!INCLUDE [Global Reach](../../includes/expressroute-global-reach-faq-include.md)]
