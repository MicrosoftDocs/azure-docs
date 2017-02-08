---
title: Balance your Azure Service Fabric cluster | Microsoft Docs
description: An introduction to balancing your cluster with the Service Fabric Cluster Resource Manager.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 030b1465-6616-4c0b-8bc7-24ed47d054c0
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---
# Balancing your service fabric cluster
The Service Fabric Cluster Resource Manager supports dynamic load changes, reacting to additions or removals of nodes or services, correcting constraint violations, and rebalancing the cluster. But how often does it do these things, and what triggers it?

The first set of controls around balancing are a set of timers. These timers govern how often the Cluster Resource Manager examines the state of the cluster for things that need to be addressed. There are three different categories of work, each with their own corresponding timer. They are:

1. Placement – this stage deals with placing any stateful replicas or stateless instances that are missing. This covers both new services and handling stateful replicas or stateless instances that have failed. Deleting and dropping replicas or instances are handled here.
2. Constraint Checks – this stage checks for and corrects violations of the different placement constraints (rules) within the system. Examples of rules are things like ensuring that nodes are not over capacity and that a service’s placement constraints are met.
3. Balancing – this stage checks to see if proactive rebalancing is necessary based on the configured desired level of balance for different metrics. If so it attempts to find an arrangement in the cluster that is more balanced.

## Configuring Cluster Resource Manager Steps and Timers
Each of these different types of corrections the Cluster Resource Manager can make is controlled by a different timer that governs its frequency. When each timer fires, the task is scheduled. By default the Resource Manager:

* scans its state and applies updates (like recording that a node is down) every 1/10th of a second
* sets the placement and constraint check flags every second
* sets the balancing flag every five seconds.

We can see this reflected in the following configuration information:

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
          "name": "MinLoadBalancingInterval",
          "value": "5.0"
      }
    ]
  }
]
```

Today the Cluster Resource Manager only performs one of these actions at a time, sequentially (that’s why we refer to these timers as “minimum intervals”). For example, the Cluster Resource Manager takes care of pending requests to create services before balancing the cluster. As you can see by the default time intervals specified, the Cluster Resource Manager scans and checks for anything it needs to do frequently, so the set of changes made at the end of each step is usually small. Making small changes frequently makes the Cluster Resource Manager responsive to things that happen in the cluster. The default timers provide some batching since many of the same types of events tend to occur simultaneously. By default the Cluster Resource Manager is not scanning through hours of changes in the cluster and trying to address all changes at once. Doing so would lead to bursts of churn.

The Cluster Resource Manager also needs some additional information to determine if the cluster imbalanced. For that we have two other pieces of configuration: *Balancing Thresholds* and *Activity Thresholds*.

## Balancing thresholds
A Balancing Threshold is the main control for triggering proactive rebalancing. The MinLoadBalancingInterval timer is just for how often the Cluster Resource Manager should check - it doesn't mean that anything happens. The Balancing Threshold defines how imbalanced the cluster needs to be for a specific metric in order for the Cluster Resource Manager to consider it imbalanced and trigger balancing.

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

The Balancing Threshold for a metric is a ratio. If the amount of load on the most loaded node divided by the amount of load on the least loaded node exceeds this number, then the cluster is considered imbalanced. As a result balancing is triggered the next time the Cluster Resource Manager checks.

<center>
![Balancing Threshold Example][Image1]
</center>

In this example, each service is consuming one unit of some metric. In the top example, the maximum load on a node is five and the minimum is two. Let’s say that the balancing threshold for this metric is three. Since the ratio in the cluster is 5/2 = 2.5 and that is less than the specified balancing threshold of three, the cluster is balanced. No balancing is triggered when the Cluster Resource Manager checks.

In the bottom example, the maximum load on a node is ten, while the minimum is two, resulting in a ratio of five. Five is greater than the designated balancing threshold of three for that metric. As a result, a rebalancing run will be scheduled next time the balancing timer fires. In a situation like this some load will almost certainly be distributed to Node3. Since the Service Fabric Cluster Resource Manager doesn't use a greedy approach, some load could also be distributed to Node2. Doing so results in minimization of the overall differences between nodes, which is one of the goals of the Cluster Resource Manager.

<center>
![Balancing Threshold Example Actions][Image2]
</center>

Getting below the balancing threshold is not an explicit goal. Balancing Thresholds are just a *trigger* that tells the Cluster Resource Manager that it should look into the cluster to determine what improvements it can make, if any. Indeed, just because a balancing search is kicked off doesn't mean anything moves - sometimes the cluster is imbalanced but the situation can't be improved.

## Activity thresholds
Sometimes, although nodes are relatively imbalanced, the *total* amount of load in the cluster is low. The lack of load could be a transient dip, or because the cluster is new and just getting bootstrapped. In either case, you may not want to spend time balancing the cluster because there’s little to be gained. If the cluster underwent balancing, you’d spend network and compute resources to move things around without making any *absolute* difference. To avoid this, there’s another control known as Activity Thresholds. Activity Thresholds allows you to specify some absolute lower bound for activity. If no node is over this threshold, balancing isn't triggered even if the Balancing Threshold is met.

As an example, let's look at the following diagram. Let’s also say that we retain our Balancing Threshold of three for this metric, but now we also have an Activity Threshold of 1536. In the first case, while the cluster is imbalanced per the Balancing Threshold there's no node meets that Activity Threshold, so nothing happens. In the bottom example, Node1 is way over the Activity Threshold. Since both the Balancing Threshold and the Activity Threshold for the metric are exceeded, so balancing is scheduled.

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

## Balancing services together
Something that’s interesting to note is that whether the cluster is imbalanced or not is a cluster-wide decision. However, the way we go about fixing it is moving individual service replicas and instances around. This makes sense, right? If memory is stacked up on one node, multiple replicas or instances could be contributing to it. Fixing the imbalance could require moving any of the stateful replicas or stateless instances that use the imbalanced metric.

Occasionally though, a service that wasn’t imbalanced gets moved. How could it happen that a service gets moved around even if all of that service’s metrics were balanced, even perfectly so, at the time of the other imbalance? Let’s see!

Take for example four services, Service1, Service2, Service3, and Service4. Service1 reports against metrics Metric1 and Metric2, Service2 against Metric2 and Mmetric3, Service3 against Metric3 and Metric4, and Service4 against some metric Metric99. Surely you can see where we’re going here. We have a chain! We don’t really have four independent services, we have a bunch of services that are related (Service1, Service2, and Service3) and one that is off on its own.

<center>
![Balancing Services Together][Image4]
</center>

So it is possible that an imbalance in Metric1 can cause replicas or instances belonging to Service3 (which doesn't report Metric1) to move around. Usually these movements are limited, but can be larger depending on exactly how imbalanced Metric1 got and what changes were necessary in the cluster to correct it. We can also say with certainty that an imbalance in Metrics 1, 2, or 3 can't cause movements in Service4. There would be no point since moving the replicas or instances belonging to Service4 around can do absolutely nothing to impact the balance of Metrics 1, 2, or 3.

The Cluster Resource Manager automatically figures out what services are related, since services may have been added, removed, or had their metric configuration change. For example, between two runs of balancing Service2 may have been reconfigured to remove Metric2. This change breaks the chain between Service1 and Service2. Now instead of two groups of related services, you have three:

<center>
![Balancing Services Together][Image5]
</center>

## Next steps
* Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about them and how to configure them, check out [this article](service-fabric-cluster-resource-manager-metrics.md)
* Movement Cost is one way of signaling to the Cluster Resource Manager that certain services are more expensive to move than others. For more about movement cost, refer to [this article](service-fabric-cluster-resource-manager-movement-cost.md)
* The Cluster Resource Manager has several throttles that you can configure to slow down churn in the cluster. They're not normally necessary, but if you need them you can learn about them [here](service-fabric-cluster-resource-manager-advanced-throttling.md)

[Image1]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resrouce-manager-balancing-thresholds.png
[Image2]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-threshold-triggered-results.png
[Image3]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-activity-thresholds.png
[Image4]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-services-together1.png
[Image5]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-services-together2.png
