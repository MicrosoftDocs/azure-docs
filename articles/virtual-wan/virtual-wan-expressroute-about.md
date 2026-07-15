---
title: 'About ExpressRoute Connections in Azure Virtual WAN'
description: Learn about using ExpressRoute in Azure Virtual WAN to connect your Azure and on-premises environments.
author: duongau
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 03/26/2025
ms.author: duau
---
# About ExpressRoute connections in Azure Virtual WAN

This article provides details on ExpressRoute connections in Azure Virtual WAN. 

A virtual hub can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Users using private connectivity in Virtual WAN can connect their ExpressRoute circuits to an ExpressRoute gateway in a Virtual WAN hub. For a tutorial on connecting an ExpressRoute circuit to an Azure Virtual WAN hub, see [How to Connect an ExpressRoute Circuit to Virtual WAN](virtual-wan-expressroute-portal.md).

## ExpressRoute circuit SKUs supported in Virtual WAN

The following ExpressRoute circuit SKUs can be connected to the hub gateway: Local, Standard, and Premium. ExpressRoute Direct circuits are also supported with Virtual WAN. To learn more about different SKUs, visit [ExpressRoute Circuit SKUs](../expressroute/expressroute-faqs.md#what-is-the-connectivity-scope-for-different-expressroute-circuit-skus). ExpressRoute Local circuits can only be connected to ExpressRoute gateways in the same region, but they can still access resources in spoke virtual networks located in other regions. 

## ExpressRoute gateway in Virtual WAN performance

ExpressRoute gateways are provisioned in units of 2 Gbps. One scale unit = 2 Gbps with support up to 10 scale units = 20 Gbps.

[!INCLUDE [ExpressRoute Performance](../../includes/virtual-wan-expressroute-performance.md)]

## ExpressRoute FastPath in Virtual WAN

ExpressRoute FastPath improves data path performance between your on-premises network and Azure by bypassing the ExpressRoute gateway in the Virtual WAN hub for supported traffic flows. For more information about FastPath, see [Azure ExpressRoute FastPath: Features, availability, and limitations](../expressroute/about-fastpath.md).
 
> [!NOTE]
> If you're using ExpressRoute FastPath with Azure Virtual WAN is **enabled by default** for ExpressRoute direct circuits connected to Virtual WAN ExpressRoute Gateways deployed with a minimum of 5 scale units. No additional configuration is required.

ExpressRoute FastPath in Virtual WAN applies to packets destined for addresses in spoke virtual networks directly connected to the Virtual WAN hub deployed in the **same** region as the Virtual WAN hub. The following table shows the connectivity matrix for scenarios where FastPath is applicable.

The following symbols denote FastPath:
* ✓ -Traffic patterns marked with a ✓ are routed via FastPath.
* ✗ - Traffic patterns marked with an ✗ are routed via the ExpressRoute gateway.

"Routed via security solution in the hub" references Virtual WAN routing configurations where [static routes](static-routes.md#routing-traffic-to-azure-firewall) or [routing intent private routing policies](how-to-routing-policies.md) are used to send on-premises to Virtual Network traffic to a security solution deployed **in the Virtual WAN hub**.

**Destinations in directly connected Virtual WAN spoke:**

|Destination of Traffic | Routed Directly | Routed via security solution in the hub|
|--|--|--|
|Virtual Machine in Virtual WAN spoke Virtual Network  (same region as hub)| ✓ | ✓ |
|Internal Load Balancer front-end IP in Virtual WAN spoke Virtual Network| ✗ | ✓ |
|Private Endpoint / Private Link in Virtual WAN spoke Virtual Network | ✗ | ✓ |
|Bare-metal workloads (examples: Azure NetApp Files or Nutanix NC2) in Virtual WAN spoke Virtual Network | ✓ | ✓ |
|Destinations in spoke Virtual Networks that are in a **different region** than the connected Virtual WAN hub | ✗ | ✗ |

**Other destinations:**

|Destination of Traffic | Routed Directly |Routed via security solution in the hub|
|--|--|--|
|IP address in indirect spoke (spoke Virtual Network directly connected to the Virtual WAN hub) | ✗ | ✗ |
|All inter-hub destinations | ✗ | ✗ |
|Internet-bound traffic | ✗ | ✗ |
|Transit-connectivity to other branches (VPN, NVA or ExpressRoute) | ✗ | ✗ |
|Site-to-site VPN Gateway tunnel IP (Encrypted ExpressRoute ESP outer packets) | ✗ | - |
|Network Virtual Appliance (NVA) or SaaS solution deployed in Virtual WAN hub (any packet destined for NVA private IP)| ✗ | - |
|Azure Firewall in the Virtual WAN hub (SNAT traffic)| ✗ | - |

Consider a few other scenarios when utilizing special types of Azure or third-party services:

* **Platform as a service (PaaS) service that's exposed in a Virtual WAN spoke Virtual Network**: The underlying implementation of the PaaS service determines whether traffic is routed through FastPath or the ExpressRoute Gateway. For example, if the PaaS service is fronted by an Internal Load Balancer, traffic is routed through the ExpressRoute gateway unless traffic is routed to a security solution in the hub.
* **Services that are connected to Azure with ExpressRoute**: Certain Azure services such as Azure VMWare service or Skytap utilize ExpressRoute to connect to Azure. Third-party services that you consume might also use ExpressRoute. When using these services with Virtual WAN, reference service documentation or reach out to the service provider to determine whether the service's ExpressRoute configuration meets the requirements for FastPath with Virtual WAN.

Other common scenarios where on-premises to Azure traffic is routed via the ExpressRoute Gateway and FastPath is **not applicable** regardless of whether a security solution is inserted include (but aren't limited to):

### IP address capacity

FastPath has IP address limits based on your circuit type. Plan your deployment to ensure you don't exceed these limits.

> [!TIP]
> Configure alerts by using Azure Monitor to get notified when FastPath routes approach the threshold limit. 

ExpressRoute Direct applies IP limits cumulatively at the port level. When you reach the limit, FastPath stops configuring new routes and traffic flows through the ExpressRoute gateway instead. All standard limits for the gateway, circuit, and virtual network still apply.


| Circuit type | Bandwidth | IP address limit |
|--------------|-----------|------------------|
| ExpressRoute Direct | 100, 400 Gbps | 200,000 |
| ExpressRoute Direct | 10 Gbps | 100,000 |

## BGP with ExpressRoute in Virtual WAN

Dynamic routing (BGP) is supported. For more information, please see [Dynamic Route Exchange with ExpressRoute](../expressroute/expressroute-routing.md#dynamic-route-exchange). The ASN of the ExpressRoute gateway in the hub and ExpressRoute circuit are fixed and can't be edited at this time.

## ExpressRoute connection concepts 
| Concept| Description| Notes|
| ---| ---|---|
| Propagate Default Route|If the Virtual WAN hub is configured with a 0.0.0.0/0 default route, this setting controls whether the 0.0.0.0/0 route is advertised to your ExpressRoute-connected site. The default route doesn't originate in the Virtual WAN hub. The route can be a static route in the default route table or 0.0.0.0/0 advertised from on-premises. | This field can be set to enabled or disabled.|
| Routing Weight|If the Virtual WAN hub learns the same prefix from multiple connected ExpressRoute circuits, then the ExpressRoute connection with the higher weight will be preferred for traffic destined for this prefix.  | This field can be set to a number between 0 and 32000.|

## ExpressRoute circuit concepts 
| Concept| Description| Notes|
| ---| ---| ---|
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
