---
title: Service Fabric Explorer blocking operations
description: Learn about the blocking operations in place to mitigate cluster desynchronization issues.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 09/15/2022
---

# Service Fabric Explorer blocking operations

When you create a Service Fabric managed cluster along with applications and services through ARM, portal, or Az cmdlets, ARM manages the cluster. Accordingly, these resources should have all their management operations performed at ARM level. Commands run directly against the cluster bypass ARM, whether they're made through a Service Fabric Explorer command or an SF cmdlet. Bypassing ARM can cause synchronization issues, as ARM isn't alerted to any changes that result from the operations. When the cluster is out of sync with its definition in ARM, there's a risk of degraded ability to manage the cluster safely and reliably.

To help prevent synchronization issues, Service Fabric Explorer now blocks the management of ARM managed resources.

## Service Fabric Explorer interface

* Applications that ARM manages are now labeled in the list of applications.
* Application type versions that ARM manages are now labeled in the list of application type versions.
* Services that ARM manages are now labeled in the list. A banner is now shown if the service is managed in ARM. The following screen capture shows an ARM-managed service in Service Fabric explorer.

## Best practices

### Application type versions

* To unprovision application type versions, use the Az PowerShell cmdlet [Remove-AzReource](/powershell/module/az.resources/remove-azresource).
* Use ARM templates or the [AzSF PowerShell cmdlet](/powershell/module/az.servicefabric/new-azservicefabricmanagedclusterapplication) to create applications.

### Applications

* Applications must be deleted through ARM or via the command line with [az resource](/cli/azure/resource#az-resource-delete).
* Use ARM templates or the [AzSF PowerShell cmdlet](/powershell/module/az.servicefabric/new-azservicefabricmanagedclusterapplication) to create applications.

### Services

* Scale actions must be done via ARM.
* Deletions must be done via the [Remove-AzResource cmdlet](/powershell/module/az.resources/remove-azresource).
* Use the [AzSF PowerShell cmdlet](/powershell/module/az.servicefabric/new-azservicefabricservice) to create services.

## Next steps

* Learn about [Service Fabric Explorer to visualize your cluster](service-fabric-visualizing-your-cluster.md).
