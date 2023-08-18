---
title: Deny assignment policy for Service Fabric managed clusters
description: An overview of the deny assignment policy for Service Fabric managed clusters.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 08/18/2023
---

# Deny assignment policy for Service Fabric managed clusters

Deny assignment policies for Service Fabric managed clusters enable customers to protect the resources of their clusters. Deny assignments attach a set of deny actions to a user, group, or service principal at a particular scope for the purpose of denying access. Limiting access to certain actions can help users from inadvertently damaging their clusters when they delete, deallocate restart, or reimage their clusters' scale set directly in the infrastruture resource group, which can cause the resources of the cluster to be out of sync with the data in the managed cluster.

All actions related to managed clusters should be done through the managed cluster resource APIs instead of diretly against the infratructure resource group to ensure the resources of the cluster are in sync with the data in the managed cluster.

This feature ensures that the correct, supported APIs are used when performing delete operations to avoid any errors.

You can learn more about deny assignments in the [Azure role-based access control (RBAC) documentation](..role-based-access-control/deny-assignments).

## Best practices

The following are some best pracitces to minimize the threat of desyncing your cluster's resources:
* Instead of deleting VMSS diretly from the managed resource group, use NodeType level APIs to delete the NodeType or virtual machine scale set, such as through the Node blade on the Azure portal or via [Azure PowerShell](https://learn.microsoft.com/powershell/module/az.servicefabric/remove-azservicefabricmanagednodetype?view=azps-10.2.0&viewFallbackFrom=azps-9.7.0).
* Use the correct APIs to restart or reimage your scale sets:
  * [Virtual machine scale set restarts](https://learn.microsoft.com/powershell/module/az.servicefabric/restart-azservicefabricmanagednodetype?view=azps-10.1.0)
  * [Virtual machine scale set reimage](https://learn.microsoft.com/powershell/module/az.servicefabric/set-azservicefabricmanagednodetype?view=azps-10.1.0)

## Next steps

* Learn more about [granting permission to access resources on managed clusters](how-to-managed-cluster-grant-access-other-resources.md)
