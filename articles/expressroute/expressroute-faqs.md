---
title: FAQ - Azure ExpressRoute | Microsoft Docs
description: The ExpressRoute FAQ contains information about Supported Azure Services, Cost, Data and Connections, SLA, Providers and Locations, Bandwidth, and other Technical Details.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/12/2023
ms.author: duau

---
# ExpressRoute FAQ

## What is ExpressRoute?

ExpressRoute is an Azure service that lets you create private connections between Microsoft datacenters and infrastructure that's on your premises or in a colocation facility.

### What are the benefits of using ExpressRoute and private network connections?

ExpressRoute connections don't go over the public Internet. They offer higher security, reliability, and speeds, with lower and consistent latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between on-premises devices and Azure can yield significant cost benefits.

### Where is the service available?

For service location and availability, see [ExpressRoute partners and locations](expressroute-locations.md).

### How can I use ExpressRoute to connect to Microsoft if I don't have partnerships with one of the ExpressRoute-carrier partners?

You can select a regional carrier and land Ethernet connections to one of the supported exchange provider locations and then peer with Microsoft at the provider location. See [connect through another service provider](expressroute-locations.md#connectivity-through-additional-service-providers) to see if your service provider is present in any of the exchange locations. You can order an ExpressRoute circuit through the service provider to connect to Azure.

### How much does ExpressRoute cost?

For a breakdown of ExpressRoute cost, see [pricing details](https://azure.microsoft.com/pricing/details/expressroute/).

### Is bandwidth for ExpressRoute allocated for ingress and egress traffic separately?

Yes, the ExpressRoute circuit bandwidth is duplex. For example, if you purchase a 200-Mbps ExpressRoute circuit, you're procuring 200 Mbps for ingress traffic and 200 Mbps for egress traffic.


### Do I have to purchase a private connection of the same speed as the ExpressRoute circuit I purchase?

No. You can purchase a private connection of any speed from your service provider. However, your connection to Azure is limited to the ExpressRoute circuit bandwidth that you purchase.

### Is it possible to use more bandwidth than I procured for my ExpressRoute circuit?

Yes, you may use up to two times the bandwidth limit you procured by using the bandwidth available on the secondary connection of your ExpressRoute circuit. The built-in redundancy of your circuit is configured using primary and secondary connections, each of the procured bandwidth, to two Microsoft Enterprise Edge routers (MSEEs). The bandwidth available through your secondary connection can be used for more traffic if necessary. Since the secondary connection is meant for redundancy, it isn't guaranteed and shouldn't be used for extra traffic for a sustained period of time. To learn more about how to use both connections to transmit traffic, see [use AS PATH prepending](expressroute-optimize-routing.md#solution-use-as-path-prepending).

If you plan to use only your primary connection to transmit traffic, the bandwidth for the connection is fixed, and attempting to oversubscribe it results in increased packet drops. If traffic flows through an ExpressRoute Gateway, the bandwidth for the Gateway SKU is fixed and not burstable. For the bandwidth of each Gateway SKU, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md#aggthroughput).

### If I pay for unlimited data, do I get unlimited egress data transfer for services accessed over Microsoft peering?

If you're connecting to a service using Microsoft Peering with unlimited data, only egress data won't be charged by ExpressRoute. Egress data will still be charged for services such as compute, storage, or any other services accessed over Microsoft peering even if the destination is a Microsoft peering public IP address.

### Can I use the same private network connection with virtual network and other Azure services simultaneously?

Yes. An ExpressRoute circuit, once set up, allows you to access services within a virtual network and other Azure services simultaneously. You connect to virtual networks over the private peering path, and to other services over the Microsoft peering path.

### How are virtual networks advertised on ExpressRoute private peering?

The ExpressRoute gateway advertises the *Address Space(s)* of the Azure virtual network, you can't include/exclude at the subnet level. It's always the virtual network address space that gets advertised. If virtual network peering is used and the peered virtual network has "Use remote gateway" enabled, the address spaces of the peered virtual network also get advertised.

### How many prefixes can be advertised from a virtual network to on-premises on ExpressRoute private peering?

There's a maximum of 1000 IPv4 prefixes advertised on a single ExpressRoute connection, or through virtual networking peering using gateway transit. For example, if you have 999 address spaces on a single virtual network connected to an ExpressRoute circuit, all 999 prefixes gets advertised to on-premises. Alternatively, if you have a virtual network enabled to allow gateway transit with 1 address space and 500 spoke virtual network enabled using the "Allow Remote Gateway" option, the virtual network deployed with the gateway advertises 501 prefixes to on-premises.

If you're using a dual-stack circuit, there's a maximum of 100 IPv6 prefixes on a single ExpressRoute connection, or through virtual network peering using gateway transit. This limit is in addition to the limits described previously.

### What happens if the prefix limit on an ExpressRoute connection gets exceeded?

The connection between the ExpressRoute circuit and the gateway disconnects including peered virtual network using gateway transit. Connectivity re-establishes when the prefix limit is no longer exceeded.

### Can routes from the on-premises network get filtered?

The only way to filter or include routes is on the on-premises edge router. User-defined routes can be added in the VNet to affect specific routing, but is only static and not part of the BGP advertisement.

### Does ExpressRoute offer a Service Level Agreement (SLA)?

For information, see the [ExpressRoute SLA](https://azure.microsoft.com/support/legal/sla/).

## Supported services

ExpressRoute supports [two routing domains](expressroute-circuit-peerings.md) for various types of services: private peering and Microsoft peering.

### Private peering

**Supported:**

* Virtual networks, including all virtual machines and cloud services like [Azure Virtual Desktop RDP Shortpath](../virtual-desktop/shortpath.md)

### Microsoft peering

If your ExpressRoute circuit is enabled for Azure Microsoft peering, you can access the [public IP address ranges](../virtual-network/ip-services/public-ip-addresses.md#public-ip-addresses) used in Azure over the circuit. Azure Microsoft peering provides access to services currently hosted on Azure (with geo-restrictions depending on your circuit's SKU). To validate availability for a specific service, you can check the documentation for that service to see if there's a reserved range published for that service. Then, look up the IP ranges of the target service and compare with the ranges listed in the [Azure IP Ranges and Service Tags – Public Cloud XML file](https://www.microsoft.com/download/details.aspx?id=56519). Alternatively, you can open a support ticket for the service in question for clarification.

**Supported:**

* [Microsoft 365](/microsoft-365/enterprise/azure-expressroute)
* Power BI - Available via an Azure Regional Community, see [here](/power-bi/service-admin-where-is-my-tenant-located) for how to find out the region of your Power BI tenant.
* Azure Active Directory
* [Azure DevOps](https://blogs.msdn.microsoft.com/devops/2018/10/23/expressroute-for-azure-devops/) (Azure Global Services community)
* [Microsoft PSTN services](./using-expressroute-for-microsoft-pstn.md)
* Azure Public IP addresses for IaaS (Virtual Machines, Virtual Network Gateways, Load Balancers, etc.)  
* Most of the other Azure services are also supported. Check directly with the service that you want to use to verify support.

**Not supported:**

* CDN
* Azure Front Door
* Multi-factor Authentication Server (legacy)
* Traffic Manager
* Logic Apps

### Public peering

Public peering is no longer available on new ExpressRoute circuits and is scheduled for retirement on March 31, 2024. Access to Azure services can be done through Microsoft peering. To avoid disruption to your services, you should migrate to Microsoft peering before the retirement date. 

* For more information, see [Migrate from public peering to Microsoft peering](how-to-move-peering.md). 
* For a comparison between the different peering types, see [Peering comparison](about-public-peering.md#compare).

### Why does the **Advertised public prefixes** status show *Validation needed*, while configuring Microsoft peering?

Microsoft verifies if the specified **Advertised public prefixes** and **Peer ASN'** or **Customer ASN** are assigned to you in the Internet Routing Registry. If you're getting public prefixes from another entity and the assignment isn't recorded with the routing registry, the automatic validation doesn't complete. You need to manually validate. If the automatic validation fails, you see the message *Validation needed*.

If you see *Validation needed*, collect documents that show your public prefixes are assigned to your organization by the entity that is listed as the owner of the prefixes in the routing registry. Then submit these documents for manual validation by opening a support ticket.

:::image type="content" source="./media/expressroute-faqs/ticket-portal-msftpeering-prefix-validation.png" alt-text="Screenshot of a new support request for proof of ownership for public prefixes.":::

### Is Dynamics 365 supported on ExpressRoute?

Dynamics 365 and Common Data Service (CDS) environments are hosted on Azure and therefore customers benefit from the underlying ExpressRoute support for Azure resources. You can connect to its service endpoints if your router filter includes the Azure regions your Dynamics 365/CDS environments are hosted in.

> [!NOTE]
> [ExpressRoute Premium](#expressroute-premium) is **not** required for Dynamics 365 connectivity via Azure ExpressRoute if the ExpressRoute circuit is deployed within the same [geopolitical region](./expressroute-locations-providers.md#expressroute-locations).

## Data and connections

### Are there limits on the amount of data that I can transfer using ExpressRoute?

We don't set a limit on the amount of data transfer. Refer to [pricing details](https://azure.microsoft.com/pricing/details/expressroute/) for information on bandwidth rates.

### What connection speeds are supported for ExpressRoute?

Supported bandwidth offers:

50 Mbps, 100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps, 10 Gbps

> [!NOTE]
> ExpressRoute supports redundant pair of cross connection. If you exceed the configured bandwidth of your ExpressRoute circuit in a cross connection, your traffic would be subjected to rate limiting within that cross connection.
>

### What's the maximum MTU supported?

ExpressRoute and other hybrid networking services--VPN and vWAN--supports a maximum MTU of 1400 bytes.
See [TCP/IP performance tuning for Azure VMs](../virtual-network/virtual-network-tcpip-performance-tuning.md) for tuning the MTU of your VMs.

### Which service providers are available?

See [ExpressRoute partners and locations](expressroute-locations.md) for the list of service providers and locations.

## Technical details

### What are the technical requirements for connecting my on-premises location to Azure?

See [ExpressRoute prerequisites page](expressroute-prerequisites.md) for requirements.

### Are connections to ExpressRoute redundant?

Yes. Each ExpressRoute circuit has a redundant pair of cross connections configured to provide high availability.

### Is connectivity lost if one of my ExpressRoute links fail?

You don't lose connectivity if one of the cross connections fails. A redundant connection is available to support the load of your network and provide high availability of your ExpressRoute circuit. You can additionally create a circuit in a different peering location to achieve circuit-level resilience.

### How is redundancy implemented for private peering?

Multiple ExpressRoute circuits from different peering locations or up to four connections from the same peering location can be connected to the same virtual network to provide high-availability in the case a single circuit becomes unavailable. You can then [assign higher weights](./expressroute-optimize-routing.md#solution-assign-a-high-weight-to-local-connection) to one of the local connections to prefer a specific circuit. It's recommended that your setup has at least two ExpressRoute circuits to avoid single points of failure. 

See [here](./designing-for-high-availability-with-expressroute.md) for designing for high availability and [here](./designing-for-disaster-recovery-with-expressroute-privatepeering.md) for designing for disaster recovery.  

### How is redundancy implemented for Microsoft peering?

We recommended when you're using Microsoft peering to access Azure public services like Azure Storage, Azure SQL, or you're using Microsoft peering for Microsoft 365 that you implement multiple circuits in different peering locations to avoid single points of failure. You can either advertise the same prefix on both circuits and use [AS PATH prepending](./expressroute-optimize-routing.md#solution-use-as-path-prepending) or advertise different prefixes to determine path from on-premises.

See [here](./designing-for-high-availability-with-expressroute.md) for designing for high availability.

### How can I ensure high availability for a virtual network connected to ExpressRoute?

You can achieve high availability by connecting up to 4 ExpressRoute circuits in the same peering location to your virtual network. You can also connect up to 16 ExpressRoute circuits in different peering locations to your virtual network. For example, Singapore and Singapore2. If one ExpressRoute circuit disconnects, connectivity fails over to another ExpressRoute circuit. By default, traffic leaving your virtual network is routed based on Equal Cost Multi-path Routing (ECMP). You can use **connection weight** to prefer one circuit to another. For more information, see [Optimizing ExpressRoute Routing](expressroute-optimize-routing.md).

> [!NOTE]
> Although it is possible to connect up to 16 circuits to your virtual network, the outgoing traffic from your virtual network will be load-balanced using Equal-Cost Multipath (ECMP) across a maximum of 4 circuits.

### How do I ensure that my traffic destined for Azure Public services like Azure Storage and Azure SQL on Microsoft peering or public peering is preferred on the ExpressRoute path?

You must implement the *Local Preference* attribute on your router(s) to ensure that the path from on-premises to Azure is always preferred on your ExpressRoute circuit(s).

For more information, see [BGP path selection and common router configurations](./expressroute-optimize-routing.md#path-selection-for-microsoft-and-public-peering).

### <a name="onep2plink"></a>If I'm not colocated at a cloud exchange and my service provider offers point-to-point connection, do I need to order two physical connections between my on-premises network and Microsoft?

If your service provider can establish two Ethernet virtual circuits over the physical connection, you only need one physical connection. The physical connection (for example, an optical fiber) is terminated on a layer 1 (L1) device (see the image). The two Ethernet virtual circuits are tagged with different VLAN IDs, one for the primary circuit, and one for the secondary. Those VLAN IDs are in the outer 802.1Q Ethernet header. The inner 802.1Q Ethernet header (not shown) is mapped to a specific [ExpressRoute routing domain](expressroute-circuit-peerings.md).

![Diagram highlighting the layer 1 (L1) Primary and Secondary virtual circuits that make up the physical connection between the switches on a Customer Site and an ExpressRoute Location.](./media/expressroute-faqs/expressroute-p2p-ref-arch.png)

### Can I extend one of my VLANs to Azure using ExpressRoute?

No. We don't support layer 2 connectivity extensions into Azure.

### Can I have more than one ExpressRoute circuit in my subscription?

Yes. You can have more than one ExpressRoute circuit in your subscription. The default limit is set to 50. You can contact Microsoft Support to increase the limit, if needed.

### Can I have ExpressRoute circuits from different service providers?

Yes. You can have ExpressRoute circuits with many service providers. Each ExpressRoute circuit is associated with one service provider only. 

### I see two ExpressRoute peering locations in the same metro, for example, Singapore and Singapore2. Which peering location should I choose to create my ExpressRoute circuit?
If your service provider offers ExpressRoute at both sites, you can work with your provider and pick either site to set up ExpressRoute. 

### Can I have multiple ExpressRoute circuits in the same metro? Can I link them to the same virtual network?

Yes. You can have multiple ExpressRoute circuits with the same or different service providers. If the metro has multiple ExpressRoute peering locations and the circuits are created at different peering locations, you can link them to the same virtual network. If the circuits are created at the same peering location, you can link up to four circuits to the same virtual network.

### How do I connect my virtual networks to an ExpressRoute circuit?

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

Yes. You can link up to 10 virtual networks in the same subscription as the circuit or different subscriptions using a single ExpressRoute circuit. This limit can be increased by enabling the ExpressRoute premium feature. Connectivity and bandwidth charges for the dedicated circuit gets applied to the ExpressRoute circuit owner and all virtual networks share the same bandwidth.

For more information, see [sharing an ExpressRoute circuit across multiple subscriptions](expressroute-howto-linkvnet-arm.md).

### I have multiple Azure subscriptions associated to different Azure Active Directory tenants or Enterprise Agreement enrollments. Can I connect virtual networks that are in separate tenants and enrollments to a single ExpressRoute circuit not in the same tenant or enrollment?

Yes. ExpressRoute authorizations can span subscription, tenant, and enrollment boundaries with no extra configuration required. Connectivity and bandwidth charges for the dedicated circuit gets applied to the ExpressRoute circuit owner and all virtual networks share the same bandwidth.

For more information, see [sharing an ExpressRoute circuit across multiple subscriptions](expressroute-howto-linkvnet-arm.md).

### Are virtual networks connected to the same circuit isolated from each other?

No. From a routing perspective, all virtual networks linked to the same ExpressRoute circuit are part of the same routing domain and aren't isolated from each other. If you need route isolation, you need to create a separate ExpressRoute circuit.

### Can a virtual network connect to more than one ExpressRoute circuit?

Yes. You can link a single virtual network with up to four ExpressRoute circuits in the same location or up to 16 ExpressRoute circuits in different peering locations. 

### Do virtual networks connected to ExpressRoute circuits have Internet connectivity?

Yes. If a default routes (0.0.0.0/0) or Internet route prefixes isn't advertised through the BGP session, you can connect to the Internet from a virtual network linked to an ExpressRoute circuit.

### Can Internet traffic be blocked for virtual networks connected to ExpressRoute circuits?

Yes. You can advertise a default route **0.0.0.0/0** to block all Internet connectivity to virtual machines deployed within a virtual network and route all traffic out through the ExpressRoute circuit.

> [!NOTE]
> If the advertised route of 0.0.0.0/0 is withdrawn from the routes advertised due to an outage or a misconfiguration, Azure will provide a [system route](../virtual-network/virtual-networks-udr-overview.md#system-routes) to resources on the connected Virtual Network to provide connectivity to the internet.  To ensure egress traffic to the internet is blocked, it is recommended to place a Network Security Group on all subnets with an **Outbound Deny** rule for internet traffic.

If you advertise default routes, we force traffic to services offered over Microsoft peering (such as Azure storage and SQL DB) back to your premises. You have to configure your routers to return traffic to Azure through the Microsoft peering path or over the Internet. If you've enabled a service endpoint for the service, the traffic to the service isn't forced to your premises. The traffic remains within the Azure backbone network. To learn more about service endpoints, see [Virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md?toc=%2fazure%2fexpressroute%2ftoc.json)

### Can virtual networks linked to the same ExpressRoute circuit talk to each other?

Yes. Virtual machines deployed in virtual networks connected to the same ExpressRoute circuit can communicate with each other. We recommend setting up [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to facilitate this communication.

### Can I set up a site-to-site VPN connection to my virtual network along with ExpressRoute?

Yes. ExpressRoute can coexist with site-to-site VPNs. See [Configure ExpressRoute and site-to-site coexisting connections](expressroute-howto-coexist-resource-manager.md).

### How can routing between site-to-site VPN connection and ExpressRoute be established?

If you want to enable routing between your branches connected to ExpressRoute and branches connected to a site-to-site VPN connection, you need to set up [Azure Route Server](../route-server/expressroute-vpn-support.md).

### Why is there a public IP address associated with the ExpressRoute gateway on a virtual network?

The public IP address is used for internal management only, and doesn't constitute a security exposure of your virtual network.

### Are there limits on the number of routes I can advertise?

Yes. ExpressRoute accepts up to 4000 prefixes for private peering and 200 prefixes for Microsoft peering. You can increase the limit to 10,000 routes for private peering when using ExpressRoute premium.

### Are there restrictions on IP ranges I can advertise over the BGP session?

We don't accept private prefixes (RFC1918) for the Microsoft peering BGP session. We accept any prefix size up to /32 prefix on both the Microsoft and the private peering.

### What happens if the BGP route limit gets exceeded?

BGP sessions disconnect. BGP sessions are restored once the prefix count gets below the limit.

### What is the ExpressRoute BGP hold time and can it be adjusted?

The BGP hold timer is 180 seconds. The keep-alive messages are sent every 60 seconds. These values are fixed settings on the Microsoft side and can't be changed. It's possible for you to configure different timers, and the BGP session parameters are negotiated accordingly.

### Can the bandwidth of an ExpressRoute circuit be changed?

Yes, you can attempt to increase the bandwidth of your ExpressRoute circuit in the Azure portal, or by using PowerShell. If there's capacity available on the physical port on which your circuit was created, your change succeeds. 

If your change failed, it means there isn't enough capacity left on the current port and you need to create a new ExpressRoute circuit with the higher bandwidth. It could also mean that there's no other capacity at that location, in which case you can't increase the bandwidth. 

You need to follow up with your connectivity provider to ensure that they update the throttles within their networks to support the bandwidth increase. You can't, however, reduce the bandwidth of your ExpressRoute circuit. You have to create a new ExpressRoute circuit with lower bandwidth and delete the old circuit.

### How can I change the bandwidth of an ExpressRoute circuit?

You can update the bandwidth of the ExpressRoute circuit using the Azure portal, REST API, PowerShell, or Azure CLI.

### I received a notification about maintenance on my ExpressRoute circuit. What is the technical effect of this maintenance?

You should experience minimal to no disruption during maintenance if you operate your circuit in [active-active mode](./designing-for-high-availability-with-expressroute.md#active-active-connections). Maintenance gets performed on the primary and secondary connections of your circuit separately. During maintenance, you may see longer AS-path prepend over one of the connections. The reason is to gracefully shift traffic from one connection to another. You must not ignore longer AS path, as it can cause asymmetric routing, resulting in a service outage. It's advisable to configure [BFD](expressroute-bfd.md) for faster BGP failover between Primary and Secondary connection in the event a BGP failure is detected during maintenance. Scheduled maintenance is performed outside of business hours in the time zone of the peering location, and you can't select a maintenance time.

### I received a notification about a software upgrade or maintenance on my ExpressRoute gateway. What is the technical effect of this maintenance?

You should experience minimal to no disruption during a software upgrade or maintenance on your gateway. The ExpressRoute gateway is composed of multiple instances and during upgrades, instances are taken offline one at a time. There may be temporarily lower network throughput to the virtual network but the gateway itself doesn't experience any downtime.

### Why are certain ports opened on my ExpressRoute gateway?

They're required for Azure infrastructure to communicate. They're protected by Azure certificates. Without proper certificates, you can't establish a connection to the ports. 

An ExpressRoute gateway is fundamentally a multi-homed device with one NIC tapping into the customer private network, and one NIC facing the public network. Azure infrastructure entities can't tap into customer private networks for compliance reasons, so they need to utilize public endpoints for infrastructure communication. The public endpoints get periodically scanned by Azure security audit.

## ExpressRoute SKU scope access

### What is the connectivity scope for different ExpressRoute circuit SKUs?

The following diagram shows the connectivity scope of different ExpressRoute circuit SKUs. In this example, your on-premises network is connected to an ExpressRoute peering site in London. With a Local SKU ExpressRoute circuit, you can connect to resources in Azure regions in the same metro as the peering site. In this case, your on-premises network can access UK South Azure resources over ExpressRoute. For more information, see [What is ExpressRoute Local?](#what-is-expressroute-local). When you configure a Standard SKU ExpressRoute circuit, connectivity to Azure resources expand to all Azure regions in a geopolitical area. As explained in the diagram, your on-premises can connect to resources in West Europe and France Central. To allow your on-premises network to access resources globally across all Azure regions, you need to configure an ExpressRoute premium SKU circuit. For more information, see [What is ExpressRoute premium?](#what-is-expressroute-premium).

:::image type="content" source="./media/expressroute-faqs/sku-scope.png" alt-text="Diagram of connectivity scope for different ExpressRoute circuit SKUs.":::

## ExpressRoute premium

### What is ExpressRoute premium?

ExpressRoute premium is a collection of the following features:

* Increased routing table limit from 4000 routes to 10,000 routes for private peering.
* Increased number of VNets and ExpressRoute Global Reach connections that can be enabled on an ExpressRoute circuit (default is 10). For more information, see the [ExpressRoute Limits](#limits) table.
* Connectivity to Microsoft 365
* Global connectivity over the Microsoft core network. You can now link a VNet in one geopolitical region with an ExpressRoute circuit in another region.<br>
    **Examples:**

    *  You can link a VNet created in Europe West to an ExpressRoute circuit created in Silicon Valley. 
    *  On the Microsoft peering, prefixes from other geopolitical regions are advertised such that you can connect to, for example, SQL Azure in Europe West from a circuit in Silicon Valley.


### <a name="limits"></a>How many VNets and ExpressRoute Global Reach connections can I enable on an ExpressRoute circuit if I enabled ExpressRoute premium?

The following tables show the ExpressRoute limits and the number of VNets and ExpressRoute Global Reach connections per ExpressRoute circuit:

[!INCLUDE [ExpressRoute limits](../../includes/expressroute-limits.md)]

### How do I enable ExpressRoute premium?

ExpressRoute premium features can be enabled when the feature is enabled, and can be shut down by updating the circuit state. You can enable ExpressRoute premium at circuit creation time, or can call the REST API / PowerShell cmdlet.

### How do I disable ExpressRoute premium?

You can disable ExpressRoute premium by calling the REST API or PowerShell cmdlet. You must make sure that you've scaled your connectivity needs to meet the default limits before you disable ExpressRoute premium. If your utilization scales beyond the default limits, the request to disable ExpressRoute premium fails.

### Can I pick and choose the features I want from the premium feature set?

No. You can't pick the features. We enable all features when you turn on ExpressRoute premium.

### How much does ExpressRoute premium cost?

Refer to [pricing details](https://azure.microsoft.com/pricing/details/expressroute/) for cost.

### Do I pay for ExpressRoute premium in addition to standard ExpressRoute charges?

Yes. ExpressRoute premium charges apply on top of ExpressRoute circuit charges and charges required by the connectivity provider.

## ExpressRoute Local

### What is ExpressRoute Local?

ExpressRoute Local is a SKU of ExpressRoute circuit, in addition to the Standard SKU and the Premium SKU. A key feature of Local is that a Local circuit at an ExpressRoute peering location gives you access only to one or two Azure regions in or near the same metro. In contrast, a Standard circuit gives you access to all Azure regions in a geopolitical area and a Premium circuit to all Azure regions globally. Specifically, with a Local SKU you can only advertise routes over Microsoft and private peering from the corresponding local region of the ExpressRoute circuit. You won't receive routes for other regions different than the defined local region.

ExpressRoute Local may not be available for an ExpressRoute Location. For peering location and supported Azure local region, see [locations and connectivity providers](expressroute-locations-providers.md#partners).

### What are the benefits of ExpressRoute Local?

While you need to pay egress data transfer for your Standard or Premium ExpressRoute circuit, you don't pay egress data transfer separately for your ExpressRoute Local circuit. In other words, the price of ExpressRoute Local includes data transfer fees. ExpressRoute Local is an economical solution if you have massive amount of data to transfer and want to have your data over a private connection to an ExpressRoute peering location near your desired Azure regions. 

### What features are available and what aren't on ExpressRoute Local?

Compared to a Standard ExpressRoute circuit, a Local circuit has the same set of features except:
* Scope of access to Azure regions is limited to one or two Azure regions in or near the same metro as the ExpressRoute peering location.
* ExpressRoute Global Reach isn't available on Local

ExpressRoute Local also has the same limits on resources as Standard. 

### Where is ExpressRoute Local available and which Azure regions is each peering location mapped to?

ExpressRoute Local is available at the peering locations where one or two Azure regions are close-by. It isn't available at a peering location where there's no Azure region in that state or province or country/region. See the exact mappings on [ExpressRoute Locations page](expressroute-locations-providers.md#partners).  

## ExpressRoute for Microsoft 365

[!INCLUDE [expressroute-office365-include](../../includes/expressroute-office365-include.md)]

### How do I create an ExpressRoute circuit to connect to Microsoft 365 services?

1. Review the [ExpressRoute prerequisites page](expressroute-prerequisites.md) to make sure you meet the requirements.
2. To ensure that your connectivity needs are met, review the list of service providers and locations in the [ExpressRoute partners and locations](expressroute-locations.md) article.
3. Plan your capacity requirements by reviewing [Network planning and performance tuning for Microsoft 365](/microsoft-365/enterprise/network-planning-and-performance).
4. Follow the steps listed in the workflows to set up connectivity [ExpressRoute workflows for circuit provisioning and circuit states](expressroute-workflows.md).

> [!IMPORTANT]
> Make sure that you have enabled ExpressRoute premium add-on when configuring connectivity to Microsoft 365 services.
> 
> 

### Can my existing ExpressRoute circuits support connectivity to Microsoft 365 services?

Yes. Your existing ExpressRoute circuit can be configured to support connectivity to Microsoft 365 services. Make sure that you have sufficient capacity to connect to Microsoft 365 services and that you have enabled premium add-on. [Network planning and performance tuning for Microsoft 365](/microsoft-365/enterprise/network-planning-and-performance) helps you plan your connectivity needs. Also, see [Create and modify an ExpressRoute circuit](expressroute-howto-circuit-classic.md).

### What Microsoft 365 services can be accessed over an ExpressRoute connection?

Refer to [Microsoft 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges) page for an up-to-date list of services supported over ExpressRoute.

### How much does ExpressRoute for Microsoft 365 services cost?

Microsoft 365 services require premium add-on to be enabled. See the [pricing details page](https://azure.microsoft.com/pricing/details/expressroute/) for costs.

### What regions is ExpressRoute for Microsoft 365 supported in?

See [ExpressRoute partners and locations](expressroute-locations.md) for information.

### Can I access Microsoft 365 over the Internet, even if ExpressRoute was configured for my organization?

Yes. Microsoft 365 service endpoints are reachable through the Internet, even though ExpressRoute has been configured for your network. Check with your organization's networking team if the network at your location is configured to connect to Microsoft 365 services through ExpressRoute.

### How can I plan for high availability for Microsoft 365 network traffic on Azure ExpressRoute?
See the recommendation for [High availability and failover with Azure ExpressRoute](./designing-for-high-availability-with-expressroute.md)

### Can I access Office 365 US Government Community (GCC) services over an Azure US Government ExpressRoute circuit?

Yes. Office 365 GCC service endpoints are reachable through the Azure US Government ExpressRoute. However, you first need to open a support ticket on the Azure portal to provide the prefixes you intend to advertise to Microsoft. Your connectivity to Office 365 GCC services will be established after the support ticket is resolved. 

## Route filters for Microsoft peering

### Are Azure service routes advertised when I first configure Microsoft peering?

You don't see any routes until you attach a route filter to your circuit to start prefix advertisements. For more information, see [Configure route filters for Microsoft peering](how-to-routefilter-powershell.md).

### I'm unable to select Exchange Online when I'm creating a route filter for Microsoft peering. What is the reason?

When you're using route filters, anyone can turn on Microsoft peering. However, for consuming Microsoft 365 services, you still need to get authorized by Microsoft 365.

### I enabled Microsoft peering prior to August 1, 2017, how can I take advantage of route filters?

Your existing circuit continues advertising the prefixes for Microsoft 365. If you want to add Azure public prefixes advertisements over the same Microsoft peering, you can create a route filter, select the services you need advertised, and attach the filter to your Microsoft peering. For more information, see [Configure route filters for Microsoft peering](how-to-routefilter-powershell.md).

### I have Microsoft peering at one location, now I'm trying to enable it at another location and I'm not seeing any prefixes.

* Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through Microsoft peering, even if route filters aren't defined.

* Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 won't have any prefixes advertised until a route filter is attached to the circuit. You see no prefixes by default.

### If I have multiple virtual networks connected to the same ExpressRoute circuit, can I use ExpressRoute for VNet-to-VNet connectivity?

VNet-to-VNet connectivity over ExpressRoute isn't recommended. Instead, configure [Virtual Network peering](../virtual-network/virtual-network-peering-overview.md?msclkid=b64a7b6ac19e11eca60d5e3e5d0764f5).

## <a name="expressRouteDirect"></a>ExpressRoute Direct

[!INCLUDE [ExpressRoute Direct](../../includes/expressroute-direct-faq-include.md)]

## <a name="globalreach"></a>Global Reach

[!INCLUDE [Global Reach](../../includes/expressroute-global-reach-faq-include.md)]

## ExpressRoute Traffic Collector

### Where does ExpressRoute Traffic Collector store your data?

All flow logs are ingested into your Log Analytics workspace by the ExpressRoute Traffic Collector. ExpressRoute Traffic Collector itself, doesn't store any of your data.

### What is the sampling rate used by ExpressRoute Traffic Collector?

ExpressRoute Traffic Collector uses a sampling rate of 1:4096, which means 1 out of 4096 packets are captured.

### How many flows can ExpressRoute Traffic Collector handle?

ExpressRoute Traffic Collector can handle up to 300,000 flows a minute. In the event this limit is reached, excess flows are dropped. For more information, see [count of flows metric](expressroute-monitoring-metrics-alerts.md#count-of-flow-records-processed---split-by-instances-or-expressroute-circuit) on a circuit.

### Does ExpressRoute Traffic Collector support Virtual WAN?

Yes, you can use Express Traffic Collector with ExpressRoute Direct circuits used in a Virtual WAN deployment. However, deploying ExpressRoute Traffic Collector within a Virtual WAN hub isn’t supported. You can deploy ExpressRoute Traffic collector in a spoke virtual network and ingest flow logs to a Log Analytics workspace.

### Does ExpressRoute Traffic Collector support ExpressRoute provider ports?

For supported ExpressRoute provider ports contact ErTCasks@microsoft.com.

### What is the effect of maintenance on flow logging?

You should experience minimal to no disruption during maintenance on your ExpressRoute Traffic Collector. ExpressRoute Traffic Collector has multiple instances on different update domains, during an upgrade, instances are taken offline one at a time. While you may experience lower ingestion of sample flows into the Log Analytics workspace, the ExpressRoute Traffic Collector itself doesn't experience any downtime. Loss of sampled flows during maintenance shouldn't affect network traffic analysis, when sampled data is aggregated over a longer time frame.

### Does ExpressRoute Traffic Collector support availability zones?

ExpressRoute Traffic Collector deployment by default has availability zones enabled in the regions where it's available. For information about region availability, see [Availability zones supported regions](../availability-zones/az-overview.md#azure-regions-with-availability-zones). 


### How should I incorporate ExpressRoute Traffic Collector in my disaster recovery plan?

You can associate a single ExpressRoute Direct circuit with multiple ExpressRoute Traffic Collectors deployed in different Azure region within a given geo-political region. It's recommended that you associate your ExpressRoute Direct circuit with multiple ExpressRoute Traffic Collectors as part of your disaster recovery and high availability plan.

## Privacy

### Does the ExpressRoute service store customer data?

No.
