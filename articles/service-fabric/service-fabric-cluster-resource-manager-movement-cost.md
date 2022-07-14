---
title: 'Service Fabric Cluster Resource Manager: Movement cost'
description: Learn about the movement cost for Service Fabric services, and how it can be specified to fit any architectural need, including dynamic configuration.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Service movement cost
A factor that the Service Fabric Cluster Resource Manager considers when trying to determine what changes to make to a cluster is the cost of those changes. The notion of "cost" is traded off against how much the cluster can be improved. Cost is factored in when moving services for balancing, defragmentation, and other requirements. The goal is to meet the requirements in the least disruptive or expensive way.

Moving services costs CPU time and network bandwidth at a minimum. For stateful services, it requires copying the state of those services, consuming additional memory and disk. Minimizing the cost of solutions that the Azure Service Fabric Cluster Resource Manager comes up with helps ensure that the cluster's resources aren't spent unnecessarily. However, you also don’t want to ignore solutions that would significantly improve the allocation of resources in the cluster.

The Cluster Resource Manager has two ways of computing costs and limiting them while it tries to manage the cluster. The first mechanism is simply counting every move that it would make. If two solutions are generated with about the same balance (score), then the Cluster Resource Manager prefers the one with the lowest cost (total number of moves).

This strategy works well. But as with default or static loads, it's unlikely in any complex system that all moves are equal. Some are likely to be much more expensive.

## Setting Move Costs 
You can specify the default move cost for a service when it is created:

PowerShell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -DefaultMoveCost Medium
```

C#: 

```csharp
FabricClient fabricClient = new FabricClient();
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
//set up the rest of the ServiceDescription
serviceDescription.DefaultMoveCost = MoveCost.Medium;
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

You can also specify or update MoveCost dynamically for a service after the service has been created: 

PowerShell: 

```posh
Update-ServiceFabricService -Stateful -ServiceName "fabric:/AppName/ServiceName" -DefaultMoveCost High
```

C#:

```csharp
StatefulServiceUpdateDescription updateDescription = new StatefulServiceUpdateDescription();
updateDescription.DefaultMoveCost = MoveCost.High;
await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/AppName/ServiceName"), updateDescription);
```

## Dynamically specifying move cost on a per-replica basis

The preceding snippets are all for specifying MoveCost for a whole service at once from outside the service itself. However, move cost is most useful when the move cost of a specific service object changes over its lifespan. Since the services themselves probably have the best idea of how costly they are to move a given time, there's an API for services to report their own individual move cost during runtime.

C#:

```csharp
this.Partition.ReportMoveCost(MoveCost.Medium);
```

> [!NOTE]
> You can only set the movement cost for secondary replicas through code.

## Reporting move cost for a partition

The previous section describes how service replicas or instances report MoveCost themselves. We provided Service Fabric API for reporting MoveCost values on behalf of other partitions. Sometimes service replica or instance can't determine the best MoveCost value by itself, and must rely on other services logic. Reporting MoveCost on behalf of other partitions, alongside [reporting load on behalf of other partitions](service-fabric-cluster-resource-manager-metrics.md#reporting-load-for-a-partition), allows you to completely manage partitions from outside. These APIs eliminate needs for [the Sidecar pattern](/azure/architecture/patterns/sidecar), from the perspective of the Cluster Resource Manager.

You can report MoveCost updates for a different partition with the same API call. You need to specify PartitionMoveCostDescription object for each partition that you want to update with new values of MoveCost. The API allows multiple ways to update MoveCost:

  - A stateful service partition can update its primary replica MoveCost.
  - Both stateless and stateful services can update the MoveCost of all its secondary replicas or instances.
  - Both stateless and stateful services can update the MoveCost of a specific replica or instance on a node.

Each MoveCost update for partition should contain at least one valid value that will be changed. For example, you could skip primary replica update with assigning _null_ to primary replica entry, other entries will be used during MoveCost update and we will skip MoveCost update for primary replica. Since updating of MoveCost for multiple partitions with single API call is possible, API provides a list of return codes for corresponding partition. If we successfully accept and process a request for MoveCost update, return code will be Success. Otherwise, API provides error code: 

  - PartitionNotFound - Specified partition ID doesn't exist.
  - ReconfigurationPending - Partition is currently reconfiguring.
  - InvalidForStatelessServices - An attempt was made to change the MoveCost of a primary replica for a partition belonging to a stateless service.
  - ReplicaDoesNotExist - Secondary replica or instance does not exist on a specified node.
  - InvalidOperation - Updating MoveCost for a partition that belongs to the System application.

C#:

```csharp
Guid partitionId = Guid.Parse("53df3d7f-5471-403b-b736-bde6ad584f42");
string nodeName0 = "NodeName0";

OperationResult<UpdatePartitionMoveCostResultList> updatePartitionMoveCostResults =
    await this.FabricClient.UpdatePartitionMoveCostAsync(
        new UpdatePartitionMoveCostQueryDescription
        {
            new List<PartitionMoveCostDescription>()
            {
                new PartitionMoveCostDescription(
                    partitionId,
                    MoveCost.VeryHigh,
                    MoveCost.Zero,
                    new List<ReplicaMoveCostDescription>()
                    {
                        new ReplicaMoveCostDescription(nodeName0, MoveCost.Medium)
                    })
            }
        },
        this.Timeout,
        cancellationToken);
```

With this example, you will perform an update of the last reported move cost for a partition _53df3d7f-5471-403b-b736-bde6ad584f42_. Primary replica move cost will be _VeryHigh_. All secondary replicas move cost will be _Zero_, except move cost for a specific secondary replica located at the node _NodeName0_. Move cost for a specific replica will be _Medium_. If you want to skip updating move cost for primary replica or all secondary replicas, you could leave corresponding entry as _null_.

## Impact of move cost
MoveCost has five levels: Zero, Low, Medium, High and VeryHigh. The following rules apply:

* MoveCosts are relative to each other, except for Zero and VeryHigh. 
* Zero move cost means that movement is free and should not count against the score of the solution.
* Setting your move cost to High or VeryHigh does *not* provide a guarantee that the replica will *never* be moved.
* Replicas with VeryHigh move cost will be moved only if there is a constraint violation in the cluster that cannot be fixed in any other way (even if it requires moving many other replicas to fix the violation)



<center>

![Move cost as a factor in selecting replicas for movement][Image1]
</center>

MoveCost helps you find the solutions that cause the least disruption overall and are easiest to achieve while still arriving at equivalent balance. A service’s notion of cost can be relative to many things. The most common factors in calculating your move cost are:

- The amount of state or data that the service has to move.
- The cost of disconnection of clients. Moving a primary replica is usually more costly than the cost of moving a secondary replica.
- The cost of interrupting an in-flight operation. Some operations at the data store level or operations performed in response to a client call are costly. After a certain point, you don’t want to stop them if you don’t have to. So while the operation is going on, you increase the move cost of this service object to reduce the likelihood that it moves. When the operation is done, you set the cost back to normal.

> [!IMPORTANT]
> Using the VeryHigh move cost should be carefully considered as it significantly restricts the ability of Cluster Resource Manager to find a globally-optimal placement solution in the cluster. Replicas with VeryHigh move cost will be moved only if there is a constraint violation in the cluster that cannot be fixed in any other way (even if it requires moving many other replicas to fix the violation)

## Enabling move cost in your cluster
In order for the more granular MoveCosts to be taken into account, MoveCost must be enabled in your cluster. Without this setting, the default mode of counting moves is used for calculating MoveCost, and MoveCost reports are ignored.


ClusterManifest.xml:

``` xml
        <Section Name="PlacementAndLoadBalancing">
            <Parameter Name="UseMoveCostReports" Value="true" />
        </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "UseMoveCostReports",
          "value": "true"
      }
    ]
  }
]
```

## Next steps
- Service Fabric Cluster Resource Manger uses metrics to manage consumption and capacity in the cluster. To learn more about metrics and how to configure them, check out [Managing resource consumption and load in Service Fabric with metrics](service-fabric-cluster-resource-manager-metrics.md).
- To learn about how the Cluster Resource Manager manages and balances load in the cluster, check out [Balancing your Service Fabric cluster](service-fabric-cluster-resource-manager-balancing.md).

[Image1]:./media/service-fabric-cluster-resource-manager-movement-cost/service-most-cost-example.png