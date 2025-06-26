---
title: Use Azure Firewall to route a multi hub and spoke topology 
description: Learn how you can deploy Azure Firewall to route a multi hub and spoke topology.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/17/2025
ms.author: maroja
# Customer intent: "As a network architect, I want to implement Azure Firewall in a multi hub and spoke topology, so that I can efficiently route and secure traffic between various virtual networks while simplifying network management."
---

# Use Azure Firewall to route a self-managed hub-and-spoke topology

The hub-and-spoke topology is a common network architecture pattern in Azure, since it offers an approach to consolidate network resources in a single subscription and provide functionality such as connectivity or security to virtual networks deployed in different subscriptions or tenants. There are different ways in which you can implement this pattern, either in a self-managed fashion (sometimes called "traditional hub-and-spoke") or through Virtual WAN, where Microsoft assumes ownership of the hub virtual networks to simplify administration tasks. Another possibility to reduce the management overhead of a self-managed hub-and-spoke implementation is by leveraging [Azure Virtual Network Manager (AVNM)][avnm]. AVNM can automate the configuration of Azure Route Tables, but the overall design and techniques doesn't change as compared to the manual approach. Consequently, the contents of this article are equally valid whether using AVNM or not in a self-managed hub-and-spoke topology.

An alternative to Azure Route Tables in the spoke VNets is injecting routes into subnets with Azure Route Server, as documented in [Default route injection in spoke virtual networks][ars]. However, this pattern is not commonly used due to the complexity that can arise because of the interaction of Azure Route Server and VPN or ExpressRoute Virtual Network Gateways.

In the self-managed hub-and-spoke setup, the hub is a virtual network (VNet) that serves as a central point of connectivity to your on-premises network via Virtual Private Network (VPN), ExpressRoute and Software-Defined Wide Area Network (SDWAN), and where network security devices such as firewalls are located. The spokes are VNets that peer with the hub and where workloads are deployed. If your workloads are spread out over multiple regions, you would typically have one hub per region aggregating traffic from the spokes in that specific region. The following diagram describes the high-level architecture of a 2-region (called A and B) self-managed hub-and-spoke topology with two spoke VNets in each region:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-overall.png" alt-text="Conceptual diagram showing 2-region self-managed hub-and-spoke architecture." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-overall.png":::

## Single-region architecture

To understand the multi-region design you need to master the single-region concepts first. The following diagram shows the routing table configuration for the first region:

:::image type="content" source="media/firewall-multi-hub-spoke/multi-hub-spoke-regionA.png" alt-text="Low-level routing design for a single-region self-managed hub-and-spoke architecture." lightbox="media/firewall-multi-hub-spoke/multi-hub-spoke-regionA.png":::

You need to consider routing for each of the potential flows in the single-region design to understand the configuration of the user-defined routes:

- **Spoke to spoke**: since spokes are not peered to each other and VNet peering is not transitive, each spoke will not know by default how to route to any other spoke (only to the hub VNet). Consequently, a route for `0.0.0.0/0` applied to all spoke subnets will cover the spoke-to-spoke traffic.
- **Spoke to Internet**: the `0.0.0.0/0` route in the spoke route table will also cover traffic sent to the public Internet. This route will overwrite the system route that is included in public subnets by default, see [Default outbound access in Azure][default-outbound] for further details.
- **Internet to spoke**: traffic from the Internet to the spoke will usually traverse the Azure Firewall first. Azure Firewall will have Destination Network Address Translation (DNAT) rules configured, which also imply translating the source IP address (Source Network Address Translation or SNAT). Consequently, the spoke workloads will see traffic as coming from the Azure Firewall subnet. Since VNet peering creates system routes to the hub (`10.1.0.0/24`), so the spokes will know how to route return traffic.
- **On-premises to/from spoke**: in this case you need to consider each of the two directions separately:
  - **On-premises to spoke**: traffic will arrive from the on-premises network to the VPN or ExpressRoute gateways. With the default routing in Azure, a system route will be created in the GatewaySubnet (as well as any other subnet in the hub VNet) for each of the spokes. You need to overwrite each of these system routes and set the next hop to the Azure Firewall's private IP address. In the example above, this means having two routes in the route table associated to the gateway subnet, one for each spoke (`10.1.1.0/24` and `10.1.2.0/24`). Note that if you try to use a summary such as `10.1.0.0/16` that encompasses all spoke VNets it will not work, since the system routes injected by the VNet peerings in the gateway subnet will be more specific (`/24` as compared to the `/16` summary).

## Routing on the firewall subnet

Each local firewall needs to know how to reach remote spokes, so you must create UDRs in the firewall subnets. Start by creating a default route, then add more specific routes to the other spokes. The following screenshots show the route tables for the two hub VNets:

> [!NOTE]
> The address prefix in the hub virtual route table should encompass the address spaces of the two spoke virtual networks.

**Hub-01 route table**
:::image type="content" source="media/firewall-multi-hub-spoke/hub-01-route-table.png" alt-text="Screenshot showing the route table for Hub-01.":::

**Hub-02 route table**
:::image type="content" source="media/firewall-multi-hub-spoke/hub-02-route-table.png" alt-text="Screenshot showing the route table for Hub-02.":::

## Routing on the spoke subnets

This topology allows traffic to move from one hub to another, reaching the next hop directly connected via global peering.

As shown in the diagram, it's best to place a UDR in the spoke subnets with a 0/0 route (default gateway) pointing to the local firewall as the next hop. This ensures a single exit point through the local firewall and reduces the risk of asymmetric routing if more specific prefixes from your on-premises environment cause traffic to bypass the firewall. For more information, see [Don’t let your Azure Routes bite you](https://blog.cloudtrooper.net/2020/11/28/dont-let-your-azure-routes-bite-you/).

Here's an example route table for the spoke subnets connected to Hub-01:

:::image type="content" source="media/firewall-multi-hub-spoke/hub-01-spoke-route.png" alt-text="Screenshot showing the route table for the spoke subnets.":::


## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).


[avnm]: /azure/virtual-network-manager/overview
[ars]: /azure/route-server/route-injection-in-spokes
[default-outbound]: /azure/virtual-network/ip-services/default-outbound-access