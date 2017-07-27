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
ms.date: 07/28/2017
ms.author: masnider

---
# Service movement cost
A factor that the Service Fabric Cluster Resource Manager considers when trying to determine what changes to make to a cluster is the cost of those changes. The notion of "cost" is traded off against how much the cluster can be improved, based on the balancing, defragmentation, and other requirements that are configured.

Moving services costs CPU time and network bandwidth at a minimum. For stateful services, it requires copying the state of those services, consuming additional memory and disk. Clearly you’d want to minimize the cost of any solution that Azure Service Fabric Cluster Resource Manager comes up with, so that the cluster's resources aren't all spent starting and stopping services and copying binaries and state around. But you also don’t want to ignore solutions that would significantly improve the allocation of resources in the cluster.

The Cluster Resource Manager has two ways of computing costs and limiting them while it tries to manage the cluster. The first mechanism is simply counting every move that it would make. If two solutions are generated with about the same balance (score), then the Cluster Resource Manager prefers the one with the lowest cost (total number of moves).

This strategy works well. But as with default or static loads, it's unlikely in any complex system that all moves are equal. Some are likely to be much more expensive.

## Setting Move Costs 
As with reporting load (another feature of Cluster Resource Manager), the default move cost for a service can also be set when it is created. 

Specifying Move Cost when Creating Services:

PowerShell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -DefaultMoveCost Medium
```

C# 

```
FabricClient fabricClient = new FabricClient();
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
//set up the rest of the ServiceDescription
serviceDescription.DefaultMoveCost = MoveCost.Medium;
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

As with most things that you can specify when creating a service, MoveCost can also be dynamically updated for the whole service after the service has been created, both through Powershell and C#:

PowerShell: 

```posh
Update-ServiceFabricService -Stateful -ServiceName "fabric:/AppName/ServiceName" -DefaultMoveCost High
```

C# :
```
StatefulServiceUpdateDescription updateDescription = new StatefulServiceUpdateDescription();
updateDescription.DefaultMoveCost = MoveCost.High;
await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/AppName/ServiceName"), updateDescription);
```

## Dynamically specifying move cost on a per-replica basis

The above snippets are all for specifying MoveCost for a whole service at once from outside the service itself. However, a lot of the cases where move cost is useful is when the move cost of specific stateful replicas (or stateless service instances) change at different rates over the lifecycle of the services. Since the services themselves probably have the best idea of how costly they are to move a given time, there's an API for services to report thier own individual move cost during runtime. 

C#

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
- The cost of disconnection of clients. The cost of moving a primary replica is usually higher than the cost of moving a secondary replica.
- The cost of interrupting an in-flight operation. Some operations at the data store level or operations performed in response to a client call are costly. After a certain point, you don’t want to stop them if you don’t have to. So while the operation is going on, you increase the move cost of this service object to reduce the likelihood that it moves. When the operation is done, you set the cost back to normal.

## Enabling move cost in your cluster
In order for the more granular MoveCosts to be taken into account, MoveCost must be enabled in your cluster. Without this setting, the default mode of just counting the number of moves being enacted.


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
