---
title: Balance your Azure Service Fabric cluster | Microsoft Docs
description: An introduction to balancing your cluster with the Service Fabric Cluster Resource Manager.
services: service-fabric
documentationcenter: .net
author: masnider
manager: chackdan
editor: ''

ms.assetid: 030b1465-6616-4c0b-8bc7-24ed47d054c0
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/18/2017
ms.author: masnider

---
# Balancing your service fabric cluster
The Service Fabric Cluster Resource Manager supports dynamic load changes, reacting to additions or removals of nodes or services. It also automatically corrects constraint violations, and proactively rebalances the cluster. But how often are these actions taken, and what triggers them?

There are three different categories of work that the Cluster Resource Manager performs. They are:

1. Placement – this stage deals with placing any stateful replicas or stateless instances that are missing. Placement includes both new services and handling stateful replicas or stateless instances that have failed. Deleting and dropping replicas or instances are handled here.
2. Constraint Checks – this stage checks for and corrects violations of the different placement constraints (rules) within the system. Examples of rules are things like ensuring that nodes are not over capacity and that a service’s placement constraints are met.
3. Balancing – this stage checks to see if rebalancing is necessary based on the configured desired level of balance for different metrics. If so it attempts to find an arrangement in the cluster that is more balanced.

## Configuring Cluster Resource Manager Timers
The first set of controls around balancing are a set of timers. These timers govern how often the Cluster Resource Manager examines the cluster and takes corrective actions.

Each of these different types of corrections the Cluster Resource Manager can make is controlled by a different timer that governs its frequency. When each timer fires, the task is scheduled. By default the Resource Manager:

* scans its state and applies updates (like recording that a node is down) every 1/10th of a second
* sets the placement check flag every second
* sets the constraint check flag every second
* sets the balancing flag every five seconds

Examples of the configuration governing these timers are below:

ClusterManifest.xml:

``` xml
        <Section Name="PlacementAndLoadBalancing">
            <Parameter Name="PLBRefreshGap" Value="0.1" />
            <Parameter Name="MinPlacementInterval" Value="1.0" />
            <Parameter Name="MinConstraintCheckInterval" Value="1.0" />
            <Parameter Name="MinLoadBalancingInterval" Value="5.0" />
        </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "PLBRefreshGap",
          "value": "0.10"
      },
      {
          "name": "MinPlacementInterval",
          "value": "1.0"
      },
      {
          "name": "MinConstraintCheckInterval",
          "value": "1.0"
      },
      {
          "name": "MinLoadBalancingInterval",
          "value": "5.0"
      }
    ]
  }
]
```

Today the Cluster Resource Manager only performs one of these actions at a time, sequentially. This is why we refer to these timers as “minimum intervals” and the actions that get taken when the timers go off as "setting flags". For example, the Cluster Resource Manager takes care of pending requests to create services before balancing the cluster. As you can see by the default time intervals specified, the Cluster Resource Manager scans for anything it needs to do frequently. Normally this means that the set of changes made during each step is small. Making small changes frequently allows the Cluster Resource Manager to be responsive when things happen in the cluster. The default timers provide some batching since many of the same types of events tend to occur simultaneously. 

For example, when nodes fail they can do so entire fault domains at a time. All these failures are captured during the next state update after the *PLBRefreshGap*. The corrections are determined during the following placement, constraint check, and balancing runs. By default the Cluster Resource Manager is not scanning through hours of changes in the cluster and trying to address all changes at once. Doing so would lead to bursts of churn.

The Cluster Resource Manager also needs some additional information to determine if the cluster imbalanced. For that we have two other pieces of configuration: *BalancingThresholds* and *ActivityThresholds*.

## Balancing thresholds
A Balancing Threshold is the main control for triggering rebalancing. The Balancing Threshold for a metric is a _ratio_. If the load for a metric on the most loaded node divided by the amount of load on the least loaded node exceeds that metric's *BalancingThreshold*, then the cluster is imbalanced. As a result balancing is triggered the next time the Cluster Resource Manager checks. The *MinLoadBalancingInterval* timer defines how often the Cluster Resource Manager should check if rebalancing is necessary. Checking doesn't mean that anything happens. 

Balancing Thresholds are defined on a per-metric basis as a part of the cluster definition. For more information on metrics, check out [this article](service-fabric-cluster-resource-manager-metrics.md).

ClusterManifest.xml

```xml
    <Section Name="MetricBalancingThresholds">
      <Parameter Name="MetricName1" Value="2"/>
      <Parameter Name="MetricName2" Value="3.5"/>
    </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "MetricBalancingThresholds",
    "parameters": [
      {
          "name": "MetricName1",
          "value": "2"
      },
      {
          "name": "MetricName2",
          "value": "3.5"
      }
    ]
  }
]
```

<center>

![Balancing Threshold Example][Image1]
</center>

In this example, each service is consuming one unit of some metric. In the top example, the maximum load on a node is five and the minimum is two. Let’s say that the balancing threshold for this metric is three. Since the ratio in the cluster is 5/2 = 2.5 and that is less than the specified balancing threshold of three, the cluster is balanced. No balancing is triggered when the Cluster Resource Manager checks.

In the bottom example, the maximum load on a node is 10, while the minimum is two, resulting in a ratio of five. Five is greater than the designated balancing threshold of three for that metric. As a result, a rebalancing run will be scheduled next time the balancing timer fires. In a situation like this some load is usually distributed to Node3. Because the Service Fabric Cluster Resource Manager doesn't use a greedy approach, some load could also be distributed to Node2. 

<center>

![Balancing Threshold Example Actions][Image2]
</center>

> [!NOTE]
> "Balancing" handles two different strategies for managing load in your cluster. The default strategy that the Cluster Resource Manager uses is to distribute load across the nodes in the cluster. The other strategy is [defragmentation](service-fabric-cluster-resource-manager-defragmentation-metrics.md). Defragmentation is performed during the same balancing run. The balancing and defragmentation strategies can be used for different metrics within the same cluster. A service can have both balancing and defragmentation metrics. For defragmentation metrics, the ratio of the loads in the cluster triggers rebalancing when it is _below_ the balancing threshold. 
>

Getting below the balancing threshold is not an explicit goal. Balancing Thresholds are just a *trigger*. When balancing runs, the Cluster Resource Manager determines what improvements it can make, if any. Just because a balancing search is kicked off doesn't mean anything moves. Sometimes the cluster is imbalanced but too constrained to correct. Alternatively, the improvements require movements that are too [costly](service-fabric-cluster-resource-manager-movement-cost.md)).

## Activity thresholds
Sometimes, although nodes are relatively imbalanced, the *total* amount of load in the cluster is low. The lack of load could be a transient dip, or because the cluster is new and just getting bootstrapped. In either case, you may not want to spend time balancing the cluster because there’s little to be gained. If the cluster underwent balancing, you’d spend network and compute resources to move things around without making any large *absolute* difference. To avoid unnecessary moves, there’s another control known as Activity Thresholds. Activity Thresholds allows you to specify some absolute lower bound for activity. If no node is over this threshold, balancing isn't triggered even if the Balancing Threshold is met.

Let’s say that we retain our Balancing Threshold of three for this metric. Let's also say we have an Activity Threshold of 1536. In the first case, while the cluster is imbalanced per the Balancing Threshold there's no node meets that Activity Threshold, so nothing happens. In the bottom example, Node1 is over the Activity Threshold. Since both the Balancing Threshold and the Activity Threshold for the metric are exceeded, balancing is scheduled. As an example, let's look at the following diagram: 

<center>

![Activity Threshold Example][Image3]
</center>

Just like Balancing Thresholds, Activity Thresholds are defined per-metric via the cluster definition:

ClusterManifest.xml

``` xml
    <Section Name="MetricActivityThresholds">
      <Parameter Name="Memory" Value="1536"/>
    </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "MetricActivityThresholds",
    "parameters": [
      {
          "name": "Memory",
          "value": "1536"
      }
    ]
  }
]
```

Balancing and activity thresholds are both tied to a specific metric - balancing is triggered only if both the Balancing Threshold and Activity Threshold is exceeded for the same metric.

> [!NOTE]
> When not specified, the Balancing Threshold for a metric is 1, and the Activity Threshold is 0. This means that the Cluster Resource Manager will try to keep that metric perfectly balanced for any given load. If you are using custom metrics it is recommended that you explicitly define your own balancing and activity thresholds for your metrics. 
>

## Balancing services together
Whether the cluster is imbalanced or not is a cluster-wide decision. However, the way we go about fixing it is moving individual service replicas and instances around. This makes sense, right? If memory is stacked up on one node, multiple replicas or instances could be contributing to it. Fixing the imbalance could require moving any of the stateful replicas or stateless instances that use the imbalanced metric.

Occasionally though, a service that wasn’t itself imbalanced gets moved (remember the discussion of local and global weights earlier). Why would a service get moved when all that service’s metrics were balanced? Let’s see an example:

- Let's say there are four services, Service1, Service2, Service3, and Service4. 
- Service1 reports metrics Metric1 and Metric2. 
- Service2 reports metrics Metric2 and Metric3. 
- Service3 reports metrics Metric3 and Metric4.
- Service4 reports metric Metric99. 

Surely you can see where we’re going here: There's a chain! We don’t really have four independent services, we have three services that are related and one that is off on its own.

<center>

![Balancing Services Together][Image4]
</center>

Because of this chain, it's possible that an imbalance in metrics 1-4 can cause replicas or instances belonging to services 1-3 to move around. We also know that an imbalance in Metrics 1, 2, or 3 can't cause movements in Service4. There would be no point since moving the replicas or instances belonging to Service4 around can do absolutely nothing to impact the balance of Metrics 1-3.

The Cluster Resource Manager automatically figures out what services are related. Adding, removing, or changing the metrics for services can impact their relationships. For example, between two runs of balancing Service2 may have been updated to remove Metric2. This breaks the chain between Service1 and Service2. Now instead of two groups of related services, there are three:

<center>

![Balancing Services Together][Image5]
</center>

## Next steps
* Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about metrics and how to configure them, check out [this article](service-fabric-cluster-resource-manager-metrics.md)
* Movement Cost is one way of signaling to the Cluster Resource Manager that certain services are more expensive to move than others. For more about movement cost, refer to [this article](service-fabric-cluster-resource-manager-movement-cost.md)
* The Cluster Resource Manager has several throttles that you can configure to slow down churn in the cluster. They're not normally necessary, but if you need them you can learn about them [here](service-fabric-cluster-resource-manager-advanced-throttling.md)

[Image1]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resrouce-manager-balancing-thresholds.png
[Image2]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-threshold-triggered-results.png
[Image3]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-activity-thresholds.png
[Image4]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-services-together1.png
[Image5]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-services-together2.png
