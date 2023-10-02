---
title: What's new in Azure Virtual WAN?
description: Learn what's new with Azure Virtual WAN such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 05/30/2023
ms.author: cherylmc
---

# What's new in Azure Virtual WAN?

Azure Virtual WAN is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

* Recent releases
* Previews underway with known limitations (if applicable)
* Known issues
* Deprecated functionality (if applicable)

You can also find the latest Azure Virtual WAN updates and subscribe to the RSS feed [here](https://azure.microsoft.com/updates/?category=networking&query=Virtual%20WAN).

## Recent releases

### Routing

| Type |Area |Name |Description | Date added | Limitations |
| --- |---|---|---|---|---|
| Feature| Routing | [Routing intent](how-to-routing-policies.md)| Routing intent is the mechanism through which you can configure Virtual WAN to send private or internet traffic via a security solution deployed in the hub.|May 2023|Routing Intent is Generally Available  in Azure public cloud. See documentation for [additional limitations](how-to-routing-policies.md#knownlimitations).|
|Feature| Routing |[Virtual hub routing preference](about-virtual-hub-routing-preference.md)|Hub routing preference gives you more control over your infrastructure by allowing you to select how your traffic is routed when a virtual hub router learns multiple routes across S2S VPN, ER and SD-WAN NVA connections.  |October 2022| |
|Feature| Routing|[Bypass next hop IP for workloads within a spoke VNet connected to the virtual WAN hub generally available](how-to-virtual-hub-routing.md)|Bypassing next hop IP for workloads within a spoke VNet connected to the virtual WAN hub lets you deploy and access other resources in the VNet with your NVA without any additional configuration.|October 2022| |
|SKU/Feature/Validation | Routing | [BGP end point (General availability)](scenario-bgp-peering-hub.md) | The virtual hub router now exposes the ability to peer with it, thereby exchanging routing information directly through Border Gateway Protocol (BGP) routing protocol. | June 2022 | |
|Feature|Routing|[0.0.0.0/0 via NVA in the spoke](scenario-route-through-nvas-custom.md)|Ability to send internet traffic to an NVA in spoke for egress.|March 2021| 0.0.0.0/0 doesn't propagate across hubs.<br><br>Can't specify multiple public prefixes with different next hop IP addresses.|

### NVAs and integrated third-party solutions

| Type |Area |Name |Description | Date added | Limitations |
| --- |---|---|---|---|---|
|Feature|Software-as-a-service|Palo Alto Networks Cloud NGFW|General Availability of [Palo Alto Networks Cloud NGFW](https://aka.ms/pancloudngfwdocs), the first software-as-a-serivce security offering deployable within the Virtual WAN hub.|July 2023|Palo Alto Networks Cloud NGFW is now deployable in all  Virtual WAN hubs (new and old). See [Limitations of Palo Alto Networks Cloud NGFW](how-to-palo-alto-cloud-ngfw.md) for a full list of limitations and regional availability. Same limitations as routing intent.|
|Feature|Network Virtual Appliances (NVAs)/Integrated Third-party solutions in Virtual WAN hubs|[Fortinet NGFW](https://www.fortinet.com/products/next-generation-firewall)|General Availability of [Fortinet NGFW](https://aka.ms/fortinetngfwdocumentation) and [Fortinet SD-WAN/NGFW dual-role](https://aka.ms/fortinetdualroledocumentation) NVAs.|May 2023| Same limitations as routing intent. Doesn't support internet inbound scenario.|
|Feature|Network Virtual Appliances (NVAs)/Integrated Third-party solutions in Virtual WAN hubs|[Check Point CloudGuard Network Security for Azure Virtual WAN](https://www.checkpoint.com/cloudguard/microsoft-azure-security/wan/) |General Availability of [Check Point CloudGuard Network Security NVA deployable from Azure Marketplace](https://sc1.checkpoint.com/documents/IaaS/WebAdminGuides/EN/CP_CloudGuard_Network_for_Azure_vWAN_AdminGuide/Content/Topics-Azure-vWAN/Introduction.htm) within the Virtual WAN hub in all Azure regions.|May 2023|Same limitations as routing intent. Doesn't support internet inbound scenario.|
|Feature |Network Virtual Appliances (NVAs)/Integrated Third-party solutions in Virtual WAN hubs| [Versa SD-WAN](about-nva-hub.md#partners)|Preview of Versa SD-WAN.|November 2021| |
|Feature|Network Virtual Appliances (NVAs)/Integrated Third-party solutions in Virtual WAN hubs|[Cisco Viptela, Barracuda and VMware (Velocloud) SD-WAN](about-nva-hub.md#partners) |General Availability of SD-WAN solutions in Virtual WAN.|June/July 2021| |

### ExpressRoute

| Type |Area |Name |Description | Date added | Limitations |
| --- |---|---|---|---|---|
|Feature |ExpressRoute | [ExpressRoute metrics can be exported as diagnostic logs](monitor-virtual-wan-reference.md#expressroute-gateway-diagnostics)|| April 2023||
|Feature |ExpressRoute | [ExpressRoute circuit page now shows vWAN connection](virtual-wan-expressroute-portal.md)|| August 2022||

### Site-to-site

| Type |Area |Name |Description | Date added | Limitations |
| --- |---|---|---|---|---|
|Feature|Branch connectivity/Site-to-site VPN|[Multi-APIPA BGP](virtual-wan-site-to-site-portal.md)| Ability to specify multiple custom BGP IPs for VPN gateway instances in vWAN. |June 2022|Currently only available via portal. (Not available yet in PowerShell)|
|Feature |Branch connectivity/Site-to-site VPN|Custom traffic selectors|Ability to specify what traffic selector pairs site-to-site VPN gateway negotiates|May 2022|Azure negotiates traffic selectors for all pairs of remote and local prefixes. You can't specify individual pairs of Traffic selectors to negotiate.|
|Feature|Branch connectivity/Site-to-site VPN|[Site-to-site connection mode choices](virtual-wan-site-to-site-portal.md)|Ability to configure if customer or vWAN gateway should initiate the site-to-site connection while creating a new S2S connection.| February 2022|
|Feature|Branch connectivity/Site-to-site VPN|[Packet capture](packet-capture-site-to-site-portal.md)|Ability for customer to perform packet captures on site-to-site VPN gateway. |November 2021| |
|Feature|Branch connectivity/Site-to-site VPN<br><br>Remote User connectivity/Point-to-site VPN|[Hot-potato vs cold-potato routing for VPN traffic](virtual-wan-site-to-site-portal.md)|Ability to specify Microsoft or ISP POP preference for Azure VPN egress traffic. For more information, see [Routing preference in Azure](../virtual-network/ip-services/routing-preference-overview.md).|June 2021|This parameter can only be specified at gateway creation time and can't be modified after the fact.|
|Feature|Branch connectivity/Site-to-site VPN|[NAT](nat-rules-vpn-gateway.md)|Ability to NAT overlapping addresses between site-to-site VPN branches, and between site-to-site VPN branches and Azure.|March 2021|NAT isn't supported with policy-based VPN connections.|

### User VPN (point-to-site)

| Type |Area |Name |Description | Date added | Limitations |
| --- |---|---|---|---|---|
|Feature|Remote User connectivity/Point-to-site VPN |[User Groups and IP address pools for P2S User VPNs](user-groups-about.md) |Ability to configure P2S User VPNs to assign users IP addresses from specific address pools based on their identity or authentication credentials.|May 2023| |
|Feature|Remote User connectivity/Point-to-site VPN|[Global profile include/exclude](global-hub-profile.md#include-or-exclude-a-hub-from-a-global-profile)|Ability to mark a point-to-site gateway as "excluded", meaning users who connect to global profile won't be load-balanced to that gateway.|February 2022| |
|Feature|Remote User connectivity/Point-to-site VPN|[Forced tunneling for P2S VPN](how-to-forced-tunnel.md)|Ability to force all traffic to Azure Virtual WAN for egress.|October 2021|Only available for Azure VPN Client version 2:1900:39.0 or newer.|
|Feature|Remote User connectivity/Point-to-site VPN|[macOS Azure VPN client](openvpn-azure-ad-client-mac.md)|General Availability of Azure VPN Client for macOS.|August 2021| |
|Feature|Branch connectivity/Site-to-site VPN<br><br>Remote User connectivity/Point-to-site VPN|[Hot-potato vs cold-potato routing for VPN traffic](virtual-wan-site-to-site-portal.md)|Ability to specify Microsoft or ISP POP preference for Azure VPN egress traffic. For more information, see [Routing preference in Azure](../virtual-network/ip-services/routing-preference-overview.md).|June 2021|This parameter can only be specified at gateway creation time and can't be modified after the fact.|
|Feature|Remote User connectivity/Point-to-site VPN|[Remote RADIUS server](virtual-wan-point-to-site-portal.md)|Ability for a P2S VPN gateway to forward authentication traffic to a RADIUS server in a VNet connected to a different hub, or a RADIUS server hosted on-premises.|April 2021| |
|Feature|Remote User connectivity/Point-to-site VPN|[Dual-RADIUS server](virtual-wan-point-to-site-portal.md)|Ability to specify primary and backup RADIUS servers to service authentication traffic.|March 2021| |
|Feature|Remote User connectivity/Point-to-site VPN|[Custom IPsec policies](point-to-site-ipsec.md)|Ability to specify connection/encryption parameters for IKEv2 point-to-site connections.|March 2021|Only supported for IKEv2- based connections.<br><br>View the [list of available parameters](point-to-site-ipsec.md). |
|SKU|Remote User connectivity/Point-to-site VPN|[Support up to 100K users connected to a single hub](about-client-address-pools.md)|Increased maximum number of concurrent users connected to a single gateway to 100,000.|March 2021| |
|Feature|Remote User connectivity/Point-to-site VPN|Multiple-authentication methods|Ability for a single gateway to use multiple authentication mechanisms.|June 2023|Supported for gateways running all protocol combinations. Note that Azure AD authentication still requires the use of OpenVPN|

## Preview

The following features are currently in gated public preview. After working with the listed articles, you have questions or require support, reach out to the contact alias (if available) that corresponds to the feature.

|Type of preview|Feature |Description|Contact alias|Limitations|
|---|---|---|---|---|
| Managed preview | Route-maps | This feature allows you to perform route aggregation, route filtering, and modify BGP attributes for your routes in Virtual WAN. | preview-route-maps@microsoft.com | Known limitations are displayed here: [About Route-maps (preview)](route-maps-about.md#key-considerations).
|Managed preview|Aruba EdgeConnect SD-WAN| Deployment of Aruba EdgeConnect SD-WAN NVA into the Virtual WAN hub| preview-vwan-aruba@microsoft.com| |

## Known issues

|#|Issue|Description |Date first reported|Mitigation|
|---|---|---|---|---|
|1|ExpressRoute connectivity with Azure Storage and the 0.0.0.0/0 route|If you have configured a 0.0.0.0/0 route statically in a virtual hub route table or dynamically via a network virtual appliance for traffic inspection, that traffic will bypass inspection when destined for Azure Storage and is in the same region as the ExpressRoute gateway in the virtual hub. | | As a workaround, you can either use [Private Link](../private-link/private-link-overview.md) to access Azure Storage or put the Azure Storage service in a different region than the virtual hub.|
|2| Default routes (0/0) won't propagate inter-hub |0/0 routes won't propagate between two virtual WAN hubs. | June 2020 |  None. Note: While the Virtual WAN team has fixed the issue, wherein static routes defined in the static route section of the VNet peering page propagate to route tables listed in "propagate to route tables" or the labels listed in "propagate to route tables" on the VNet connection page, default routes (0/0) won't propagate inter-hub. |
|3| Two ExpressRoute circuits in the same peering location connected to multiple hubs |If you have two ExpressRoute circuits in the same peering location, and both of these circuits are connected to multiple virtual hubs in the same Virtual WAN, then connectivity to your Azure resources may be impacted. | July 2023 | Make sure each virtual hub has at least 1 virtual network connected to it. This will ensure connectivity to your Azure resources. The Virtual WAN team is also working on a fix for this issue. |

## Next steps

For more information about Azure Virtual WAN, see [What is Azure Virtual WAN](virtual-wan-about.md) and [frequently asked questions- FAQ](virtual-wan-faq.md).
