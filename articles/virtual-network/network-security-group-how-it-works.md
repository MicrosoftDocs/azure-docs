---
title: How Network Security Groups Filter Network Traffic in Azure
titlesuffix: Azure Virtual Network
description: Discover how Azure network security groups filter inbound and outbound traffic in virtual networks. Learn NSG rules, traffic flow processing, and best practices for secure Azure networking.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/28/2025
ms.author: allensu
# Customer intent: "As a network administrator, I want to configure network security groups for Azure resources so that I can effectively filter and manage inbound and outbound network traffic within my virtual network."
---

# How network security groups filter network traffic

<a name="network-security-groups"></a>

Use an Azure network security group (NSG) to filter network traffic to and from Azure resources in an Azure virtual network. Network security groups provide essential traffic filtering capabilities that help secure your cloud infrastructure by controlling which traffic can flow between resources. A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination details, port, and protocol.

You can deploy resources from several Azure services into an Azure virtual network. For a complete list, see [Services that can be deployed into a virtual network](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network). If desired, you can associate a network security group with each virtual network subnet and network interface in a virtual machine. The same network security group can be associated with as many subnets and network interfaces as you choose.

The following diagram illustrates different scenarios for how network security groups might be deployed to allow network traffic to and from the internet over TCP port 80:

:::image type="content" source="./media/network-security-group-how-it-works/network-security-group-interaction.png" alt-text="Screenshot of network security group traffic flow diagram showing inbound and outbound rule processing for Azure virtual machines.":::

Refer to the preceding diagram to understand how Azure processes inbound and outbound rules. The diagram illustrates how network security groups handle traffic filtering.

## Inbound traffic
For inbound traffic, Azure first processes the rules in a network security group associated with a subnet if one exists. Azure then processes the rules in a network security group associated with the network interface if one exists. This same order of evaluation applies to intra-subnet traffic.

- **VM1**: The security rules in *NSG1* are processed because *NSG1* is associated with *Subnet1*, and *VM1* resides in *Subnet1*. The [DenyAllInbound](./network-security-groups-overview.md#denyallinbound) default security rule blocks the traffic unless you create a custom rule that explicitly allows port 80 inbound. *NSG2*, associated with the network interface *NIC1*, doesn't evaluate the blocked traffic. However, if *NSG1* allows port 80 in its security rule, *NSG2* then evaluates the traffic. To permit port 80 to the virtual machine, both *NSG1* and *NSG2* must include a rule that allows port 80 from the internet.

- **VM2**: The security rules in *NSG1* are processed because *VM2* is also in *Subnet1*. Since *VM2* doesn't have a network security group associated with its network interface, it receives all traffic allowed through *NSG1* and denied all traffic blocked by *NSG1*. Traffic is either allowed or denied to all resources in the same subnet when a network security group is associated to a subnet.

- **VM3**: Since there's no network security group associated with *Subnet2*, traffic is allowed into the subnet and processed by *NSG2* because *NSG2* is associated with the network interface *NIC1* attached to *VM3*.

- **VM4**: Traffic is blocked to *VM4* because a network security group isn't associated with *Subnet3* nor the network interface in the virtual machine. All network traffic is blocked through a subnet and network interface if they don't have a network security group associated to them. The virtual machine with a standard public IP address is secure by default. For traffic to flow from the internet, a network security group must be associated with the subnet or network interface of the virtual machine. For more information, see [IP address version](/azure/virtual-network/ip-services/public-ip-addresses#ip-address-version).

## Outbound traffic
For outbound traffic, Azure processes network security group rules in a specific order. Azure evaluates the rules in any network security group associated with a network interface. Then, Azure processes the rules in any network security group associated with the subnet. This same processing order applies to intra-subnet traffic.

- **VM1**: The security rules in *NSG2* are processed. The [AllowInternetOutbound](./network-security-groups-overview.md#allowinternetoutbound) default security rule in both *NSG1* and *NSG2* allows the traffic unless you create a security rule that explicitly denies port 80 outbound to the internet. If *NSG2* denies port 80 in its security rule, it denies the traffic, and *NSG1* never receives the traffic and can't evaluate it. To deny port 80 from the virtual machine, either one of or both of the network security groups must have a rule that denies port 80 to the internet.

- **VM2**: All traffic is sent through the network interface to the subnet, since the network interface attached to *VM2* doesn't have a network security group associated with it. The rules in *NSG1* are processed.

- **VM3**: If *NSG2* denies port 80 in its security rule, it blocks the traffic. If *NSG2* doesn't deny port 80, the [AllowInternetOutbound](./network-security-groups-overview.md#allowinternetoutbound) default security rule in *NSG2* allows the traffic because there's no network security group associated with *Subnet2*.

- **VM4**: Traffic flows freely from *VM4* because no network security group is associated with the virtual machine's network interface or *Subnet3*.

## Intra-subnet traffic

It's important to note that security rules in a network security group associated with a subnet can affect connectivity between virtual machines within it. By default, virtual machines in the same subnet can communicate based on a default network security group rule allowing intra-subnet traffic. If you add a rule to *NSG1* that denies all inbound and outbound traffic, *VM1* and *VM2* can't communicate with each other.

You can easily view the aggregate rules applied to a network interface by viewing the [effective security rules](virtual-network-network-interface.md#view-effective-security-rules) for a network interface. The [IP flow verify](../network-watcher/ip-flow-verify-overview.md) capability in Azure Network Watcher helps determine whether communication is allowed to or from a network interface. IP flow verify determines whether a communication is allowed or denied. It also identifies which network security rule is responsible for allowing or denying the traffic. 

[Azure Virtual Network Manager's network verifier](../virtual-network-manager/concept-virtual-network-verifier.md) can also help troubleshooting reachability between virtual machines and the internet or other Azure resources. The network verifier provides insights into network security group rules and other Azure rules and policies that might affect connectivity.

> [!TIP]
> For optimal security configuration, avoid associating network security groups with both a subnet and its network interfaces at the same time. Choose to associate your network security group with either the subnet or the network interface, but not both. When you apply network security groups at multiple levels, the rules can conflict with each other. This overlap in security rules often leads to unexpected traffic filtering problems that are difficult to troubleshoot.

## Next steps

* Learn which Azure resources you can deploy into a virtual network. See [Virtual network integration for Azure services](virtual-network-for-azure-services.md) to find resources that support network security groups.

* Complete a quick [tutorial](tutorial-filter-network-traffic.md) to get experience creating a network security group.

* If you're familiar with network security groups and need to manage them, see [Manage a network security group](manage-network-security-group.md).

* If you're having communication problems and need to troubleshoot network security groups, see [Diagnose a virtual machine network traffic filter problem](diagnose-network-traffic-filter-problem.md).

* Learn how to enable [virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) to analyze traffic to and from your virtual network that might pass through associated network security groups.
