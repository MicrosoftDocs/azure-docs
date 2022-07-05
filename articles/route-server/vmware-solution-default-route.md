---
title: 'Injecting routes to Azure VMware Solution'
description: Learn about how to advertise routes to Azure VMware Solution with Azure Route Server.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: halkazwini
---

# Injecting routes to Azure VMware Solution with Azure Route Server

[Azure VMware Solution](../azure-vmware/introduction.md) is an Azure service where native VMware vSphere workloads run and communicate with other Azure services. This communication happens over ExpressRoute, and Azure Route Server can be used to modify the default behavior of Azure VMware Solution networking. The most frequent patterns for injecting routing information in Azure VMware Solution are either advertising a default route to attract Internet traffic to Azure, or advertising routes to achieve communications to on-premises networks when Global Reach is not available.

## Injecting a default route to Azure VMware Solution

Certain deployments require to inspect all egress traffic from AVS towards Internet. While it is possible creating Network Virtual Appliances (NVAs) in AVS, some times those appliances already exist in Azure, and they can be leveraged as well to inspect Internet traffic from AVS. In this case, a default route can be injected from the NVA in Azure to attract traffic from AVS and inspect it before sending it out to the public Internet.

The following diagram describes a basic hub and spoke topology connected to an AVS cloud and to an on-premises network through ExpressRoute. The diagram shows how the default route (`0.0.0.0/0`) is originated by the NVA in Azure, and propagated by Azure Route Server to Azure VMware Solution through ExpressRoute.

:::image type="content" source="./media/scenarios/vmware-solution-default.png" alt-text="Diagram of Azure VMware Solution with Route Server and default route.":::

> [!IMPORTANT]
> The default route advertised by the NVA will be propagated to the on-premises network as well, so it needs to be filtered out in the customer routing environment.

Communication between Azure VMware Solution and the on-premises network will typically happen over ExpressRoute Global Reach, as described in [Peer on-premises environments to Azure VMware Solution](../azure-vmware/tutorial-expressroute-global-reach-private-cloud.md).

## Communication between Azure VMware Solution and the on-premises network via an NVA

Similar designs can be used to interconnect AVS and on-premises networks sending traffic through an NVA in Azure. There are two main scenarios for this pattern:

- Some organizations might have the requirement to send traffic between AVS and the on-premises network through an NVA (typically a firewall).
- ExpressRoute Global Reach might not be available on a particular region to interconnect the ExpressRoute circuits of AVS and the on-premises network.

> [!IMPORTANT]
> Global Reach is still the preferred option to connect AVS and on-premises environments, the patterns described in this document add a considerable complexity to the environment.

If both ExpressRoute circuits (to AVS and to on-premises) are terminated in the same ExpressRoute gateway, you could assume that the gateway is going to route packets across them. However, an ExpressRoute gateway isn't designed to do that. Instead, you need to hairpin the traffic to a Network Virtual Appliance that is able to route the traffic. To that purpose, two actions are required:

- The NVA should advertise a supernet for the AVS and on-premises prefixes, as the diagram below shows. You could use a supernet that includes both AVS and on-premises prefixes, or individual prefixes for AVS and on-premises (always less specific that the actual prefixes advertised over ExpressRoute). Consider though that all supernet prefixes advertised to Route Server are going to be propagated both to AVS and on-premises.
- UDRs in the GatewaySubnet that exactly match the prefixes advertised from AVS and on-premises will hairpin traffic from the GatewaySubnet to the Network Virtual Appliance.

:::image type="content" source="./media/scenarios/vmware-solution-to-on-premises-hairpin.png" alt-text="Diagram of AVS to on-premises communication with Route Server in a single region.":::

As the diagram above shows, the NVA needs to advertise more generic (less specific) prefixes that include the networks from on-premises and AVS. You need to be careful with this approach, since the NVA might be potentially attracting traffic that it shouldn't (since it is advertising wider ranges, in the example above the whole `10.0.0.0/8` network).

If advertising less specific prefixes isn't possible as in the option described above or the UDRs that are required in the GatewaySubnet are not desired or supported (for example because they exceed the maximum limit of routes per route table, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits) for more details), you could instead implement an alternative design using two separate VNets. In this topology, instead of propagating less specific routes to attract traffic to the ExpressRoute gateway, two different NVAs in separate VNets exchange routes between each other, and propagate them to their respective ExpressRoute circuits via BGP and Azure Route Server, as the following diagram shows. Each NVAs has full control on which prefixes are propagated to each ExpressRoute circuit. For example, the diagram below shows how a single 0.0.0.0/0 is advertised to AVS, and the individual AVS prefixes are propagated to the on-premises network:

:::image type="content" source="./media/scenarios/vmware-solution-to-on-premises.png" alt-text="Diagram of AVS to on-premises communication with Route Server in two regions.":::

Note that some sort of encapsulation protocol such as VXLAN or IPsec is required between the NVAs. The reason why encapsulation is needed is because the NVA NICs would learn the routes from Azure Route Server with the NVA as next hop, and create a routing loop. An alternative to using an overlay is by leveraging secondary NICs in the NVA that don't learn the routes from Azure Route Server, and configuring UDRs so that Azure can route traffic to the remote environment over those NICs. You can find more details in [Enterprise-scale network topology and connectivity for Azure VMware Solution][caf_avs_nw].

The main difference between this dual VNet design and the previously described single VNet design is that with two VNets you have full control on what is advertised to each ExpressRoute circuit, and this allows for a more dynamic and granular configuration. In comparison, in the single-VNet design described earlier in this document a common set of supernets or less specific prefixes are sent down both circuits to attract traffic to the VNet. Additional, in the single-VNet design there is a static configuration component in the UDRs that are required in the Gateway Subnet. Hence, although less cost-effective (two ExpressRoute gateways and two sets of NVAs are required), the double-VNet design might be a better alternative for very dynamic routing environments.

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)

[caf_avs_nw]: /azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity
