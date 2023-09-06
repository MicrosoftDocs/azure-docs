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

Deny assignment policies for Service Fabric managed clusters enable customers to protect the resources of their clusters. Deny assignments attach a set of deny actions to a user, group, or service principal at a particular scope to deny access. Limiting access to certain actions can help users from inadvertently damaging their clusters when they delete, deallocate restart, or reimage their clusters' scale set directly in the infrastructure resource group, which can cause the resources of the cluster to be unsynchronized with the data in the managed cluster.

All actions that are related to managed clusters should be done through the managed cluster resource APIs instead of directly against the infrastructure resource group. Using the resource APIs ensures the resources of the cluster are synchronized with the data in the managed cluster.

This feature ensures that the correct, supported APIs are used when performing delete operations to avoid any errors.

You can learn more about deny assignments in the [Azure role-based access control (RBAC) documentation](../role-based-access-control/deny-assignments.md).

## Best practices

The following are some best practices to minimize the threat of desyncing your cluster's resources:
* Instead of deleting virtual machine scale sets directly from the managed resource group, use NodeType level APIs to delete the NodeType or virtual machine scale set. Options include the Node blade on the Azure portal and [Azure PowerShell](/powershell/module/az.servicefabric/remove-azservicefabricmanagednodetype).
* Use the correct APIs to restart or reimage your scale sets:
  * [Virtual machine scale set restarts](/powershell/module/az.servicefabric/restart-azservicefabricmanagednodetype)
  * [Virtual machine scale set reimage](/powershell/module/az.servicefabric/set-azservicefabricmanagednodetype)

## Next steps

* Learn more about [granting permission to access resources on managed clusters](how-to-managed-cluster-grant-access-other-resources.md)
