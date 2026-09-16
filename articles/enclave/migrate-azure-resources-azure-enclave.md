---
title: Migrate Azure Resources into Azure Enclave
description: Migrate Azure Resources into Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Migrate Azure Resources into Azure Enclave

Moving Azure resources into an enclave is similar to [moving resources to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription). When you move resources, the target resource group would be a [workload](./what-workload.md) resource group. [Learn more about Azure tools, scripts, templates, or commands to automate resource group moving or migration](/azure/azure-resource-manager/management/move-resource-group-and-subscription).

It's important to note that the following considerations still apply when moving resources into an enclave or workload:
- Locked resources or resource groups can't be moved.
- Source and target resource groups (if using Azure portal, REST, Azure CLI, or Azure PowerShell Resource group move operations) are temporarily locked during the move operations.
- Setting up new dependent resources incur interruptions to those resources until they have been reconfigured.
- Moving resources only moves those resources to a new resource group or subscription. It doesn't change the location of the resource.

## Checklist before moving resources
For a more exhaustive and detailed checklist, see [Checklist before moving resources](/azure/azure-resource-manager/management/move-resource-group-and-subscription#checklist-before-moving-resources).
- When you move a resource, the ID of the resource also changes. The standard format for a resource ID is `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`. 
    - When you move a resource to a new resource group or subscription, you change one or more values in that path.
    - If you use the resource ID anywhere (such as in custom dashboards, scripts, or templates) you need to change that value. 
- Source and destination subscriptions must be active. If you have trouble enabling an account that has been disabled, contact [Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request).
- Source and destination subscriptions must exist within the same Microsoft Entra tenant.
- The resources you want to move into your Enclave must support the move operation. For a list of which resources support move, see [Move operation support for resources](/azure/azure-resource-manager/management/move-support-resources).
- Some services have specific limitations or requirements when moving resources. If you're moving any of the following services, check that guidance before moving.
    - [App Service move guidance](/azure/azure-resource-manager/management/move-limitations/app-service-move-limitations)
    - [Networking move guidance](/azure/azure-resource-manager/management/move-limitations/networking-move-limitations)
    - [Virtual Machine move guidance](/azure/azure-resource-manager/management/move-limitations/virtual-machines-move-limitations)
    - To move an Azure subscription to a new management group, see [Move subscriptions](/azure/governance/management-groups/overview).
- The destination subscription must be registered for the `Microsoft.Mission` resource provider and the resource provider of the resource being moved. If not, you'll receive an error stating that the subscription isn't registered for a resource type.
- Before moving the resources, check the subscription quotas for the subscription you're moving the resources to. If moving the resources means the subscription exceeds its limits, you need to review whether you can request an increase in the quota.
- The account moving the resources must have at least the following permissions:
    - Microsoft.Resources/subscriptions/resourceGroups/moveResources/action on the source resource group.
    - Microsoft.Resources/subscriptions/resourceGroups/write on the destination resource group.
- If you move a resource that has an Azure role assigned directly to the resource (or a child resource), the role assignment isn't moved and becomes orphaned. After the move, you must re-create the role assignment.
- **For a move across subscriptions, the resource and its dependent resources must be located in the same resource group and they must be moved together.** For example, a VM with managed disks would require the VM and the managed disks to be moved together, along with other dependent resources.
<br>If you're moving a resource to a new subscription, check to see whether the resource has any dependent resources, and whether they're located in the same resource group. If the resources aren't in the same resource group, check to see whether the resources can be combined into the same resource group. If so, bring all these resources into the same resource group by using a move operation across resource groups.
- Moving resources into a workload resource group means that those resources will be governed by Azure Enclave [Policy Assignments](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring). Moving resources into an enclave may require changing configurations to those resources to be [compliant](/azure/governance/policy/concepts/compliance-states) with Azure Enclave policy governance.

## Existing Preview Customers
Certain Azure Enclave customers deployed enclaves with early preview or beta builds of Azure Enclave or predecessor systems (for example, "mission enclaves"). If you deployed your system into a traditional mission enclave (or similar landing zone architecture), here are some things to consider as you plan your migration into Azure Enclave:

- You can't move a mission enclave network into a [community](./what-community.md) or an [Enclave](./what-enclave.md).
- Migrating secrets from a mission enclave Key Vault to an Azure Enclave Key Vault may require using Azure PowerShell modules to do the following:
    - Exporting secrets from the mission enclave Key Vault
    - Temporarily storing those secrets locally
    - Uploading the secrets to the Azure Enclave Key Vault
- [Moving data](./move-data-inside-enclave.md) from a mission enclave to an Azure Enclave enclave requires the creation of [connections](./create-enclave-connection-portal.md) and [enclave endpoints](./create-enclave-endpoint-portal.md).
- Azure Enclave assigns [Azure Policies](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring) to all workload resource groups. Certain preview or beta versions of Azure Enclave had manually assigned Policies at different assignment scopes.
- Certain mission enclave deployments utilized different networking connectivity technology, such as [VPN Gateways](/azure/vpn-gateway/vpn-gateway-about-vpngateways) and IPSec tunnels. Azure Enclave additionally utilizes [Azure Virtual WAN](/azure/virtual-wan/virtual-wan-about) and [virtual network Peering](/azure/virtual-network/virtual-network-peering-overview) for its hub-and-spoke network architecture.
- Certain mission enclave deployments utilize [locks](/azure/azure-resource-manager/management/lock-resources). Before you move any resources, these locks must be removed by a user with elevated privileges.
- Certain preview customers of mission enclaves utilize custom Role-based Access Control (RBAC) roles. All possible actions in Azure Enclave can be taken with our Azure Enclave RBAC roles.
- Accessing an Azure Enclave enclave through an [Admin VM](./understand-admin-vm.md) differs slightly from accessing a mission enclave's evPAW.
- **If you are using on-prem/custom DNS** - each Enclave _must deploy a DNS resolver_ workload in order to resolve private endpoints for Azure Storage, Key Vault, and Log Analytics. Learn more about [DNS in Azure Enclave](./understand-domain-name-service.md).
  - If you have requirements to connect to an existing instance of DNS elsewhere, provide the private IP addresses of the DNS server as the DNS servers list field for your community and enclaves.

## References
- [What is Azure Enclave?](./what-azure-enclave.md)
- [Move resources to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription)
- [Move Azure Networking resources to new subscription or resource group](/azure/azure-resource-manager/management/move-limitations/networking-move-limitations)
- [Azure Enclave governance/Governance](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring)
- [Azure Policy compliance states](/azure/governance/policy/concepts/compliance-states)
- [What is an enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Shared responsibility model in the cloud](/azure/security/fundamentals/shared-responsibility)
- [Best practices of Azure Enclave](./best-practices.md)
