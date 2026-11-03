---
title: Migrate Azure resources into Azure Enclave
description: Review Azure Resource Manager move requirements and Azure Enclave planning considerations before migrating resources.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ms.topic: overview
ai-usage: ai-assisted
ms.date: 10/15/2026
---

# Migrate Azure resources into Azure Enclave

To move supported Azure resources into Azure Enclave, use Azure Resource Manager move operations. Before you move resources, identify the destination resource group and the Azure Enclave [workload](./what-workload.md) it belongs to. Azure Enclave applies workload policies and guardrails to resource groups associated with a workload. For move requirements and tools, see [Move resources to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription).

It's important to note that the following considerations still apply when moving resources into an enclave or workload:
- Locked resources or resource groups can't be moved.
- Source and target resource groups (if using Azure portal, REST, Azure CLI, or Azure PowerShell Resource group move operations) are temporarily locked during the move operations.
- Moving resources or reconfiguring dependencies can interrupt service until you update the dependent resources.
- Moving resources only moves those resources to a new resource group or subscription. It doesn't change the location of the resource.

## Checklist before moving resources
For a more exhaustive and detailed checklist, see [Checklist before moving resources](/azure/azure-resource-manager/management/move-resource-group-and-subscription#checklist-before-moving-resources).
- When you move a resource, the ID of the resource also changes. The standard format for a resource ID is `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`. 
    - When you move a resource to a new resource group or subscription, one or more values in the ID change.
    - Update references to the old resource ID in dashboards, scripts, templates, and other configurations.
- Source and destination subscriptions must be active. If you have trouble enabling an account that has been disabled, contact [Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request).
- Source and destination subscriptions must exist within the same Microsoft Entra tenant.
- The resources you want to move into your Enclave must support the move operation. For a list of which resources support move, see [Move operation support for resources](/azure/azure-resource-manager/management/move-support-resources).
- Some services have specific limitations or requirements when moving resources. If you're moving any of the following services, check that guidance before moving.
    - [App Service move guidance](/azure/azure-resource-manager/management/move-limitations/app-service-move-limitations)
    - [Networking move guidance](/azure/azure-resource-manager/management/move-limitations/networking-move-limitations)
    - [Virtual Machine move guidance](/azure/azure-resource-manager/management/move-limitations/virtual-machines-move-limitations)
    - To move an Azure subscription to a new management group, see [Move subscriptions](/azure/governance/management-groups/overview).
- Confirm that the destination subscription meets the resource-provider registration requirements for Azure Enclave and each resource being moved.
- Before moving the resources, check the subscription quotas for the subscription you're moving the resources to. If moving the resources means the subscription exceeds its limits, you need to review whether you can request an increase in the quota.
- The account moving the resources must have at least the following permissions:
    - `Microsoft.Resources/subscriptions/resourceGroups/moveResources/action` on the source resource group.
    - `Microsoft.Resources/subscriptions/resourceGroups/write` on the destination resource group.
- Review direct Azure role assignments on the resources and their child resources, and follow the move guidance for preserving or recreating those assignments.
- For a move across subscriptions, check the resource provider's requirements for moving dependent resources. For example, a virtual machine and its managed disks might need to be moved together.
- After a resource group is associated with a workload, Azure Enclave applies its configured policies and guardrails to the group. Review the [Azure Enclave governance guidance](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring) and check resource [compliance states](/azure/governance/policy/concepts/compliance-states).

## Plan a migration from an earlier preview deployment

If you're moving from an earlier Azure Enclave preview or a predecessor deployment, don't assume that the same migration steps apply. Inventory the resources and dependencies, and verify the required move, network, identity, policy, and data-protection steps for your deployment before proceeding.

- Confirm which resource groups are associated with each workload, and review their policy assignments and compliance before and after the move.
- Identify dependent resources, locks, role assignments, network connections, and DNS settings. Check the move requirements for each resource provider and the target environment.
- Plan how to protect and transfer data and secrets, and validate access to the migrated resources before cutover.

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
