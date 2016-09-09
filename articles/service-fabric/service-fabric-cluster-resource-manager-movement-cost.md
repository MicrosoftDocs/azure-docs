<properties
   pageTitle="Service Fabric Cluster Resource Manager - Movement Cost | Microsoft Azure"
   description="Overview of Movement Cost for Service Fabric Services"
   services="service-fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/20/2016"
   ms.author="masnider"/>

# Service movement cost for influencing Resource Manager choices
Another important factor that we take into consideration when trying to determine what changes to make to a cluster and the score of a given solution is the overall Cost of achieving that solution.

Moving service instances or replicas around costs CPU time and network bandwidth at a minimum, and for stateful services it also costs the amount of space on disk that you need to create a copy of the state before shutting down old replicas. Clearly you’d want to minimize the cost of any solution that the Resource Manager comes up with, but you also don’t want to ignore solutions that would significantly improve the allocation of resources in the cluster.

The Service Fabric Resource Manager has two ways of computing costs and limiting them. The first is that when the Resource Manager is planning a new layout for the cluster, it counts every single move that it would make. In a simple case if you get two solutions with about the same overall balance (score) at the end, then take the one with the lowest cost (total number of moves).
This works pretty well, until we run into the same problem we had with default or static loads – it is unlikely that in any complex system that all moves are equal; some are likely to be much more expensive.

## Changing a replica's move cost and factors to consider
Just like when reporting load (another feature of the Cluster Resource Manager), we give the service a way of self-reporting how costly the service is to move at any given time.

Code

```csharp
this.ServicePartition.ReportMoveCost(MoveCost.Medium);
```

MoveCost has four levels, Zero, Low, Medium, and High. Again – these are just relative to each other, except for Zero which means that moving a replica is free and should not count against the score of the solution. Setting your move cost to High is *not* a guarantee that the replica won’t move, just that we won’t move it unless there’s a good reason to.

![Move Cost as a Factor in Selecting Replicas for Movement][Image1]

Move Cost helps us find the solutions that cause overall the least disruption while achieving equivalent balance. A service’s notion of cost can be relative to many things, but the most common factors in calculating your move cost are:

1.	The amount of state or data that the service has to move
2.	The cost of disconnection of clients (so the cost of moving a Primary replica would be higher than the cost of moving a Secondary replica)
3.	The cost of interrupting some in-flight operation (some data store level operations are costly and after a certain point you don’t want to have to abort them if you don’t have to). So for the duration of the operation you bump up the cost to reduce the likelihood that the service replica or instance moves, and then when the operation is done you put it back to normal.

## Next steps
- Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about them and how to configure them check out [this article](service-fabric-cluster-resource-manager-metrics.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)

[Image1]:./media/service-fabric-cluster-resource-manager-movement-cost/service-most-cost-example.png
