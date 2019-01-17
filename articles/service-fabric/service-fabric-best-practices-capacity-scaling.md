---
title: Azure Service Fabric Capacity Planning and Scaling Best Practices| Microsoft Docs
description: Best practices for  planning and scaling Service Fabric clusters and applications.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: timlt
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/11/2019
ms.author: pepogors

---
# Capacity Planning and Scaling
Before creating any Azure Service Fabric cluster or scaling compute resources hosting your cluster, it is important to [plan for capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity). In addition to Nodetype and Cluster characteristics that you need to take into consideration when planning capacity, you need to plan for scaling operations to take longer than an hour to complete for a production environment, irrespective of the number of VMs you are adding.

## Vertical 
[Vertical scaling](https://docs.microsoft.com/en-us/azure/service-fabric/virtual-machine-scale-set-scale-node-type-scale-out#upgrade-the-size-and-operating-system-of-the-primary-node-type-vms) of a Node Type in Azure Service Fabric requires a number of steps and considerations that must be taken. 
* The cluster must be healthy before scaling, otherwise you will only destabilize cluster further.
* **Silver durability level or greater** is required for all Service Fabric Cluster NodeTypes that are hosting stateful services. 

> [!NOTE]
> Your primary NodeType that is hosting Stateful Service Fabric System Services, and must be Silver durability level or greater. Once you enable silver durability, all the cluster operations like upgrades, adding or removing of nodes etc would be slower, since the system now optimizes for data safety over speed of operations.

Given in place vertical scaling of a Virtual Machine Scale Set is a destructive operation, you have to horizontally scale your cluster by adding a new Scale Set with the desires SKU, and migrate your services to your desired SKU to complete a safe vertical scaling operation. Service Fabric [node properties and placement constraints](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-resource-manager-cluster-description#node-properties-and-placement-constraints) are leveraged by your cluster to decide where to host your Applications services; so when vertically scaling your Primary Node Type, declaring identical property values for "nodeTypeRef" Virtual Machine Scale Set Service Fabric Extension, enables your cluster to choose an your provisioned scale set with those properties to host your Applications services. The following is a snippet of the Resource Manager template properties you will declare, with the same value for your new provisioned scale sets that you are scaling to, and is only supported as a temporary stateful for your cluster:
```json
"settings": {
   "nodeTypeRef": ["[parameters('primaryNodetypeName')]"]
}
```
> [!NOTE]
> Do not leave your cluster with multiple scale sets using the same nodeTypeRef property value longer than required to complete a successful vertical scaling operation, and you should always validate operations in test environments before attempting production environment changes. By default Service Fabric Cluster System Services have a placement constraint to target primary nodetype only.

With your node properties and placement constraints declared, you need to execute the following steps one VM instance at a time. This allows for the system services (and your stateful services) to be shut down gracefully on the VM instance you are removing and new replicas created else where.
1. Run Disable-ServiceFabricNode with intent ‘RemoveNode’ to disable the node you’re going to remove (the highest instance in that node type).
2. Run Get-ServiceFabricNode to make sure that the node has indeed transitioned to disabled. If not, wait until the node is disabled. You cannot hurry this step.
3. Change the number of VMs by one in that Node type. The highest VM instance will now be removed.
4. Repeat steps 1 through 3 as needed, but never scale down the number of instances in the primary node types less than what the reliability tier warrants. Refer to the details on reliability tiers here.

## Horizontal Scaling 
Horizontal Scaling in Service Fabric can be done either [manually](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-scale-up-down) or [programmatically](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-programmatic-scaling).

### Scaling Out
Scaling out of a Service Fabric cluster can be done by increasing the instance count for a particular Vitrual Machine Scale Set. You can scale out programmatically by using the AzureClient and the ID for the desired scale set to increase the capacity.
```c#
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);
var newCapacity = (int)Math.Min(MaximumNodeCount, scaleSet.Capacity + 1);
scaleSet.Update().WithCapacity(newCapacity).Apply(); 
```
Scaling out manually, you can update the capacity in the SKU property of the desired [Virtual Machine Scale Set](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) resource.
```json
"sku": {
    "name": "[parameters('vmNodeType0Size')]",
    "capacity": "[parameters('nt0InstanceCount')]",
    "tier": "Standard"
}
```
### Scaling In
Scaling In requires more consideration than scaling out. 
* The service fabric system services run in the Primary node type in your cluster. So should never shut down or scale down the number of instances in that node types less than what the reliability tier warrants. 
* For a stateful service, you need a certain number of nodes to be always up to maintain availability and preserve state of your service. At the minimum, you need the number of nodes equal to the target replica set count of the partition/service.

To, scale in manually requires the completion of the following steps:
1. Run [Disable-ServiceFabricNode](https://docs.microsoft.com/powershell/module/servicefabric/disable-servicefabricnode?view=azureservicefabricps) with intent ‘RemoveNode’ to disable the node you’re going to remove (the highest instance in that node type).
2. Run [Get-ServiceFabricNode](https://docs.microsoft.com/en-us/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) to make sure that the node has indeed transitioned to disabled. If not, wait until the node is disabled. You cannot hurry this step.
3. Decrease the instance count to the desired number of nodes in the SKU property of the desired [Virtual Machine Scale Set](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) resource.
```json
"sku": {
    "name": "[parameters('vmNodeType0Size')]",
    "capacity": "[parameters('nt0InstanceCount')]",
    "tier": "Standard"
}
```
4. Repeat steps 1 through 3 as needed, but never scale down the number of instances in the primary node types less than what the reliability tier warrants. Refer to the [details on reliability tiers here](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity).

Scaling in programmatically requires preparing the node for shutdown involves finding the node to be removed (the most recently added virtual machine scale set instance) and deactivating it. 
```c#
using (var client = new FabricClient())
{
    var mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync())
        .Where(n => n.NodeType.Equals(NodeTypeToScale, StringComparison.OrdinalIgnoreCase))
        .Where(n => n.NodeStatus == System.Fabric.Query.NodeStatus.Up)
        .OrderByDescending(n =>
        {
            var instanceIdIndex = n.NodeName.LastIndexOf("_");
            var instanceIdString = n.NodeName.Substring(instanceIdIndex + 1);
            return int.Parse(instanceIdString);
        })
        .FirstOrDefault();
```

Once the node to be removed is found, it can be deactivated and removed using the same FabricClient instance and the IAzure instance from earlier.
```c#
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);

// Remove the node from the Service Fabric cluster
ServiceEventSource.Current.ServiceMessage(Context, $"Disabling node {mostRecentLiveNode.NodeName}");
await client.ClusterManager.DeactivateNodeAsync(mostRecentLiveNode.NodeName, NodeDeactivationIntent.RemoveNode);

// Wait (up to a timeout) for the node to gracefully shutdown
var timeout = TimeSpan.FromMinutes(5);
var waitStart = DateTime.Now;
while ((mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Up || mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Disabling) &&
        DateTime.Now - waitStart < timeout)
{
    mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync()).FirstOrDefault(n => n.NodeName == mostRecentLiveNode.NodeName);
    await Task.Delay(10 * 1000);
}

// Decrement VMSS capacity
var newCapacity = (int)Math.Max(MinimumNodeCount, scaleSet.Capacity - 1); // Check min count 

scaleSet.Update().WithCapacity(newCapacity).Apply();
```

## Reliability Levels
The [reliability level](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) is a property of your Service Fabric Cluster resource, and can not be configured differently for individual nodeTypes. It controls the replication factor of the system services for the cluster, and is a setting at the cluster resource level. The reliability level will determine the minimum number of nodes that your primary node type must have. The reliability tier can take the following values:
* Platinum - Run the System services with a target replica set count of seven
* Gold - Run the System services with a target replica set count of seven
* Silver - Run the System services with a target replica set count of five
* Bronze - Run the System services with a target replica set count of three
The minimum recommended reliability level is Silver.

The reliability level is set in the properties section of the [Microsoft.ServiceFabric/clusters resource](https://docs.microsoft.com/azure/templates/microsoft.servicefabric/2018-02-01/clusters)
```json
"properties":{
    "reliabilityLevel": "Silver"
}
```
## Durability Levels
> [!WARNING]
> Node types running with Bronze durability obtain _no privileges_. This means that infrastructure jobs that impact your stateless workloads will not be stopped or delayed, which might impact your workloads. Use only Bronze for node types that run only stateless workloads. For production workloads, running Silver or above is recommended. 

The durability level must be set in two resources. The extension profile of the [Virtual Machine Scale Set resource](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile).
```json
"extensionProfile": {
    "extensions":          {
        "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
        "properties": {
            "settings": {
                "durabilityLevel": "Bronze"
            }
        }
    }
}
```
And under the nodeType in the [Microsoft.ServiceFabric/clusters resource](https://docs.microsoft.com/azure/templates/microsoft.servicefabric/2018-02-01/clusters) 
```json
"nodeTypes": [
    {
        "name": "[variables('vmNodeType0Name')]",
        "durabilityLevel": "Bronze"
    }
]
```

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

[Image1]: ./media/service-fabric-best-practices/generate-common-name-cert-portal.png
