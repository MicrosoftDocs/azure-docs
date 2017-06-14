---
title: Scale a Service Fabric cluster in or out | Microsoft Docs
description: Scale a Service Fabric cluster in or out to match demand by setting auto-scale rules for each node type/VM scale set. Add or remove nodes to a Service Fabric cluster
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: aeb76f63-7303-4753-9c64-46146340b83d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/22/2017
ms.author: chackdan

---
# Scale a Service Fabric cluster in or out using auto-scale rules
Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in a Service Fabric cluster is set up as a separate VM scale set. Each node type can then be scaled in or out independently, have different sets of ports open, and can have different capacity metrics. Read more about it in the [Service Fabric nodetypes](service-fabric-cluster-nodetypes.md) document. Since the Service Fabric node types in your cluster are made of VM scale sets at the backend, you need to set up auto-scale rules for each node type/VM scale set.

> [!NOTE]
> Your subscription must have enough cores to add the new VMs that make up this cluster. There is no model validation currently, so you get a deployment time failure, if any of the quota limits are hit.
> 
> 

## Choose the node type/VM scale set to scale
Currently, you are not able to specify the auto-scale rules for VM scale sets using the portal, so let us use Azure PowerShell (1.0+) to list the node types and then add auto-scale rules to them.

To get the list of VM scale set that make up your cluster, run the following cmdlets:

```powershell
Get-AzureRmResource -ResourceGroupName <RGname> -ResourceType Microsoft.Compute/VirtualMachineScaleSets

Get-AzureRmVmss -ResourceGroupName <RGname> -VMScaleSetName <VM Scale Set name>
```

## Set auto-scale rules for the node type/VM scale set
If your cluster has multiple node types, then repeat this for each node types/VM scale sets that you want to scale (in or out). Take into account the number of nodes that you must have before you set up auto-scaling. The minimum number of nodes that you must have for the primary node type is driven by the reliability level you have chosen. Read more about [reliability levels](service-fabric-cluster-capacity.md).

> [!NOTE]
> Scaling down the primary node type to less than the minimum number make the cluster unstable or bring it down. This could result in data loss for your applications and for the system services.
> 
> 

Currently the auto-scale feature is not driven by the loads that your applications may be reporting to Service Fabric. So at this time the auto-scale you get is purely driven by the performance counters that are emitted by each of the VM scale set instances.  

Follow these instructions [to set up auto-scale for each VM scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md).

> [!NOTE]
> In a scale down scenario, unless your node type has a durability level of Gold or Silver you need to call the [Remove-ServiceFabricNodeState cmdlet](https://msdn.microsoft.com/library/azure/mt125993.aspx) with the appropriate node name.
> 
> 

## Manually add VMs to a node type/VM scale set
Follow the sample/instructions in the [quick start template gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing) to change the number of VMs in each Nodetype. 

> [!NOTE]
> Adding of VMs takes time, so do not expect the additions to be instantaneous. So plan to add capacity well in time, to allow for over 10 minutes before the VM capacity is available for the replicas/ service instances to get placed.
> 
> 

## Manually remove VMs from the primary node type/VM scale set
> [!NOTE]
> The service fabric system services run in the Primary node type in your cluster. So should never shut down or scale down the number of instances in that node types less than what the reliability tier warrants. Refer to [the details on reliability tiers here](service-fabric-cluster-capacity.md). 
> 
> 

You need to execute the following steps one VM instance at a time. This allows for the system services (and your stateful services) to be shut down gracefully on the VM instance you are removing and new replicas created on other nodes.

1. Run [Disable-ServiceFabricNode](https://msdn.microsoft.com/library/mt125852.aspx) with intent ‘RemoveNode’ to disable the node you’re going to remove (the highest instance in that node type).
2. Run [Get-ServiceFabricNode](https://msdn.microsoft.com/library/mt125856.aspx) to make sure that the node has indeed transitioned to disabled. If not, wait until the node is disabled. You cannot hurry this step.
3. Follow the sample/instructions in the [quick start template gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing) to change the number of VMs by one in that Nodetype. The instance removed is the highest VM instance. 
4. Repeat steps 1 through 3 as needed, but never scale down the number of instances in the primary node types less than what the reliability tier warrants. Refer to [the details on reliability tiers here](service-fabric-cluster-capacity.md). 

## Manually remove VMs from the non-primary node type/VM scale set
> [!NOTE]
> For a stateful service, you need a certain number of nodes to be always up to maintain availability and preserve state of your service. At the very minimum, you need the number of nodes equal to the target replica set count of the partition/service. 
> 
> 

You need the execute the following steps one VM instance at a time. This allows for the system services (and your stateful services) to be shut down gracefully on the VM instance you are removing and new replicas created else where.

1. Run [Disable-ServiceFabricNode](https://msdn.microsoft.com/library/mt125852.aspx) with intent ‘RemoveNode’ to disable the node you’re going to remove (the highest instance in that node type).
2. Run [Get-ServiceFabricNode](https://msdn.microsoft.com/library/mt125856.aspx) to make sure that the node has indeed transitioned to disabled. If not wait till the node is disabled. You cannot hurry this step.
3. Follow the sample/instructions in the [quick start template gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing) to change the number of VMs by one in that Nodetype. This will now remove the highest VM instance. 
4. Repeat steps 1 through 3 as needed, but never scale down the number of instances in the primary node types less than what the reliability tier warrants. Refer to [the details on reliability tiers here](service-fabric-cluster-capacity.md).

## Behaviors you may observe in Service Fabric Explorer
When you scale up a cluster the Service Fabric Explorer will reflect the number of nodes (VM scale set instances) that are part of the cluster.  However, when you scale a cluster down you will see the removed node/VM instance displayed in an unhealthy state unless you call [Remove-ServiceFabricNodeState cmd](https://msdn.microsoft.com/library/mt125993.aspx) with the appropriate node name.   

Here is the explanation for this behavior.

The nodes listed in Service Fabric Explorer are a reflection of what the Service Fabric system services (FM specifically) knows about the number of nodes the cluster had/has. When you scale the VM scale set down, the VM was deleted but FM system service still thinks that the node (that was mapped to the VM that was deleted) will come back. So Service Fabric Explorer continues to display that node (though the health state may be error or unknown).

In order to make sure that a node is removed when a VM is removed, you have two options:

1) Choose a durability level of Gold or Silver (available soon) for the node types in your cluster, which gives you the infrastructure integration. Which will then automatically remove the nodes from our system services (FM) state when you scale down.
Refer to [the details on durability levels here](service-fabric-cluster-capacity.md)

2) Once the VM instance has been scaled down, you need to call the [Remove-ServiceFabricNodeState cmdlet](https://msdn.microsoft.com/library/mt125993.aspx).

> [!NOTE]
> Service Fabric clusters require a certain number of nodes to be up at all the time in order to maintain availability and preserve state - referred to as "maintaining quorum." So, it is typically unsafe to shut down all the machines in the cluster unless you have first performed a [full backup of your state](service-fabric-reliable-services-backup-restore.md).
> 
> 

## Next steps
Read the following to also learn about planning cluster capacity, upgrading a cluster, and partitioning services:

* [Plan your cluster capacity](service-fabric-cluster-capacity.md)
* [Cluster upgrades](service-fabric-cluster-upgrade.md)
* [Partition stateful services for maximum scale](service-fabric-concepts-partitioning.md)

<!--Image references-->
[BrowseServiceFabricClusterResource]: ./media/service-fabric-cluster-scale-up-down/BrowseServiceFabricClusterResource.png
[ClusterResources]: ./media/service-fabric-cluster-scale-up-down/ClusterResources.png
