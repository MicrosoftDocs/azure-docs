---
title: 'Architecture: Global transit network architecture'
titleSuffix: Azure Virtual WAN
description: Learn how Azure Virtual WAN allows a global transit network architecture by enabling ubiquitous, any-to-any connectivity between globally distributed sets of cloud workloads in VNets, branch sites, SaaS and PaaS applications, and users.
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/25/2023
ms.author: cherylmc

---

# Global transit network architecture and Virtual WAN

Modern enterprises require ubiquitous connectivity between hyper-distributed applications, data, and users across the cloud and on-premises. Global transit network architecture is being adopted by enterprises to consolidate, connect, and control the cloud-centric modern, global enterprise IT footprint.

The global transit network architecture is based on a classic hub-and-spoke connectivity model where the cloud hosted network 'hub' enables transitive connectivity between endpoints that may be distributed across different types of 'spokes'.

In this model, a spoke can be:
* Virtual network (VNets)
* Physical branch site
* Remote user
* Internet

:::image type="content" source="./media/virtual-wan-global-transit-network-architecture/hub-spoke.png" alt-text="Diagram of hub and spoke." lightbox="./media/virtual-wan-global-transit-network-architecture/hub-spoke.png":::

**Figure 1: Global transit hub-and-spoke network**

Figure 1 shows the logical view of the global transit network where geographically distributed users, physical sites, and VNets are interconnected via a networking hub hosted in the cloud. This architecture enables logical one-hop transit connectivity between the networking endpoints.

## <a name="globalnetworktransit"></a>Global transit network with Virtual WAN

Azure Virtual WAN is a Microsoft-managed cloud networking service. All the networking components that this service is composed of are hosted and managed by Microsoft. For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) article.

Azure Virtual WAN allows a global transit network architecture by enabling ubiquitous, any-to-any connectivity between globally distributed sets of cloud workloads in VNets, branch sites, SaaS and PaaS applications, and users.

:::image type="content" source="./media/virtual-wan-global-transit-network-architecture/transit-network.png" alt-text="Diagram of global network transit with Virtual WAN." lightbox="./media/virtual-wan-global-transit-network-architecture/transit-network.png":::

**Figure 2: Global transit network and Virtual WAN**

In the Azure Virtual WAN architecture, virtual WAN hubs are provisioned in Azure regions, to which you can choose to connect your branches, VNets, and remote users. The physical branch sites are connected to the hub by Premium or Standard ExpressRoute or site-to site-VPNs, VNets are connected to the hub by VNet connections, and remote users can directly connect to the hub using User VPN (point-to-site VPNs). Virtual WAN also supports cross-region VNet connection where a VNet in one region can be connected to a virtual WAN hub in a different region.

You can establish a virtual WAN by creating a single virtual WAN hub in the region that has the largest number of spokes (branches, VNets, users), and then connecting the spokes that are in other regions to the hub. This is a good option when an enterprise footprint is mostly in one region with a few remote spokes.  
  
## <a name="hubtohub"></a>Hub-to-hub connectivity

An Enterprise cloud footprint can span multiple cloud regions and it's optimal (latency-wise) to access the cloud from a region closest to their physical site and users. One of the key principles of global transit network architecture is to enable cross-region connectivity between all cloud and on-premises network endpoints. This means that traffic from a branch that is connected to the cloud in one region can reach another branch or a VNet in a different region using hub-to-hub connectivity enabled by [Azure Global Network](https://azure.microsoft.com/global-infrastructure/global-network/).

:::image type="content" source="./media/virtual-wan-global-transit-network-architecture/cross-region.png" alt-text="Diagram of cross-region." lightbox="./media/virtual-wan-global-transit-network-architecture/cross-region.png":::

**Figure 3: Virtual WAN cross-region connectivity**

When multiple hubs are enabled in a single virtual WAN, the hubs are automatically interconnected via hub-to-hub links, thus enabling global connectivity between branches and Vnets that are distributed across multiple regions. 

Additionally, hubs that are all part of the same virtual WAN, can be associated with different regional access and security policies. For more information, see [Security and policy control](#security) later in this article.

## <a name="anytoany"></a>Any-to-any connectivity

Global transit network architecture enables any-to-any connectivity via virtual WAN hubs. This architecture eliminates or reduces the need for full mesh or partial mesh connectivity between spokes that are more complex to build and maintain. In addition, routing control in hub-and-spoke vs. mesh networks is easier to configure and maintain.

Any-to-any connectivity (in the context of a global architecture) allows an enterprise with globally distributed users, branches, datacenters, VNets, and applications to connect to each other through the “transit” hub(s). Azure Virtual WAN acts as the global transit system.

:::image type="content" source="./media/virtual-wan-global-transit-network-architecture/any-any.png" alt-text="Diagram of any to any." lightbox="./media/virtual-wan-global-transit-network-architecture/any-any.png":::

**Figure 4: Virtual WAN traffic paths**

Azure Virtual WAN supports the following global transit connectivity paths. The letters in parentheses map to Figure 4.

* Branch-to-VNet (a)
* Branch-to-branch (b)
  * ExpressRoute Global Reach and Virtual WAN
* Remote User-to-VNet (c)
* Remote User-to-branch (d)
* VNet-to-VNet (e)
* Branch-to-hub-hub-to-Branch (f)
* Branch-to-hub-hub-to-VNet (g)
* VNet-to-hub-hub-to-VNet (h)

### Branch-to-VNet (a) and Branch-to-VNet Cross-region (g)

Branch-to-VNet is the primary path supported by Azure Virtual WAN. This path allows you to connect branches to Azure IAAS enterprise workloads that are deployed in Azure VNets. Branches can be connected to the virtual WAN via ExpressRoute or site-to-site VPN. The traffic transits to VNets that are connected to the virtual WAN hubs via VNet Connections. Explicit [gateway transit](../virtual-network/virtual-network-peering-overview.md#gateways-and-on-premises-connectivity) isn't required for Virtual WAN because Virtual WAN automatically enables gateway transit to branch site. See [Virtual WAN Partners](virtual-wan-configure-automation-providers.md) article on how to connect an SD-WAN CPE to Virtual WAN.

### ExpressRoute Global Reach and Virtual WAN

ExpressRoute is a private and resilient way to connect your on-premises networks to the Microsoft Cloud. Virtual WAN supports Express Route circuit connections. The following ExpressRoute circuit SKUs can be connected to Virtual WAN: Local, Standard, and Premium.

There are two options to enable ExpressRoute to ExpressRoute transit connectivity when using Azure Virtual WAN:

* You can enable ExpressRoute to ExpressRoute transit connectivity by enabling ExpressRoute Global Reach on your ExpressRoute circuits. [Global Reach](../expressroute/expressroute-global-reach.md) is an ExpressRoute add-on feature that allows you to link ExpressRoute circuits in different peering locations together to make a private network. ExpressRoute to ExpressRoute transit connectivity between circuits with the Global Reach add-on will not transit the Virtual WAN hub because Global Reach enables a more optimal path over the global backbone.

* You can use the Routing Intent feature with private traffic routing policies to enable ExpressRoute transit connectivity via a security appliance deployed in the Virtual WAN Hub. This option doesn't require Global Reach. For more information, see the [ExpressRoute section](how-to-routing-policies.md#expressroute) in routing intent documentation.

### Branch-to-branch (b) and Branch-to-Branch cross-region (f)

Branches can be connected to an Azure virtual WAN hub using ExpressRoute circuits and/or site-to-site VPN connections. You can connect the branches to the virtual WAN hub that is in the region closest to the branch.

This option lets enterprises leverage the Azure backbone to connect branches. However, even though this capability is available, you should weigh the benefits of connecting branches over Azure Virtual WAN vs. using a private WAN.  

> [!NOTE]
> Disabling Branch-to-Branch Connectivity in Virtual WAN -
> Virtual WAN can be configured to disable Branch-to-Branch connectivity. This configuration will block route propagation between VPN (S2S and P2S) and Express Route connected sites. This configuration will not affect branch-to-Vnet and Vnet-to-Vnet route propagation and connectivity. To configure this setting using Azure Portal: Under Virtual WAN Configuration menu, Choose Setting: Branch-to-Branch - Disabled. 

### Remote User-to-VNet (c)

You can enable direct, secure remote access to Azure using point-to-site connection from a remote user client to a virtual WAN. Enterprise remote users no longer have to hairpin to the cloud using a corporate VPN.

### Remote User-to-branch (d)

The Remote User-to-branch path lets remote users who are using a point-to-site connection to Azure access on-premises workloads and applications by transiting through the cloud. This path gives remote users the flexibility to access workloads that are both deployed in Azure and on-premises. Enterprises can enable central cloud-based secure remote access service in Azure Virtual WAN.

### VNet-to-VNet transit (e) and VNet-to-VNet cross-region (h)

The VNet-to-VNet transit enables VNets to connect to each other in order to interconnect multi-tier applications that are implemented across multiple VNets. Optionally, you can connect VNets to each other through VNet Peering and this may be suitable for some scenarios where transit via the VWAN hub isn't necessary.


## <a name="DefaultRoute"></a>Forced tunneling and default route

Forced Tunneling can be enabled by configuring the enable default route on a VPN, ExpressRoute, or Virtual Network connection in Virtual WAN.

A virtual hub propagates a learned default route to a virtual network/site-to-site VPN/ExpressRoute connection if enable default flag is 'Enabled' on the connection. 

This flag is visible when the user edits a virtual network connection, a VPN connection, or an ExpressRoute connection. By default, this flag is disabled when a site or an ExpressRoute circuit is connected to a hub. It's enabled by default when a virtual network connection is added to connect a VNet to a virtual hub. The default route doesn't originate in the Virtual WAN hub; the default route is propagated if it's already learned by the Virtual WAN hub as a result of deploying a firewall in the hub, or if another connected site has forced-tunneling enabled.

## <a name="security"></a>Security and policy control

The Azure Virtual WAN hubs interconnect all the networking end points across the hybrid network and potentially see all transit network traffic. Virtual WAN hubs can be converted to Secure Virtual Hubs by deploying a bump-in-the-wire security solution in the hub. You can deploy Azure Firewall, select Next-Generation Firewall Network Virtual Appliances or security software-as-a-service (SaaS) inside of Virtual WAN hubs to enable cloud-based security, access, and policy control. You can configure Virtual WAN to route traffic to security solutions in the hub using [Virtual Hub Routing Intent](how-to-routing-policies.md).


Orchestration of Azure Firewalls in virtual WAN hubs can be performed by Azure Firewall Manager. [Azure Firewall Manager](../firewall-manager/index.yml) provides the capabilities to manage and scale security for global transit networks. Azure Firewall Manager provides ability to centrally manage routing, global policy management, advanced Internet security services via third-party along with the Azure Firewall.

For more information on deploying and orchestrating Next-Generation Firewall Network Virtual Appliances in the Virtual WAN hub, see [Integrated Network Virtual Appliances in the Virtual Hub](about-nva-hub.md). For more information on SaaS security solutions that can be deployed in the Virtual WAN hub, see [software-as-a-service](how-to-palo-alto-cloud-ngfw.md).

:::image type="content" source="./media/virtual-wan-global-transit-network-architecture/secured-hub.png" alt-text="Diagram of secured virtual hub with Azure Firewall." lightbox="./media/virtual-wan-global-transit-network-architecture/secured-hub.png":::

**Figure 5: Secured virtual hub with Azure Firewall**

Virtual WAN supports the following global secured transit connectivity paths. While the diagram and traffic patterns in this section describe Azure Firewall use cases, the same traffic patterns are supported with Network Virtual Appliances and SaaS security solutions deployed in the hub. The letters in parentheses map to Figure 5.

* VNet-to-VNet secure transit (e)
* VNet-to-Internet or third-party Security Service (i)
* Branch-to-Internet or third-party Security Service (j)

### VNet-to-VNet secured transit (e)

The VNet-to-VNet secured transit enables VNets to connect to each other via the Azure Firewall in the Virtual WAN hub.

### VNet-to-Internet or third-party Security Service (i)

The VNet-to-Internet enables VNets to connect to the internet via the Azure Firewall in the virtual WAN hub. Traffic to internet via supported third-party security services doesn't flow through the Azure Firewall. You can configure Vnet-to-Internet path via supported third-party security service using Azure Firewall Manager.  

### Branch-to-Internet or third-party Security Service (j)

The Branch-to-Internet enables branches to connect to the internet via the Azure Firewall in the virtual WAN hub. Traffic to internet via supported third-party security services doesn't flow through the Azure Firewall. You can configure Branch-to-Internet path via supported third-party security service using Azure Firewall Manager. 

### Branch-to-branch secured transit cross-region (f)

Branches can be connected to a secured virtual hub with Azure Firewall using ExpressRoute circuits and/or site-to-site VPN connections. You can connect the branches to the virtual WAN hub that is in the region closest to the branch.

This option lets enterprises leverage the Azure backbone to connect branches. However, even though this capability is available, you should weigh the benefits of connecting branches over Azure Virtual WAN vs. using a private WAN.  


### Branch-to-VNet secured transit (g)

The Branch-to-VNet secured transit enables branches to communicate with virtual networks in the same region as the virtual WAN hub as well as another virtual network connected to another virtual WAN hub in another region.


### How do I enable default route (0.0.0.0/0) in a Secured Virtual Hub

Azure Firewall deployed in a Virtual WAN hub (Secure Virtual Hub) can be configured as default router to the Internet or Trusted Security Provider for all branches (connected by VPN or Express Route), spoke Vnets and Users (connected via P2S VPN). 
This configuration must be done using Azure Firewall Manager.  See Route Traffic to your hub to configure all traffic from branches (including Users) as well as Vnets to Internet via the Azure Firewall. 

This is a two step configuration:

1. Configure Internet traffic routing using Secure Virtual Hub Route Setting menu. Configure Vnets and Branches that can send traffic to the internet via the Firewall.

2. Configure which Connections (Vnet and Branch) can route traffic to the internet (0.0.0.0/0) via the Azure FW in the hub or Trusted Security Provider. This step ensures that the default route is propagated to selected branches and Vnets that are attached to the Virtual WAN hub via the Connections. 

### Force tunneling traffic to on-premises firewall in a Secured Virtual Hub

If there is already a default route learned (via BGP) by the Virtual Hub from one of the Branches (VPN or ER sites), this default route is overridden by the default route learned from Azure Firewall Manager setting. In this case, all traffic that is entering the hub from Vnets and branches destined to internet, will be routed to the Azure Firewall or Trusted Security Provider.

> [!NOTE]
> Currently there is no option to select on-premises firewall or Azure Firewall (and Trusted Security Provider) for internet bound traffic originating from Vnets, Branches or Users. The default route learned from the Azure Firewall Manager setting is always preferred over the default route learned from one of the branches.


## Next steps

Create a connection using Virtual WAN and Deploy Azure Firewall in VWAN hub(s).

* [Site-to-site connections using Virtual WAN](virtual-wan-site-to-site-portal.md)
* [ExpressRoute connections using Virtual WAN](virtual-wan-expressroute-portal.md)
* [Azure Firewall Manager to Deploy Azure FW in VWAN](../firewall-manager/index.yml)
