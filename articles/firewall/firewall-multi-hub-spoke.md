---
title: Use Azure Firewall to route a multi hub and spoke topology 
description: Learn how you can deploy Azure Firewall to route a multi hub and spoke topology.
services: firewall
author: erjosito
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 06/26/2025
ms.author: jomore
# Customer intent: "As a network architect, I want to implement Azure Firewall in a multi hub and spoke topology, so that I can efficiently route and secure traffic between various virtual networks while simplifying network management."
---

# Use Azure Firewall to route a self-managed hub-and-spoke topology

The hub-and-spoke topology is a common pattern for network architectures in Azure, since it offers an approach to consolidate network resources in a single subscription. Hub-and-spoke architectures provide network connectivity or security to virtual networks deployed in different subscriptions or tenants while centralizing the network services. You can implement this pattern either in a self-managed fashion, sometimes called "traditional hub-and-spoke", or through Virtual WAN, where Microsoft assumes ownership of the hub virtual networks to simplify administration tasks. Another possibility to reduce the management overhead of a self-managed hub-and-spoke implementation is by using [Azure Virtual Network Manager (AVNM)][avnm]. AVNM can automate the configuration of Azure Route Tables, but the overall design and techniques doesn't change as compared to the manual approach. Therefore, the contents of this article are equally valid whether using AVNM or not in a self-managed hub-and-spoke topology.

An alternative to Azure Route Tables in the spoke VNets is injecting routes into subnets with Azure Route Server, as documented in [Default route injection in spoke virtual networks][ars]. However, this pattern isn't commonly used due to the complexity that can arise because of the interaction of Azure Route Server and VPN or ExpressRoute Virtual Network Gateways.

In the self-managed hub-and-spoke setup, the hub is a virtual network (VNet) that serves as a central connectivity point to your on-premises network via Virtual Private Network (VPN), ExpressRoute and Software-Defined Wide Area Network (SDWAN). Network security devices like firewalls are also located in the hub virtual network. The spokes are VNets that peer with the hub and where workloads are deployed. If your workloads are spread out over multiple regions, you would typically have one hub per region aggregating traffic from the spokes in that specific region. The following diagram describes the high-level architecture of a 2-region (called A and B) self-managed hub-and-spoke topology with two spoke VNets in each region:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-overall.png" alt-text="Conceptual diagram showing 2-region self-managed hub-and-spoke architecture." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-overall.png":::

## Single-region architecture

To understand the multi-region design, you need to master the single-region concepts first. The following diagram shows the routing table configuration for the first region:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-regiona.png" alt-text="Low-level routing design for a single-region self-managed hub-and-spoke architecture." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-regiona.png":::

You need to consider routing for each of the potential flows in the single-region design to understand the configuration of the user-defined routes:

- **Spoke to spoke**: since spokes aren't peered to each other and VNet peering isn't transitive, each spoke knows by default how to route to the hub VNet, but not to any other spoke. As a consequence, a route for `0.0.0.0/0` applied to all spoke subnets covers the spoke-to-spoke traffic.
- **Spoke to Internet**: the `0.0.0.0/0` route in the spoke route table also covers traffic sent to the public Internet. This route overwrites the system route that is included in public subnets by default, see [Default outbound access in Azure][default-outbound] for further details.
- **Internet to spoke**: traffic from the Internet to the spoke usually goes first through the Azure Firewall. Azure Firewall has Destination Network Address Translation (DNAT) rules configured, which also implies translating the source IP address (Source Network Address Translation or SNAT). Therefore, the spoke workloads see traffic as coming from the Azure Firewall subnet. Since VNet peering creates system routes to the hub (`10.1.0.0/24`), so the spokes will know how to route return traffic.
- **On-premises to/from spoke**: in this case you need to consider each of the two directions separately:
  - **On-premises to spoke**: traffic arrives from the on-premises network to the VPN or ExpressRoute gateways. With the default routing in Azure, a system route is be created in the GatewaySubnet (as well as any other subnet in the hub VNet) for each of the spokes. You need to overwrite each of these system routes and set the next hop to the Azure Firewall's private IP address. In this example, this requirement translates to having two routes in a route table associated to the gateway subnet, one for each spoke (`10.1.1.0/24` and `10.1.2.0/24`). If you try to use a summary such as `10.1.0.0/16` that encompasses all spoke VNets it doesn't work, since the system routes injected by the VNet peerings in the gateway subnet are more specific (`/24` as compared to the `/16` summary). This route table must have the toggle "Propagate gateway routes" enabled (set to "Yes"), otherwise gateway routing can become unpredictable.
  - **Spoke to on-premises**: the key to notice here's that the VNet peerings between the hub and the spokes must have the settings "Allow Gateway Transit" on the hub side, and "Use Remote Gateways" on the spoke side. These settings are required so that the VPN and ExpressRoute gateways advertise the spoke prefixes over Border Gateway Protocol (BGP) to on-premises. However, another effect of these settings is that the spokes learn by default the prefixes that are advertised from on-premises to Azure. Since these prefixes are usually more specific than the user-defined route `0.0.0.0/0` in the spoke route table, by default traffic from the spokes to on-premises would bypass the firewall. To provent this situation from happening, you can set the toggle "Propagate Gateway Routes" to "No" in the spoke route table, so that the on-premises prefixes aren't learnt and the `0.0.0.0/0` route is also used for traffic to on-premises.

> [!NOTE]
> Use the exact spoke virtual network IP prefixes in the route table associated with the gateway subnet instead of a network summary. Otherwise, the system routes introduced by the VNet peerings with the spokes override your user-defined route, since they're more specific.

Both the route table associated to the spoke subnets and the route table associated to the gateway subnet can be managed with Azure Virtual Network Manager to reduce administrative overhead. See [AVNM - Use Azure Firewall as the next hop][avnm-azfw] for more details.

## Workloads in the hub VNet

Workloads deployed in the hub VNet such as Active Directory Domain Controllers, Domain Name System (DNS) servers or other infrastructure shared across spokes can increase the complexity of the hub-and-spoke design. The overall recommendation is to avoid placing workloads in the hub and instead deploying them in a dedicated spoke for shared services. This section describes the configuration that is required to have hub workloads, so that you can evaluate whether this complexity is acceptable in case you require this kind of setup. A common mistake that can cause asymmetric traffic and consequently packet drops will be described too.

The following diagram reflects a single-region design with a workload subnet present in the hub VNet:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-hubworkload.png" alt-text="Low-level routing design for a single-region self-managed hub-and-spoke architecture with workloads in the hub." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-hubworkload.png":::

The critical detail to notice is that the user-defined routes configured in both the gateway subnet and the spoke subnets are defined for the specific value of the workload subnet **and not for the whole hub VNet prefix**:

- Configuring a route in the gateway subnet for the whole hub VNet (`10.1.0.0/24` in this example) overrides the system route for the hub VNet. Consequently, intra-subnet control traffic between the VPN / ExpressRoute gateways is also sent to the firewall, potentially disrupting the correct operation of the gateways.
- Configuring a route in the spoke subnets for the whole hub VNet (`10.1.0.0/24` in this example) overrides the system route created by the peering with the hub VNet. All traffic sent to the hub would be sent to the Azure Firewall, including traffic sourced from the Azure Firewall itself, such as Internet-to-spoke traffic that goes through Source Network Address Translation (SNAT). This configuration introduces asymmetric traffic in the design, and the effect is that a part of your flows are dropped.

> [!NOTE]
> If you deploy workloads in the hub VNet, don't use the whole VNet IP prefix in your user-defined routes.

## Inter-subnet traffic

In the setup so far, traffic between spokes is sent to the firewall, but intra-spoke traffic stays inside of the spoke VNet and should be controlled using [Network Security Groups][nsg]. This design decision implies that virtual networks are considered as a security boundary: the firewalls only inspect traffic that needs to exit or enter a virtual network.

If you need to firewall traffic between subnets that are in the same spoke VNet you need to modify the route table that is associated to the spoke subnets, as the following diagram describes:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-intersubnet.png" alt-text="Low-level routing design for a single-region self-managed hub-and-spoke architecture with inter-subnet traffic going through the firewall." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-intersubnet.png":::

In the previous diagram two spoke subnets have been introduced in each of the spoke VNets, and the route tables for the spokes in VNet A2 have been described. As you can see, a first consequence of sending inter-subnet traffic to the firewall is that every subnet now needs a separate route table, since the routes to install in each subnet are different. If we have a look at one of the subnets, for example to subnet A21, you would need these additional two routes:

- The route to `10.1.2.0/24` overrides the system route for intra-VNet traffic. If you don't configure any other route, all intra-VNet traffic is sent up to the Azure Firewall, even traffic between virtual machines in the same subnet.
- The route to `10.1.2.0/26` with next hop "Virtual Network" is an exception to the previous route, so that traffic inside of this specific subnet isn't sent to the firewall, but it's locally routed inside of the VNet. This route is specific to each subnet, which is the main reason why you need a specific route table for each subnet.

## SD-WAN appliances

If you're using SD-WAN Network Virtual Appliances (NVAs) instead of VPN or ExpressRoute gateways, the design is similar, as you can see in the following diagram:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-sdwan1.png" alt-text="Low-level routing design for a two-region self-managed hub-and-spoke architecture with SDWAN NVAs." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-sdwan1.png":::

There are different ways of integrating SDWAN NVAs in Azure, please refer to [SDWAN integration with Azure hub-and-spoke network topologies][sdwan] for further details. This article reflects integration using Azure Route Server, one of the most common ways of routing traffic to SDWAN networks. In this case, the SDWAN NVAs advertise the on-premises prefixes to the Azure Route Server via BGP. Azure Route Server injects these prefixes in the Azure Firewall subnet, so that Azure Firewall has routing information for on-premises networks. The spokes don't learn the on-premises prefixes because the option "Propagate gateway routes" is disabled in the spoke route table.

If you don't want to to configure each spoke VNet's prefix in the route table associated to the NVA subnet, there's an alternative design you can do by placing the SDWAN NVAs in their dedicated VNet. This way, the NVA VNet doesn't learn the spokes' prefixes, since they'ren't directly peered, and a summary route is possible as the following diagram shows: 

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-sdwan2.png" alt-text="Low-level routing design for a two-region self-managed hub-and-spoke architecture with SDWAN NVAs in a separate VNet." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-sdwan2.png":::

## Multi-region architecture

Now that you understand in detail how traffic works inside of a single hub-and-spoke region, extending the design to an architecture with multiple regions is simple. The following diagram shows an updated network design with hubs in two regions A and B:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-interhub.png" alt-text="Low-level routing design for a two-region self-managed hub-and-spoke architecture." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-interhub.png":::

The only addition to the configuration is the route tables associated with the Azure Firewall subnets in each region. Each hub VNet only knows the prefixes of the directly peered VNets, so there's no routing for the prefixes of remote spokes. You can add user-defined routes for each Azure Firewall subnet so that traffic for each region is routed to the corresponding Azure Firewall. In this example, each region can be easily summarized (region A contains prefixes in `10.1.0.0/16` and region B in `10.2.0.0/16`. Defining IP addresses in each region which are easily summarized will make your routing configuration much simpler, otherwise you have to create one route for each remote spoke.

The route table associated to the Azure Firewall subnet needs to have the checkbox "Propagate Gateways Routes" set to yes, so that Azure Firewall learns the routes from the VPN and ExpressRoute gateways and it's able to route traffic to on-premises networks.

> [!NOTE]
> If the Azure Firewall is deployed without Management NIC, the Azure Firewall Subnet requires a default route with Next Hop Internet to be able to add more specific routes as previously described.

To simplify the management of user-defined routes in a multi-region environment you can use Azure Virtual Network Manager. See [Manage User-Defined Routes across multiple hub-and-spoke topologies with AVNM][avnm-multihub] for more details.

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).

[ars]: /azure/route-server/route-injection-in-spokes
[avnm]: /azure/virtual-network-manager/overview
[avnm-multihub]: /azure/virtual-network-manager/how-to-manage-user-defined-routes-multiple-hub-spoke-topologies
[avnm-azfw]: /azure/virtual-network-manager/concept-user-defined-route#use-azure-firewall-as-the-next-hop
[default-outbound]: /azure/virtual-network/ip-services/default-outbound-access
[nsg]: /azure/virtual-network/network-security-group-how-it-works
[sdwan]: /azure/architecture/networking/guide/sdwan-integration-in-hub-and-spoke-network-topologies
[udr]: /azure/virtual-network/virtual-networks-udr-overview#user-defined
