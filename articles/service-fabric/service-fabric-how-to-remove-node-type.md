---
title: Remove a node type in Azure Service Fabric | Microsoft Docs
description: Learn how to remove a node type from a Service Fabric cluster running in Azure.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chakdan
editor: vturecek

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/14/2019
ms.author: aljo 

---

# Remove a Service Fabric node type
This article describes how to scale an Azure Service Fabric cluster by removing an existing node type from a cluster. A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Virtual machine scale sets are an Azure compute resource that you use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately. After creating a Service Fabric cluster, you can scale a cluster horizontally by removing a node type (virtual machine scale set) and all of it's nodes.  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Use [Remove-AzServiceFabricNodeType](https://docs.microsoft.com/powershell/module/az.servicefabric/remove-azservicefabricnodetype) to remove a Service Fabric node type.

The three operations that occur when Remove-AzServiceFabricNodeType is called are:
1.	The virtual machine scale set behind the node type is deleted.
2.  The node type is removed from the cluster.
3.	For each node within that node type, the entire state for that node is removed from the system. If there are services on that node, then the services are first moved out to another node. If the cluster manager cannot find a node for the replica/service, then the operation is delayed/blocked.

> [!WARNING]
> Using Remove-AzServiceFabricNodeType to remove a node type from a production cluster is
> not recommended to be used on a frequent basis. It is a dangerous command as it deletes the virtual machine scale set 
> resource behind the node type. 

## Durability characteristics
Safety is prioritized over speed when using Remove-AzServiceFabricNodeType. The node type must be Silver or Gold [durability level](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster), because:
- Bronze does not give you any guarantees about saving state information.
- Silver and Gold durability trap any changes to the scale set.
- Gold also gives you control over the Azure updates underneath scale set.

Service Fabric "orchestrates" underlying changes and updates so that data is not lost. However, when you remove a node with Bronze durability, you may lose state information. If you're  removing a primary node type and your application is stateless, Bronze is acceptable. When you run stateful workloads in production, the minimum configuration should be Silver. Similarly, for production scenarios the primary node type should always be Silver or Gold.

### More about Bronze durability

When removing a node type that is Bronze, all the nodes in the node type go down immediately. Service Fabric doesn't trap any Bronze nodes scale set updates, thus all the VMs go down immediately. If you had anything stateful on those nodes, the data is lost. Now, even if you were stateless, all the nodes in the Service Fabric participate in the ring, so an entire neighborhood may be lost, which might destabilize the cluster itself.

## Recommended node type removal process

To remove the node type, run the [Remove-AzServiceFabricNodeType](/powershell/module/az.servicefabric/remove-azservicefabricnodetype) cmdlet.  The cmdlet takes some time to complete.  Once all VMs are gone (represented as "Down") the fabric:/System/InfrastructureService/[nodetype name] will show an Error state.

```powershell
$groupname = "mynodetype"
$nodetype = "nt2vm"
$clustername = "mytestcluster"

Remove-AzServiceFabricNodeType -Name $clustername  -NodeType $nodetype -ResourceGroupName $groupname

Connect-ServiceFabricCluster -ConnectionEndpoint mytestcluster.eastus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint <thumbprint> `
          -FindType FindByThumbprint -FindValue <thumbprint> `
          -StoreLocation CurrentUser -StoreName My
```

Then, you can update the cluster resource to remove the node type. You can either use the ARM template deployment, or edit the cluster resource through the [Azure resource manager](https://resources.azure.com). This will start a cluster upgrade which will remove the fabric:/System/InfrastructureService/[nodetype name] service that is in error state.

You will still see the nodes are "Down" in the Service Fabric Explorer. Run [Remove-ServiceFabricNodeState](/powershell/module/servicefabric/remove-servicefabricnodestate?view=azureservicefabricps) on each of the nodes that you want removed.


```powershell
$nodes = Get-ServiceFabricNode | Where-Object {$_.NodeType -eq $nodetype} | Sort-Object { $_.NodeName.Substring($_.NodeName.LastIndexOf('_') + 1) } -Descending

Foreach($node in $nodes)
{
    Remove-ServiceFabricNodeState -NodeName $node.NodeName -TimeoutSec 300 -Force 
}
```

## Next steps
- Learn more about cluster [durability characteristics](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster).
- Learn more about [node types and Virtual Machine Scale Sets](service-fabric-cluster-nodetypes.md).
- Learn more about [Service Fabric cluster scaling](service-fabric-cluster-scaling.md).
