<properties
   pageTitle="Azure Virtual Network Peering | Microsoft Azure"
   description="Learn about VNet Peering in Azure."
   services="virtual-network"
   documentationCenter="na"
   authors="narayan"
   manager="jefco"
   editor="tysonn" />
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/28/2016"
   ms.author="narayan" />

# VNet Peering

VNet Peering is a mechanism to connect two Virtual Networks in the same region through the Azure backbone network. Once peered, the two Virtual Networks will appear like one for all connectivity purposes. They will still be managed as separate resources, but virtual machines in these VNets can communicate with each other directly using private IP address. The traffic between Virtual machines in the peered VNets will be routed through the Azure Infrastructure much like traffic between VMs in the same VNet. Some of the benefits of using VNet Peering:

- Low latency, high bandwidth connection between resources in different VNets.
- Ability to use resources such as Network Virtual appliances, and VPN gateways in peered VNet (Transit).
- Connect Resource Manager VNet to a classic VNet and enable full connectivity between resources in these VNets

Requirements and key aspects with VNet peering:
- The two Virtual Networks that are peered should be in the same Azure region
- The VNets that are peered should have non overlapping IP Address space
- VNet Peering is between two virtual networks and there is no derived transitive relationship, i.e. if VNet A is peered with VNet B and if VNet B is peered with VNet C, it does not translate to VNet A being peered with VNet C
- Peering can be established between Virtual networks in two different subscriptions as long a privileged user of the respective subscriptions authorizes the peering
- A Resource Manager VNet can be peered with another Resource Manager VNet or classic VNet, but two classic VNets cannot be peered to each other
- Though the communication between Virtual machines in peered Vnets has no aditional bandwidth restrictions, bandwidth cap based on VM size will still apply. 


![VNet Peering Basic](./media/virtual-networks-peering-overview/figure01.png)

## Connectivity 
Once two VNets are peered, a virtual machine (web/worker role) in the Vnet can directly connect with other virtual machines in the peered VNet. They will have full IP level connectivity. The network latency for round trip between two Virtual machines in peered Vnets will be the same as within the local VNet. The network throughput will be based on the bandwidth allowed for the Virtual machine proportional to its size, there won’t be any additional restriction on allowed bandwidth. The traffic between the Virtual machines in peered Vnets are routed directly, through Azure’s backend infrastructure and not through a gateway.

Virtual machines in a VNet will be able to access the Internal load balanced endpoints (ILB) in the peered VNet. Network Security Groups can be applied in either Vnet to block access to other Vnet or subnet if desired. When user configures peering they will have choice to either open or close the Network Security Group rules between the VNets. If the user chooses to open full connectivity between peered VNets (default option), they can then use NSGs on specific subnets or Virtual machines to block or deny speicifc access.

Azure provided internal DNS name resolution for Virtual machines will not work across peered VNets. Virtual machines will have internal DNS names that is resolvable only within the local Virtual Network. However, users can configure Virtual machines running in peered Vnets as DNS servers for a Virtual network. 

## Service Chaining
Users can configure user defined route tables pointing to Virtual machines in peered Vets as next hop (as shown in the diagram below). This enables users to achieve service chaining by which they can direct traffic from one VNet to a Virtual appliance running in a peered VNet through user defined route tables. Users can also effectively build Hub and spoke type environments where the Hub can host infrastructural component such as Network Virtual appliance and all the spoke VNets can peer with it and direct a subset of traffic to appliances running in the hub VNet. In short, VNet peering allows the next hop IP Address on the ‘User defined route table’ to be that of a virtual machine in the peered VNet.

## Gateways and On-premises connectivity
Each Virtual Network regardless of if they are peered with another Vnet or not, can still have its own gateway and use it to connect to on-premises. Users can also configure VNet-to-VNet connection (provide link) using gateways even though the VNets are peered. When both options for VNet inter connectivity are configured, the traffic between the VNets will flow through the peering configuration (i.e. through the Azure backbone). 

When VNets are peered, users can also configure to use the gateway in the peered Vnet as a transit point to on-premises. In this case, the VNet that is using a remote gateway cannot have a gateway on its own, to simplify one VNet can have only one gateway, it could either be a local gateway or a remote gateway (in the peered Vnet) as illustrated in the picture below. Gateway Transit is not suported between an Resource Manager and classic Vnet, both Vnets in the peering relationship should be Resource Manager Vnets for gateway transit to work.
When the VNets that are sharing a single ER circuit are peered, the traffic between them will go through the peering relationship (i.e. through the Azure backbone network). Users can still use local gateways in each Vnet to connect to the on-premises circuit or use a shared gateway and configure transit for on-premises connectivity.

![VNet Peering Transit](./media/virtual-networks-peering-overview/figure02.png)

## Provisioning
VNet Peering is a privileged operation. It’s a separate function under the Virtual Network namespace. A user can be given specific rights to authorize peering. A user who has read-write access on the VNet will inherit this automatically. A user who is either an admin or a privileged user of the peering ability can initiate a peering operation to another VNet. If there is a matching request for peering on the other side and if other requirements are met, the peering will be established. 

Please refer to the How-To articles to learn more about how to establish VNet peering between two Virtual Networks.

## Limits
There are limits on the number of peerings allowed for a single Virtual network, please refer to [Azure Networking limits](../azure-subscription-service-limits.md#networking-limits) for more information.

## Pricing
VNet Peering will not be charged for during the review period. Once it is released for General Availability there will be a nominal charge on ingress and egress traffic that utilizes the peering. For more information please refer to the [pricing page](https://azure.microsoft.com/pricing/details/virtual-network) 


## Next steps
- [Setup peering between Virtual Networks](virtual-networks-create-vnet-arm-pportal.md).
- Learn about [NSGs](virtual-networks-nsg.md).
- Learn about [user defined routes and IP forwarding](virtual-networks-udr-overview.md).
