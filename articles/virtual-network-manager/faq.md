---
title: Frequently asked questions about Azure Virtual Network Manager
description: Find answers to frequently asked questions about Azure Virtual Network Manager.
services: virtual-network-manager
author: mbender-ms
ms.service: virtual-network-manager
ms.topic: article
ms.date: 01/30/2024
ms.author: mbender
ms.custom:
  - references_regions
  - engagement-fy23
  - ignite-2023
---

# Azure Virtual Network Manager FAQ

## General

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

### Which Azure regions support Azure Virtual Network Manager?

For current region support, refer to [products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=virtual-network-manager).

> [!NOTE]
> All regions have [Availability Zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones), except France Central.

### What are common use cases for using Azure Virtual Network Manager?

* You can create different network groups to meet the security requirements of your environment and its functions. For example, you can create network groups for your Production and Test environments to manage their connectivity and security rules at scale. For security rules, you'd create a security admin configuration with two security admin rule collections, each targeted on your Production and Test network groups, respectively. Once deployed, this configuration would enforce one set of security rules for network resources in your Production environment, and one set for Test environment.

* You can apply connectivity configurations to create a mesh or a hub-and-spoke network topology for a large number of virtual networks across your organization's subscriptions.

* You can deny high-risk traffic: As an administrator of an enterprise, you can block specific protocols or sources that override any NSG rules that would normally allow the traffic.

* Always allow traffic: You want to permit a specific security scanner to always have inbound connectivity to all your resources, even if there are NSG rules configured to deny the traffic.

### What's the cost of using Azure Virtual Network Manager?

Azure Virtual Network Manager charges are based on the number of subscriptions that contain a virtual network with an active network manager configuration deployed onto it. Also, a Virtual Network Peering charge applies to the traffic volume of virtual networks managed by a deployed connectivity configuration (either Mesh, or Hub-and-Spoke).

Current pricing for your region can be found on the [Azure Virtual Network Manager pricing](https://azure.microsoft.com/pricing/details/virtual-network-manager/) page.

## Technical

### Can a virtual network belong to multiple Azure Virtual Network Managers?

Yes, a virtual network can belong to more than one Azure Virtual Network Manager.

### What is a global mesh network topology?

A global mesh allows for virtual networks across different regions to communicate with one another. The effects are similar to how global virtual network peering works.

### Is there a limit to how many network groups can be created?

There's no limit to how many network groups can be created.

### How do I remove the deployment of all applied configurations?

You need to deploy a **None** configuration to all regions that have you have a configuration applied.

### Can I add virtual networks from another subscription not managed by myself?

Yes, you need to have the appropriate permissions to access those virtual networks.

### What is dynamic group membership?

For more information, see [dynamic membership](concept-network-groups.md#dynamic-membership).

### How does the deployment of configuration differ for dynamic membership and static membership?

For more information, see [deployment against membership types](concept-deployments.md#deployment).

### How do I delete an Azure Virtual Network Manager component?

For more information, see [remove components checklist](concept-remove-components-checklist.md).

### Does Azure Virtual Network Manager store customer data?
No. Azure Virtual Network Manager doesn't store any customer data.

### Can an Azure Virtual Network Manager instance be moved?
No. Resource move isn't supported currently. If you need to move it, you can consider deleting the existing virtual network manager instance and using the ARM template to create another one in another location.

### How can I see what configurations are applied to help me troubleshoot?

You can view Azure Virtual Network Manager settings under **Network Manager** for a virtual network. You can see both connectivity and security admin configuration that are applied. For more information, see [view applied configuration](how-to-view-applied-configurations.md).

### What happens when all zones are down in a region with a virtual network manager instance?

Should a regional outage occur, all configurations applied to current managed virtual network resources will remain intact during the outage. You can't create new configurations or modify existing configurations during the outage. Once the outage is resolved, you can continue to manage your virtual network resources as before.

### Can a virtual network managed by Azure Virtual Network Manager be peered to a non-managed virtual network?

Yes, Azure Virtual Network Manager is fully compatible with pre-existing hub and spoke topology deployments using peering. This means that you won't need to delete any existing peered connections between the spokes and the hub. The migration occurs without any downtime to your network.

### Can I migrate an existing hub and spoke topology to Azure Virtual Network Manager?

Yes, migrating existing VNets to AVNM’s hub and spoke topology is easy and requires no down time. Customers can [create a hub and spoke topology connectivity configuration](how-to-create-hub-and-spoke.md) of the desired topology. When the deployment of this configuration is deployed, virtual network manager will automatically create the necessary peerings. Any pre-existing peerings set up by users remain intact, ensuring there's no downtime.

### How do connected groups differ from virtual network peering regarding establishing connectivity between virtual networks?

In Azure, virtual network peering and connected groups are two methods of establishing connectivity between virtual networks (VNets). While virtual network peering works by creating a 1:1 mapping between each peered virtual network, connected groups use a new construct that establishes connectivity without such a mapping. In a connected group, all virtual networks are connected without individual peering relationships.  For example, if VNetA, VNetB, and VNetC are part of the same connected group, connectivity is enabled between each virtual network without the need for individual peering relationships.


### Can I create exceptions to security admin rules?

Normally, security admin rules will be defined to block traffic across virtual networks. However, there are times when certain virtual networks and their resources need to allow traffic for management or other processes. For these scenarios, you can [create exceptions](./concept-enforcement.md#network-traffic-enforcement-and-exceptions-with-security-admin-rules) where needed. Learn how to [blocking high-risk ports with exceptions](how-to-block-high-risk-ports.md) for these types of scenarios.

### How can I deploy multiple security admin configurations to a region?

Only one security admin configuration can be deployed to a region. However, multiple connectivity configurations can exist in a region. To deploy multiple security admin configurations to a region, you can [create multiple rule collections](how-to-block-network-traffic-portal.md#add-a-rule-collection) in a security configuration instead.

### Do security admin rules apply to Azure Private Endpoints?

Currently, security admin rules don't apply to Azure Private Endpoints that fall under the scope of a virtual network managed by Azure Virtual Network Manager.

#### Outbound rules

| Port | Protocol | Source | Destination | Action |
| ---- | -------- | ------ | ----------- | ------ |
| 443, 12000 | TCP	| **VirtualNetwork** | AzureCloud | Allow |
| Any | Any | **VirtualNetwork** | **VirtualNetwork** | Allow |

### Can an Azure Virtual WAN hub be part of a network group?

No, an Azure Virtual WAN hub can't be in a network group at this time.


### Can an Azure Virtual WAN be used as the hub in virtual network manager's hub and spoke topology configuration?

No, an Azure Virtual WAN hub isn't supported as the hub in a hub and spoke topology at this time.

### My Virtual Network isn't getting the configurations I'm expecting. How do I troubleshoot?

#### Have you deployed your configuration to the virtual network's region?

Configurations in Azure Virtual Network Manager don't take effect until they're deployed. Make a deployment to the virtual networks region with the appropriate configurations.

#### Is your virtual network in scope?

A network manager is only delegated enough access to apply configurations to virtual networks within your scope. Even if a resource is in your network group but out of scope, it doesn't receive any configurations.

#### Are you applying security rules to a virtual network containing Azure SQL Managed Instances?

Azure SQL Managed Instance has some network requirements. These are enforced through high priority Network Intent Policies, whose purpose conflicts with Security Admin Rules. By default, Admin rule application is skipped on VNets containing any of these Intent Policies. Since *Allow* rules pose no risk of conflict, you can opt to apply *Allow Only* rules. If you only wish to use Allow rules, you can set AllowRulesOnly on `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices`.

#### Are you applying security rules to a virtual network or subnet that contains services blocking security configuration rules?


Certain services such as Azure SQL Managed Instance, Azure Databricks and Azure Application Gateway require specific network requirements to function properly. By default, security admin rule application is skipped on [VNets and subnets containing any of these services](./concept-security-admins.md#nonapplication-of-security-admin-rules). Since *Allow* rules pose no risk of conflict, you can opt to apply *Allow Only* rules by setting the security configurations' `AllowRulesOnly`field on `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices` .NET class.

## Limits

### What are the service limitations of Azure Virtual Network Manager?

For the most current limitations, see [Limitations with Azure Virtual Network Manager](concept-limitations.md).

## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
