<properties
   pageTitle="Scale a Service Fabric cluster up or down | Microsoft Azure"
   description="Scale a Service Fabric cluster up or down to match demand by setting auto-scale rules for each node type/VM scale set."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/04/2016"
   ms.author="chackdan"/>


# Scale a Service Fabric cluster up or down using auto-scale rules

Virtual machine scale sets are an Azure compute resource which you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in a Service Fabric cluster is setup as a separate VM scale set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. Read more about it in the [Service Fabric nodetypes](service-fabric-cluster-nodetypes.md) document. Since the Service Fabric node types in your cluster are made of VM scale sets at the backend, you will need to set up auto-scale rules for each node type/VM scale set.

>[AZURE.NOTE] Your subscription must have enough cores to add the new VMs that will make up this cluster. There is no model validation currently, so you will get a deployment time failure, if any of the quota limits are hit.

## Choose the node type/VM scale set to scale

Currently, you are not able to specify the auto-scale rules for VM scale sets using the portal, so let us use Azure PowerShell (1.0+) to list the node types and then add auto-scale rules to them.

To get the list of VM scale set that make up your cluster, run the following cmdlets:

```powershell
Get-AzureRmResource -ResourceGroupName <RGname> -ResourceType Microsoft.Compute/VirtualMachineScaleSets

Get-AzureRmVmss -ResourceGroupName <RGname> -VMScaleSetName <VM Scale Set name>
```

## Set auto-scale rules for the node type/VM scale set

If your cluster has multiple node types, then you will need to do this for each of the node types/VM scale sets that you want to scale (up or down). Take into account the number of nodes that you must have before you set up auto-scaling. The minimum number of nodes that you must have for the primary node type is driven by the reliability level you have chosen. Read more about [reliability levels](service-fabric-cluster-capacity.md).

>[AZURE.NOTE]  Scaling down the primary node type to less than the minimum number will make the cluster unstable or bring it down. This could result in data loss for your applications and for the system services.

Currently the auto-scale feature is not driven by the loads that your applications may be reporting to Service Fabric. So at this time the auto-scale you get is purely driven by the performance counters that are emitted by each of the VM scale set instances.  

Follow these instructions [to set up auto-scale for each VM scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md).

>[AZURE.NOTE] In a scale down scenario, unless your node type has a durability level of Gold or Silver you will need to call the [Remove-ServiceFabricNodeState cmdlet](https://msdn.microsoft.com/library/azure/mt125993.aspx) with the appropriate node name.

## Behaviors you may observe in Service Fabric Explorer

When you scale up a cluster the Service Fabric Explorer will reflect the number of nodes (VM scale set instances) that are part of the cluster.  However, when you scale a cluster down you will still see the removed node/VM instance displayed in an unhealthy state unless you call [Remove-ServiceFabricNodeState cmd](https://msdn.microsoft.com/library/mt125993.aspx) with the appropriate node name.   

Here is the explanation for this behavior.

The nodes listed in Service Fabric Explorer are a reflection of what the Service Fabric system services (FM specifically) knows about the number of nodes the cluster had/has. When you scale the VM scale set down, the VM was deleted but FM system service still thinks that the node (that was mapped to the VM that was deleted) will come back. So Service Fabric Explorer continues to display that node (though the health state may be error or unknown).

In order to make sure that a node is removed when a VM is removed you have two options:

1) Choose a durability level of Gold or Silver (available soon) for the node types in your cluster, which will give you the infrastructure integration. Which will then automatically remove the nodes from our system services (FM) state when you scale down.
Refer to [the details on durability levels](service-fabric-cluster-capacity.md)

2) Once the VM instance has been scaled down, you will need to call the [Remove-ServiceFabricNodeState cmdlet](https://msdn.microsoft.com/library/mt125993.aspx).

>[AZURE.NOTE] Service Fabric clusters require a certain number of nodes to be up at all times in order to maintain availability and preserve state - referred to as "maintaining quorum". Consequently, it is typically unsafe to shut down all of the machines in the cluster unless you have first performed a [full backup of your state](service-fabric-reliable-services-backup-restore.md).

## Next steps
Read the following to also learn about planning cluster capacity, upgrading a cluster, and partitioning services:

- [Plan your cluster capacity](service-fabric-cluster-capacity.md)
- [Cluster upgrades](service-fabric-cluster-upgrade.md)
- [Partition stateful services for maximum scale](service-fabric-concepts-partitioning.md)

<!--Image references-->
[BrowseServiceFabricClusterResource]: ./media/service-fabric-cluster-scale-up-down/BrowseServiceFabricClusterResource.png
[ClusterResources]: ./media/service-fabric-cluster-scale-up-down/ClusterResources.png
