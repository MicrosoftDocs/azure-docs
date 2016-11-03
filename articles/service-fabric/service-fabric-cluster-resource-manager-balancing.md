---
title: Balancing Your Cluster With the Azure Service Fabric Cluster Resource Manager | Microsoft Docs
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
ms.date: 08/19/2016
ms.author: masnider

---
# Balancing your service fabric cluster
The Service Fabric Cluster Resource Manager allows reporting dynamic load, reacting to changes in the cluster, correcting constraint violations, and rebalancing the cluster if necessary. But how often does it do these things, and what triggers it? There are several controls related to this.

The first set of controls around balancing are a set of timers. These timers govern how often the Cluster Resource Manager examines the state of the cluster for things that need to be addressed. There are three different categories of work, each with their own corresponding timer. They are:

1. Placement – this stage deals with placing any stateful replicas or stateless instances which are missing. This covers both new services and handling stateful replicas or stateless instances which have failed and need to be recreated. Deleting and dropping replicas or instances is also handled here.
2. Constraint Checks – this stage checks for and corrects violations of the different placement constraints (rules) within the system. Examples of rules are things like ensuring that nodes are not over capacity and that a service’s placement constraints (more on these later) are met.
3. Balancing – this stage checks to see if proactive rebalancing is necessary based on the configured desired level of balance for different metrics, and if so attempts to find an arrangement in the cluster that is more balanced.

## Configuring Cluster Resource Manager Steps and Timers
Each of these different types of corrections the Cluster Resource Manager can make is controlled by a different timer which governs its frequency. So for example, if you only want to deal with placing new service workloads in the cluster every hour (to batch them up), but want regular balancing checks every few seconds, you can configure that behavior. When each timer fires, the task is scheduled. By default the Resource Manager scans its state and applies updates (batching all the changes that have occurred since the last scan, like noticing that a node is down) every 1/10th of a second, sets the placement and constraint check flags every second, and the balancing flag every 5 seconds.

ClusterManifest.xml:

``` xml
        <Section Name="PlacementAndLoadBalancing">
            <Parameter Name="PLBRefreshGap" Value="0.1" />
            <Parameter Name="MinPlacementInterval" Value="1.0" />
            <Parameter Name="MinConstraintCheckInterval" Value="1.0" />
            <Parameter Name="MinLoadBalancingInterval" Value="5.0" />
        </Section>
```

Today we only perform one of these actions at a time, sequentially (that’s why we refer to these configurations as “minimum intervals”)). This is so that, for example, we’ve already responded to any pending requests to create new replicas before we move on to balancing the cluster. As you can see by the default time intervals specified, we can scan and check for anything we need to do very frequently, meaning that the set of changes we make at the end of each step is usually smaller: we’re not scanning through hours of changes in the cluster and trying to correct them all at once, we are trying to handle things more or less as they happen but with some batching when many things happen at the same time. This makes the Service Fabric resource manager very responsive to things that happen in the cluster.

While most of these tasks are straightforward (if there are constraint violations, fix them, if there are services to be created, create them), the Cluster Resource Manager also needs some additional information to determine if the cluster imbalanced. For that we have two other pieces of configuration: *Balancing Thresholds* and *Activity Thresholds*.

## Balancing thresholds
A Balancing Threshold is the main control for triggering proactive rebalancing (remember that the timer is just for how often the Cluster Resource Manager should check - it doesn't mean that anything will happen). The Balancing Threshold defines how imbalanced the cluster needs to be for a specific metric in order for the Cluster Resource Manager to consider it imbalanced and trigger balancing.

Balancing Thresholds are defined on a per-metric basis as a part of the cluster definition. For more information on metrics check out [this article](service-fabric-cluster-resource-manager-metrics.md).

ClusterManifest.xml

``` xml
    <Section Name="MetricBalancingThresholds">
      <Parameter Name="MetricName1" Value="2"/>
      <Parameter Name="MetricName2" Value="3.5"/>
    </Section>
```

The Balancing Threshold for a metric is a ratio. If the amount of load on the most loaded node divided by the amount of load on the least loaded node exceeds this number, then the cluster is considered imbalanced and balancing will be triggered the next time the Cluster Resource Manager checks (by default, ever 5 seconds, as governed by the MinLoadBalancingInterval, shown above).

![Balancing Threshold Example][Image1]

In this simple example each service is consuming one unit of some metric. In the top example, the maximum load on a node is 5 and the minimum is 2. Let’s say that the balancing threshold for this metric is 3. Therefore, in the top example, the cluster is considered balanced and no balancing will be triggered when the Cluster Resource Manager checks (since the ratio in the cluster is 5/2 = 2.5 and that is less than the specified balancing threshold of 3).

In the bottom example, the max load on a node is 10, while the minimum is 2, resulting in a ratio of 5. This puts the cluster over the designed balancing threshold of 3 for that metric. As a result, a global rebalancing run will be scheduled next time the balancing timer fires. Note that just because a balancing search is kicked off doesn't mean anything will move - sometimes the cluster is imbalanced but the situation can't be improved - but in a situation like this one (at least by default) some the load will almost certainly be distributed to Node3. Note that since we are not using a greedy approach some load could also be distributed to Node2 since that would result in minimization of the overall differences between nodes, but we would expect that the majority of the load would flow to Node3.

![Balancing Threshold Example Actions][Image2]

Note that getting below the balancing threshold is not an explicit goal – Balancing Thresholds are just a *trigger* that tells the Cluster Resource Manager that it should look into the cluster to determine what improvements it can make, if any.

## Activity thresholds
Sometimes, although nodes are relatively imbalanced, the *total* amount of load in the cluster is low. This could be just because of the time of day, or because the cluster is new and just getting bootstrapped. In either case, you may not want to spend time balancing the cluster because there’s actually very little to be gained – you’ll just be spending network and compute resources to move things around, without making any absolute difference. Because we want to avoid doing this, there’s another control inside of the Resource Manager, known as Activity Thresholds, which allows you to specify some absolute lower bound for activity – if no node has at least this much load then balancing will not be triggered even if the Balancing Threshold is met.

As an example let’s say that we have reports with the following totals for consumption on these nodes. Let’s also say that we retain our Balancing Threshold of 3 for this metric, but now we also have an Activity Threshold of 1536. In the first case, while the cluster is imbalanced per the Balancing Threshold no node meets that minimum Activity Threshold, so we leave things alone. In the bottom example, Node1 is way over the Activity Threshold, so balancing will be performed (since both the Balancing Threshold and the Activity Threshold for the metric are exceeded)

![Activity Threshold Example][Image3]

Just like Balancing Thresholds, Activity Thresholds are defined per-metric via the cluster definition:

ClusterManifest.xml

``` xml
    <Section Name="MetricActivityThresholds">
      <Parameter Name="Memory" Value="1536"/>
    </Section>
```

Note that balancing and activity thresholds are both tied to the metric - balancing will only be triggered if both balancing and activity thresholds are exceeded for the same metric. Thus, if we exceed the Balancing Threshold for Memory and the Activity Threshold for CPU, balancing will not trigger as long as the remaining thresholds (Balancing Threshold for CPU and Activity Threshold for Memory) are not exceeded.

## Balancing services together
Something that’s interesting to note is that whether the cluster is imbalanced or not is a cluster-wide decision, but the way we go about fixing it is moving individual service replicas and instances around. This makes sense, right? If memory is stacked up on one node, multiple replicas or instances could be contributing to it, so it could require moving any of the stateful replicas or stateless instances that use the affected, imbalanced metric.

Occasionally though a customer will call us up or file a ticket saying that a service that wasn’t imbalanced got moved. How could it happen that a service gets moved around even if all of that service’s metrics were balanced, even perfectly so, at the time of the other imbalance? Let’s see!

Take for example four services, Service1, Service2, Service3, and Service4. Service1 reports against metrics Metric1 and Metric2, Service2 against Metric2 and Mmetric3, Service3 against Metric3 and Metric4, and Service4 against some metric Metric99. Surely you can see where we’re going here. We have a chain! From the perspective of the Cluster Resource Manager, we don’t really have four independent services, we have a bunch of services that are related (Service1, Service2, and Service3) and one that is off on its own.

![Balancing Services Together][Image4]

So it is possible that an imbalance in Metric1 can cause replicas or instances belonging to Service3 to move around. Usually these movements are pretty limited, but can be larger depending on exactly how imbalanced Metric1 got and what changes were necessary in the cluster in order to correct it. We can also say with certainty that an imbalance in Metrics 1, 2, or 3 will never cause movements in Service4 – there’d be no point since moving the replicas or instances belonging to Service4 around can do absolutely nothing to impact the balance of Metrics 1, 2, or 3.

The Cluster Resource Manager automatically figures out what services are related, since services may have been added, removed, or had their metric configuration change – for example, between two runs of balancing Service2 may have been reconfigured to remove Metric2. This breaks the chain between Service1 and Service2. Now instead of two groups of services, you have three:

![Balancing Services Together][Image5]

## Next steps
* Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about them and how to configure them check out [this article](service-fabric-cluster-resource-manager-metrics.md)
* Movement Cost is one way of signaling to the Cluster Resource Manager that certain services are more expensive to move than others. To learn more about movement cost, refer to [this article](service-fabric-cluster-resource-manager-movement-cost.md)
* The Cluster Resource Manager has several throttles that you can configure to slow down churn in the cluster. They're not normally necessary, but if you need them you can learn about them [here](service-fabric-cluster-resource-manager-advanced-throttling.md)

[Image1]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resrouce-manager-balancing-thresholds.png
[Image2]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-threshold-triggered-results.png
[Image3]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-activity-thresholds.png
[Image4]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-services-together1.png
[Image5]:./media/service-fabric-cluster-resource-manager-balancing/cluster-resource-manager-balancing-services-together2.png
