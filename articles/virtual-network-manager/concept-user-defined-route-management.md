---
title: Automate UDR Management with Azure Virtual Network Manager
description: Learn to automate and simplifying routing behaviours using user-defined routes management with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 03/18/2024
ms.service: virtual-network-manager
# Customer Intent: As a network engineer, I want learn how I can automate and simplify routing within my Azure Network using User-defined routes.
---
# Automate UDR Management with Azure Virtual Network Manager

## What is UDR management and what we are solving? 
Azure Virtual Network Manager (AVNM) allows you to describe your desired routing behavior, and AVNM orchestrates user-defined routes (UDRs) to create and maintain the desired routing behavior. 

## Why UDR management is important
User-defined routes addresses the need for automation and simplification in managing routing behaviors. Currently, you’d manually create User-Defined Routes (UDRs) or utilize custom scripts. However, these methods are prone to errors and overly complicated. Also, you can utilize the Azure-managed hub in Virtual WAN, but this option has certain limitations (such as the inability to customize the hub or lack of IPV6 support) not be relevant to your organization. With UDR management in your virtual network manager, you have a centralized hub for managing and maintaining routing behaviors.

## How does UDR management works
In virtual network manager, you create rule collections to describe the UDRs needed for a network group (target network group). In the rule collection, route rules are used to describe the desired routing behavior for the subnets or virtual networks or virtual networks in the target network group. Each route rule consists of the following attributes: 

| **Attribute** | **Description** |
|---------------|-----------------|
| **Name** | The name of the route rule. |
| **Destination type** |  |
| IP address | The IP address of the destination. |
| Destination IP addresses/CIDR ranges | The IP address or CIDR range of the destination. |
| Service tag | The service tag of the destination. |
| **Next hop type** |  |
| Virtual network gateway | The virtual network gateway as the next hop. |
| Virtual network | The virtual network as the next hop. |
| Internet | The Internet as the next hop. |
| Virtual appliance | The virtual appliance as the next hop. |
| **Next hop address** | The IP address of the next hop. |

For each type of next hop, please refer to https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#user-defined.
 
Routing configurations create UDRs for you based on what the route rules specify. For example, you can specify that the spoke network group, consisting of two virtual networks, *VNet1* and *VNet2*, accesses the DNS service's address through a Firewall. Your network manager will then create UDRs to make this routing behavior happen.

:::image type="content" source="media/concept-udr-management/udr-management-example.png" alt-text="Diagram of user-defined rules being applied to virtual networks to route DNS traffic through firewall.":::

### Common destination patterns for IP Addresses

When creating route rules, you can specify the destination type and address. When you specify the destination type as an IP address, you can specify the IP address information. The following are common destination patterns:
The following are common destination patterns:

| **Traffic destination** | **Description** |
|-------------------------|-----------------|
| **Internet > NVA** | For traffic destined to the Internet through a network virtual appliance, enter **0.0.0.0/0** as the destination in the rule. |
| **Private traffic > NVA** | For traffic destined to the private space through a network virtual appliance, enter **192.168.0.0/16, 172.16.0.0/12, 40.0.0.0/24, 10.0.0.0/24** as the destination in the rule. These are base on the RFC1918 private IP address space. |
| **Spoke network > NVA** | For traffic bound between two spoke virtual networks connecting through a network virtual appliance, enter the CIDRs of the spokes as the destination in the rule. |

### Use Azure Firewall as the next hop

You can also easily choose an Azure Firewall as the next hop by selecting **Import Azure firewall private IP address** when creating your routing rule. The IP address of the Azure Firewall is then used as the next hop.




## Common routing scenarios

Here are the common routing scenarios that you can simplify and automate by using UDR management. 

| **Routing scenarios**                              | **Description**  |
|--------------------------------------------------|---------------|
| Spoke network -> Network Virtual Appliance -> Spoke network |  Use this scenario for traffic bound between two spoke virtual networks connecting through a network virtual appliance. |
| Spoke network -> Network Virtual Appliance -> Endpoint or Service in Hub network | Use this scenario for traffic from a spoke network to a service endpoint in a hub network connecting through a network virtual appliance. |
| Subnet -> Network Virtual Appliance -> Subnet even in the same virtual network |              |
| Spoke network -> Network Virtual Appliance -> On-premises network/internet | Use this scenario when you have traffic outbound through a network virtual appliance to the Internet or an on-premises location, such as hybrid network scenarios. |
| Cross-hub and spoke network via Network Virtual Appliances in each hub |              |
| hub and spoke network with Spoke network to on-premises needs to go via Network Virtual Appliance |              |
| Gateway -> Network Virtual Appliance -> Spoke network  |              |

## Routing configurations

Routing configurations are the building blocks of UDR management. They are used to describe the desired routing behavior for a network group. A routing configuration consists of the following attributes:

| **Attribute** | **Description** |
|---------------|-----------------|
| **Name** | The name of the routing configuration. |
| **Target network group** | The target network group for the routing configuration. |
| **Route rules** | The route rules that describe the desired routing behavior for the target network group. |

### 

## Local routing settings

Local route setting
You can choose to select whether you want to create local routing behavior so that 
1.	If the source and destination are in the same Vnet, route to the destination directly
2.	If the source and destination are in the same subnet, route to the destination directly
3.	No above behavior


Selecting "Direct routing within virtual network" or "Direct routing within subnet" creates a UDR with a "virtual network" next hop for local traffic routing within the same VNet or subnet. However, if the destination CIDR is fully contained within the source CIDR under these selections and direct routing is selected, a UDR specifying a network appliance as the next hop won't be set up.

Sample setting of routing all traffic to an Azure Firewall, unless in the same VNet
By using the following sample setting, you can easily route all traffic to an Azure Firewall, except the destination is in the same VNet to save routing and inspection cost. All new subnets in the VNets in the spoke network group can automatically get the necessary UDRs to make this routing behavior happen.



Use Azure Firewall as the next hop
Note, you can also easily choose an Azure Firewall as the next hop by importing Azure firewall private IP address in your AVNM’s scope. AVNM will use the IP of the Azure Firewall you choose as the next hop.

## Availability

## Service level agreement



## Next step

> [!div class="nextstepaction"]
> Learn to how to [create user-defined routes in Azure Virtual Network Manager](how-to-create-user-defined-routes.md).

