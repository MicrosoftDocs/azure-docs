---
title: Network security group - how it works
titlesuffix: Azure Virtual Network
description: Learn how network security groups help you filter network traffic between Azure resources.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: allensu
# Customer intent: "As a network administrator, I want to configure network security groups for Azure resources so that I can effectively filter and manage inbound and outbound network traffic within my virtual network."
---

# How network security groups filter network traffic
<a name="network-security-groups"></a>

You can use an Azure network security group (NSG) to filter network traffic to and from Azure resources in an Azure virtual network. A network security group contains [security rules](./network-security-groups-overview.md#security-rules) that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol.

You can deploy resources from several Azure services into an Azure virtual network. For a complete list, see [Services that can be deployed into a virtual network](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network). You can associate zero, or one, network security group to each virtual network [subnet](virtual-network-manage-subnet.md#change-subnet-settings) and [network interface](virtual-network-network-interface.md#associate-or-dissociate-a-network-security-group) in a virtual machine. The same network security group can be associated to as many subnets and network interfaces as you choose.

The following picture illustrates different scenarios for how network security groups might be deployed to allow network traffic to and from the internet over TCP port 80:

:::image type="content" source="./media/network-security-group-how-it-works/network-security-group-interaction.png" alt-text="Diagram of NSG processing.":::

Refer to the preceding diagram to understand how Azure processes inbound and outbound rules. The picture illustrates how network security groups handle traffic filtering. 

## Inbound traffic

For inbound traffic, Azure processes the rules in a network security group associated to a subnet first, if there's one, and then the rules in a network security group associated to the network interface, if there's one. This process includes intra-subnet traffic as well.

- **VM1**: *NSG1* processes the security rules because **NSG1** is associated with *Subnet1*, and *VM1* resides in *Subnet1*. The [DenyAllInbound](./network-security-groups-overview.md#denyallinbound) default security rule blocks the traffic unless a rule explicitly allows port 80 inbound. The network interface associated with *NSG2* doesn't evaluate the blocked traffic. However, if *NSG1* allows port 80 in its security rule, *NSG2* then evaluates the traffic. To permit port 80 to the virtual machine, both *NSG1* and *NSG2* must include a rule that allows port 80 from the internet.

- **VM2**: The rules in *NSG1* are processed because *VM2* is also in *Subnet1*. Since *VM2* doesn't have a network security group associated to its network interface, it receives all traffic allowed through *NSG1* or is denied all traffic denied by *NSG1*. Traffic is either allowed or denied to all resources in the same subnet when a network security group is associated to a subnet.

- **VM3**: Since there's no network security group associated to *Subnet2*, traffic is allowed into the subnet and processed by *NSG2*, because *NSG2* is associated to the network interface attached to *VM3*.

- **VM4**: Traffic is blocked to *VM4,* because a network security group isn't associated to *Subnet3*, or the network interface in the virtual machine. All network traffic is blocked through a subnet and network interface if they don't have a network security group associated to them. The virtual machine with a Standard public IP address is secure by default. For traffic to flow from the internet, an NSG must be assigned to the subnet or NIC of the virtual machine. For more information see, [IP address version](/azure/virtual-network/ip-services/public-ip-addresses#ip-address-version)

## Outbound traffic

For outbound traffic, Azure processes the rules in a network security group associated to a network interface first, if there's one, and then the rules in a network security group associated to the subnet, if there's one. This process includes intra-subnet traffic as well.

- **VM1**: The security rules in *NSG2* are processed. The [AllowInternetOutbound](./network-security-groups-overview.md#allowinternetoutbound) default security rule in both *NSG1* and *NSG2* allows the traffic unless you create a security rule that denies port 80 outbound to the internet. If *NSG2* denies port 80 in its security rule, it denies the traffic, and *NSG1* never evaluates it. To deny port 80 from the virtual machine, either, or both of the network security groups must have a rule that denies port 80 to the internet.

- **VM2**: All traffic is sent through the network interface to the subnet, since the network interface attached to *VM2* doesn't have a network security group associated to it. The rules in *NSG1* are processed.

- **VM3**: If *NSG2* denies port 80 in its security rule, it denies the traffic. If *NSG2* doesn't deny port 80, the [AllowInternetOutbound](./network-security-groups-overview.md#allowinternetoutbound) default security rule in *NSG2* allows the traffic because there's no network security group associated with *Subnet2*.

- **VM4**: All network traffic is allowed from *VM4,* because a network security group isn't associated to the network interface attached to the virtual machine, or to *Subnet3*.

## Intra-Subnet traffic

It's important to note that security rules in an NSG associated to a subnet can affect connectivity between VMs within it. By default, virtual machines in the same subnet can communicate based on a default NSG rule allowing intra-subnet traffic. If you add a rule to *NSG1* that denies all inbound and outbound traffic, *VM1* and *VM2* can't communicate with each other.

You can easily view the aggregate rules applied to a network interface by viewing the [effective security rules](virtual-network-network-interface.md#view-effective-security-rules) for a network interface. You can also use the [IP flow verify](../network-watcher/ip-flow-verify-overview.md) capability in Azure Network Watcher to determine whether communication is allowed to or from a network interface. You can use IP flow verify to determine whether a communication is allowed or denied. Additionally, Use IP flow verify to surface the identity of the network security rule responsible for allowing or denying the traffic.

> [!TIP]
> Unless you have a specific reason to, we recommend that you associate a network security group to a subnet, or a network interface, but not both. Rules in a network security group associated to a subnet can conflict with rules in a network security group associated to a network interface. You might have unexpected communication problems that require troubleshooting.

## Next steps

* Learn which Azure resources you can deploy into a virtual network. See [Virtual network integration for Azure services](virtual-network-for-azure-services.md) to find resources that support network security groups.

* To create a network security group, complete a quick [tutorial](tutorial-filter-network-traffic.md) to get experience creating one.

* If you're familiar with network security groups and need to manage them, see [Manage a network security group](manage-network-security-group.md). 

* If you're having communication problems and need to troubleshoot network security groups, see [Diagnose a virtual machine network traffic filter problem](diagnose-network-traffic-filter-problem.md). 
* Learn how to enable [network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to analyze network traffic to and from resources that have an associated network security group.
