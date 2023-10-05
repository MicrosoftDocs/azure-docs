---
title: Concepts - Network design considerations
description: Learn about network design considerations for Azure VMware Solution
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 9/15/2023
---

# Azure VMware Solution network design considerations

Azure VMware Solution offers a VMware private cloud environment that users and applications can access from on-premises and Azure-based environments or resources. Networking services such as Azure ExpressRoute and virtual private network (VPN) connections deliver the connectivity. 

There are several networking considerations to review before you set up your Azure VMware Solution environment. This article provides solutions for use cases that you might encounter when you're using Azure VMware Solution to configure your networks.

## Azure VMware Solution compatibility with AS-Path Prepend

Azure VMware Solution has considerations relating to the use of AS-Path Prepend for redundant ExpressRoute configurations. If you're running two or more ExpressRoute paths between on-premises and Azure, consider the following guidance for influencing traffic out of Azure VMware Solution towards your on-premises location via ExpressRoute GlobalReach.

Due to asymmetric routing, connectivity issues can occur when Azure VMware Solution doesn't observe AS-Path Prepend and therefore uses equal-cost multipath (ECMP) routing to send traffic toward your environment over both ExpressRoute circuits. This behavior can cause problems with stateful firewall inspection devices placed behind existing ExpressRoute circuits.

### Prerequisites

For AS-Path Prepend, consider the following:

> [!div class="checklist"]
> * The key point is that you must prepend **Public** ASN numbers to influence how Azure VMware Solution routes traffic back to on-premises. If you prepend using _Private_ ASN, Azure VMware Solution will ignore the prepend, and the ECMP behavior above will occur. Even if you operate a Private BGP ASN on-premises, it's still possible to configure your on-premises devices to utilize a Public ASN when prepending routes outbound, to ensure compatibility with Azure VMware Solution.
> * Design your traffic path for private ASNs after the public ASN to be honored by Azure VMware Solution. The Azure VMware Solution ExpressRoute circuit doesn't strip any private ASNs that exist in the path after the public ASN is processed.
> * Both or all circuits are connected to Azure VMware Solution through Azure ExpressRoute Global Reach.
> * The same netblocks are being advertised from two or more circuits.
> * You wish to use AS-Path Prepend to force Azure VMware solution to prefer one circuit over another.
> * Use either 2-byte or 4-byte public ASN numbers.

## Management VMs and default routes from on-premises

> [!IMPORTANT]
> Azure VMware Solution management virtual machines (VMs) won't honor a default route from on-premises for RFC1918 destinations.

If you're routing back to your on-premises networks by using only a default route advertised toward Azure, traffic from vCenter Server and NSX-T Manager VMs towards on-premises destinations with private IP addresses won't follow that route.

To reach vCenter Server and NSX-T Manager from on-premises, provide specific routes to allow traffic to have a return path to those networks. For example, advertise the RFC1918 summaries (10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16).

## Default route to Azure VMware Solution for internet traffic inspection

Certain deployments require inspecting all egress traffic from Azure VMware Solution toward the internet. Although it's possible to create network virtual appliances (NVAs) in Azure VMware Solution, there are use cases where these appliances already exist in Azure and can be applied to inspect internet traffic from Azure VMware Solution. In this case, a default route can be injected from the NVA in Azure to attract traffic from Azure VMware Solution and inspect the traffic before it goes out to the public internet.

The following diagram describes a basic hub-and-spoke topology connected to an Azure VMware Solution cloud and to an on-premises network through ExpressRoute. The diagram shows how the NVA in Azure originates the default route (`0.0.0.0/0`). Azure Route Server propagates the route to Azure VMware Solution through ExpressRoute.

:::image type="content" source="media/concepts-network-design/vmware-solution-default.png" alt-text="Diagram of Azure VMware Solution with Route Server and a default route." lightbox="media/concepts-network-design/vmware-solution-default.png":::

> [!IMPORTANT]
> The default route that the NVA advertises will be propagated to the on-premises network. You need to add user-defined routes (UDRs) to ensure that traffic from Azure VMware Solution is transiting through the NVA.

Communication between Azure VMware Solution and the on-premises network usually occurs over ExpressRoute Global Reach, as described in [Peer on-premises environments to Azure VMware Solution](../azure-vmware/tutorial-expressroute-global-reach-private-cloud.md).

## Connectivity between Azure VMware Solution and an on-premises network

There are two main scenarios for connectivity between Azure VMware Solution and an on-premises network via a third-party NVA:

- Organizations have a requirement to send traffic between Azure VMware Solution and the on-premises network through an NVA (typically a firewall).
- ExpressRoute Global Reach isn't available in a particular region to interconnect the ExpressRoute circuits of Azure VMware Solution and the on-premises network.

There are two topologies that you can apply to meet all requirements for those scenarios: [supernet](#supernet-design-topology) and [transit spoke virtual network](#transit-spoke-virtual-network-topology).

> [!IMPORTANT]
> The preferred option to connect Azure VMware Solution and on-premises environments is a direct ExpressRoute Global Reach connection. The patterns described in this article add complexity to the environment.

### Supernet design topology

If both ExpressRoute circuits (to Azure VMware Solution and to on-premises) are terminated in the same ExpressRoute gateway, you can assume that the gateway is going to route packets across them. However, an ExpressRoute gateway isn't designed to do that. You need to hairpin the traffic to an NVA that can route the traffic. 

There are two requirements to hairpin network traffic to an NVA:

- The NVA should advertise a supernet for the Azure VMware Solution and on-premises prefixes.

    You could use a supernet that includes both Azure VMware Solution and on-premises prefixes. Or you could use individual prefixes for Azure VMware Solution and on-premises (always less specific than the actual prefixes advertised over ExpressRoute). Keep in mind that all supernet prefixes advertised to Route Server will be propagated to both Azure VMware Solution and on-premises.
- UDRs in the gateway subnet that exactly match the prefixes advertised from Azure VMware Solution and on-premises will cause hairpin traffic from the gateway subnet to the NVA.

This topology results in high management overhead for large networks that change over time. Consider these limitations:

- Anytime a workload segment is created in Azure VMware Solution, UDRs might need to be added to ensure that traffic from Azure VMware Solution is transiting through the NVA.
- If your on-premises environment has a large number of routes that change, Border Gateway Protocol (BGP) and UDR configuration in the supernet might need to be updated.
- Because a single ExpressRoute gateway processes network traffic in both directions, performance might be limited.
- There's an Azure Virtual Network limit of 400 UDRs.

The following diagram demonstrates how the NVA needs to advertise prefixes that are more generic (less specific) and that include the networks from on-premises and Azure VMware Solution. Be careful with this approach. The NVA could potentially attract traffic that it shouldn't, because it's advertising wider ranges (for example, the whole `10.0.0.0/8` network).

:::image type="content" source="media/concepts-network-design/vmware-solution-to-on-premises-hairpin.png" alt-text="Diagram of Azure VMware Solution to on-premises communication with Route Server in a single region." lightbox="media/concepts-network-design/vmware-solution-to-on-premises-hairpin.png":::

### Transit spoke virtual network topology

> [!NOTE]
> If advertising prefixes that are less specific isn't possible because of the previously described limits, you can implement an alternative design that uses two separate virtual networks.

In this topology, instead of propagating routes that are less specific to attract traffic to the ExpressRoute gateway, two different NVAs in separate virtual networks can exchange routes between each other. The virtual networks can propagate these routes to their respective ExpressRoute circuits via BGP and Azure Route Server. Each NVA has full control over which prefixes are propagated to each ExpressRoute circuit.

The following diagram demonstrates how a single `0.0.0.0/0` route is advertised to Azure VMware Solution. It also shows how the individual Azure VMware Solution prefixes are propagated to the on-premises network.

:::image type="content" source="media/concepts-network-design/vmware-solution-to-on-premises.png" alt-text="Diagram of Azure VMware Solution to on-premises communication with Route Server in two regions." lightbox="media/concepts-network-design/vmware-solution-to-on-premises.png":::

> [!IMPORTANT]
> An encapsulation protocol such as VXLAN or IPsec is required between the NVAs. Encapsulation is needed because the NVA network adapter (NIC) would learn the routes from Azure Route Server with the NVA as the next hop and create a routing loop.

There's an alternative to using an overlay. Apply secondary NICs in the NVA that won't learn the routes from Azure Route Server. Then, configure UDRs so that Azure can route traffic to the remote environment over those NICs. You can find more details in [Enterprise-scale network topology and connectivity for Azure VMware Solution](/azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity#scenario-2-a-third-party-nva-in-hub-azure-virtual-network-inspects-all-network-traffic).

This topology requires a complex initial setup. The topology then works as expected with minimal management overhead. Setup complexities include:

- There's an extra cost for an additional transit virtual network that includes Azure Route Server, an ExpressRoute gateway, and another NVA. The NVAs might also need to use large VM sizes to meet throughput requirements.
- IPsec or VXLAN tunneling is required between the two NVAs, which means that the NVAs are also in the datapath. Depending on the type of NVA that you're using, it can result in custom and complex configuration on those NVAs.

## Next steps

Now that you've covered network design considerations for Azure VMware Solution, you might want to learn more about these topics:

- [Azure VMware Solution networking and interconnectivity concepts](concepts-networking.md)
- [Plan the Azure VMware Solution deployment](plan-private-cloud-deployment.md)
- [Tutorial: Networking planning checklist for Azure VMware Solution](tutorial-network-checklist.md)
