---
title: Concepts - Network design considerations
description: Learn about network design considerations for Azure VMware Solution
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 12/22/2022
---

# Azure VMware Solution network design considerations

Azure VMware Solution offers a VMware private cloud environment accessible for users and applications from on-premises and Azure-based environments or resources. The connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections. There are several networking considerations to review before setting up your Azure VMware Solution environment. This article provides solutions for use cases you may encounter when configuring your networking with Azure VMware Solution.

## Azure VMware Solution compatibility with AS-Path Prepend

Azure VMware Solution is incompatible with AS-Path Prepend for redundant ExpressRoute configurations and doesn't honor the outbound path selection from Azure towards on-premises. If you're running two or more ExpressRoute paths between on-premises and Azure, and the listed [Prerequisites](#prerequisites) are not met, you may experience impaired connectivity or no connectivity between your on-premises networks and Azure VMware Solution. The connectivity issue is caused when Azure VMware Solution doesn't see the AS-Path Prepend and uses equal cost multi-pathing (ECMP) to send traffic towards your environment over both ExpressRoute circuits. That action causes issues with stateful firewall inspection.

### Prerequisites

For AS-Path Prepend, you'll need to verify that all of the following listed connections are true:

> [!div class="checklist"]
> * Both or all circuits are connected to Azure VMware Solution with ExpressRoute Global Reach.
> * The same netblocks are being advertised from two or more circuits.
> * Stateful firewalls are in the network path.
> * You're using AS-Path Prepend to force Azure to prefer one path over others.

Either 2 or 4 byte Public ASN numbers should be used and be compatible with Azure VMware Solution. If you don't own a Public ASN to use for prepending, open a [Microsoft Customer Support Ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) to view options.

## Management VMs and default routes from on-premises

> [!IMPORTANT]
> Azure VMware Solution Management VMs will not honor a default route from on-premises.

If you're routing back to your on-premises networks using only a default route advertised towards Azure, the vCenter Server and NSX-T Manager VMs won't be compatible with that route.

**Solution**

To reach vCenter Server and NSX-T Manager, more specific routes from on-premises need to be provided to allow traffic to have a return path route to those networks.

## Use a default route to Azure VMware Solution for internet traffic inspection

Certain deployments require inspecting all egress traffic from Azure VMware Solution towards the Internet. While it's possible to create Network Virtual Appliances (NVAs) in Azure VMware Solution, there are use cases when these appliances already exist in Azure that can be applied to inspect Internet traffic from Azure VMware Solution. In this case, a default route can be injected from the NVA in Azure to attract traffic from Azure VMware Solution and inspect it before sending it out to the public Internet.

The following diagram describes a basic hub and spoke topology connected to an Azure VMware Solution cloud and to an on-premises network through ExpressRoute. The diagram shows how the default route (`0.0.0.0/0`) is originated by the NVA in Azure, and propagated by Azure Route Server to Azure VMware Solution through ExpressRoute.

:::image type="content" source="media/concepts-network-design/vmware-solution-default.png" alt-text="Diagram of Azure VMware Solution with Route Server and default route." lightbox="media/concepts-network-design/vmware-solution-default.png":::

> [!IMPORTANT]
> The default route advertised by the NVA will be propagated to the on-premises network. Because of that, UDRs will need to be added to ensure traffic from Azure VMware Solution is transiting through the NVA.

Communication between Azure VMware Solution and the on-premises network usually occurs over ExpressRoute Global Reach, as described in [Peer on-premises environments to Azure VMware Solution](../azure-vmware/tutorial-expressroute-global-reach-private-cloud.md).

## Connectivity between Azure VMware Solution and on-premises network via a third party network virtual appliance

There are two main scenarios for this connectivity pattern:

- Organizations may have the requirement to send traffic between Azure VMware Solution and the on-premises network through an NVA (typically a firewall).
- ExpressRoute Global Reach might not be available in a particular region to interconnect the ExpressRoute circuits of Azure VMware Solution and the on-premises network.

There are two topologies you can apply to meet all requirements for these two scenarios. The first is a [Supernet topology](#supernet-design-topology) and the second is a [Transit spoke virtual network topology](#transit-spoke-virtual-network-topology).

> [!IMPORTANT]
> The preferred option to connect Azure VMware Solution and on-premises environments is a direct ExpressRoute Global Reach connection. The patterns described in this document add considerable complexity to the environment.

### Supernet design topology

If both ExpressRoute circuits (to Azure VMware Solution and to on-premises) are terminated in the same ExpressRoute gateway, you can assume that the gateway is going to route packets across them. However, an ExpressRoute gateway isn't designed to do that. You need to hairpin the traffic to an NVA that can route the traffic. There are two requirements to hairpin network traffic to an NVA:

- The NVA should advertise a supernet for the Azure VMware Solution and on-premises prefixes.

    You could use a supernet that includes both Azure VMware Solution and on-premises prefixes, or individual prefixes for Azure VMware Solution and on-premises (always less specific that the actual prefixes advertised over ExpressRoute). Keep in mind that all supernet prefixes advertised to Route Server are going to be propagated both to Azure VMware Solution and on-premises.
- UDRs in the GatewaySubnet that exactly match the prefixes advertised from Azure VMware Solution and on-premises will cause hairpin traffic from the GatewaySubnet to the NVA.

**This topology results in high management overhead for large networks that change over time. Note that there are specific limitations to be considered.**

**Limitations**

- Anytime a workload segment is created in Azure VMware Solution, UDRs may need to be added to ensure traffic from Azure VMware Solution is transiting through the NVA.
- If your on-premises environment has a large number of routes that change, BGP and UDR configuration in the supernet may need to be updated.
- Since there's a single ExpressRoute Gateway that processes network traffic in both directions, performance may be limited.
- There's an Azure Virtual Network limit of 400 UDRs.

The following diagram demonstrates how the NVA needs to advertise more generic (less specific) prefixes that include the networks from on-premises and Azure VMware Solution. Be careful with this approach as the NVA could potentially attract traffic that it shouldn't (since it's advertising wider ranges, for example: the whole `10.0.0.0/8` network).

:::image type="content" source="media/concepts-network-design/vmware-solution-to-on-premises-hairpin.png" alt-text="Diagram of Azure VMware Solution to on-premises communication with Route Server in a single region." lightbox="media/concepts-network-design/vmware-solution-to-on-premises-hairpin.png":::

### Transit spoke virtual network topology

> [!NOTE]
> If advertising less specific prefixes is not possible due to the limits previously described, you can implement an alternative design using two separate Virtual Networks.

In this topology, instead of propagating less specific routes to attract traffic to the ExpressRoute gateway, two different NVAs in separate Virtual Networks can exchange routes between each other. The Virtual Networks can propagate these routes to their respective ExpressRoute circuits via BGP and Azure Route Server, as the following diagram shows. Each NVA has full control on which prefixes are propagated to each ExpressRoute circuit.

The following diagram demonstrates how a single 0.0.0.0/0 is advertised to Azure VMware Solution. It also shows how the individual Azure VMware Solution prefixes are propagated to the on-premises network.

:::image type="content" source="media/concepts-network-design/vmware-solution-to-on-premises.png" alt-text="Diagram of Azure VMware Solution to on-premises communication with Route Server in two regions." lightbox="media/concepts-network-design/vmware-solution-to-on-premises.png":::

> [!IMPORTANT]
> An encapsulation protocol such as VXLAN or IPsec is required between the NVAs. Encapsulation is needed because the NVA NICs would learn the routes from Azure Route Server with the NVA as next hop and create a routing loop.

There's an alternative to using an overlay. Apply secondary NICs in the NVA that won't learn the routes from Azure Route Server and configure UDRs so that Azure can route traffic to the remote environment over those NICs. You can find more details in [Enterprise-scale network topology and connectivity for Azure VMware Solution](/azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity#scenario-2-a-third-party-nva-in-hub-azure-virtual-network-inspects-all-network-traffic).

**This topology requires a complex initial set-up. Once the set-up is complete, the topology works as expected with minimal management overhead. See the following list of specific set-up complexities.**

- There's an extra cost for an additional transit Virtual Network that includes an Azure Route Server, ExpressRoute Gateway, and another NVA. The NVAs may also need to use large VM sizes to meet throughput requirements.
- There's IPSec or VxLAN tunneling between the two NVAs required which means that the NVAs are also in the datapath. Depending on the type of NVA you're using, it can result in custom and complex configuration on those NVAs.

## Next steps

Now that you've covered Azure VMware Solution network design considerations, you may want to learn more about:

- [Network interconnectivity concepts - Azure VMware Solution](concepts-networking.md)
- [Plan the Azure VMware Solution deployment](plan-private-cloud-deployment.md)
- [Networking planning checklist for Azure VMware Solution](tutorial-network-checklist.md)

## Recommended content

- [Tutorial - Configure networking for your VMware private cloud in Azure - Azure VMware Solution](tutorial-network-checklist.md)

