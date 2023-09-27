---
title: 'Azure ExpressRoute: Routing requirements'
description: This page provides detailed requirements for configuring and managing routing for ExpressRoute circuits.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 09/06/2023
ms.author: duau
ms.custom: references_regions, ignite-2022
---

# ExpressRoute routing requirements

To connect to Microsoft cloud services using ExpressRoute, you need to set up and manage routing. Some connectivity providers offer setting up and managing routing as a managed service. Check with your connectivity provider to see if they offer this service. If they don't, you must adhere to the following requirements:

Refer to the [Circuits and routing domains](expressroute-circuit-peerings.md) article for a description of the routing sessions that need to be set up in to facilitate connectivity.

> [!NOTE]
> Microsoft doesn't support any router redundancy protocols such as HSRP or VRRP for high availability configurations. We rely on a redundant pair of BGP sessions per peering for high availability.
> 

## IP addresses used for peering

You need to reserve a few blocks of IP addresses to configure routing between your network and Microsoft's Enterprise edge (MSEEs) routers. This section provides a list of requirements and describes the rules regarding how these IP addresses must be acquired and used.

### IP addresses used for Azure private peering

You can use either private IP addresses or public IP addresses to configure the peering. The address range used for configuring routes can't overlap with address ranges used for virtual networks in Azure. 

* IPv4:
    * You must reserve a `/29` subnet or two `/30` subnets for routing interfaces.
    * The subnets used for routing can be either private IP addresses or public IP addresses.
    * The subnets must not conflict with the range reserved by the customer for use in the Microsoft cloud.
    * If a `/29` subnet is used, it's split into two `/30` subnets. 
      * The first `/30` subnet is used for the primary link and the second `/30` subnet is used for the secondary link.
      * For each of the `/30` subnets, you must use the first IP address of the `/30` subnet for your router. Microsoft uses the second IP address of the `/30` subnet to set up a BGP session.
      * You must set up both BGP sessions for the [availability SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.
* IPv6:
    * You must reserve a `/125` subnet or two `/126` subnets for routing interfaces.
    * The subnets used for routing can be either private IP addresses or public IP addresses.
    * The subnets must not conflict with the range reserved by the customer for use in the Microsoft cloud.
    * If a `/125` subnet is used, it's split into two `/126` subnets. 
      * The first `/126` subnet is used for the primary link and the second `/126` subnet is used for the secondary link.
      * For each of the `/126` subnets, you must use the first IP address of the `/126` subnet for your router. Microsoft uses the second IP address of the `/126` subnet to set up a BGP session.
      * You must set up both BGP sessions for the [availability SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.

#### Example for private peering

If you choose to use `a.b.c.d/29` to set up the peering, it's split into two `/30` subnets. In the following example, notice how the `a.b.c.d/29` subnet is used:

* `a.b.c.d/29` is split to `a.b.c.d/30` and `a.b.c.d+4/30` and passed down to Microsoft through the provisioning APIs.
  * You use `a.b.c.d+1` as the VRF IP for the Primary PE and Microsoft uses `a.b.c.d+2` as the VRF IP for the primary MSEE.
  * You use `a.b.c.d+5` as the VRF IP for the secondary PE and Microsoft uses `a.b.c.d+6` as the VRF IP for the secondary MSEE.

Consider a case where you select `192.168.100.128/29` to set up private peering. `192.168.100.128/29` includes addresses from `192.168.100.128` to `192.168.100.135`, among which:

* `192.168.100.128/30` is assigned to `link1`, with provider using `192.168.100.129` and Microsoft using `192.168.100.130`.
* `192.168.100.132/30` is assigned to `link2`, with provider using `192.168.100.133` and Microsoft using `192.168.100.134`.

### IP addresses used for Microsoft peering

You must use public IP addresses that you own for setting up the BGP sessions. Microsoft must be able to verify the ownership of the IP addresses through Routing Internet Registries and Internet Routing Registries.

* The IPs listed in the portal for Advertised Public Prefixes for Microsoft Peering creates ACLs for the Microsoft core routers to allow inbound traffic from these IPs. 
* You must use a unique `/29` (IPv4) or `/125` (IPv6) subnet or two `/30` (IPv4) or `/126` (IPv6) subnets to set up the BGP peering for each peering per ExpressRoute circuit, if you have more than one.
* If a `/29` subnet is used, it's split into two `/30` subnets.
* The first `/30` subnet is used for the primary link and the second `/30` subnet is used for the secondary link.
* For each of the `/30` subnets, you must use the first IP address of the `/30` subnet on your router. Microsoft uses the second IP address of the `/30` subnet to set up a BGP session.
* If a `/125` subnet is used, it's split into two `/126` subnets.
* The first `/126` subnet is used for the primary link and the second `/126` subnet is used for the secondary link.
* For each of the `/126` subnets, you must use the first IP address of the `/126` subnet on your router. Microsoft uses the second IP address of the `/126` subnet to set up a BGP session.
* You must set up both BGP sessions for our [availability SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.

### IP addresses used for Azure public peering

> [!NOTE]
> Azure public peering isn't available for new ExpressRoute circuits.
> 

You must use public IP addresses that you own for setting up the BGP sessions. Microsoft must be able to verify the ownership of the IP addresses through Routing Internet Registries and Internet Routing Registries. 

* You must use a unique `/29` subnet or two `/30` subnets to set up the BGP peering for each peering per ExpressRoute circuit (if you have more than one). 
* If a `/29` subnet is used, it's split into two `/30` subnets. 
  * The first `/30` subnet is used for the primary link and the second `/30` subnet is used for the secondary link.
  * For each of the `/30` subnets, you must use the first IP address of the `/30` subnet on your router. Microsoft uses the second IP address of the `/30` subnet to set up a BGP session.
  * You must set up both BGP sessions for the [availability SLA](https://azure.microsoft.com/support/legal/sla/) to be valid.

## Public IP address requirement

### Private peering

You can choose to use public or private IPv4 addresses for private peering. We provide end-to-end isolation of your traffic, so overlapping of addresses with other customers isn't possible for private peering. These addresses aren't advertised to Internet. 

### Microsoft peering

The Microsoft peering path lets you connect to Microsoft cloud services. The list of services includes Microsoft 365 services, such as Exchange Online, SharePoint Online, Skype for Business, and Microsoft Teams. Microsoft supports bi-directional connectivity on the Microsoft peering. Traffic destined to Microsoft cloud services must use valid public IPv4 addresses before they enter the Microsoft network.

Make sure that your IP address and AS number are registered to you in one of the following registries:

* [ARIN](https://www.arin.net/)
* [APNIC](https://www.apnic.net/)
* [AFRINIC](https://www.afrinic.net/)
* [LACNIC](https://www.lacnic.net/)
* [RIPENCC](https://www.ripe.net/)
* [RADB](https://www.radb.net/)
* [ALTDB](https://altdb.net/)

If your prefixes and AS number aren't assigned to you in the preceding registries, you need to open a support case for manual validation of your prefixes and ASN. Support requires documentation, such as a Letter of Authorization that proves you're allowed to use that prefix.

A Private AS Number is allowed with Microsoft Peering, but requires manual validation. In addition, we remove private AS numbers in the AS PATH for the received prefixes. As a result, you can't append private AS numbers in the AS PATH to [influence routing for Microsoft Peering](expressroute-optimize-routing.md). Additionally, AS numbers 64496 - 64511 reserved by IANA for documentation purposes aren't allowed in the path.

> [!IMPORTANT]
> Do not advertise the same public IP route to the public Internet and over ExpressRoute. To reduce the risk of incorrect configuration causing asymmetric routing, we strongly recommend that the [NAT IP addresses](expressroute-nat.md) advertised to Microsoft over ExpressRoute be from a range that is not advertised to the internet at all. If this is not possible to achieve, it is essential to ensure you advertise a more specific range over ExpressRoute than the one on the Internet connection. Besides the public route for NAT, you can also advertise over ExpressRoute the Public IP addresses used by the servers in your on-premises network that communicate with Microsoft 365 endpoints within Microsoft. 
> 
> 

### Public peering (deprecated - not available for new circuits)

The Azure public peering path enables you to connect to all services hosted in Azure over their public IP addresses. These include services listed in the [ExpressRoute FAQ](expressroute-faqs.md) and any services hosted by ISVs on Microsoft Azure. Connectivity to Microsoft Azure services on public peering is always initiated from your network into the Microsoft network. You must use Public IP addresses for the traffic destined to Microsoft network.

> [!IMPORTANT]
> All Azure PaaS services are accessible through Microsoft peering.
>   

A Private AS Number is allowed with public peering.

## Dynamic route exchange

Routing exchange is over eBGP protocol. EBGP sessions are established between the MSEEs and your routers. Authentication of BGP sessions isn't a requirement. If necessary, an MD5 hash can be configured. See the [Configure routing](how-to-routefilter-portal.md) and [Circuit provisioning workflows and circuit states](expressroute-workflows.md) for information about configuring BGP sessions.

## Autonomous System numbers (ASN)

Microsoft uses AS 12076 for Azure public, Azure private and Microsoft peering. We have reserved ASNs from 65515 to 65520 for internal use. Both 16 bit and 32-bit AS numbers are supported.

There are no requirements around data transfer symmetry. The forward and return paths may traverse different router pairs. Identical routes must be advertised from either sides across multiple circuit pairs belonging to you. Route metrics aren't required to be identical.

## Route aggregation and prefix limits

ExpressRoute supports up to 4000 IPv4 prefixes and 100 IPv6 prefixes advertised to Microsoft through the Azure private peering. This limit can be increased up to 10,000 IPv4 prefixes if the ExpressRoute premium add-on is enabled. ExpressRoute accept up to 200 prefixes per BGP session for Azure public and Microsoft peering. 

The BGP session is dropped if the number of prefixes exceeds the limit. ExpressRoute accept default routes on the private peering link only. Provider must filter out default route and private IP addresses (RFC 1918) from the Azure public and Microsoft peering paths. 

## Transit routing and cross-region routing

ExpressRoute can't be configured as transit routers. You have to rely on your connectivity provider for transit routing services.

## Advertising default routes

Default routes are permitted only on Azure private peering sessions. In such a case, ExpressRoute routes all traffic from the associated virtual networks to your network. Advertising default routes into private peering results in the internet path from Azure being blocked. You must rely on your corporate edge to route traffic from and to the internet for services hosted in Azure. 

To enable connectivity to other Azure services and infrastructure services, you must make sure one of the following items is in place:

* Azure public peering is enabled to route traffic to public endpoints.
* You use user-defined routing to allow internet connectivity for every subnet requiring Internet connectivity.

> [!NOTE]
> Advertising default routes will break Windows and other VM license activation. For information about a work around, see [use user defined routes to enable KMS activation](/archive/blogs/mast/use-azure-custom-routes-to-enable-kms-activation-with-forced-tunneling).
> 

## <a name="bgp"></a>Support for BGP communities

This section provides an overview of how BGP communities get used with ExpressRoute. Microsoft advertises routes in the private, Microsoft and public (deprecated) peering paths with routes tagged with appropriate community values. The rationale for doing so and the details on community values are describe as followed. Microsoft, however, doesn't honor any community values tagged to routes advertised to Microsoft.

For private peering, if you [configure a custom BGP community value](./how-to-configure-custom-bgp-communities.md) on your Azure virtual networks, you'll see this custom value and a regional BGP community value on the Azure routes advertised to your on-premises over ExpressRoute.

For Microsoft peering, you're connecting to Microsoft through ExpressRoute at any one peering location within a geopolitical region. You also have access to all Microsoft cloud services across all regions within the geopolitical boundary.

For example, if you connected to Microsoft in Amsterdam through ExpressRoute, you have access to all Microsoft cloud services hosted in North Europe and West Europe. 

Refer to the [ExpressRoute partners and peering locations](expressroute-locations.md) page for a detailed list of geopolitical regions, associated Azure regions, and corresponding ExpressRoute peering locations.

You can purchase more than one ExpressRoute circuit per geopolitical region. Having multiple connections offers you significant benefits on high availability due to geo-redundancy. In cases where you have multiple ExpressRoute circuits, you receive the same set of prefixes advertised from Microsoft on the Microsoft peering and public peering paths. This configuration results in multiple paths from your network into Microsoft. This set up can potentially cause suboptimal routing decisions to be made within your network. As a result, you may experience suboptimal connectivity experiences to different services. You can rely on the community values to make appropriate routing decisions to offer [optimal routing to users](expressroute-optimize-routing.md).

| **Microsoft Azure region** | **Regional BGP community (private peering)** | **Regional BGP community (Microsoft peering)** | **Storage BGP community** | **SQL BGP community** | **Azure Cosmos DB BGP community** | **Backup BGP community** |
| --- | --- | --- | --- | --- | --- | --- |
| **North America** | |
| East US | 12076:50004 | 12076:51004 | 12076:52004 | 12076:53004 | 12076:54004 | 12076:55004 |
| East US 2 | 12076:50005 | 12076:51005 | 12076:52005 | 12076:53005 | 12076:54005 | 12076:55005 |
| West US | 12076:50006 | 12076:51006 | 12076:52006 | 12076:53006 | 12076:54006 | 12076:55006 |
| West US 2 | 12076:50026 | 12076:51026 | 12076:52026 | 12076:53026 | 12076:54026 | 12076:55026 |
| West Central US | 12076:50027 | 12076:51027 | 12076:52027 | 12076:53027 | 12076:54027 | 12076:55027 |
| North Central US | 12076:50007 | 12076:51007 | 12076:52007 | 12076:53007 | 12076:54007 | 12076:55007 |
| South Central US | 12076:50008 | 12076:51008 | 12076:52008 | 12076:53008 | 12076:54008 | 12076:55008 |
| Central US | 12076:50009 | 12076:51009 | 12076:52009 | 12076:53009 | 12076:54009 | 12076:55009 |
| Canada Central | 12076:50020 | 12076:51020 | 12076:52020 | 12076:53020 | 12076:54020 | 12076:55020 |
| Canada East | 12076:50021 | 12076:51021 | 12076:52021 | 12076:53021 | 12076:54021 | 12076:55021 |
| **South America** | |
| Brazil South | 12076:50014 | 12076:51014 | 12076:52014 | 12076:53014 | 12076:54014 | 12076:55014 |
| **Europe** | |
| North Europe | 12076:50003 | 12076:51003 | 12076:52003 | 12076:53003 | 12076:54003 | 12076:55003 |
| West Europe | 12076:50002 | 12076:51002 | 12076:52002 | 12076:53002 | 12076:54002 | 12076:55002 |
| UK South | 12076:50024 | 12076:51024 | 12076:52024 | 12076:53024 | 12076:54024 | 12076:55024 |
| UK West | 12076:50025 | 12076:51025 | 12076:52025 | 12076:53025 | 12076:54025 | 12076:55025 |
| France Central | 12076:50030 | 12076:51030 | 12076:52030 | 12076:53030 | 12076:54030 | 12076:55030 |
| France South | 12076:50031 | 12076:51031 | 12076:52031 | 12076:53031 | 12076:54031 | 12076:55031 |
| Switzerland North | 12076:50038 | 12076:51038 | 12076:52038 | 12076:53038 | 12076:54038 | 12076:55038 |
| Switzerland West | 12076:50039 | 12076:51039 | 12076:52039 | 12076:53039 | 12076:54039 | 12076:55039 | 
| Germany North | 12076:50040 | 12076:51040 | 12076:52040 | 12076:53040 | 12076:54040 | 12076:55040 | 
| Germany West Central | 12076:50041 | 12076:51041 | 12076:52041 | 12076:53041 | 12076:54041 | 12076:55041 | 
| Norway East | 12076:50042 | 12076:51042 | 12076:52042 | 12076:53042 | 12076:54042 | 12076:55042 | 
| Norway West | 12076:50043 | 12076:51043 | 12076:52043 | 12076:53043 | 12076:54043 | 12076:55043 | 
| **Asia Pacific** | |
| East Asia | 12076:50010 | 12076:51010 | 12076:52010 | 12076:53010 | 12076:54010 | 12076:55010 |
| Southeast Asia | 12076:50011 | 12076:51011 | 12076:52011 | 12076:53011 | 12076:54011 | 12076:55011 |
| **Japan** | |
| Japan East | 12076:50012 | 12076:51012 | 12076:52012 | 12076:53012 | 12076:54012 | 12076:55012 |
| Japan West | 12076:50013 | 12076:51013 | 12076:52013 | 12076:53013 | 12076:54013 | 12076:55013 |
| **Australia** | |
| Australia East | 12076:50015 | 12076:51015 | 12076:52015 | 12076:53015 | 12076:54015 | 12076:55015 |
| Australia Southeast | 12076:50016 | 12076:51016 | 12076:52016 | 12076:53016 | 12076:54016 | 12076:55016 |
| **Australia Government** | |
| Australia Central | 12076:50032 | 12076:51032 | 12076:52032 | 12076:53032 | 12076:54032 | 12076:55032 |
| Australia Central 2 | 12076:50033 | 12076:51033 | 12076:52033 | 12076:53033 | 12076:54033 | 12076:55033 |
| **India** | |
| India South | 12076:50019 | 12076:51019 | 12076:52019 | 12076:53019 | 12076:54019 | 12076:55019 |
| India West | 12076:50018 | 12076:51018 | 12076:52018 | 12076:53018 | 12076:54018 | 12076:55018 |
| India Central | 12076:50017 | 12076:51017 | 12076:52017 | 12076:53017 | 12076:54017 | 12076:55017 |
| **Korea** | |
| Korea South | 12076:50028 | 12076:51028 | 12076:52028 | 12076:53028 | 12076:54028 | 12076:55028 |
| Korea Central | 12076:50029 | 12076:51029 | 12076:52029 | 12076:53029 | 12076:54029 | 12076:55029 |
| **South Africa**| |
| South Africa North | 12076:50034 | 12076:51034 | 12076:52034 | 12076:53034 | 12076:54034 | 12076:55034 |
| South Africa West | 12076:50035 | 12076:51035 | 12076:52035 | 12076:53035 | 12076:54035 | 12076:55035 |
| **UAE**| |
| UAE North | 12076:50036 | 12076:51036 | 12076:52036 | 12076:53036 | 12076:54036 | 12076:55036 |
| UAE Central | 12076:50037 | 12076:51037 | 12076:52037 | 12076:53037 | 12076:54037 | 12076:55037 |


All routes advertised from Microsoft are tagged with the appropriate community value. 

> [!IMPORTANT]
> Global prefixes are tagged with an appropriate community value.
> 

### Service to BGP community value

In addition to the BGP tag for each region, Microsoft also tags prefixes based on the service they belong to. This tagging only applies to the Microsoft peering. The following table provides a mapping of service to BGP community value. You can run the 'Get-AzBgpServiceCommunity' cmdlet for a full list of the latest values.

| **Service** | **BGP community value** |
| --- | --- |
| Exchange Online (2) | 12076:5010 |
| SharePoint Online (2) | 12076:5020 |
| Skype For Business Online (2) and (3) | 12076:5030 |
| CRM Online (4) |12076:5040 |
| Azure Global Services (1) | 12076:5050 |
| Azure Active Directory |12076:5060 |
| Azure Resource Manager |12076:5070 |
| Other Office 365 Online services (2) | 12076:5100 |
| Microsoft Defender for Identity | 12076:5220 |
| Microsoft PSTN services (5) | 12076:5250 |

(1) Azure Global Services includes only Azure DevOps at this time.

(2) Authorization required from Microsoft. See [Configure route filters for Microsoft Peering](how-to-routefilter-portal.md).

(3) This community also publishes the needed routes for Microsoft Teams services.

(4) CRM Online supports Dynamics v8.2 and below. For higher versions, select the regional community for your Dynamics deployments.

(5) Use of Microsoft Peering with PSTN services is restricted to specific use cases. See [Using ExpressRoute for Microsoft PSTN services](using-expressroute-for-microsoft-pstn.md).

> [!NOTE]
> Microsoft does not honor any BGP community values that you set on the routes advertised to Microsoft.
> 
> 

### BGP Community support in National Clouds

| **National Clouds Azure Region**| **BGP community value** |
| --- | --- |
| **US Government** |  |
| US Gov Arizona | 12076:51106 |
| US Gov Iowa | 12076:51109 |
| US Gov Virginia | 12076:51105 |
| US Gov Texas | 12076:51108 |
| US DoD Central | 12076:51209 |
| US DoD East | 12076:51205 |
| **China** |  |
| China North | 12076:51301 |
| China East | 12076:51302 |
| China East 2| 12076:51303 |
| China North 2 | 12076:51304 |

| **Service in National Clouds** | **BGP community value** |
| --- | --- |
| **US Government** |  |
| Exchange Online |12076:5110 |
| SharePoint Online |12076:5120 |
| Skype For Business Online |12076:5130 |
| Azure Active Directory |12076:5160 |
| Other Office 365 Online services |12076:5200 |

* *Office 365 communities aren't supported over Microsoft Peering for Microsoft Azure operated by 21Vianet region.*

## Next steps
* Configure your ExpressRoute connection.
  
  * [Create and modify a circuit](expressroute-howto-circuit-arm.md)
  * [Create and modify peering configuration](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
