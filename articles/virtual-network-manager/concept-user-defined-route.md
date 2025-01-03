---
title: Automate management of user-defined routes (UDRs) with Azure Virtual Network Manager
description: Learn to automate and simplifying routing behaviors using user-defined routes management with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 11/07/2024
ms.service: azure-virtual-network-manager
ms.custom: references_regions
# Customer Intent: As a network engineer, I want learn how I can automate and simplify routing within my Azure Network using User-defined routes.
---
#  Automate management of user-defined routes (UDRs) with Azure Virtual Network Manager

This article provides an overview of UDR management, why it's important, how it works, and common routing scenarios that you can simplify and automate using UDR management.

> [!IMPORTANT]
> **User-defined routes management with Azure Virtual Network Manager is generally available in select regions. For more information and a list of regions, see [General availability](#general-availability).**
>
> Regions that aren't listed in the previous link are in public preview. Public previews are made available to you on the condition that you agree to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some features might not be supported or might have constrained capabilities. This preview version is provided without a service level agreement, and it's not recommended for production workloads.

## What is UDR management?

Azure Virtual Network Manager allows you to describe your desired routing behavior and orchestrate user-defined routes (UDRs) to create and maintain the desired routing behavior. User-defined routes address the need for automation and simplification in managing routing behaviors. Currently, you’d manually create User-Defined Routes (UDRs) or utilize custom scripts. However, these methods are prone to errors and overly complicated. You can utilize the Azure-managed hub in Virtual WAN. This option has certain limitations (such as the inability to customize the hub or lack of IPV6 support) not be relevant to your organization. With UDR management in your virtual network manager, you have a centralized hub for managing and maintaining routing behaviors.

## How does UDR management work?

In virtual network manager, you create a routing configuration. Inside the configuration, you create rule collections to describe the UDRs needed for a network group (target network group). In the rule collection, route rules are used to describe the desired routing behavior for the subnets or virtual networks in the target network group. Once the configuration is created, you need to [deploy the configuration](./concept-deployments.md) for it to apply to your resources. Upon deployment, all routes are stored in a route table located inside a virtual network manager-managed resource group.

Routing configurations create UDRs for you based on what the route rules specify. For example, you can specify that the spoke network group, consisting of two virtual networks, accesses the DNS service's address through a Firewall. Your network manager creates UDRs to make this routing behavior happen.

:::image type="content" source="media/concept-udr-management/udr-management-example.png" alt-text="Diagram of user-defined rules being applied to virtual networks to route DNS traffic through firewall.":::

### Routing configurations

Routing configurations are the building blocks of UDR management. They're used to describe the desired routing behavior for a network group. A routing configuration consists of the following settings:

| **Attribute** | **Description** |
|---------------|-----------------|
| **Name** | The name of the routing configuration. |
| **Description** | The description of the routing configuration. |

### Route collection settings

A route collection consists of the following settings:

| **Attribute** | **Description** |
|---------------|-----------------|
| **Name** | The name of the route collection. |
| **Enable BGP route propagation** | The BGP settings for the route collection. |
| **Target network group** | The target network group for the route collection. |
| **Route rules** | The route rules that describe the desired routing behavior for the target network group. |

:::image type="content" source="media/how-to-deploy-user-defined-routes/rule-collection-settings.png" alt-text="Screenshot of a configured rule collection with a routing rule.":::

### Route rule settings

Each route rule consists of the following settings: 

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

:::image type="content" source="media/how-to-deploy-user-defined-routes/routing-rule-settings.png" alt-text="Screenshot of configured routing rule.":::

For each type of next hop, refer to [used-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined).

### Common destination patterns for IP Addresses

When creating route rules, you can specify the destination type and address. When you specify the destination type as an IP address, you can specify the IP address information. The following are common destination patterns:
The following are common destination patterns:

| **Traffic destination** | **Description** |
|-------------------------|-----------------|
| **Internet > NVA** | For traffic destined to the Internet through a network virtual appliance, enter **0.0.0.0/0** as the destination in the rule. |
| **Private traffic > NVA** | For traffic destined to the private space through a network virtual appliance, enter **192.168.0.0/16, 172.16.0.0/12, 40.0.0.0/24, 10.0.0.0/24** as the destination in the rule. These destinations are based on the RFC1918 private IP address space. |
| **Spoke network > NVA** | For traffic bound between two spoke virtual networks connecting through a network virtual appliance, enter the CIDRs of the spokes as the destination in the rule. |

### Use Azure Firewall as the next hop

You can also easily choose an Azure Firewall as the next hop by selecting **Import Azure firewall private IP address** when creating your routing rule. The IP address of the Azure Firewall is then used as the next hop.

:::image type="content" source="media/how-to-deploy-user-defined-routes/add-routing-rule-azure-firewall.png" alt-text="Screenshot of routing rule with Azure Firewall option.":::

### Use more user-defined routes in a single route table

In Azure Virtual Network Manager UDR management, users can now create up to 1,000 user-defined routes (UDRs) in a single route table, compared to the traditional 400-route limit. This higher limit enables more complex routing configurations, such as directing traffic from on-premises data centers through a firewall to each spoke virtual network in a hub-and-spoke topology. This expanded capacity is especially useful for managing traffic inspection and security across large-scale network architectures with numerous spokes.

## Common routing scenarios

Here are the common routing scenarios that you can simplify and automate by using UDR management. 

| **Routing scenarios**                              | **Description**  |
|--------------------------------------------------|---------------|
| Spoke network -> Network Virtual Appliance -> Spoke network |  Use this scenario for traffic bound between two spoke virtual networks connecting through a network virtual appliance. |
| Spoke network -> Network Virtual Appliance -> Endpoint or Service in Hub network | Use this scenario for spoke network traffic for a service endpoint in a hub network connecting through a network virtual appliance. |
| Subnet -> Network Virtual Appliance -> Subnet even in the same virtual network |              |
| Spoke network -> Network Virtual Appliance -> On-premises network/internet | Use this scenario when you have Internet traffic outbound through a network virtual appliance or an on-premises location, such as hybrid network scenarios. |
| Cross-hub and spoke network via Network Virtual Appliances in each hub |              |
| hub and spoke network with Spoke network to on-premises needs to go via Network Virtual Appliance |              |
| Gateway -> Network Virtual Appliance -> Spoke network  |              |

## Adding other virtual networks

When you add other virtual networks to a network group, the routing configuration is automatically applied to the new virtual network. Your network manager automatically detects the new virtual network and applies the routing configuration to it. When you remove a virtual network from the network group, the applied routing configuration is automatically removed as well.

Newly created or deleted subnets have their route table updated with eventual consistency. The processing time can vary based on the volume of subnet creation and deletion.

## Impact of UDR Management on routes and route tables

The following are impacts of UDR management with Azure Virtual Network Manager on routes and route tables:

- When conflicting routing rules exist (rules with the same destination but different next hops), only one of the conflicting rules will be applied, while the others will be ignored. Any of the conflicting rules may be selected at random. It is important to note that conflicting rules within or across rule collections targeting the same virtual network or subnet are not supported.
- When you create a routing rule with the same destination as an existing route in the route table, the routing rule is ignored.
- When a route table with existing UDRs is present, Azure Virtual Network Manager will create a new managed route table that includes both the existing routes and new routes based on the deployed routing configuration.
- Any additional UDRs added to a managed route table will remain unaffected and will not be deleted when the routing configuration is removed. Only routes created by Azure Virtual Network Manager will be removed.
- If an Azure Virtual Network Manager managed UDR is manually edited in the route table, that route will be deleted when the configuration is removed from the region.
- Existing Azure services in the Hub virtual network maintain their existing limitations with respect to Route Table and UDRs.
- Azure Virtual Network Manager requires a managed resource group to store the route table. If an Azure Policy enforces specific tags or properties on resource groups, those policies must be disabled or adjusted for the managed resource group to prevent deployment issues. Furthermore, if you need to delete this managed resource group, ensure that deletion occurs prior to initiating any new deployments for resources within the same subscription.
- UDR management allows users to create up to 1000 UDRs per route table.

## General availability

General availability of user defined routes management with Azure Virtual Network Manager is accessible in the following regions:

- Australia Central

- Australia Central 2

- Australia East

- Australia Southeast

- Brazil South

- Brazil Southeast

- Canada Central

- Canada East

- Central India

- Central US

- East Asia

- East US

- France Central

- Germany North

- Germany West Central

- Jio India Central

- Jio India West

- Japan East

- Korea Central

- Korea South

- North Central US

- North Europe

- Norway East

- Norway West

- Poland Central

- Qatar Central

- South Africa North

- South Africa West

- South India

- Southeast Asia

- Sweden Central

- Sweden South

- Switzerland North

- Switzerland West

- UAE Central

- UAE North

- UK South

- UK West

- West Europe

- West India

- West US

- West US 2

- West Central US

- Central US (EUAP)

- East US 2 (EUAP)

For regions undefined in the previous list, user defined routes management with Azure Virtual Network Manager remains in public preview.


## Next step

> [!div class="nextstepaction"]
> [Learn how to create user-defined routes in Azure Virtual Network Manager](how-to-create-user-defined-route.md).
