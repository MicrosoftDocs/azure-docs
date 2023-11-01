---
title: 'About ExpressRoute Connections in Azure Virtual WAN'
description: Learn about using ExpressRoute in Azure Virtual WAN to connect your Azure and on-premises environments.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 12/13/2022
ms.author: cherylmc
---
# About ExpressRoute connections in Azure Virtual WAN

This article provides details on ExpressRoute connections in Azure Virtual WAN. 

A virtual hub can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Users using private connectivity in Virtual WAN can connect their ExpressRoute circuits to an ExpressRoute gateway in a Virtual WAN hub. For a tutorial on connecting an ExpressRoute circuit to an Azure Virtual WAN hub, see [How to Connect an ExpressRoute Circuit to Virtual WAN](virtual-wan-expressroute-portal.md).

## ExpressRoute circuit SKUs supported in Virtual WAN
The following ExpressRoute circuit SKUs can be connected to the hub gateway: Local, Standard, and Premium. ExpressRoute Direct circuits are also supported with Virtual WAN. To learn more about different SKUs, visit [ExpressRoute Circuit SKUs](../expressroute/expressroute-faqs.md#what-is-the-connectivity-scope-for-different-expressroute-circuit-skus). ExpressRoute Local circuits can only be connected to ExpressRoute gateways in the same region, but they can still access resources in spoke virtual networks located in other regions. 

## ExpressRoute gateway performance

ExpressRoute gateways are provisioned in units of 2 Gbps. One scale unit = 2 Gbps with support up to 10 scale units = 20 Gbps. 

[!INCLUDE [ExpressRoute Performance](../../includes/virtual-wan-expressroute-performance.md)]


## BGP with ExpressRoute in Virtual WAN
Dynamic routing (BGP) is supported. For more information, please see [Dynamic Route Exchange with ExpressRoute](../expressroute/expressroute-routing.md#dynamic-route-exchange). The ASN of the ExpressRoute gateway in the hub and ExpressRoute circuit are fixed and can't be edited at this time.

## ExpressRoute connection concepts 
| Concept| Description| Notes|
| --| --| --|
| Propagate Default Route|If the Virtual WAN hub is configured with a 0.0.0.0/0 default route, this setting controls whether the 0.0.0.0/0 route is advertised to your ExpressRoute-connected site. The default route doesn't originate in the Virtual WAN hub. The route can be a static route in the default route table or 0.0.0.0/0 advertised from on-premises. | This field can be set to enabled or disabled.|
| Routing Weight|If the Virtual WAN hub learns the same prefix from multiple connected ExpressRoute circuits, then the ExpressRoute connection with the higher weight will be preferred for traffic destined for this prefix.  | This field can be set to a number between 0 and 32000.|

## ExpressRoute circuit concepts 
| Concept| Description| Notes|
| --| --| --|
| Authorization Key| An authorization key is granted by a circuit owner and is valid for only one ExpressRoute connection. | To redeem and connect an ExpressRoute circuit that isn't in your subscription, you'll need to collect the authorization key from the ExpressRoute circuit owner.|
| Peer circuit URI| This is the Resource ID of the ExpressRoute circuit (which you can find under the **Properties** setting pane of the ExpressRoute Circuit).  | To redeem and connect an ExpressRoute circuit that isn't in your subscription, you'll need to collect the Peer Circuit URI from the ExpressRoute circuit owner. |

> [!NOTE]
> If you have configured a 0.0.0.0/0 route statically in a virtual hub route table or dynamically via a network virtual appliance for traffic inspection, that traffic will bypass inspection when destined for Azure Storage and is in the same region as the ExpressRoute gateway in the virtual hub. As a workaround, you can either use [Private Link](../private-link/private-link-overview.md) to access Azure Storage or put the Azure Storage service in a different region than the virtual hub.
>

## ExpressRoute limits in Virtual WAN
| Maximum number of circuits connected to the same virtual hub's ExpressRoute gateway | Limit |
| --- | --- |
| Maximum number of circuits in the same peering location connected to the same virtual hub | 4 |
| Maximum number of circuits in different peering locations connected to the same virtual hub | 8 |

The above two limits hold true regardless of the number of ExpressRoute gateway scale units deployed. For ExpressRoute circuit route limits, please see [ExpressRoute Circuit Route Advertisement Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#route-advertisement-limits).

## Next steps

Next, for a tutorial on connecting an ExpressRoute circuit to Virtual WAN, see:

> [!div class="nextstepaction"]
> * [How to Connect an ExpressRoute Circuit to Virtual WAN](virtual-wan-expressroute-portal.md)
