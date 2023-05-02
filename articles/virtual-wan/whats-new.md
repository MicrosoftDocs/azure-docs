---
title: What's new in Azure Virtual WAN?
description: Learn what's new with Azure Virtual WAN such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 12/02/2022
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
|Feature| Routing |[Virtual hub routing preference](about-virtual-hub-routing-preference.md)|Hub routing preference gives you more control over your infrastructure by allowing you to select how your traffic is routed when a virtual hub router learns multiple routes across S2S VPN, ER and SD-WAN NVA connections.  |October 2022| |
|Feature| Routing|[Bypass next hop IP for workloads within a spoke VNet connected to the virtual WAN hub generally available](how-to-virtual-hub-routing.md)|Bypassing next hop IP for workloads within a spoke VNet connected to the virtual WAN hub lets you deploy and access other resources in the VNet with your NVA without any additional configuration.|October 2022| |
|SKU/Feature/Validation | Routing | [BGP end point (General availability)](scenario-bgp-peering-hub.md) | The virtual hub router now exposes the ability to peer with it, thereby exchanging routing information directly through Border Gateway Protocol (BGP) routing protocol. | June 2022 | |
|Feature|Routing|[0.0.0.0/0 via NVA in the spoke](scenario-route-through-nvas-custom.md)|Ability to send internet traffic to an NVA in spoke for egress.|March 2021| 0.0.0.0/0 doesn't propagate across hubs.<br><br>Can't specify multiple public prefixes with different next hop IP addresses.|

### NVAs and integrated third-party solutions

| Type |Area |Name |Description | Date added | Limitations |
| --- |---|---|---|---|---|
|Feature|Software-as-a-service|Palo Alto Networks Cloud NGFW|Public preview of [Palo Alto Networks Cloud NGFW](https://aka.ms/pancloudngfwdocs), the first software-as-a-serivce security offering deployable within the Virtual WAN hub.|May 2023|Palo Alto Networks Cloud NGFW is only deployable in newly created Virtual WAN hubs in some Azure regions. See [Limitations of Palo Alto Networks Cloud NGFW](how-to-palo-alto-cloud-ngfw.md) for a full list of limitations.|
| Feature| Network Virtual Appliances (NVAs)/Integrated Third-party solutions in Virtual WAN hubs| [Fortinet SD-WAN](https://docs.fortinet.com/document/fortigate-public-cloud/7.2.2/azure-vwan-sd-wan-deployment-guide/12818/deployment-overview)| General availability of Fortinet SD-WAN solution in Virtual WAN. Next-Generation Firewall use cases  in preview.| October 2022| SD-WAN solution generally available. Next Generation Firewall use cases in preview.|
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
|Feature|Remote User connectivity/Point-to-site VPN|[Global profile include/exclude](global-hub-profile.md#include-or-exclude-a-hub-from-a-global-profile)|Ability to mark a point-to-site gateway as "excluded", meaning users who connect to global profile won't be load-balanced to that gateway.|February 2022| |
|Feature|Remote User connectivity/Point-to-site VPN|[Forced tunneling for P2S VPN](how-to-forced-tunnel.md)|Ability to force all traffic to Azure Virtual WAN for egress.|October 2021|Only available for Azure VPN Client version 2:1900:39.0 or newer.|
|Feature|Remote User connectivity/Point-to-site VPN|[macOS Azure VPN client](openvpn-azure-ad-client-mac.md)|General Availability of Azure VPN Client for macOS.|August 2021| |
|Feature|Branch connectivity/Site-to-site VPN<br><br>Remote User connectivity/Point-to-site VPN|[Hot-potato vs cold-potato routing for VPN traffic](virtual-wan-site-to-site-portal.md)|Ability to specify Microsoft or ISP POP preference for Azure VPN egress traffic. For more information, see [Routing preference in Azure](../virtual-network/ip-services/routing-preference-overview.md).|June 2021|This parameter can only be specified at gateway creation time and can't be modified after the fact.|
|Feature|Remote User connectivity/Point-to-site VPN|[Remote RADIUS server](virtual-wan-point-to-site-portal.md)|Ability for a P2S VPN gateway to forward authentication traffic to a RADIUS server in a VNet connected to a different hub, or a RADIUS server hosted on-premises.|April 2021| |
|Feature|Remote User connectivity/Point-to-site VPN|[Dual-RADIUS server](virtual-wan-point-to-site-portal.md)|Ability to specify primary and backup RADIUS servers to service authentication traffic.|March 2021| |
|Feature|Remote User connectivity/Point-to-site VPN|[Custom IPsec policies](point-to-site-ipsec.md)|Ability to specify connection/encryption parameters for IKEv2 point-to-site connections.|March 2021|Only supported for IKEv2- based connections.<br><br>View the [list of available parameters](point-to-site-ipsec.md). |
|SKU|Remote User connectivity/Point-to-site VPN|[Support up to 100K users connected to a single hub](about-client-address-pools.md)|Increased maximum number of concurrent users connected to a single gateway to 100,000.|March 2021| |
|Feature|Remote User connectivity/Point-to-site VPN|Multiple-authentication methods|Ability for a single gateway to use multiple authentication mechanisms.|March 2021|Only supported for OpenVPN-based gateways.|

## Preview

The following features are currently in gated public preview. After working with the listed articles, you have questions or require support, reach out to the contact alias (if available) that corresponds to the feature.

|Type of preview|Feature |Description|Contact alias|Limitations|
|---|---|---|---|---|
|Managed preview|Configure user groups and IP address pools for P2S User VPNs| This feature allows you to configure P2S User VPNs to assign users IP addresses from specific address pools based on their identity or authentication credentials by creating **User Groups**.|| Known limitations are displayed here: [Configure User Groups and IP address pools for P2S User VPNs (preview)](user-groups-create.md).|
|Managed preview|Aruba EdgeConnect SD-WAN| Deployment of Aruba EdgeConnect SD-WAN NVA into the Virtual WAN hub| preview-vwan-aruba@microsoft.com| |
|Managed preview|Routing intent and policies enabling inter-hub security|This feature allows you to configure internet-bound, private, or inter-hub traffic flow through the Azure Firewall. For more information, see [Routing intent and policies](how-to-routing-policies.md).|For access to the preview, contact previewinterhub@microsoft.com|Not compatible with NVA in a spoke, but compatible with BGP peering.<br><br>For additional limitations, see [How to configure Virtual WAN  hub routing intent and routing policies](how-to-routing-policies.md#key-considerations).|
|Managed preview|Checkpoint NGFW|Deployment of Checkpoint NGFW NVA into the Virtual WAN hub|DL-vwan-support-preview@checkpoint.com, previewinterhub@microsoft.com|Same limitations as routing intent.<br><br>Doesn't support internet inbound scenario.|
|Managed preview|Fortinet NGFW/SD-WAN|Deployment of Fortinet dual-role SD-WAN/NGFW NVA into the Virtual WAN hub|azurevwan@fortinet.com, previewinterhub@microsoft.com|Same limitations as routing intent.<br><br>Doesn't support internet inbound scenario.|
|Public preview/Self serve|Virtual hub routing preference|This feature allows you to influence routing decisions for the virtual hub router. For more information, see [Virtual hub routing preference](about-virtual-hub-routing-preference.md).|For questions or feedback, contact preview-vwan-hrp@microsoft.com|If a route-prefix is reachable via ER or VPN connections, and via virtual hub SD-WAN NVA, then the latter route is ignored by the route-selection algorithm. Therefore, the flows to prefixes reachable only via virtual hub. SD-WAN NVA will take the route through the NVA. This is a limitation during the preview phase of the hub routing preference feature.|
|Public preview/Self serve|Hub-to-hub traffic flows instead of an ER circuit connected to different hubs (Hub-to-hub over ER)|This feature allows traffic between 2 hubs traverse through the Azure Virtual WAN router in each hub and uses a hub-to-hub path, instead of the ExpressRoute path (which traverses through Microsoft's edge routers/MSEE). For more information, see the [Hub-to-hub over ER](virtual-wan-faq.md#expressroute-bow-tie) preview link.|For questions or feedback, contact preview-vwan-hrp@microsoft.com|

## Known issues

|#|Issue|Description |Date first reported|Mitigation|
|---|---|---|---|---|
|1|Virtual hub upgrade to VMSS-based infrastructure: Compatibility with NVA in a hub.|For deployments with an NVA provisioned in the hub, the virtual hub router can't be upgraded to Virtual Machine Scale Sets.| July 2022|The Virtual WAN team is working on a fix that will allow Virtual hub routers to be upgraded to Virtual Machine Scale Sets, even if an NVA is provisioned in the hub. After upgrading, users will have to re-peer the NVA with the hub router’s new IP addresses (instead of having to delete the NVA).|
|2|Virtual hub upgrade to VMSS-based infrastructure: Compatibility with NVA in a spoke VNet.|For deployments with an NVA provisioned in a spoke VNet, the customer will have to delete and recreate the BGP peering with the spoke NVA.|March 2022|The Virtual WAN team is working on a fix to remove the need for users to delete and recreate the BGP peering with a spoke NVA after upgrading.|
|3|Virtual hub upgrade to VMSS-based infrastructure: Compatibility with spoke VNets in different regions |If your Virtual WAN hub is connected to a combination of spoke virtual networks in the same region as the hub and a separate region than the hub, then you may experience a lack of connectivity to these respective spoke virtual networks after upgrading your hub router to VMSS-based infrastructure.|March 2023|To resolve this and restore connectivity to these virtual networks, you can modify any of the virtual network connection properties (For example, you can modify the connection to propagate to a dummy label). We are actively working on removing this requirement. |
|4|Virtual hub upgrade to VMSS-based infrastructure: Compatibility with more than 100 spoke VNets |If your Virtual WAN hub is connected to more than 100 spoke VNets, then the upgrade may time out, causing your virtual hub to remain on Cloud Services-based infrastructure.|March 2023|The Virtual WAN team is working on a fix to support upgrades when there are more than 100 spoke VNets connected.|

## Next steps

For more information about Azure Virtual WAN, see [What is Azure Virtual WAN](virtual-wan-about.md) and [frequently asked questions- FAQ](virtual-wan-faq.md).
