---
title: 'Service Fabric Cluster Resource Manager: Movement cost | Microsoft Docs'
description: Overview of movement cost for Service Fabric services
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: f022f258-7bc0-4db4-aa85-8c6c8344da32
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---
# Service movement cost for influencing Cluster Resource Manager choices
An important factor that the Service Fabric Cluster Resource Manager considers when trying to determine what changes to make to a cluster is the overall cost of achieving that solution. The notion of "cost" is traded off against the amount of balance that can be achieved.

Moving service instances or replicas costs CPU time and network bandwidth at a minimum. For stateful services, it also costs the amount of space on disk and in memory that you need to create a copy of the state before shutting down old replicas. Clearly you’d want to minimize the cost of any solution that Azure Service Fabric Cluster Resource Manager comes up with. But you also don’t want to ignore solutions that would significantly improve the allocation of resources in the cluster.

The Cluster Resource Manager has two ways of computing costs and limiting them, even while it tries to manage the cluster according to its other goals. The first is that when Cluster Resource Manager is planning a new layout for the cluster, it counts every move that it would make. If two solutions are generated with about the same balance (score), then prefer the one with the lowest cost (total number of moves).

This strategy works well. But as with default or static loads, it's unlikely in any complex system that all moves are equal. Some are likely to be much more expensive.

## Changing a replica's move cost and factors to consider
As with reporting load (another feature of Cluster Resource Manager), services can dynamically self-report how costly it is to move at any time.

Code:

```csharp
this.ServicePartition.ReportMoveCost(MoveCost.Medium);
```

A default move cost can also be specified when a service is created.

MoveCost has four levels: Zero, Low, Medium, and High. MoveCosts are relative to each other, except for Zero. Zero move cost means that movement is free and should not count against the score of the solution. Setting your move cost to High does *not* guarantee that the replica stays in one place.

<center>
![Move cost as a factor in selecting replicas for movement][Image1]
</center>

MoveCost helps you find the solutions that cause the least disruption overall and are easiest to achieve while still arriving at equivalent balance. A service’s notion of cost can be relative to many things. The most common factors in calculating your move cost are:

* The amount of state or data that the service has to move.
* The cost of disconnection of clients. The cost of moving a primary replica is usually higher than the cost of moving a secondary replica.
* The cost of interrupting an in-flight operation. Some operations at the data store level or operations performed in response to a client call are costly. After a certain point, you don’t want to stop them if you don’t have to. So while the operation is going on, you increase the move cost of this service object to reduce the likelihood that it moves. When the operation is done, you set the cost back to normal.

## Next steps
* Service Fabric Cluster Resource Manger uses metrics to manage consumption and capacity in the cluster. To learn more about metrics and how to configure them, check out [Managing resource consumption and load in Service Fabric with metrics](service-fabric-cluster-resource-manager-metrics.md).
* To learn about how the Cluster Resource Manager manages and balances load in the cluster, check out [Balancing your Service Fabric cluster](service-fabric-cluster-resource-manager-balancing.md).

[Image1]:./media/service-fabric-cluster-resource-manager-movement-cost/service-most-cost-example.png
