---
title: Automate management of user-defined routes (UDRs) with Azure Virtual Network Manager
description: Learn to automate and simplifying routing behaviors using user-defined routes management with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 01/09/2026
ms.service: azure-virtual-network-manager
ms.custom:
  - references_regions
  - sfi-image-nochange
# Customer Intent: As a network engineer, I want learn how I can automate and simplify routing within my Azure Network using User-defined routes.
---
#  Automate management of user-defined routes (UDRs) with Azure Virtual Network Manager

This article provides an overview of UDR management, why it's important, how it works, and common routing scenarios that you can simplify and automate using UDR management.

## What is UDR management?

Azure Virtual Network Manager allows you to describe your desired routing behavior and orchestrate user-defined routes (UDRs) to create and maintain the desired routing behavior. User-defined routes address the need for automation and simplification in managing routing behaviors. Currently, you’d manually create User-Defined Routes (UDRs) or utilize custom scripts. However, these methods are prone to errors and overly complicated. You can utilize the Azure-managed hub in Virtual WAN. This option has certain limitations (such as the inability to customize the hub or lack of IPV6 support) not be relevant to your organization. With UDR management in your virtual network manager, you have a centralized hub for managing and maintaining routing behaviors.

## How does UDR management work?

In virtual network manager, you create a routing configuration. Inside the configuration, you create rule collections to describe the UDRs needed for a network group (target network group). In the rule collection, route rules are used to describe the desired routing behavior for the subnets or virtual networks in the target network group. Once the configuration is created, you need to [deploy the configuration](./concept-deployments.md) for it to apply to your resources. Upon deployment, by default, all routes are stored in a route table located inside a virtual network manager-managed resource group. You can also choose to use and update existing route tables for targeted subnets. Azure Virtual Network Manager creates new route tables only when necessary. The option to use and update existing route tables is a preview feature currently and needs the API version 2025-01-01 and later.

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

In Azure Virtual Network Manager UDR management, users can now create up to 1,000 user-defined routes in a single route table, compared to the traditional 400-route limit. This higher limit enables more complex routing configurations, such as directing traffic from on-premises data centers through a firewall to each spoke virtual network in a hub-and-spoke topology. This expanded capacity is especially useful for managing traffic inspection and security across large-scale network architectures with numerous spokes.

In a hub-and-spoke topology, it's common for users to require that network traffic be inspected or filtered by a firewall located in the hub virtual network before reaching any spoke virtual networks. Azure Virtual Network Manager supports up to 1,000 spoke virtual networks and allows you to configure the route table associated with the gateway subnet to include up to 1,000 user-defined routes. To set this up, follow these steps:
1. Create an Azure Virtual Network Manager instance.
1. Create a network group and include the gateway subnet in this network group.
1. Establish a routing configuration and create a rule collection, setting the target network group as the one created in Step 2.
1. Define a routing rule by adding the address spaces of the spoke virtual networks. Set the next hop to "virtual appliance" and specify the firewall's IP address as the next hop address.
1. Deploy this routing configuration in the region where the gateway subnet is located.

This method allows the route table of the gateway subnet to accommodate up to 1,000 user-defined routes. When adding a new spoke virtual network, simply include its address spaces in the existing rule and redeploy the routing configuration.

## Common routing scenarios with UDR management

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

## UseExisting Mode for AVNM UDR Management

### Overview
**UseExisting mode** allows Azure Virtual Network Manager (AVNM) to append routes to an existing route table instead of creating a new one.  
This mode provides greater **control**, ensures **compliance with organizational policies**, and reduces **operational complexity** when customers need to preserve existing resource naming conventions, tags, or resource group structures.

**Comparison:**
- **ManagedOnly (default):** AVNM always creates or reuses its own managed route table.
- **UseExisting:** AVNM uses the existing subnet-associated route table, appending required routes while preserving its properties.



### Step-by-Step: Enable UseExisting Mode

#### 1. Enable via Portal or API
1. Open the **AVNM portal** or use the **API**.
1. Select your **routing configuration**.
1. Set the **`routeTableUsageMode`** property to `UseExisting`.  
   - If a route table already exists on the subnet, AVNM will **append** the required routes.  
   - If no route table is present, AVNM will **create** one automatically.

#### 2. Switching Modes
- You can switch between `ManagedOnly` and `UseExisting` at any time.  
- When switching **from ManagedOnly to UseExisting**, note that the existing route tables are **AVNM-managed**, so manual updates and reassociation might be required to align configurations.  
- When switching **from UseExisting to ManagedOnly**, remove any AVNM-created routes from the customer route tables. Reassociation is **not required** since AVNM will automatically manage the new route tables.

### Behavior

| Aspect | Description |
|--------|--------------|
| **Preservation** | Existing route table properties such as name, tags, and resource group are preserved. |
| **Manual Changes** | AVNM doesn't track manual modifications. Any manual edits can lead to configuration drift. |
| **Compliance** | AVNM respects Azure Policy, RBAC permissions, and resource locks. Ensure permissions allow updates. |
| **Shared Tables** | If multiple subnets share a single route table, all will inherit AVNM routes—verify before enabling. |
| **Subnet Associations** | AVNM doesn't automatically remove subnet associations from existing customer route tables. If a subnet is removed from the network group, its association remains intact, meaning the subnet will still be linked to the same route table. |

### Route Table Sharing and Cleanup Behavior
When multiple subnets from different network groups share the same route table, unintended routes may appear, as AVNM doesn't track which subnet adds specific routes. Customers must manually remove or dissociate subnets if undesired routes occur.
If any subnet enables properties such as `DisableBgpRoutePropagation`, those settings apply to the entire shared table. Routes remain in the table until all contributing subnets are unmanaged.
When a subnet is removed from a network group, AVNM stops managing it but doesn't modify the existing table association. AVNM removes its routes only when no remaining managed subnets depend on them. Customer-created route tables are never deleted, even when left empty after cleanup.

## Adding other virtual networks

When you add other virtual networks to a network group, the routing configuration is automatically applied to the new virtual network. Your network manager automatically detects the new virtual network and applies the routing configuration to it. When you remove a virtual network from the network group, the applied routing configuration is automatically removed as well.

Newly created or deleted subnets have their route table updated with eventual consistency. The processing time can vary based on the volume of subnet creation and deletion.

## Impact of UDR Management on routes and route tables

The following are impacts of UDR management with Azure Virtual Network Manager on routes and route tables:

- UDR management allows users to create up to 1000 UDRs per route table.

The following items apply when users choose to use AVNM-managed route tables.

- When conflicting routing rules exist (rules with the same destination but different next hops), only one of the conflicting rules will be applied, while the others will be ignored. Any of the conflicting rules can be selected at random. It's important to note that conflicting rules within or across rule collections targeting the same virtual network or subnet aren't supported.
- When you create a routing rule with the same destination as an existing route in the route table, the routing rule is ignored.
- When a route table with existing UDRs is present, Azure Virtual Network Manager creates a new managed route table that includes both the existing routes and new routes based on the deployed routing configuration.
- Other UDRs added to a managed route table remain unaffected and won't be deleted when the routing configuration is removed. Only routes created by Azure Virtual Network Manager are removed.
- If an Azure Virtual Network Manager managed UDR is manually edited in the route table, that route is deleted when the configuration is removed from the region.
- Azure Virtual Network Manager doesn't interfere with your existing UDRs. It just adds the new UDRs to the current ones, ensuring your routing continues to work as it does now. Also, UDRs for specific Azure services still function along with your network manager's UDRs without encountering new limitations.
- Azure Virtual Network Manager requires a managed resource group to store the route table. If an Azure Policy enforces specific tags or properties on resource groups, those policies must be disabled or adjusted for the managed resource group to prevent deployment issues. Furthermore, if you need to delete this managed resource group, ensure that deletion occurs before initiating any new deployments for resources within the same subscription.

The following items apply when users choose to use existing route tables.
- When a common route table is attached to subnets in different network groups/collections, rules from all collections are added to the route table.
- If a subnet is removed from a network group, its rules aren't removed from the route table unless all associated subnets are removed.

## Next step

> [!div class="nextstepaction"]
> [Learn how to create user-defined routes in Azure Virtual Network Manager](how-to-create-user-defined-route.md).
