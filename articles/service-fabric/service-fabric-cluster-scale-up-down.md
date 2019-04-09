---
title: Scale a Service Fabric cluster in or out | Microsoft Docs
description: Scale a Service Fabric cluster in or out to match demand by setting auto-scale rules for each node type/virtual machine scale set. Add or remove nodes to a Service Fabric cluster
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid: aeb76f63-7303-4753-9c64-46146340b83d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/12/2019
ms.author: aljo

---
# Scale a cluster in or out

> [!WARNING]
> Read this section before you scale

Scaling compute resources to source your application work load requires intentional planning, will nearly always take longer than an hour to complete for a production environment, and does require you to understand your workload and business context; in fact if you have never done this activity before, it's recommended you start by reading and understanding [Service Fabric cluster capacity planning considerations](service-fabric-cluster-capacity.md), before continuing the remainder of this document. This recommendation is to avoid unintended LiveSite issues, and it's also recommended you successfully test the operations you decide to perform against a non-production environment. At any time you can [report production issues or request paid support for Azure](service-fabric-support.md#report-production-issues-or-request-paid-support-for-azure). For engineers allocated to perform these operations that possess appropriate context, this article will describe scaling operations, but you must decide and understand which operations are appropriate for your use case; such as what resources to scale (CPU, Storage, Memory), what direction to scale (Vertically or Horizontally), and what operations to perform (Resource Template deployment, Portal, PowerShell/CLI).


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Scale a Service Fabric cluster in or out using auto-scale rules or manually
Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in a Service Fabric cluster is set up as a separate virtual machine scale set. Each node type can then be scaled in or out independently, have different sets of ports open, and can have different capacity metrics. Read more about it in the [Service Fabric node types](service-fabric-cluster-nodetypes.md) document. Since the Service Fabric node types in your cluster are made of virtual machine scale sets at the backend, you need to set up auto-scale rules for each node type/virtual machine scale set.

> [!NOTE]
> Your subscription must have enough cores to add the new VMs that make up this cluster. There is no model validation currently, so you get a deployment time failure, if any of the quota limits are hit. Also a single node type can not simply exceed 100 nodes per VMSS. You may need to add VMSS's to achieve the targeted scale, and auto-scaling can not automagically add VMSS's. Adding VMSS's in-place to a live cluster is a challenging task, and commonly this results in users provisioning new clusters with the appropriate node types provisioned at creation time; [plan cluster capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) accordingly. 
> 
> 

## Choose the node type/Virtual Machine scale set to scale
Currently, you are not able to specify the auto-scale rules for virtual machine scale sets using the portal to create a Service Fabric Cluster, so let us use Azure PowerShell (1.0+) to list the node types and then add auto-scale rules to them.

To get the list of virtual machine scale set that make up your cluster, run the following cmdlets:

```powershell
Get-AzResource -ResourceGroupName <RGname> -ResourceType Microsoft.Compute/VirtualMachineScaleSets

Get-AzVmss -ResourceGroupName <RGname> -VMScaleSetName <virtual machine scale set name>
```

## Set auto-scale rules for the node type/virtual machine scale set
If your cluster has multiple node types, then repeat this for each node types/virtual machine scale sets that you want to scale (in or out). Take into account the number of nodes that you must have before you set up auto-scaling. The minimum number of nodes that you must have for the primary node type is driven by the reliability level you have chosen. Read more about [reliability levels](service-fabric-cluster-capacity.md).

> [!NOTE]
> Scaling down the primary node type to less than the minimum number make the cluster unstable or bring it down. This could result in data loss for your applications and for the system services.
> 
> 

Currently the auto-scale feature is not driven by the loads that your applications may be reporting to Service Fabric. So at this time the auto-scale you get is purely driven by the performance counters that are emitted by each of the virtual machine scale set instances.  

Follow these instructions [to set up auto-scale for each virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md).

> [!NOTE]
> In a scale down scenario, unless your node type has a [durability level][durability] of Gold or Silver you need to call the [Remove-ServiceFabricNodeState cmdlet](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricnodestate) with the appropriate node name. For the Bronze durability, it’s not recommended to scale down more than one node at a time.
> 
> 

## Manually add VMs to a node type/virtual machine scale set

When you scale out, you add more virtual machine instances to the scale set. These instances become the nodes that Service Fabric uses. Service Fabric knows when the scale set has more instances added (by scaling out) and reacts automatically. 

> [!NOTE]
> Adding VMs takes time, so do not expect the additions to be instantaneous. So plan to add capacity well in advance, to allow for over 10 minutes before the VM capacity is available for the replicas/service instances to get placed.
> 

### Add VMs using a template
Follow the sample/instructions in the [quickstart template gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-scale-existing) to change the number of VMs in each node type. 

### Add VMs using PowerShell or CLI commands
The following code gets a scale set by name and increases the **capacity** of the scale set by 1.

```powershell
$scaleset = Get-AzVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm
$scaleset.Sku.Capacity += 1

Update-AzVmss -ResourceGroupName $scaleset.ResourceGroupName -VMScaleSetName $scaleset.Name -VirtualMachineScaleSet $scaleset
```

This code sets the capacity to 6.

```azurecli
# Get the name of the node with
az vmss list-instances -n nt1vm -g sfclustertutorialgroup --query [*].name

# Use the name to scale
az vmss scale -g sfclustertutorialgroup -n nt1vm --new-capacity 6
```

## Manually remove VMs from a node type/virtual machine scale set
When you scale in a node type, you remove VM instances from the scale set. If the node type is Bronze durability level, Service Fabric is unaware what has happened and reports that a node has gone missing. Service Fabric then reports an unhealthy state for the cluster. To prevent that bad state, you must explicitly remove the node from the cluster and remove the node state.

The service fabric system services run in the primary node type in your cluster. When scaling down the primary node type, never scale down the number of instances to less than what the [reliability tier](service-fabric-cluster-capacity.md) warrants. 
 
For a stateful service, you need a certain number of nodes to be always up to maintain availability and preserve state of your service. At the very minimum, you need the number of nodes equal to the target replica set count of the partition/service.

### Remove the Service Fabric node

The steps for manually removing node state apply only to node types with a *Bronze* durability tier.  For *Silver* and *Gold* durability tier, these steps are done automatically by the platform. For more information about durability, see [Service Fabric cluster capacity planning][durability].

To keep the nodes of the cluster evenly distributed across upgrade and fault domains, and hence enable their even utilization, the most recently created node should be removed first. In other words, the nodes should be removed in the reverse order of their creation. The most recently created node is the one with the greatest `virtual machine scale set InstanceId` property value. The code examples below return the most recently created node.

```powershell
Get-ServiceFabricNode | Sort-Object { $_.NodeName.Substring($_.NodeName.LastIndexOf('_') + 1) } -Descending | Select-Object -First 1
```

```azurecli
sfctl node list --query "sort_by(items[*], &name)[-1]"
```

The Service Fabric cluster needs to know that this node is going to be removed. There are three steps you need to take:

1. Disable the node so that it no longer is a replicate for data.  
PowerShell: `Disable-ServiceFabricNode`  
sfctl: `sfctl node disable`

2. Stop the node so that the Service Fabric runtime shuts down cleanly, and your app gets a terminate request.  
PowerShell: `Start-ServiceFabricNodeTransition -Stop`  
sfctl: `sfctl node transition --node-transition-type Stop`

2. Remove the node from the cluster.  
PowerShell: `Remove-ServiceFabricNodeState`  
sfctl: `sfctl node remove-state`

Once these three steps have been applied to the node, it can be removed from the scale set. If you're using any durability tier besides [bronze][durability], these steps are done for you when the scale set instance is removed.

The following code block gets the last created node, disables, stops, and removes the node from the cluster.

```powershell
#### After you've connected.....
# Get the node that was created last
$node = Get-ServiceFabricNode | Sort-Object { $_.NodeName.Substring($_.NodeName.LastIndexOf('_') + 1) } -Descending | Select-Object -First 1

# Node details for the disable/stop process
$nodename = $node.NodeName
$nodeid = $node.NodeInstanceId

$loopTimeout = 10

# Run disable logic
Disable-ServiceFabricNode -NodeName $nodename -Intent RemoveNode -TimeoutSec 300 -Force

$state = Get-ServiceFabricNode | Where-Object NodeName -eq $nodename | Select-Object -ExpandProperty NodeStatus

while (($state -ne [System.Fabric.Query.NodeStatus]::Disabled) -and ($loopTimeout -ne 0))
{
    Start-Sleep 5
    $loopTimeout -= 1
    $state = Get-ServiceFabricNode | Where-Object NodeName -eq $nodename | Select-Object -ExpandProperty NodeStatus
    Write-Host "Checking state... $state found"
}

# Exit if the node was unable to be disabled
if ($state -ne [System.Fabric.Query.NodeStatus]::Disabled)
{
    Write-Error "Disable failed with state $state"
}
else
{
    # Stop node
    $stopid = New-Guid
    Start-ServiceFabricNodeTransition -Stop -OperationId $stopid -NodeName $nodename -NodeInstanceId $nodeid -StopDurationInSeconds 300

    $state = (Get-ServiceFabricNodeTransitionProgress -OperationId $stopid).State
    $loopTimeout = 10

    # Watch the transaction
    while (($state -eq [System.Fabric.TestCommandProgressState]::Running) -and ($loopTimeout -ne 0))
    {
        Start-Sleep 5
        $state = (Get-ServiceFabricNodeTransitionProgress -OperationId $stopid).State
        Write-Host "Checking state... $state found"
    }

    if ($state -ne [System.Fabric.TestCommandProgressState]::Completed)
    {
        Write-Error "Stop transaction failed with $state"
    }
    else
    {
        # Remove the node from the cluster
        Remove-ServiceFabricNodeState -NodeName $nodename -TimeoutSec 300 -Force
    }
}
```

In the **sfctl** code below, the following command is used to get the **node-name** value of the last-created node: `sfctl node list --query "sort_by(items[*], &name)[-1].name"`

```azurecli
# Inform the node that it is going to be removed
sfctl node disable --node-name _nt1vm_5 --deactivation-intent 4 -t 300

# Stop the node using a random guid as our operation id
sfctl node transition --node-instance-id 131541348482680775 --node-name _nt1vm_5 --node-transition-type Stop --operation-id c17bb4c5-9f6c-4eef-950f-3d03e1fef6fc --stop-duration-in-seconds 14400 -t 300

# Remove the node from the cluster
sfctl node remove-state --node-name _nt1vm_5
```

> [!TIP]
> Use the following **sfctl** queries to check the status of each step
>
> **Check deactivation status**
> `sfctl node list --query "sort_by(items[*], &name)[-1].nodeDeactivationInfo"`
>
> **Check stop status**
> `sfctl node list --query "sort_by(items[*], &name)[-1].isStopped"`
>

### Scale in the scale set

Now that the Service Fabric node has been removed from the cluster, the virtual machine scale set can be scaled in. In the example below, the scale set capacity is reduced by 1.

```powershell
$scaleset = Get-AzVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm
$scaleset.Sku.Capacity -= 1

Update-AzVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm -VirtualMachineScaleSet $scaleset
```

This code sets the capacity to 5.

```azurecli
# Get the name of the node with
az vmss list-instances -n nt1vm -g sfclustertutorialgroup --query [*].name

# Use the name to scale
az vmss scale -g sfclustertutorialgroup -n nt1vm --new-capacity 5
```

## Behaviors you may observe in Service Fabric Explorer
When you scale up a cluster the Service Fabric Explorer will reflect the number of nodes (virtual machine scale set instances) that are part of the cluster.  However, when you scale a cluster down you will see the removed node/VM instance displayed in an unhealthy state unless you call [Remove-ServiceFabricNodeState cmd](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricnodestate) with the appropriate node name.   

Here is the explanation for this behavior.

The nodes listed in Service Fabric Explorer are a reflection of what the Service Fabric system services (FM specifically) knows about the number of nodes the cluster had/has. When you scale the virtual machine scale set down, the VM was deleted but FM system service still thinks that the node (that was mapped to the VM that was deleted) will come back. So Service Fabric Explorer continues to display that node (though the health state may be error or unknown).

In order to make sure that a node is removed when a VM is removed, you have two options:

1. Choose a durability level of Gold or Silver for the node types in your cluster, which gives you the infrastructure integration. Which will then automatically remove the nodes from our system services (FM) state when you scale down.
Refer to [the details on durability levels here](service-fabric-cluster-capacity.md)

2. Once the VM instance has been scaled down, you need to call the [Remove-ServiceFabricNodeState cmdlet](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricnodestate).

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

[durability]: service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster
