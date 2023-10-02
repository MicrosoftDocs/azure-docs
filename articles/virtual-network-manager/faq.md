---
title: Frequently asked questions about Azure Virtual Network Manager
description: Find answers to frequently asked questions about Azure Virtual Network Manager.
services: virtual-network-manager
author: mbender-ms
ms.service: virtual-network-manager
ms.topic: article
ms.date: 09/27/2023
ms.author: mbender
ms.custom: references_regions, ignite-fall-2021, engagement-fy23
---

# Azure Virtual Network Manager FAQ

## General

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)..

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

Should a regional outage occur, all configurations applied to current resources managed persist, and you can't modify existing configurations, or create new configuration.

### Can a virtual network managed by Azure Virtual Network Manager be peered to a non-managed virtual network?

Yes, Azure Virtual Network Manager is fully compatible with pre-existing hub and spoke topology deployments using peering. This means that you won't need to delete any existing peered connections between the spokes and the hub. The migration occurs without any downtime to your network.

### Can I migrate an existing hub and spoke topology to Azure Virtual Network Manager?

Yes, 

### How do connected groups differ from virtual network peering regarding establishing connectivity between virtual networks?

In Azure, VNet peering and connected groups are two methods of establishing connectivity between virtual networks (VNets). While VNet peering works by creating a 1:1 mapping between each peered VNet, connected groups use a new construct that establishes connectivity without such a mapping. In a connected group, all virtual networks are connected without individual peering relationships.  For example, if VNetA, VNetB, and VNetC are part of the same connected group, connectivity is enabled between each VNet without the need for individual peering relationships.

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

#### Have you deployed your configuration to the VNet's region?

Configurations in Azure Virtual Network Manager don't take effect until they're deployed. Make a deployment to the virtual networks region with the appropriate configurations.

#### Is your virtual network in scope?

A network manager is only delegated enough access to apply configurations to virtual networks within your scope. Even if a resource is in your network group but out of scope, it doesn't receive any configurations.

#### Are you applying security rules to a VNet containing Azure SQL Managed Instances?

Azure SQL Managed Instance has some network requirements. These are enforced through high priority Network Intent Policies, whose purpose conflicts with Security Admin Rules. By default, Admin rule application is skipped on VNets containing any of these Intent Policies. Since *Allow* rules pose no risk of conflict, you can opt to apply *Allow Only* rules. If you only wish to use Allow rules, you can set AllowRulesOnly on `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices`.

## Limits

### What are the service limitations of Azure Virtual Network Manager?

* A connected group can have up to 250 virtual networks. Virtual networks in a mesh topology are in a connected group, therefore a mesh configuration has a limit of 250 virtual networks.

* You can have network groups with or without direct connectivity enabled in the same hub-and-spoke configuration, as long as the total number of virtual networks peered to the hub **doesn't exceed 500** virtual networks.
    * If the network group peered with the hub **has direct connectivity enabled**, these virtual networks are in a *connected group*, therefore the network group has a limit of 250 virtual networks.
    * If the network group peered with the hub **doesn't have direct connectivity enabled**, the network group can have up to the total limit for a hub-and-spoke topology.

* A virtual network can be part of up to two connected groups. 

    **Example:**
    * A virtual network can be part of two mesh configurations.
    * A virtual network can be part of a mesh topology and a network group that has direct connectivity enabled in a hub-and-spoke topology.
    * A virtual network can be part of two network groups with direct connectivity enabled in the same or different hub-and-spoke configuration.

* You can have virtual networks with overlapping IP spaces in the same connected group. However, communication to an overlapped IP address is dropped.

* The maximum number of IP prefixes in all admin rules combined is 1000. 

* The maximum number of admin rules in one level of Azure Virtual Network Manager is 100. 

* Azure Virtual Network Manager doesn't have cross-tenant support in the public preview.

* Customers with more than 15,000 Azure subscriptions can apply Azure Virtual Network Policy only at the subscription and resource group scopes. Management groups can't be applied over the 15 k subscription limit.
   * If this is your scenario, you would need to create assignments at lower level management group scope that have less than 15,000 subscriptions.

* Virtual networks can't be added to a network group when the Azure Virtual Network Manager custom policy `enforcementMode` element is set to `Disabled`.

* Azure Virtual Network Manager policies don't support the standard policy compliance evaluation cycle. For more information, see [Evaluation triggers](../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

* The current preview of connected group has a limitation where traffic from a connected group cannot communicate with a private endpoint in this connected group if it has NSG enabled on it. However, this limitation will be removed once the feature is generally available.
## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
