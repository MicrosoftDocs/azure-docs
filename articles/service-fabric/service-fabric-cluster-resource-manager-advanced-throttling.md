---
title: Throttling in the Service Fabric cluster resource manager | Microsoft Docs
description: Learn to configure the throttles provided by the Service Fabric Cluster Resource Manager.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 4a44678b-a5aa-4d30-958f-dc4332ebfb63
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---

# Throttling the behavior of the Service Fabric Cluster Resource Manager
Even if you’ve configured the Cluster Resource Manager correctly, the cluster can get disrupted. For example, there could be simultaneous node or fault domain failures - what would happen if that occurred during an upgrade? The Cluster Resource Manager tries to fix everything, but this can introduce churn in the cluster. Throttles help provide a backstop so that the cluster can use resources to stabilize itself - the nodes come back, the network partitions heal, corrected bits get deployed.

To help with these sorts of situations, the Service Fabric Cluster Resource Manager includes several throttles. These throttles are fairly large hammers. These settings shouldn’t be changed from the defaults unless there’s been some careful math done around the amount of work that the cluster can do in parallel.

The throttles have default values that the Service Fabric team has found through experience to be ok defaults. If you need to change them you should tune them to your expected actual load. You may determine you need to have some throttles in place, even if it means the cluster takes longer to stabilize in mainline situations.

## Configuring the throttles
The throttles that are included by default are:

* GlobalMovementThrottleThreshold – this setting controls the total number of movements in the cluster over some time (defined as the GlobalMovementThrottleCountingInterval, value in seconds)
* MovementPerPartitionThrottleThreshold – this setting controls the total number of movements for any service partition over some time (the MovementPerPartitionThrottleCountingInterval, value in seconds)

``` xml
<Section Name="PlacementAndLoadBalancing">
     <Parameter Name="GlobalMovementThrottleThreshold" Value="1000" />
     <Parameter Name="GlobalMovementThrottleCountingInterval" Value="600" />
     <Parameter Name="MovementPerPartitionThrottleThreshold" Value="50" />
     <Parameter Name="MovementPerPartitionThrottleCountingInterval" Value="600" />
</Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "GlobalMovementThrottleThreshold",
          "value": "1000"
      },
      {
          "name": "GlobalMovementThrottleCountingInterval",
          "value": "600"
      },
      {
          "name": "MovementPerPartitionThrottleThreshold",
          "value": "50"
      },
      {
          "name": "MovementPerPartitionThrottleCountingInterval",
          "value": "600"
      }
    ]
  }
]
```

Most of the time we’ve seen customers use these throttles it has been because they were already in a resource constrained environment. Some examples of that environment would be limited network bandwidth into individual nodes, or disks that aren't able to build many replicas in parallel due to throughput limitations. These types of restrictions meant that operations triggered in response to failures wouldn’t succeed or would be slow, even without the throttles. In these situations customers knew they were extending the amount of time it would take the cluster to reach a stable state. Customers also understood they could end up running at lower overall reliability while they were throttled.

## Next steps
* To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
* The Cluster Resource Manager has many options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
