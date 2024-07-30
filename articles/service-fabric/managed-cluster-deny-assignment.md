---
title: Deny assignment policy for Service Fabric managed clusters
description: An overview of the deny assignment policy for Service Fabric managed clusters.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/17/2024
---

# Deny assignment policy for Service Fabric managed clusters

Deny assignment policies for Service Fabric managed clusters enable customers to protect their clusters' resources. Limiting access to certain actions can help users prevent inadvertent damage to their clusters when they delete, deallocate, restart, or reimage their clusters' scale sets. These actions, when done directly in the infrastructure resource group, can cause the resources of the cluster to desynchronize with the data in the cluster.

Deny assignments deny access by attaching a set of deny actions to a user, group, or service principal at a particular scope. You can learn more about deny assignments in the [Azure role-based access control (RBAC) documentation](../role-based-access-control/deny-assignments.md).

This article pertains to Service Fabric managed clusters, but we make callouts when the information pertains to classic clusters as well.

## Proper actions

All actions related to managed clusters should be done through the managed cluster resource APIs instead of directly against the infrastructure resource group. Using the resource APIs ensures the resources of the cluster are synchronized with the data in the managed cluster.

See the [Best practices section](#best-practices) for guidance on what tools to use to go through the proper resource APIs.

## Blocked actions

The following actions are blocked when using managed clusters and don't apply to classic clusters.

* **VMSS deletes**
    * "Microsoft.Compute/virtualMachineScaleSets/delete"
* **VMSS reimages, restarts, deallocates**
    * "Microsoft.Compute/virtualMachineScaleSets/reimage/action"
    * "Microsoft.Compute/virtualMachineScaleSets/restart/action"
    * "Microsoft.Compute/virtualMachineScaleSets/deallocate/action"
* **VM deletes**
    * "Microsoft.Compute/virtualMachineScaleSets/delete/action"
* **Storage account writes and deletes**
    * "Microsoft.Storage/storageAccounts/delete"
    * "Microsoft.Storage/storageAccounts/write"
* **Resource group delete**
    * "Microsoft.Resources/subscriptions/resourceGroups/delete"
* **Load balancer writes**
    * "Microsoft.Network/loadBalancers/write"

## Best practices

The following are some best practices to minimize the threat of desyncing your cluster's resources:

* Instead of deleting virtual machine scale sets directly from the managed resource group, use NodeType level APIs to delete the NodeType or virtual machine scale set. Options include the Node blade on the Azure portal and [Azure PowerShell](/powershell/module/az.servicefabric/remove-azservicefabricmanagednodetype).
* Use the correct APIs to restart or reimage your scale sets:
  * [Virtual machine scale set restarts](/powershell/module/az.servicefabric/restart-azservicefabricmanagednodetype)
  * [Virtual machine scale set reimage](/powershell/module/az.servicefabric/set-azservicefabricmanagednodetype)

When managing resources in managed clusters, use ARM or ARM-backed tools to ensure the use of the proper resource APIs.

| Utility | ARM or ARM-backed |
| - | - |
| [ARM and ARM templates](/azure/templates/microsoft.servicefabric/clusters?pivots=deployment-language-arm-template) | Yes |
| [Bicep](/azure/templates/microsoft.servicefabric/clusters?pivots=deployment-language-bicep) | Yes |
| [Azure portal](https://portal.azure.com) | Yes |
| [Azure CLI](/cli/azure/sf?view=azure-cli-latest&preserve-view=true) | Yes |
| [Azure PowerShell](/powershell/module/az.servicefabric/?view=azps-12.1.0&preserve-view=true) | Yes |
| [Service Fabric PowerShell](/powershell/module/servicefabric/?view=azureservicefabricps&preserve-view=true) | **No** |
| [sfctl](service-fabric-sfctl.md) | **No** |

> [!IMPORTANT]
> When managing resources in a **classic cluster** that were *created* by ARM or ARM-backed tools, continue to use those tools. There's risk of error when modifying the configuration of resources created in ARM with a non-ARM tool (for example, using Service Fabric PowerShell to update or delete a resource created in ARM).

## Next steps

* Learn more about [granting permission to access resources on managed clusters](how-to-managed-cluster-grant-access-other-resources.md)
