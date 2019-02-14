---
title: How to remote a node type in Azure Service Fabric | Microsoft Docs
description: Learn how to remove a node type in Azure Service Fabric
services: service-fabric
documentationcenter: .net
author: v-steg
manager: JeanPaul.Connick
editor: vturecek

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/26/2018
ms.author: v-steg 

---

# Remove a Service Fabric node type

Use [Remove-AzureRmServiceFabricNodeType](https://docs.microsoft.com/powershell/module/azurerm.servicefabric/remove-azurermservicefabricnodetype) to remove a Service Fabric node type.

The two operations that occur when Remove-AzureRmServiceFabricNodeType is called are:
1.	The Virtual Machine Scale Set (VMSS) behind the node type is deleted.
2.	For all the Nodes within that node type, the entire state for that node is removed from the system. If there are services on that node, then the services are first moved out to another node. If the cluster manager cannot find a node for the replica/service, then the operation is delayed/blocked.

> [!NOTE]
> Using Remove-AzureRmServiceFabricNodeType to remove a node type from a production cluster is
> not recommended to be used on a frequent basis. In this case, it is a very dangerous command as it basically
> deletes the Virtual Machine Scale Set resource behind the node type. When you call 
> Remove-AzureRmServiceFabricNodeType, the system has no way to know if you care about the removal
> being safe. 

## Durability characteristics
Safety is prioritized over speed when using Remove-AzureRmServiceFabricNodeType. Silver or Gold [durability characteristics](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster) are recommended, because:
- Bronze does not give you any guarantees about saving state information.
- Silver and Gold durability trap any changes to the VMSS.
- Gold also gives you control over the Azure updates underneath VMSS.

Service Fabric "orchestrates" underlying changes and updates so that data is not lost. However, when you remove a node with Bronze durability, you may lose state information. If you're  removing a primary node type and your application is stateless, Bronze is acceptable. When you run stateful workloads in production, the minimum configuration should be Silver. Similarly, for production scenarios the primary node type should always be Silver or Gold.

### More about Bronze durability

When removing a node type that is Bronze, all the nodes in the node type go down immediately. Service Fabric doesn't trap any Bronze nodes VMSS updates, thus all the VMs go down immediately. If you had anything stateful on those nodes, the data is lost. Now, even if you were stateless, all the nodes in the Service Fabric participate in the ring, so an entire neighborhood may be lost, which might affect the cluster itself.

Unlike removing a single node, because, in theory, you can remove one node at a time, wait for the replicas and services to move over, wait for the system to stabilize, before removing another node, and so on.  However, if you remove several nodes at once simultaneously, your cluster may go down (since Service Fabric doesn't trap any VMSS updates with Bronze durability).

## Recommended node type removal process

To remove the node type in the most safe and rapid manner:
1.  If you're using Bronze durability or do not want the system to move applications that contain state information that will be lost as part of the node type deletion, first empty stateful data from the nodes that will be affected by the node type removal.
2.	Run [Remove-ServiceFabricNodeState](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricnodestate?view=azureservicefabricps) on each of the nodes that you want removed.
3.	Run [Remove-AzureRmVmss](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#remove-vms-from-a-scale-set) for VMs that will be affected by the node type removal.
4. Run [Remove-AzureRmServiceFabricNodeType](https://docs.microsoft.com/powershell/module/azurerm.servicefabric/remove-azurermservicefabricnodetype) to remove the node type.

## Next steps
- Learn more about cluster [durability characteristics](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster).
- Learn more about [node types and Virtual Machine Scale Sets](service-fabric-cluster-nodetypes.md).
- Learn more about [Service Fabric cluster scaling](service-fabric-cluster-scaling.md).