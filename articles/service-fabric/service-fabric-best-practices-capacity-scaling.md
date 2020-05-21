---
title: Capacity planning and scaling for Azure Service Fabric 
description: Best practices for planning and scaling Service Fabric clusters and applications.
author: peterpogorski

ms.topic: conceptual
ms.date: 04/25/2019
ms.author: pepogors
---

# Capacity planning and scaling for Azure Service Fabric

Before you create any Azure Service Fabric cluster or scale compute resources that host your cluster, it's important to plan for capacity. For more information about planning for capacity, see [Planning the Service Fabric cluster capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity). For further best-practice guidance for cluster scalability, see [Service Fabric scalability considerations](https://docs.microsoft.com/azure/architecture/reference-architectures/microservices/service-fabric#scalability-considerations).

In addition to considering node type and cluster characteristics, you should expect scaling operations to take longer than an hour to complete for a production environment. This consideration is true regardless of the number of VMs you're adding.

## Autoscaling
You should perform scaling operations via Azure Resource Manager templates, because it's the best practice to treat [resource configurations as code]( https://docs.microsoft.com/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code). 

Using automatic scaling through virtual machine scale sets will make your versioned Resource Manager template inaccurately define your instance counts for virtual machine scale sets. Inaccurate definition increases the risk that future deployments will cause unintended scaling operations. In general, you should use autoscaling if:

* Deploying your Resource Manager templates with appropriate capacity declared doesn’t support your use case.
     
   In addition to manual scaling, you can configure a [Continuous integration and delivery pipeline in Azure DevOps Services by using Azure resource group deployment projects](https://docs.microsoft.com/azure/vs-azure-tools-resource-groups-ci-in-vsts). This pipeline is commonly triggered by a logic app that uses virtual machine performance metrics queried from the [Azure Monitor REST API](https://docs.microsoft.com/azure/azure-monitor/platform/rest-api-walkthrough). The pipeline effectively autoscales based on whatever metrics you want, while optimizing for Resource Manager templates.
* You need to horizontally scale only one virtual machine scale set node at a time.
   
   To scale out by three or more nodes at a time, you should [scale out a Service Fabric cluster by adding a virtual machine scale set](virtual-machine-scale-set-scale-node-type-scale-out.md). It's safest to scale in and scale out virtual machine scale sets horizontally, one node at a time.
* You have Silver reliability or higher for your Service Fabric cluster, and Silver durability or higher on any scale where you configure autoscaling rules.
  
   The minimum capacity for autoscaling rules must be equal to or greater than five virtual machine instances. It must also be equal to or greater than your Reliability Tier minimum for your primary node type.

> [!NOTE]
> The Service Fabric stateful service fabric:/System/InfastructureService/<NODE_TYPE_NAME> runs on every node type that has Silver or higher durability. It's the only system service that is supported to run in Azure on any of your clusters node types.

## Vertical scaling considerations

[Vertical scaling](https://docs.microsoft.com/azure/service-fabric/virtual-machine-scale-set-scale-node-type-scale-out) a node type in Azure Service Fabric requires a number of steps and considerations. For example:

* The cluster must be healthy before scaling. Otherwise, you'll destabilize the cluster further.
* Silver durability level or greater is required for all Service Fabric cluster node types that host stateful services.

> [!NOTE]
> Your primary node type that hosts stateful Service Fabric system services must be Silver durability level or greater. After you enable Silver durability, cluster operations such as upgrades, adding or removing of nodes, and so on will be slower because the system optimizes for data safety over speed of operations.

Vertical scaling a virtual machine scale set is a destructive operation. Instead, horizontally scale your cluster by adding a new scale set with the desired SKU. Then, migrate your services to your desired SKU to complete a safe vertical scaling operation. Changing a virtual machine scale set resource SKU is a destructive operation because it reimages your hosts, which removes all locally persisted state.

Your cluster uses Service Fabric [node properties and placement constraints](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-resource-manager-cluster-description#node-properties-and-placement-constraints) to decide where to host your application's services. When you're vertically scaling your primary node type, declare identical property values for `"nodeTypeRef"`. You can find these values in the Service Fabric extension for virtual machine scale sets. 

The following snippet of a Resource Manager template shows the properties you'll declare. It has the same value for the newly provisioned scale sets that you're scaling to, and it's supported only as a temporary stateful service for your cluster.

```json
"settings": {
   "nodeTypeRef": ["[parameters('primaryNodetypeName')]"]
}
```

> [!NOTE]
> Don't leave your cluster running with multiple scale sets that use the same `nodeTypeRef` property value longer than required to complete a successful vertical scaling operation.
>
> Always validate operations in test environments before you attempt changes to the production environment. By default, Service Fabric cluster system services have a placement constraint to only the target primary node type.

With the node properties and placement constraints declared, do the following steps one VM instance at a time. This allows the system services (and your stateful services) to be shut down gracefully on the VM instance you're removing as new replicas are created elsewhere.

1. From PowerShell, run `Disable-ServiceFabricNode` with intent `RemoveNode` to disable the node you’re going to remove. Remove the node type that has the highest number. For example, if you have a six-node cluster, remove the "MyNodeType_5" virtual machine instance.
2. Run `Get-ServiceFabricNode` to make sure that the node has transitioned to disabled. If not, wait until the node is disabled. This might take a couple hours for each node. Don't proceed until the node has transitioned to disabled.
3. Decrease the number of VMs by one in that node type. The highest VM instance will now be removed.
4. Repeat steps 1 through 3 as needed, but never scale in the number of instances in the primary node types less than what the reliability tier warrants. See [Planning the Service Fabric cluster capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) for a list of recommended instances.
5. Once all VMs are gone (represented as "Down") the fabric:/System/InfrastructureService/[node name] will show an Error state. Then, you can update the cluster resource to remove the node type. You can either use the ARM template deployment, or edit the cluster resource through the [Azure resource manager](https://resources.azure.com). This will start a cluster upgrade which will remove the fabric:/System/InfrastructureService/[node type] service that is in error state.
 6. After that you can optionally delete the VMScaleSet, you will still see the nodes as “Down” from Service Fabric Explorer view though. The last step would be to clean them up with `Remove-ServiceFabricNodeState` command.

## Horizontal scaling

You can do horizontal scaling either [manually](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-scale-in-out) or [programmatically](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-programmatic-scaling).

> [!NOTE]
> If you're scaling a node type that has Silver or Gold durability, scaling will be slow.

### Scaling out

Scale out a Service Fabric cluster by increasing the instance count for a particular virtual machine scale set. You can scale out programmatically by using `AzureClient` and the ID for the desired scale set to increase the capacity.

```csharp
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);
var newCapacity = (int)Math.Min(MaximumNodeCount, scaleSet.Capacity + 1);
scaleSet.Update().WithCapacity(newCapacity).Apply(); 
```

To scale out manually, update the capacity in the SKU property of the desired [virtual machine scale set](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) resource.

```json
"sku": {
    "name": "[parameters('vmNodeType0Size')]",
    "capacity": "[parameters('nt0InstanceCount')]",
    "tier": "Standard"
}
```

### Scaling in

Scaling in requires more consideration than scaling out. For example:

* Service Fabric system services run in the primary node type in your cluster. Never shut down or scale in the number of instances for that node type so that you have fewer instances than what the reliability tier warrants. 
* For a stateful service, you need a certain number of nodes that are always up to maintain availability and preserve the state of your service. At a minimum, you need a number of nodes equal to the target replica set count of the partition or service.

To scale in manually, follow these steps:

1. From PowerShell, run `Disable-ServiceFabricNode` with intent `RemoveNode` to disable the node you’re going to remove. Remove the node type that has the highest number. For example, if you have a six-node cluster, remove the "MyNodeType_5" virtual machine instance.
2. Run `Get-ServiceFabricNode` to make sure that the node has transitioned to disabled. If not, wait until the node is disabled. This might take a couple hours for each node. Don't proceed until the node has transitioned to disabled.
3. Decrease the number of VMs by one in that node type. The highest VM instance will now be removed.
4. Repeat steps 1 through 3 as needed until you provision the capacity you want. Don't scale in the number of instances in the primary node types to less than what the reliability tier warrants. See [Planning the Service Fabric cluster capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) for a list of recommended instances.

To scale in manually, update the capacity in the SKU property of the desired [virtual machine scale set](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) resource.

```json
"sku": {
    "name": "[parameters('vmNodeType0Size')]",
    "capacity": "[parameters('nt0InstanceCount')]",
    "tier": "Standard"
}
```

You must prepare the node for shutdown to scale in programmatically. Find the node to be removed (the highest-instance node). For example:

```csharp
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

Deactivate and remove the node by using the same `FabricClient` instance (`client` in this case) and node instance (`instanceIdString` in this case) that you used in the previous code:

```csharp
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);

// Remove the node from the Service Fabric cluster
ServiceEventSource.Current.ServiceMessage(Context, $"Disabling node {mostRecentLiveNode.NodeName}");
await client.ClusterManager.DeactivateNodeAsync(mostRecentLiveNode.NodeName, NodeDeactivationIntent.RemoveNode);

// Wait (up to a timeout) for the node to gracefully shut down
var timeout = TimeSpan.FromMinutes(5);
var waitStart = DateTime.Now;
while ((mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Up || mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Disabling) &&
        DateTime.Now - waitStart < timeout)
{
    mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync()).FirstOrDefault(n => n.NodeName == mostRecentLiveNode.NodeName);
    await Task.Delay(10 * 1000);
}

// Decrement virtual machine scale set capacity
var newCapacity = (int)Math.Max(MinimumNodeCount, scaleSet.Capacity - 1); // Check min count 

scaleSet.Update().WithCapacity(newCapacity).Apply();
```

> [!NOTE]
> When you scale in a cluster, you'll see the removed node/VM instance displayed in an unhealthy state in Service Fabric Explorer. For an explanation of this behavior, see [Behaviors you may observe in Service Fabric Explorer](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-scale-in-out#behaviors-you-may-observe-in-service-fabric-explorer). You can:
> * Call the [Remove-ServiceFabricNodeState command](https://docs.microsoft.com/powershell/module/servicefabric/remove-servicefabricnodestate?view=azureservicefabricps) with the appropriate node name.
> * Deploy the [Service Fabric autoscale helper application](https://github.com/Azure/service-fabric-autoscale-helper/) on your cluster. This application ensures that the scaled-down nodes are cleared from Service Fabric Explorer.

## Reliability levels

The [reliability level](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) is a property of your Service Fabric cluster resource. It can't be configured differently for individual node types. It controls the replication factor of the system services for the cluster, and is a setting at the cluster resource level. 

The reliability level will determine the minimum number of nodes that your primary node type must have. The reliability tier can take the following values:

* Platinum: Runs the system services with a target replica set count of seven and nine seed nodes.
* Gold: Runs the system services with a target replica set count of seven and seven seed nodes.
* Silver: Runs the system services with a target replica set count of five and five seed nodes.
* Bronze: Runs the system services with a target replica set count of three and three seed nodes.

The minimum recommended reliability level is Silver.

The reliability level is set in the properties section of the [Microsoft.ServiceFabric/clusters resource](https://docs.microsoft.com/azure/templates/microsoft.servicefabric/2018-02-01/clusters), like this:

```json
"properties":{
    "reliabilityLevel": "Silver"
}
```

## Durability levels

> [!WARNING]
> Node types running with Bronze durability obtain _no privileges_. Infrastructure jobs that affect your stateless workloads will not be stopped or delayed, which might affect your workloads. 
>
> Use Bronze durability only for node types that run stateless workloads. For production workloads, run Silver or higher to ensure state consistency. Choose the right reliability based on the guidance in the [capacity planning documentation](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity).

The durability level must be set in two resources. One is the extension profile of the [virtual machine scale set resource](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile):

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

The other resource is under `nodeTypes` in the [Microsoft.ServiceFabric/clusters resource](https://docs.microsoft.com/azure/templates/microsoft.servicefabric/2018-02-01/clusters): 

```json
"nodeTypes": [
    {
        "name": "[variables('vmNodeType0Name')]",
        "durabilityLevel": "Bronze"
    }
]
```

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md).
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md).
* Learn about [Service Fabric support options](service-fabric-support.md).

[Image1]: ./media/service-fabric-best-practices/generate-common-name-cert-portal.png
