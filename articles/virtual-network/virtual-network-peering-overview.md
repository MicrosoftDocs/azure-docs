---
title: Azure Virtual Network peering | Microsoft Docs
description: Learn about virtual network peering in Azure.
services: virtual-network
documentationcenter: na
author: NarayanAnnamalai
manager: jefco
editor: tysonn

ms.assetid: eb0ba07d-5fee-4db0-b1cb-a569b7060d2a
ms.service: virtual-network
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/17/2016
ms.author: narayan

---
# Virtual network peering
Virtual network (VNet) peering enables you to connect two VNets in the same region through the Azure backbone network. Once peered, the two VNets appear as one for connectivity purposes. The two VNets are still managed as separate resources, but virtual machines (VM) in the peered VNets can communicate with each other directly by using private IP addresses.

The traffic between VMs in the peered VNets is routed through the Azure infrastructure, much like traffic is routed between VMs in the same VNet. Some of the benefits of using VNet peering include:

* A low-latency, high-bandwidth connection between resources in different VNets.
* The ability to use resources such as network appliances and VPN gateways as transit points in a peered VNet.
* The ability to peer two VNets created through the Azure Resource Manager deployment model or to peer one VNet created through Resource Manager to a VNet created through the classic deployment model. Read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md) article to learn more about the differences between the two Azure deployment models.

Requirements and key aspects of VNet peering:

* The peered VNets must exist in the same Azure region.
* The peered VNets must have non-overlapping IP address spaces.
* VNet peering is between two VNets, but there is no derived transitive relationship across peerings. For example, if VNetA is peered with VNetB, and VNetB is peered with VNetC, VNetA is *not* peered to VNetC.
* You can peer VNets that exist in two different subscriptions as long a privileged user of both subscriptions authorizes the peering and the subscriptions are associated to the same Active Directory tenant.
* VNets can be peered if both are created through the Resource Manager deployment model or if one is created through the Resource Manager deployment model and the other is created through the classic deployment model. Two VNets created through the classic deployment model cannot be peered to each other however. When peering VNets created through different deployment models, the VNets must both exist in  the *same* subscription. The ability to peer VNets created through different deployment models that exist in *different* subscriptions is in **preview** release. Read the [Create a virtual network peering using Powershell](virtual-networks-create-vnetpeering-arm-ps.md) article for further details.
* Though the communication between VMs in peered VNets has no additional bandwidth restrictions, there is a maximum network bandwidth depending on the VM size that still applies. To learn more about maximum network bandwidth for different VM sizes, read the [Windows](../virtual-machines/windows/sizes.md) or [Linux](../virtual-machines/linux/sizes.md) VM sizes articles.

![Basic VNet peering](./media/virtual-networks-peering-overview/figure01.png)

## Connectivity
After two VNets are peered, VMs or Cloud Services roles in the VNet can directly connect with other resources connected to the peered VNet. The two VNets have full IP-level connectivity.

The network latency for a round trip between two VMs in peered VNets is the same as for a round trip within a single VNet. The network throughput is based on the bandwidth that's allowed for the VM proportionate to its size. There isn't any additional restriction on bandwidth within the peering.

The traffic between the VMs in peered VNets is routed directly through the Azure back-end infrastructure and not through a gateway.

VMs connected to a VNet can access the internal load-balanced (ILB) endpoints in the peered VNet. Network security groups (NSGs) can be applied in either VNet to block access to other VNets or subnets, if desired.

When configuring peering, you can either open or close the NSG rules between the VNets. If you open full connectivity between peered VNets (which is the default option), you can apply NSGs to specific subnets or VMs to block or deny specific access. Read the [Network security groups](virtual-networks-nsg.md) article to learn more about NSGs.

Azure-provided internal DNS name resolution for VMs doesn't work across peered VNets. VMs have internal DNS names that are resolvable only within the local VNet. You can however, configure VMs connected to peered VNets as DNS servers for a VNet. Read the [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) article for further details.

## Service chaining
You can configure user-defined routes (UDR) that point to VMs in peered VNets as the "next hop" IP address, as shown in the diagram later in this article. This enables service chaining, which enables you to direct traffic from one VNet to a virtual appliance that's running in a peered VNet through UDRs.

You can also effectively build hub-and-spoke type environments, where the hub can host infrastructure components such as a network virtual appliance. All the spoke VNets can then peer with it, as well as a subset of traffic to appliances that are running in the hub VNet. In short, VNet peering enables the next hop IP address on the UDR to be the IP address of a VM in the peered VNet. Read the [user-defined routes](virtual-networks-udr-overview.md) article for additional information about UDRs.

## Gateways and on-premises connectivity
Each VNet, regardless of whether it is peered with another VNet, can still have its own gateway and use it to connect to an on-premises network. Users can also configure [VNet-to-VNet connections](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md) by using gateways, even though the VNets are peered.

When both options for VNet interconnectivity are configured, the traffic between the VNets flows through the peering configuration (that is, through the Azure backbone).

When VNets are peered, users can also configure the gateway in the peered VNet as a transit point to an on-premises network. In this case, the VNet that is using a remote gateway cannot have its own gateway. A VNet can have only one gateway. The gateway can be either a local or remote gateway (in the peered VNet), as shown in the following picture:

![VNet peering transit](./media/virtual-networks-peering-overview/figure02.png)

Gateway transit is not supported in the peering relationship between VNets created through different deployment models. Both VNets in the peering relationship must have been created through Resource Manager for a gateway transit to work.

When the VNets that are sharing a single Azure ExpressRoute connection are peered, the traffic between them goes through the peering relationship (that is, through the Azure backbone network). You can still use local gateways in each VNet to connect to the on-premises circuit. Alternatively, you can use a shared gateway and configure transit for on-premises connectivity.

## Provisioning
VNet peering is a privileged operation. It’s a separate function under the VirtualNetworks namespace. A user can be given specific rights to authorize peering. A user who has read-write access to the virtual network inherits these rights automatically.

A user who is either an admin or a privileged user of the peering ability can initiate a peering operation on another VNet. If there is a matching request for peering on the other side, and if other requirements are met, the peering will be established.

Refer to the articles in the [Next steps](#next-steps) section of this article to learn how to establish VNet peering between two VNets.

## Limits
There are limits on the number of peerings that are allowed for a single virtual network. Refer to [Azure networking limits](../azure-subscription-service-limits.md#networking-limits) for more information.

## Pricing
There is a nominal charge for ingress and egress traffic that utilizes a VNet peering. For more information, refer to the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network).

## <a name="next-steps"></a>Next steps
Learn how to create a VNet peering using:

* [The Azure portal](virtual-networks-create-vnetpeering-arm-portal.md)
* [Azure PowerShell](virtual-networks-create-vnetpeering-arm-ps.md)
* [An Azure Resource Manager template](virtual-networks-create-vnetpeering-arm-template-click.md)
