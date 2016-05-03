<properties
   pageTitle="Scale a Service Fabric cluster up or down | Microsoft Azure"
   description="Scale a Service Fabric cluster up or down to match demand by adding or removing virtual machines."
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
   ms.date="05/02/2016"
   ms.author="chackdan"/>


# Scale a Service Fabric cluster up or down by adding or removing virtual machines from the node types

### Relationship between Cluster node types and Virtual Machine Scale Sets 
Virtual Machine Scale Sets (VMSS) are an azure compute resource you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in a Service Fabric cluster is setup as a separate VM Scale Set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. Read more about it in the [ Service Fabric nodetypes](service-fabric-cluster-nodetypes.md) document.

>[AZURE.NOTE] Your subscription must have enough cores to add the new VMs that will make up this cluster. There is no model validation currently, so you will get a deployment time failure, if any of the quota limits are hit.


## Auto-scale Service Fabric clusters

Since the Service fabric Node types in your cluster is made of VMSS at the backend, you will need to set up Auto-scale rules for each one of them.

### Choose the node type /VMSS to scale

Currently, you are not able to specify the autoscale rules for VMSS, using the portal, so let us use Azure power shell (1.0+) to list our the nodetypes and then add autoscale rules to them. 

To get the list of VMSSs tha make up your cluster, run the following

```
Get-AzureRmResource -ResourceGroupName <RGname> -ResourceType Microsoft.Network/VirtualMachineScaleSets 
```

```
Get-AzureRmVmss -ResourceGroupName <RGname> -VMScaleSetName <VM Scale Set name> 
```

### Set autoscale rules for the NodeType (VMSS)

If your cluster has multiple node types, then you will need to do this for each of the NodeTypes/VMSS that you want to scale (up or down). 


1. Take into account the following before you go about setting up the autoscaling.
	- The minimum number of nodes that you must have for the primary Node Type is driven by the reliability level you have chosen for it. Read more about [reliability level here](service-fabric-cluster-capacity.md)
	>[AZURE.NOTE]  Scaling down the primary node type to less than the minimum number will make the cluster unstable or bring it down. This could result in data loss for your applications and for the system services.
	
Currently the Autoscale feature is not driven by the loads that your applications may be reporting to service fabric. That functionality is planned to be added later. So at this time the autoscale you get is purely driven by the performance counters that are emitted in each of the VMSS instances.  


2. Follow the instructions on [how to set up autoscale for each VMSS here](virtual-machine-scale-sets-autoscale-overview.md)

   >[AZURE.NOTE] On a scale down scenario, unless your nodetype has a durability level of Gold or Silver, you will have to you will need to call the Remove-ServiceFabricNodeState cmd with the appropriate Node name : refer to [https://msdn.microsoft.com/en-us/library/mt125993.aspx](https://msdn.microsoft.com/library/mt125993.aspx) for details on the CMD.
   

### Behaviors you may observe on scale up down the Node type in Service fabric Explorer 

On a scale up the SFX will reflect the number of nodes (VMSS instances) that are part of the cluster, however on a scale down, unless you call [Remove-ServiceFabricNodeState cmd](https://msdn.microsoft.com/library/mt125993.aspx) with the appropriate Node name, you will still see the removed Node/VM instance showing up in an  unhealthy state.  

Here is the explanation for this behavior.

The Nodes listed /shown in Service Fabric Explorer (SFX) are a reflection of what the Service Fabric system services (FM specifically) knows about the number of Nodes the cluster had/has. When you scaled the VMSS down, the VM was deleted, but FM still thinks that the node (that mapped to the VM that was deleted) will come back. So SFX shows that Node (albeit the health may be error or unknown).

In order to make sure that when a VM is removed, the Node is also gone, you have two options.

1) Choose a durability level of Gold or Silver (available soon) for the node types in your cluster, this will give you the infrastructure integration. Which will then automatically remove the Nodes from our system services (FM )state when you scaled down. Refer to [this document for details on Durability levels](service-fabric-cluster-capacity.md)

2) Once the VM instance has been scaled down, you will need to call the Remove-ServiceFabricNodeState cmd with the appropriate Node name : refer to https://msdn.microsoft.com/en-us/library/mt125993.aspx for details on the CMD



>[AZURE.NOTE] Service Fabric clusters require a certain number of nodes to be up at all times in order to maintain availability and preserve state - referred to as "maintaining quorum". Consequently, it is typically not safe to shut down all of the machines in the cluster unless you have first performed a [full backup of your state](service-fabric-reliable-services-backup-restore.md).


## Next steps

- [Learn about how to plan your cluster capacity](/service-fabric-cluster-capacity.md)
- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)

<!--Image references-->
[BrowseServiceFabricClusterResource]: ./media/service-fabric-cluster-scale-up-down/BrowseServiceFabricClusterResource.png
[ClusterResources]: ./media/service-fabric-cluster-scale-up-down/ClusterResources.png
