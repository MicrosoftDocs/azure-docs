---
title: Upgrade the primary nodetype VMs of an Azure Service Fabric cluster | Microsoft Docs
description: Learn how to upgrade the virtual machines in a Service Fabric cluster's primary nodetype.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 5441e7e0-d842-4398-b060-8c9d34b07c48
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/25/2018
ms.author: ryanwi;aljo

---
# Upgrade the primary nodetype VMs of a Service Fabric cluster
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Clusters can contain potentially thousands of nodes. After creating a Service Fabric cluster, you can scale the cluster horizontally (change the number of nodes) or vertically (change the resources of the nodes).  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

### Scaling up and down, or vertical scaling 
Changes the resources (CPU, memory, or storage) of nodes in the cluster.
- Advantages: Software and application architecture stays the same.
- Disadvantages: Finite scale, since there is a limit to how much you can increase resources on individual nodes. Downtime, because you will need to take physical or virtual machines offline in order to add or remove resources.

## Scaling an Azure cluster up or down
Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately.  Scaling a node type up or down involves changing the SKU of the virtual machine instances in the scale set. 

> [!WARNING]
> We recommend that you do not change the VM SKU of a scale set/node type unless it is running at [Silver durability or greater](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster). Changing VM SKU Size is a data-destructive in-place infrastructure operation. Without some ability to delay or monitor this change, it is possible that the operation can cause data loss for stateful services or cause other unforeseen operational issues, even for stateless workloads. 
>

When scaling an Azure cluster, keep the following guideline in mind:
- If scaling down a primary node type, you should never scale it down more than what the [reliability tier](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) allows.

The process of scaling a node type up or down is different depending on whether it is a non-primary or primary node type.

### Scaling the primary node type
We recommend that you do not change the VM SKU of the primary node type. If you need more cluster capacity, we recommend adding more instances. 

If that not possible, you can create a new cluster and [restore application state](service-fabric-reliable-services-backup-restore.md) (if applicable) from your old cluster. You do not need to restore any system service state, they are recreated when you deploy your applications to your new cluster. If you were just running stateless applications on your cluster, then all you do is deploy your applications to the new cluster, you have nothing to restore. If you decide to go the unsupported route and want to change the VM SKU, then make modifications to the virtual machine scale set Model definition to reflect the new SKU. If your cluster has only one node type, then make sure that all your stateful applications respond to all [Service replica lifecycle events](service-fabric-reliable-services-lifecycle.md) (like replica in build is stuck) in a timely fashion and that your service replica rebuild duration is less than five minutes (for Silver durability level). 

## Scaling
1)	Deploy a two node type SF cluster, with a primary node type with D2V2 SKU.
2)	Deploy a stateful sample to it.
3)	Add a new VMSS with a different SKU (D4v2) was added to cluster, but with the same NodeType name as the primary node type
4)	 VM instances from the old primary node type was disabled with intent to remove node. (This will cause  the system services and seed nodes to be moved to the new VMSS.)
5)	move public IP from the LB old VMSS to the new one
6)	The cluster and the app should stay healthy.

Results:
-	VM instances from the old primary node type was disabled with intent to remove node.
-	Deallocated VM instances from old VMSS to move public IP from the LB old VMSS to the new one
-	Successfully move public IP from the LB old VMSS to the new one
-	During the process of moving public IP from old LB to new, the cluster was not reachable for time for which LB is detached from old VMSS and is not attached to new VMSS.
-	After public IP move is completed the cluster endpoint was reachable.

```powershell
# Variables.
$groupname = "ryanwiupgradetestgroup"
$clusterloc="southcentralus"  
$subscriptionID="0754ecc2-d80d-426a-902c-b83f4cfbdc95"

# sign in to your Azure account and select your subscription
Login-AzureRmAccount -SubscriptionId $subscriptionID 

# Create a new resource group for your deployment and give it a name and a location.
New-AzureRmResourceGroup -Name $groupname -Location $clusterloc

New-AzureRmResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\temp\cluster\template_2NodeTypes.parameters.json" -TemplateFile "C:\temp\cluster\template_2NodeTypes.json" -Verbose

New-AzureRmResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\temp\cluster\template_3NodeTypes.parameters.json" -TemplateFile "C:\temp\cluster\template_3NodeTypes.json" -Verbose


$ClusterName= "ryanwiupgradetest.southcentralus.cloudapp.azure.com:19000"
$certCN = "sfrpe2eetest.southcentralus.cloudapp.azure.com"
$thumb="F361720F4BD5449F6F083DDE99DC51A86985B25B"

Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My 

# Disable VM instances from old primary node type
Disable-ServiceFabricNode -NodeName _NTvm1_4 -Intent RemoveNode 

# Create new public IP for old primary vmss
$newPublicIP = New-AzureRmPublicIpAddress -Name "LBIP-testcluster8252711300318-new" -ResourceGroupName $groupname -AllocationMethod Dynamic -Location ‘South Central US’

# Load the load balancer resource related to old primary VMSS into a variable
$vm1lb = Get-AzureRmLoadBalancer -Name "LB-ryanwiupgradetest-NTvm1" -ResourceGroupName $groupname

# Update the load balancer related to old primary VMSS with newly created Public IP
Set-AzureRmLoadBalancerFrontendIpConfig -Name LoadBalancerIPConfig -LoadBalancer $vm1lb -PublicIpAddress $newPublicIP 

# Save the load balancer configuration by using Set-AzureLoadBalancer.
Set-AzureRmLoadBalancer -LoadBalancer $vm1lb 

# Get Public IP of primary node type 
$primaryPublicIP = Get-AzureRmPublicIpAddress -Name "LBIP-ryanwiupgradetest-0" -ResourceGroupName $groupname

# Load load balancer resource related to new VMSS into a variable
$vm3lb = Get-AzureRmLoadBalancer -Name "LB-ryanwiupgradetest-NTvm3" -ResourceGroupName $resourceGroupName 


# Update the load balancer related to new VMSS with Public IP of old primary VMSS
Set-AzureRmLoadBalancerFrontendIpConfig -Name LoadBalancerIPConfig -LoadBalancer $vm3lb -PublicIpAddress $oldPublicIP 


# Save the load balancer configuration by using Set-AzureLoadBalancer.
Set-AzureRmLoadBalancer -LoadBalancer $vm3lb 

```

## Next steps
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standaone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).

