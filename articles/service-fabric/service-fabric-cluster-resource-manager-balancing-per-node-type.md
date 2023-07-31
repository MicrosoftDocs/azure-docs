---
title: Balancing per node type
description: An introduction to balancing per node type with the Service Fabric Cluster Resource Manager. 
author: vladelekic

ms.topic: conceptual
ms.date: 07/21/2023
ms.author: vladelekic
---
# Balancing of a cluster per node type

## Prerequisites

* Learn more about [balancing of a cluster with the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-balancing.md)
* Learn more about [balancing of a subclustered cluster with the Service Fabric Cluster Resource Manager](cluster-resource-manager-subclustering.md)

## Introduction

The Service Fabric Cluster Resource Manager provides capability of balancing a cluster. The global balancing of a cluster contains two phases:
1. The first phase is imbalance detection in a cluster. The Service Fabric Cluster Resource Manager provides two mechanisms, activity metric threshold and balancing metric threshold. If maximum global load of a cluster is above defined activity metric threshold, the activity threshold criteria is violated. If division of maximum and minimum global load is above defined balancing metric threshold, the balancing threshold criteria is violated. The both of these criteria needs to be violated to declare a cluster as imbalanced.
2. The second phase is actual balancing actions in a cluster through movement of replicas. During global balancing, all replicas are eligible for movements regardless of a current node location, service and node properties.

Additionally, the Service Fabric Cluster Resource Manager provides support for collocation of services to a particular set of nodes. For more details regarding placement constraints please check [here](service-fabric-cluster-resource-manager-configure-services#placement-constraints). Placement constraints represent base for allowing multitenant architecture from the Service Fabric Cluster Resource Manager perspective:

| Phase | Does support multitenancy | Explanation |
| --- | --- | --- |
| Placement | Yes | Services are placed on nodes with corresponding placement properties. |
| Upgrade | Yes | Replicas and instances could be created only on nodes with corresponding properties. |
| Constraint Check | Yes | Replicas could be moved only if these actions resolve constraint violation. Only replicas from affected node types (with corresponding placement properties) could be moved. |
| Balancing | No | Global balancing doesn't support multitenancy since all replicas could be moved due to imbalance of a cluster, regardless of placement properties. |

Full multitenant support on the Service Fabric Cluster Resource Manager side requires balancing algorithm per node type and fine-grained configuration of balancing per node type. Node types have different logical and hardware properties and workloads that are running upon them have different requirements. The main goals of balancing per node type are:
1. Separating balancing phase per node type and providing full multitenancy support.
2. Providing fine-grained configuration per node type.

## How balancing per node type affects a cluster

During balancing of a cluster per node type, the Service Fabric Cluster Resource Manager calculates the imbalance state for each node type. If at least one node type is imbalanced, the balancing phase will be triggered. Balancing phase will not move replicas on node types that are imbalanced, when balancing is temporarily paused on these node types (e.g. minimal balancing interval hasn't passed since a previous balancing phase). The detection of an imbalanced state uses common mechanisms already available for classical cluster balancing, but improves configuration granularity and flexibility. The mechanisms uses for balancing per node type to detect imbalance are provided in the list below:
- **Metric balancing thresholds** per node type are values that have a similar role as the globally-defined balancing threshold used in classical balancing. The ratio of minimum and maximum metric load is calculated for each node type. If that ratio of a node type is higher than the defined balancing threshold of the node type, the node type is marked as imbalanced. For more details regarding configuration of metric activity thresholds per node type, please check [here](service-fabric-cluster-resource-manager-balancing-per-node-type#balancing-thresholds-per-node-type).
- **Metric activity thresholds** per node type are values that have a similar role to the globally-defined activity threshold used in classical balancing. The maximum metric load is calculated for each node type. If the maximum load of a node type is higher than the defined activity threshold for that node type, the node type is marked as imbalanced. For more details regarding configuration of metric activity thresholds per node type, please check [here](service-fabric-cluster-resource-manager-balancing-per-node-type#activity-thresholds-per-node-type).
- **Minimum balancing interval** per node type has a role similar to the globally-define minimum balancing interval. For each node type, the Cluster Resource Manager preserves the timestamp of the last balancing. Two consecutive balancing phases couldn't be executed on a node type within the defined minimum balancing interval. For more details regarding configuration of minimum balancing interval per node type, please check [here](service-fabric-cluster-resource-manager-balancing-per-node-type.md#minimum-balancing-interval-per-node-type).

## Describing balancing per node type

In order to enable balancing per node type, parameter SeparateBalancingStrategyPerNodeType needs to be enabled in a cluster manifest. Additionally, subclustering feature needs to be enabled as well. Example of a cluster manifest PlacementAndLoadBalancing section for enabling the feature:

``` xml
<Section Name="PlacementAndLoadBalancing">
    <Parameter Name="SeparateBalancingStrategyPerNodeType" Value="true" />
    <Parameter Name="SubclusteringEnabled" Value="true" />
    <Parameter Name="SubclusteringReportingPolicy" Value="1" />
</Section>
```

ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

``` JSON
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "SeparateBalancingStrategyPerNodeType",
          "value": "true"
      },
      {
          "name": "SubclusteringEnabled",
          "value": "true"
      },
      {
          "name": "SubclusteringReportingPolicy",
          "value": "1"
      },
    ]
  }
]
```

Balancing per node type supports fine-grained configuration for imbalance detection:
- [Metric balancing thresholds per node type](service-fabric-cluster-resource-manager-balancing-per-node-type.md#balancing-thresholds-per-node-type)
- [Metric activity thresholds per node type](service-fabric-cluster-resource-manager-balancing-per-node-type.md#activity-thresholds-per-node-type)
- [Minimum balancing interval per node type](service-fabric-cluster-resource-manager-balancing-per-node-type.md#minimum-balancing-interval-per-node-type)

### Balancing thresholds per node type

Metric balancing threshold could be defined per node type in order to increase granularity from balancing configuration. Balancing thresholds have floating-point type, since they represent threshold for ratio of maximum and minimum load value within particular node type. Balancing thresholds are defined in **PlacementAndLoadBalancingOverrides** section for each node type:

``` xml
<NodeTypes>
    <NodeType Name="NodeType1">
        <PlacementAndLoadBalancingOverrides>
            <MetricBalancingThresholdsPerNodeType>
                <BalancingThreshold Name="Metric1" Value="2.5">
                <BalancingThreshold Name="Metric2" Value="4">
                <BalancingThreshold Name="Metric3" Value="3.25">
            </MetricBalancingThresholdsPerNodeType>
        </PlacementAndLoadBalancingOverrides>
    </NodeType>
</NodeTypes>
```

If balancing threshold for a metric isn't defined for a node type, threshold inherits value of metric balancing threshold defined globally in the **PlacementAndLoadBalancing** section. Otherwise, if balancing threshold for a metric isn't defined neither for a node type nor globally in a **PlacementAndLoadBalancing** section, threshold will have default value of *one*.

### Activity thresholds per node type

Metric activity threshold could be defined per node type in order to increase granularity of balancing configuration. Activity thresholds have integer type, since they represent threshold for maximum load value within particular node type. Activity thresholds are defined in **PlacementAndLoadBalancingOverrides** section for each node type:

``` xml
<NodeTypes>
    <NodeType Name="NodeType1">
        <PlacementAndLoadBalancingOverrides>
            <MetricActivityThresholdsPerNodeType>
                <ActivityThreshold Name="Metric1" Value="500">
                <ActivityThreshold Name="Metric2" Value="40">
                <ActivityThreshold Name="Metric3" Value="1000">
            </MetricActivityThresholdsPerNodeType>
        </PlacementAndLoadBalancingOverrides>
    </NodeType>
</NodeTypes>
```

If activity threshold for a metric isn't defined for a node type, threshold inherits value from metric activity threshold defined globally in the **PlacementAndLoadBalancing** section. Otherwise, if activity threshold for a metric isn't defined neither for a node type nor globally in a **PlacementAndLoadBalancing** section, threshold will have default value of *zero*.

### Minimum balancing interval per node type

Minimal balancing interval could be defined per node type in order to increase granularity of balancing configuration. Minimal balancing interval has integer type, since it represents the minimum amount of time that must pass before two consecutive balancing rounds on a same node type. Minimum balancing interval is defined in **PlacementAndLoadBalancingOverrides** section for each node type:

``` xml
<NodeTypes>
    <NodeType Name="NodeType1">
        <PlacementAndLoadBalancingOverrides>
            <MinLoadBalancingIntervalPerNodeType>100</MinLoadBalancingIntervalPerNodeType>
        </PlacementAndLoadBalancingOverrides>
    </NodeType>
</NodeTypes>
```

If minimal balancing interval isn't defined for a node type, interval inherits value from minimum balancing interval defined globally in the **PlacementAndLoadBalancing** section. Otherwise, if minimal interval isn't defined neither for a node type nor globally in a **PlacementAndLoadBalancing** section, minimal interval will have default value of *zero* which indicates that pause between consecutive balancing rounds isn't required.

## Examples

### Example1

Let's consider a case where a cluster contains two node types, node type **A** and node type **B**. All services report a same metric and they are split between these node types, thus load statistics are different for them. In the example, the node type **A** has maximum load of 300 and minimum of 100, and the node type **B** has maximum load of 700 and minimum load of 500: 

<center>

![Balancing Threshold Example][Example1]
</center>

Customer detected that workloads of two node types have different balancing needs and decided to set different balancing and activity thresholds per node type. Balancing threshold of node type **A** is *2.5*, and activity threshold is *50*. For node type **B**, customer set balancing threshold to *1.2*, and activity threshold to *400*.

During detection of imbalance for the cluster in this example, both node types violate activity threshold. Maximum load of node type **A** of *300* is higher than defined activity threshold of *50*. Maximum load of node type **B** of *700* is higher than defined activity threshold of *400*. Node type **A** violates balancing threshold criteria, since current ratio of maximum and minimum load is *3*, and balancing threshold is *2.5*. Opposite, node type **B** doesn't violate balancing threshold criteria, since current ratio of maximum and minimum load for this node type is *1.2*, but balancing threshold is *1.4*. Balancing is required only for replicas in the node type **A**, and the only set of replicas that will be eligible for movements during balancing phase are replicas placed in the node type **A**. 

### Example2

Let's consider a case where a cluster contains three node types, node type **A**, **B** and **C**. All services report a same metric and they are split between these node types, thus load statistics are different for them. In the example, the node type **A** has maximum load of 600 and minimum of 100, the node type **B** has maximum load of 900 and minimum load of 100, and node type **C** has maximum load of 600 and minimum load of 300: 

<center>

![Balancing Threshold Example][Example2]
</center>

Customer detected that workloads of these node types have different balancing needs and decided to set different balancing and activity thresholds per node type. Balancing threshold of node type **A** is *5*, and activity threshold is *700*. For node type **B**, customer set balancing threshold to *10*, and activity threshold to *200*. For node type **C**, customer set balancing threshold to *2*, and activity threshold to *300*.

Maximum load of node type **A** of *600* is lower than defined activity threshold of *700*, thus node type **A** will not be balanced. Maximum load of node type **B** of *900* is higher than defined activity threshold of *200*. The node type **B** violates activity threshold criteria. Maximum load of node type **C** of *600* is higher than defined activity threshold of *300*. The node type **C** violates activity threshold criteria. The node type **B** doesn't violate balancing threshold criteria, since current ratio of maximum and minimum load for this node type is *9*, but balancing threshold is *10*. Node type **C** violates balancing threshold criteria, since current ratio of maximum and minimum load is *2*, and balancing threshold is *2*.  Balancing is required only for replicas in the node type **C**, and the only set of replicas that will be eligible for movements during balancing phase are replicas placed in the node type **C**. 

## Next steps

* Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about metrics and how to configure them, check out [this article](service-fabric-cluster-resource-manager-metrics.md).
* Movement Cost is one way of signaling to the Cluster Resource Manager that certain services are more expensive to move than others. For more about movement cost, refer to [this article](service-fabric-cluster-resource-manager-movement-cost.md).
* The Cluster Resource Manager has several throttles that you can configure to slow down churn in the cluster. They're not normally necessary, but if you need them you can learn about them [here](service-fabric-cluster-resource-manager-advanced-throttling.md).

[Example1]:./media/service-fabric-cluster-resource-manager-balancing-per-node-type/example1.png
[Example2]:./media/service-fabric-cluster-resource-manager-balancing-per-node-type/example2.png