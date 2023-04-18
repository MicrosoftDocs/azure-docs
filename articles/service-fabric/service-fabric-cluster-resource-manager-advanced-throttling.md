---
title: Throttling in the Service Fabric cluster resource manager 
description: Learn to configure the throttles provided by the Service Fabric Cluster Resource Manager.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Throttling the Service Fabric Cluster Resource Manager
Even if you’ve configured the Cluster Resource Manager correctly, the cluster can get disrupted. For example, there could be simultaneous node and fault domain failures - what would happen if that occurred during an upgrade? The Cluster Resource Manager always tries to fix everything, consuming the cluster's resources trying to reorganize and fix the cluster. Throttles help provide a backstop so that the cluster can use resources to stabilize - the nodes come back, the network partitions heal, corrected bits get deployed.

To help with these sorts of situations, the Service Fabric Cluster Resource Manager includes several throttles. These throttles are all fairly large hammers. Generally they shouldn’t be changed without careful planning and testing.

If you change the Cluster Resource Manager's throttles, you should tune them to your expected actual load. You may determine you need to have some throttles in place, even if it means the cluster takes longer to stabilize in some situations. Testing is required to determine the correct values for throttles. Throttles need to be high enough to allow the cluster to respond to changes in a reasonable amount of time, and low enough to actually prevent too much resource consumption. 

Most of the time we’ve seen customers use throttles it has been because they were already in a resource constrained environment. Some examples would be limited network bandwidth for individual nodes, or disks that aren't able to build many stateful replicas in parallel due to throughput limitations. Without throttles, operations could overwhelm these resources, causing operations to fail or be slow. In these situations customers used throttles and knew they were extending the amount of time it would take the cluster to reach a stable state. Customers also understood they could end up running at lower overall reliability while they were throttled.


## Configuring the throttles

Service Fabric has two mechanisms for throttling the number of replica movements. The default mechanism that existed before Service Fabric 5.7 represents throttling as an absolute number of moves allowed. This does not work for clusters of all sizes. In particular, for large clusters the default value can be too small, significantly slowing down balancing even when it is necessary, while having no effect in smaller clusters. This prior mechanism has been superseded by percentage-based throttling, which scales better with dynamic clusters in which the number of services and nodes change regularly.

The throttles are based on a percentage of the number of replicas in the clusters. Percentage based throttles enable expressing the rule: "do not move more than 10% of replicas in a 10 minute interval", for example.

The configuration settings for percentage-based throttling are:

  - GlobalMovementThrottleThresholdPercentage - Maximum number of movements allowed in cluster at any time, expressed as percentage of total number of replicas in the cluster. 0 indicates no limit. The default value is 0. If both this setting and GlobalMovementThrottleThreshold are specified, then the more conservative limit is used.
  - GlobalMovementThrottleThresholdPercentageForPlacement - Maximum number of movements allowed during the placement phase, expressed as percentage of total number of replicas in the cluster. 0 indicates no limit. The default value is 0. If both this setting and GlobalMovementThrottleThresholdForPlacement are specified, then the more conservative limit is used.
  - GlobalMovementThrottleThresholdPercentageForBalancing - Maximum number of movements allowed during the balancing phase, expressed as percentage of total number of replicas in the cluster. 0 indicates no limit. The default value is 0. If both this setting and GlobalMovementThrottleThresholdForBalancing are specified, then the more conservative limit is used.

When specifying the throttle percentage, you'd specify 5% as 0.05. The interval on which these throttles are governed is the GlobalMovementThrottleCountingInterval, which is specified in seconds.


``` xml
<Section Name="PlacementAndLoadBalancing">
     <Parameter Name="GlobalMovementThrottleThresholdPercentage" Value="0" />
     <Parameter Name="GlobalMovementThrottleThresholdPercentageForPlacement" Value="0" />
     <Parameter Name="GlobalMovementThrottleThresholdPercentageForBalancing" Value="0" />
     <Parameter Name="GlobalMovementThrottleCountingInterval" Value="600" />
</Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "GlobalMovementThrottleThresholdPercentage",
          "value": "0.0"
      },
      {
          "name": "GlobalMovementThrottleThresholdPercentageForPlacement",
          "value": "0.0"
      },
      {
          "name": "GlobalMovementThrottleThresholdPercentageForBalancing",
          "value": "0.0"
      },
      {
          "name": "GlobalMovementThrottleCountingInterval",
          "value": "600"
      }
    ]
  }
]
```

### Default count based throttles
This information is provided in case you have older clusters or still retain these configurations in clusters that have since been upgraded. In general, it is recommended that these are replaced with the percentage-based throttles above. Since percentage-based throttling is disabled by default, these throttles remain the default throttles for a cluster until they are disabled and replaced with the percentage-based throttles. 

  - GlobalMovementThrottleThreshold – this setting controls the total number of movements in the cluster over some time. The amount of time is specified in seconds as the GlobalMovementThrottleCountingInterval. The default value for the GlobalMovementThrottleThreshold is 1000 and the default value for the GlobalMovementThrottleCountingInterval is 600.
  - MovementPerPartitionThrottleThreshold – this setting controls the total number of movements for any service partition over some time. The amount of time is specified in seconds as the MovementPerPartitionThrottleCountingInterval. The default value for the MovementPerPartitionThrottleThreshold is 50 and the default value for the MovementPerPartitionThrottleCountingInterval is 600.

The configuration for these throttles follows the same pattern as the percentage-based throttling.

## Next steps
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
- The Cluster Resource Manager has many options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
