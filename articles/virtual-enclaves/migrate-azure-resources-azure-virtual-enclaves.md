---
title: Migrate Azure Resources into Azure Virtual Enclaves
description: Migrate Azure Resources into Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Migrate Azure Resources into Azure Virtual Enclaves

Moving Azure resources into an enclave is similar to [moving resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md). When you move resources, the target resource group would be a [Workload](./what-workload.md) resource group. [Learn more about Azure tools, scripts, templates, or commands to automate resource group moving or migration](../azure-resource-manager/management/move-resource-group-and-subscription.md).

It's important to note that the following considerations still apply when moving resources into an Enclave or Workload:
- Locked resources or resource groups can't be moved.
- Source and target resource groups (if using Azure portal, REST, Azure CLI, or Azure PowerShell Resource group move operations) are temporarily locked during the move operations.
- Setting up new dependent resources incur interruptions to those resources until they have been reconfigured.
- Moving resources only moves those resources to a new resource group or subscription. It doesn't change the location of the resource.

## Checklist before moving resources
For a more exhaustive and detailed checklist, see [Checklist before moving resources](../azure-resource-manager/management/move-resource-group-and-subscription.md#checklist-before-moving-resources).
- When you move a resource, the ID of the resource also changes. The standard format for a resource ID is `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`. 
    - When you move a resource to a new resource group or subscription, you change one or more values in that path.
    - If you use the resource ID anywhere (such as in custom dashboards, scripts, or templates) you need to change that value. 
- Source and destination subscriptions must be active. If you have trouble enabling an account that has been disabled, contact [Azure Support](https://learn.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request).
- Source and destination subscriptions must exist within the same Microsoft Entra tenant.
- The resources you want to move into your Enclave must support the move operation. For a list of which resources support move, see [Move operation support for resources](../azure-resource-manager/management/move-support-resources.md).
- Some services have specific limitations or requirements when moving resources. If you're moving any of the following services, check that guidance before moving.
    - [App Service move guidance](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md)
    - [Networking move guidance](../azure-resource-manager/management/move-limitations/networking-move-limitations.md)
    - [Virtual Machine move guidance](../azure-resource-manager/management/move-limitations/virtual-machines-move-limitations.md)
    - To move an Azure subscription to a new management group, see [Move subscriptions](https://learn.microsoft.com/azure/governance/management-groups/overview).
- The destination subscription must be registered for the `Microsoft.Mission` resource provider and the resource provider of the resource being moved. If not, you'll receive an error stating that the subscription isn't registered for a resource type.
- Before moving the resources, check the subscription quotas for the subscription you're moving the resources to. If moving the resources means the subscription exceeds its limits, you need to review whether you can request an increase in the quota.
- The account moving the resources must have at least the following permissions:
    - Microsoft.Resources/subscriptions/resourceGroups/moveResources/action on the source resource group.
    - Microsoft.Resources/subscriptions/resourceGroups/write on the destination resource group.
- If you move a resource that has an Azure role assigned directly to the resource (or a child resource), the role assignment isn't moved and becomes orphaned. After the move, you must re-create the role assignment.
- **For a move across subscriptions, the resource and its dependent resources must be located in the same resource group and they must be moved together.** For example, a VM with managed disks would require the VM and the managed disks to be moved together, along with other dependent resources.
<br>If you're moving a resource to a new subscription, check to see whether the resource has any dependent resources, and whether they're located in the same resource group. If the resources aren't in the same resource group, check to see whether the resources can be combined into the same resource group. If so, bring all these resources into the same resource group by using a move operation across resource groups.
- Moving resources into a workload resource group means that those resources will be governed by AVE [Policy Assignments](./what-azure-virtual-enclaves.md#multi-layered-governancegovernance-security-and-monitoring). Moving resources into an enclave may require changing configurations to those resources to be [compliant](../governance/policy/concepts/compliance-states.md) with AVE policy governance.

## Existing Preview Customers
Certain AVE customers deployed enclaves with early preview or beta builds of AVE or predecessor systems (for example, "mission enclaves"). If you deployed your system into a traditional mission enclave (or similar landing zone architecture), here are some things to consider as you plan your migration into Azure Virtual Enclaves:

- You can't move a mission enclave network into a [Community](./what-community.md) or an [Enclave](./what-enclave.md).
- Migrating secrets from a mission enclave Key Vault to an AVE Key Vault may require using Azure PowerShell modules to do the following:
    - Exporting secrets from the mission enclave Key Vault
    - Temporarily storing those secrets locally
    - Uploading the secrets to the AVE Key Vault
- [Moving data](./transfer-or-move-data-into-my-enclave.md) from a mission enclave to an AVE enclave requires the creation of [connections](./create-an-enclave-connection-from-the-azure-portal.md) and [endpoints](./create-a-enclave-endpoint-in-the-azure-portal.md).
- AVE assigns [Azure Policies](./what-azure-virtual-enclaves.md#multi-layered-governancegovernance-security-and-monitoring) to all workload resource groups. Certain preview or beta versions of AVE had manually assigned Policies at different assignment scopes.
- Certain mission enclave deployments utilized different networking connectivity technology, such as [VPN Gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md) and IPSec tunnels. AVE additionally utilizes [Azure VWAN](../virtual-wan/virtual-wan-about.md) and [virtual network Peering](../virtual-network/virtual-network-peering-overview.md) for its hub-and-spoke network architecture.
- Certain mission enclave deployments utilize [locks](../azure-resource-manager/management/lock-resources.md). Before you move any resources, these locks must be removed by a user with elevated privileges.
- Certain preview customers of mission enclaves utilize custom Role-based Access Control (RBAC) roles. All possible actions in AVE can be taken with our AVE RBAC roles.
- Accessing an AVE enclave through an [Admin Workstation](./understand-admin-vm.md) differs slightly from accessing a mission enclave's evPAW.
- **If you are using on-prem/custom DNS** - each Enclave _must deploy a DNS resolver_ workload in order to resolve private endpoints for Azure Storage, Key Vault, and Log Analytics. Learn more about [DNS in AVE](./understand-domain-name-service.md).
  - If you have requirements to connect to an existing instance of DNS elsewhere, you would provide the private IP addresses of the DNS server as the DNS servers list field for your Community and Enclaves.

## References
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure Networking resources to new subscription or resource group](../azure-resource-manager/management/move-limitations/networking-move-limitations.md)
- [AVE governance/Governance](./what-azure-virtual-enclaves.md#multi-layered-governancegovernance-security-and-monitoring)
- [Azure Policy compliance states](../governance/policy/concepts/compliance-states.md)
- [What is an Enclave?](./what-enclave.md)
- [What is a Workload?](./what-workload.md)
- [Shared responsibility model in the cloud](../security/fundamentals/shared-responsibility.md)
- [Best practices of Azure Virtual Enclaves](./best-practices.md)
