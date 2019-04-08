---
title: 'Service Fabric Cluster Resource Manager: Movement cost | Microsoft Docs'
description: Overview of movement cost for Service Fabric services
services: service-fabric
documentationcenter: .net
author: masnider
manager: chackdan
editor: ''

ms.assetid: f022f258-7bc0-4db4-aa85-8c6c8344da32
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider

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

The preceding snippets are all for specifying MoveCost for a whole service at once from outside the service itself. However, move cost is most useful is when the move cost of a specific service object changes over its lifespan. Since the services themselves probably have the best idea of how costly they are to move a given time, there's an API for services to report their own individual move cost during runtime. 

C#:

```csharp
this.Partition.ReportMoveCost(MoveCost.Medium);
```

## Impact of move cost
MoveCost has four levels: Zero, Low, Medium, and High. MoveCosts are relative to each other, except for Zero. Zero move cost means that movement is free and should not count against the score of the solution. Setting your move cost to High does *not* guarantee that the replica stays in one place.

<center>

![Move cost as a factor in selecting replicas for movement][Image1]
</center>

MoveCost helps you find the solutions that cause the least disruption overall and are easiest to achieve while still arriving at equivalent balance. A service’s notion of cost can be relative to many things. The most common factors in calculating your move cost are:

- The amount of state or data that the service has to move.
- The cost of disconnection of clients. Moving a primary replica is usually more costly than the cost of moving a secondary replica.
- The cost of interrupting an in-flight operation. Some operations at the data store level or operations performed in response to a client call are costly. After a certain point, you don’t want to stop them if you don’t have to. So while the operation is going on, you increase the move cost of this service object to reduce the likelihood that it moves. When the operation is done, you set the cost back to normal.

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
