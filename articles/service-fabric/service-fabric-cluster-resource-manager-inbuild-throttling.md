---
title: InBuild throttling
description: Configure, understand, and apply InBuild Throttling constraint.
ms.topic: conceptual
ms.author: vladelekic
author: vladelekic
ms.service: service-fabric
services: service-fabric
ms.date: 02/28/2024
---

# Throttling InBuild Replicas per Node

Replicas of stateful services transition through several phases during their lifecycle: InBuild, Ready, Closing, and Dropped states. Only replicas in Ready and Closing states can declare either default or dynamic load. Replicas in the Dropped state are irrelevant in terms of resource utilization. The resource utilization of InBuild (IB) replicas is specific, so the Cluster Resource Manager provides more support for handling that utilization. Since IB replicas can't report dynamic load, and their resource utilization might be higher than resource utilization of less utilized replicas in Ready state, especially for I/O and memory-related metrics, the CRM allows limiting the number of concurrent builds per node.

The CRM provides support for limiting the number of IB replicas per node. Limits can be defined in two ways:
* Per node type
* For all nodes that satisfy placement constraint

Depending on the constraint priority, according to general rules about constraint prioritization, the CRM halts movements and creations of replicas on a node if the actions violate the defined IB limit for that node. The constraint blocks only operations that could cause high I/O and memory consumption during the InBuild phase, especially when extensively replicating context from other active replicas.

Movements of any kind and promotion of StandBy replicas are restricted operations that cause state replication and extensive resource utilization during the InBuild phase. On the other hand, the promotion of an active Secondary replica to Primary replica isn't a problematic operation, so the constraint blocks such operations. During the promotion of a Secondary replica, the state of the replica is up-to-date with the Primary replica, eliminating the need for extra replication.   

> [!NOTE]
> The promotion of StandBy replicas could be blocked due to InBuild replicas per node throttling. The transition from StandBy to Ready replicas could cause extensive I/O and memory utilization, depending on the amount of context that needs to be replicated from active replicas. Thus, ignoring promotions of StandBy replicas could cause issues that the InBuild replicas per node throttling constraint aims to resolve.   
>

## Configuring the InBuild Replicas per Node Throttling

### Enable InBuild Replicas per Node Throttling for Action

There are three different categories of actions that the Cluster Resource Manager performs:

* _Placement_: Controls placement of missing replicas, orchestrates swaps during upgrades, and removal of extra replicas.
* _Constraint Check_: Enforces rules.
* _Balancing_: Performs actions that reduce the imbalance of total node utilization in a cluster.

The Cluster Resource Manager allows enabling/disabling throttling of IB replicas per node for each category. Configurations that control whether throttling is active for specific actions are *ThrottlePlacementPhase*, *ThrottleConstraintCheckPhase*, and *ThrottleBalancingPhase*, respectively. The value specified for these configurations is boolean. The cluster manifest section that explicitly defines these configurations is provided:

```xml
<Section Name="PlacementAndLoadBalancing">
    <Parameter Name="ThrottlePlacementPhase" Value="true">
    <Parameter Name="ThrottleConstraintCheckPhase" Value="true">
    <Parameter Name="ThrottleBalancingPhase" Value="true">
</Section>
```

Here's an example of configurations that enable IB replicas throttling per node, defined via ClusterConfig.json for standalone deployments or Template.json for Azure-hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "ThrottlePlacementPhase",
          "value": "true"
      },
      {
          "name": "ThrottleConstraintCheckPhase",
          "value": "true"
      },
      {
          "name": "ThrottleBalancingPhase",
          "value": "true"
      }
    ]
  }
]
```

### Configure InBuild Replicas per Node Limits

The Cluster Resource Manager allows defining IB limits globally and for each category of actions:

* MaximumInBuildReplicasPerNode: Defines IB limits globally. These limits are used to evaluate the final IB limit for each category.
* MaximumInBuildReplicasPerNodePlacementThrottle: Defines IB limits for the placement category. These limits are used to evaluate the final IB limit only for the placement category.
* MaximumInBuildReplicasPerNodeConstraintCheckThrottle: Defines IB limits for the constraint check category. These limits are used to evaluate the final IB limit only for the constraint check category.
* MaximumInBuildReplicasPerNodeBalancingThrottle: Defines IB limits for the balancing category. These limits are used to evaluate the final IB limit only for the balancing category.

For each option, the Cluster Resource Manager provides two options for defining the limit of IB replicas:

* Define IB limit for all nodes in a single node type.
* Define IB limit for all nodes with a matching placement constraint.

These rules allow you to define multiple values for a single category, and the CRM always respects the most strict limit that you provided. The limit for each node in a specific phase is the lowest value according to node type or any placement property that corresponds to that node, for both global limits and category limits. If the limit for an action category for a specific node isn't defined, the CRM assumes that there's no upper IB replica count for a node.

The cluster manifest sections that explicitly define limits for each phase are provided:

```xml
<Section Name="MaximumInBuildReplicasPerNode">
    <Parameter Name="NodeTypeA" Value="10" />
    <Parameter Name="NodeTypeB" Value="20" />
    <Parameter Name="NodeTypeName == NodeTypeA || NodeTypeName == NodeTypeC" Value="15" />
</Section>

<Section Name="MaximumInBuildReplicasPerNodePlacementThrottle">
    <Parameter Name="NodeTypeC" Value="20" />
</Section>

<Section Name="MaximumInBuildReplicasPerNodeConstraintCheckThrottle">
    <Parameter Name="NodeTypeD" Value="10" />
    <Parameter Name="Color == Blue" Value="8" />
</Section>

<Section Name="MaximumInBuildReplicasPerNodeBalancingThrottle">
    <Parameter Name="Color == Red" Value="25" />
</Section>
```

Here's an example of the same IB limits defined via ClusterConfig.json for standalone deployments or Template.json for Azure-hosted clusters:

```json
"fabricSettings": [
  {
    "name": "MaximumInBuildReplicasPerNode",
    "parameters": [
      {
          "name": "NodeTypeA",
          "value": "10"
      },
      {
          "name": "NodeTypeB",
          "value": "20"
      },
      {
          "name": "NodeTypeName == NodeTypeA || NodeTypeName == NodeTypeC",
          "value": "15"
      }
    ]
  },
  {
    "name": "MaximumInBuildReplicasPerNodePlacementThrottle",
    "parameters": [
      {
          "name": "NodeTypeC",
          "value": "20"
      }
    ]
  },
  {
    "name": "MaximumInBuildReplicasPerNodeConstraintCheckThrottle",
    "parameters": [
      {
          "name": "NodeTypeD",
          "value": "10"
      },
      {
          "name": "Color == Blue",
          "value": "8"
      }
    ]
  },
  {
    "name": "MaximumInBuildReplicasPerNodeBalancingThrottle",
    "parameters": [
      {
          "name": "Color == Red",
          "value": "25"
      }
    ]
  }
]
```

## Next Steps
- For more information about replica states, check out the article on [replica lifecycle](service-fabric-concepts-replica-lifecycle.md)
- For more information about balancing and other action categories, check out the article on [balancing action](service-fabric-cluster-resource-manager-balancing.md) 