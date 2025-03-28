---
title: Migrate Azure Resources into Azure Virtual Enclaves
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

Moving Azure resources into an enclave is very similar to [moving resources to a new resource group or subscription](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription). When moving resources, the target resource group would be a [Workload](/docs/overview/what%20is%20a%20workload) resource group. [Learn more about Azure tools, scripts, templates, or commands to automate resource group moving or migration](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription#use-the-portal).

It's important to note that the following considerations still apply when moving resources into an Enclave or Workload:
- Locked resources or resource groups cannot be moved
- Source and target resource groups (if using Azure Portal, REST, Azure CLI, or Azure PowerShell Resource group move operations) are temporarily locked during the move operations
- Setting up new dependent resources will incur interruptions to those resources until they have been reconfigured
- Moving resources only moves those resources to a new resource group or subscription. It does not change the location of the resource.

## Checklist before moving resources
For a more exhaustive and detailed checklist, please refer to [Checklist before moving resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription#checklist-before-moving-resources).
- When you move a resource, the ID of the resource also changes. The standard format for a resource ID is `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`. 
    - When you move a resource to a new resource group or subscription, you change one or more values in that path.
    - If you use the resource ID anywhere (such as in custom dashboards, scripts, or templates) you'll need to change that value. 
- Source and destination subscriptions must be active. If you have trouble enabling an account that has been disabled, please contact [Azure Support](https://learn.microsoft.com/en-us/azure/azure-portal/supportability/how-to-create-azure-support-request).
- Source and destination subscriptions must exist within the same Microsoft Entra tenant.
- The resources you want to move into your Enclave must support the move operation. For a list of which resources support move, see [Move operation support for resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-support-resources).
- Some services have specific limitations or requirements when moving resources. If you're moving any of the following services, check that guidance before moving.
    - [App Services move guidance](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-limitations/app-service-move-limitations)
    - [Networking move guidance](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-limitations/networking-move-limitations)
    - [Virtual Machines move guidance](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-limitations/virtual-machines-move-limitations)
    - To move an Azure subscription to a new management group, see [Move subscriptions](https://learn.microsoft.com/en-us/azure/governance/management-groups/manage#move-subscriptions).
- The destination subscription must be registered for the `Microsoft.Mission` resource provider and the resource provider of the resource being moved. If not, you will receive an error stating that the subscription is not registered for a resource type.
- Before moving the resources, check the subscription quotas for the subscription you're moving the resources to. If moving the resources means the subscription will exceed its limits, you need to review whether you can request an increase in the quota.
- The account moving the resources must have at least the following permissions:
    - Microsoft.Resources/subscriptions/resourceGroups/moveResources/action on the source resource group.
    - Microsoft.Resources/subscriptions/resourceGroups/write on the destination resource group.
- If you move a resource that has an Azure role assigned directly to the resource (or a child resource), the role assignment isn't moved and becomes orphaned. After the move, you must re-create the role assignment.
- **For a move across subscriptions, the resource and its dependent resources must be located in the same resource group and they must be moved together.** For example, a VM with managed disks would require the VM and the managed disks to be moved together, along with other dependent resources.
<br>If you're moving a resource to a new subscription, check to see whether the resource has any dependent resources, and whether they're located in the same resource group. If the resources aren't in the same resource group, check to see whether the resources can be combined into the same resource group. If so, bring all these resources into the same resource group by using a move operation across resource groups.
- Moving resources into a workload resource group means that those resources will be governed by AVE [Policy Assignments](/docs/concepts/governance/Governance). Moving resources into an enclave may require changing configurations to those resources to be [compliant](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/compliance-states) with AVE policy governance.

## Existing Preview Customers
Certain AVE customers deployed enclaves with early preview or beta builds of AVE or predecessor systems (i.e. "mission enclaves"). If you deployed your system into a traditional mission enclave (or similar landing zone architecture), here are some things to consider as you plan your migration into Azure Virtual Enclaves:

- You cannot move a mission enclave network into a [Community](/docs/overview/what%20is%20a%20community) or an [Enclave](/docs/overview/what%20is%20an%20enclave)
- Migrating secrets from a mission enclave Key Vault to an AVE Key Vault may require using Azure PS modules to do the following:
    - Exporting secrets from the mission enclave Key Vault
    - Temporarily storing those secrets locally
    - Uploading the secrets to the AVE Key Vault
- [Moving data](docs/How%20To%20Guides/Transfer-or-move-data-into-my-enclave) from a mission enclave to an AVE enclave requires the creation of [connections](docs/How%20To%20Guides/Create-a-Connection-from-the-Azure-Portal) and [endpoints](docs/How%20To%20Guides/Create%20a%20Enclave%20Endpoint%20in%20the%20Azure%20Portal)
- AVE assigns [Azure Policies](/docs/concepts/governance/Governance) to all workload resource groups. Certain preview or beta versions of AVE had manually assigned Policies at different assignment scopes 
- Certain mission enclave deployments utilized different networking connectivity technology, such as [VPN Gateways](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways) and IPSec tunnels. AVE additionally utilizes [Azure VWAN](https://learn.microsoft.com/en-us/azure/virtual-wan/virtual-wan-about) and [VNET Peering](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview) for its hub-and-spoke network architecture
- Certain mission enclave deployments utilize [locks](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources?tabs=json). Before moving any resources, these locks must be removed by a user with elevated privileges
- Certain preview customers of mission enclaves utilize custom Role-based Access Control (RBAC) roles. All possible actions in AVE can be taken with our AVE RBAC roles
- Accessing an AVE enclave through an [Admin Workstation](/docs/concepts/Understanding-Admin-Workstations) differs slightly from accessing a mission enclave's evPAW
- **If you are using on-prem/custom DNS** - each Enclave _must deploy a DNS resolver_ workload in order to resolve private endpoints for Azure Storage, Key Vault, and Log Analytics. Learn more about [DNS in AVE](/docs/concepts/DNS-in-AVE).
  - If you have requirements to connect to an existing instance of DNS elsewhere, you would provide the private IP address(es) of the DNS server as the DNS servers list field for your Community and Enclaves.

## References
- [What is Azure Virtual Enclaves?](/docs/overview/what%20is%20azure%20virtual%20enclaves)
- [Move resources to a new resource group or subscription](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-resource-group-and-subscription)
- [Move Azure Networking resources to new subscription or resource group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/move-limitations/networking-move-limitations)
- [AVE governance/Governance](/docs/concepts/governance/Governance)
- [Azure Policy compliance states](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/compliance-states)
- [What is an Enclave?](/docs/overview/what%20is%20an%20enclave)
- [What is a Workload?](/docs/overview/what%20is%20a%20workload)
- [Shared responsibility model in the cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
- [Concepts and best practices of Azure Virtual Enclaves](/docs/concepts/Concepts-and-best-practices)
