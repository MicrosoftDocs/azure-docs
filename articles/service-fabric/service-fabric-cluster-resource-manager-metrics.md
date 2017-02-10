---
title: Manage Azure microservice load using metrics | Microsoft Docs
description: Learn about how to configure and use metrics in Service Fabric to manage service resource consumption.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 0d622ea6-a7c7-4bef-886b-06e6b85a97fb
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---
# Managing resource consumption and load in Service Fabric with metrics
Metrics are the generic term within Service Fabric for the resources that your services care about and which are provided by the nodes in the cluster. Generally, a metric is anything that you want to manage to deal with the performance of your services.

Things like Memory, Disk, and CPU usage are examples of metrics. These are physical metrics, resources that correspond to physical resources on the node that need to be managed. Metrics can also be (and commonly are) logical metrics. Logical metrics are things like “MyWorkQueueDepth” or "MessagesToProcess" or "TotalRecords". Logical metrics are application-defined and correspond to some physical resource consumption, but the application doesn't really know how to measure it. This is common. Most metrics that we see people use are logical metrics. Most commonly this is because today many services are written in managed code. Managed code means that from within a host process it can be hard to measure and report a single service object's consumption of physical resources. The complexity of measuring and reporting your own metrics is also why we provide some default metrics out of the box.

## Default metrics
Let’s say that you want to get started and don’t know what resources you are going to consume or even which ones would be important to you. So you go implement and then create your services without specifying any metrics. That’s fine! The Service Fabric Cluster Resource Manager picks some simple metrics for you. The default metrics that we use today when you don’t specify any are called PrimaryCount, ReplicaCount, and Count. The following table shows how much load for each of these metrics is associated with each service object:

| Metric | Stateless Instance Load | Stateful Secondary Load | Stateful Primary Load |
| --- | --- | --- | --- |
| PrimaryCount |0 |0 |1 |
| ReplicaCount |0 |1 |1 |
| Count |1 |1 |1 |

Ok, so with these default metrics, what do you get? Well it turns out that for basic workloads you get a decent distribution of work. In the following example, let’s see what happens when we create two services. The first one a stateful service with three partitions and a target replica set size of three. The second one a stateless service with one partition and an instance count of three:

<center>
![Cluster Layout with Default Metrics][Image1]
</center>

Here's what you get:

* Primary replicas for the stateful service are not stacked up on a single node
* Replicas for the same partition are not on the same node
* The total number of primaries and secondaries is distributed in the cluster
* The total number of service objects are evenly allocated on each node

Good!

This works great until you start to run large numbers of real workloads: What's the likelihood that the partitioning scheme you picked results in perfectly even utilization by all partitions? What’s the chance that the load for a given service is constant over time, or even just the same right now?

Realistically, you could run with just the default metrics, but doing so usually means that your cluster utilization is lower than you’d like. This is because the default metric reporting isn’t adaptive and presumes everything is equivalent. In the worst case, using just the defaults can also result in overscheduled nodes resulting in performance issues. We can do better with custom metrics and dynamic load reports, which we'll cover next. For any serious workload, the odds of all services being equivalent forever is low. If you're interested in getting the most out of your cluster and avoiding performance issues, you'll want to start looking into custom metrics.

## Custom metrics
Metrics are configured on a per-named-service-instance basis when you’re creating the service.

Any metric has some properties that describe it: a name, a default load, and a weight.

* Metric Name: The name of the metric. The metric name is a unique identifier for the metric within the cluster from the Resource Manager’s perspective.
* Default Load: The default load is represented differently depending on whether the service is stateless or stateful.
  * For stateless services, each metric has a single property named DefaultLoad
  * For stateful services you define:
    * PrimaryDefaultLoad: The default amount of this metric this service consumes when it is a Primary
    * SecondaryDefaultLoad: The default amount of this metric this service consumes when it is a Secondary
* Weight: Metric weight defines how important this metric is relative to the other metrics for this service.

If you define custom metrics and you want to also use the default metrics, you'll need to explicitly add them back. This is because you want to be clear about the relationship between the default metrics and your custom metrics. For example, maybe you care about Memory consumption or WorkQueueDepth way more than you care about Primary distribution.

### Defining metrics for your service - an example
Let’s say you wanted to configure a service that reports a metric called “MemoryInMb”, and that you also want to use the default metrics. Let’s also say that you’ve done some measurements and know that normally a Primary replica of that service takes up 20 units of "MemoryInMb", while secondaries take up 5. You know that Memory is the most important metric in terms of managing the performance of this particular service, but you still want primary replicas to be balanced. Balancing Primaries is a good idea so that the loss of some node or fault domain doesn’t impact a majority of primary replicas along with it. Other than these tweaks, you want to use the default metrics.

Here’s the code that you would write to create a service with that metric configuration:

Code:

```csharp
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
StatefulServiceLoadMetricDescription memoryMetric = new StatefulServiceLoadMetricDescription();
memoryMetric.Name = "MemoryInMb";
memoryMetric.PrimaryDefaultLoad = 20;
memoryMetric.SecondaryDefaultLoad = 5;
memoryMetric.Weight = ServiceLoadMetricWeight.High;

StatefulServiceLoadMetricDescription primaryCountMetric = new StatefulServiceLoadMetricDescription();
primaryCountMetric.Name = "PrimaryCount";
primaryCountMetric.PrimaryDefaultLoad = 1;
primaryCountMetric.SecondaryDefaultLoad = 0;
primaryCountMetric.Weight = ServiceLoadMetricWeight.Medium;

StatefulServiceLoadMetricDescription replicaCountMetric = new StatefulServiceLoadMetricDescription();
replicaCountMetric.Name = "ReplicaCount";
replicaCountMetric.PrimaryDefaultLoad = 1;
replicaCountMetric.SecondaryDefaultLoad = 1;
replicaCountMetric.Weight = ServiceLoadMetricWeight.Low;

StatefulServiceLoadMetricDescription totalCountMetric = new StatefulServiceLoadMetricDescription();
totalCountMetric.Name = "Count";
totalCountMetric.PrimaryDefaultLoad = 1;
totalCountMetric.SecondaryDefaultLoad = 1;
totalCountMetric.Weight = ServiceLoadMetricWeight.Low;

serviceDescription.Metrics.Add(memoryMetric);
serviceDescription.Metrics.Add(primaryCountMetric);
serviceDescription.Metrics.Add(replicaCountMetric);
serviceDescription.Metrics.Add(totalCountMetric);

await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("MemoryInMb,High,20,5”,"PrimaryCount,Medium,1,0”,"ReplicaCount,Low,1,1”,"Count,Low,1,1”)
```

(Reminder: if you just want to use the default metrics, you don’t need to touch the metrics collection at all or do anything special when creating your service.)

Now that we've gotten an introduction and seen an example, let's go through each of these settings in more detail and talk about the behavior you'll get.

## Load
The whole point of defining metrics is to represent some load. "Load" is how much of a given metric is consumed by some service instance or replica on a given node. The expected load can be configured when a service is created, updated after the service is created, reported on a per service object basis, or all of the above.

## Default load
Default load is how much load each service object (instance or replica) of this service consumes by default. For simpler services, the default load is a static definition that is never updated and that is used for the lifetime of the service. Default load works great for simple capacity planning scenarios where certain amounts of resources are dedicated to different workloads.

The Cluster Resource Manager allows stateful services to specify a different default load for both their Primaries and Secondaries, while stateless services can only specify one value. For stateful services the default load for primary and secondary replicas are typically different since replicas do different kinds of work in each role. For example, primaries usually serve both reads and writes (and most of the computational burden), while secondaries don't. It's expected that the default load for a primary replica is higher than for secondary replicas, but the real numbers should depend on your own measurements.

## Dynamic load
Let’s say that you’ve been running your service for a while. With some monitoring, you’ve noticed that:

1. Some partitions or instances of a given service consume more resources than others
2. Some services have load that varies over time.

There's lots of things that could cause these types of load fluctuations. The service or partition could be associated with a particular customer, or maybe they correspond to workloads that vary over the course of the day. Regardless of the reason, there’s no single number that you can use for default load. Any value you pick for default load is wrong some of the time. This is a problem since incorrect default loads result in the Cluster Resource Manager either over or under allocating resources for your service. As a result, you have nodes that are over or under utilized even if the Cluster Resource Manager thinks the cluster is balanced. Default loads are still good since they provide some information, but they're not a complete story for real workloads most of the time. This is why the Cluster Resource Manager allows each service object to update its own load during runtime. This is called dynamic load reporting.

Dynamic load reports allow replicas or instances to adjust their allocation/reported load of metrics over their lifetime. A service replica or instance that was cold and not doing any work would usually report that it was using low amounts of a given metric. A busy replica or instance would report that they are using more.

Reporting per replica or instance allows the Cluster Resource Manager to reorganize the individual service objects in the cluster to ensure that the services get the resources they require. Busy services effectively get to "reclaim" resources from other replicas or instances that are currently cold or doing less work.

Within your Reliable Service the code to report load dynamically would look like this:

Code:

```csharp
this.ServicePartition.ReportLoad(new List<LoadMetric> { new LoadMetric("MemoryInMb", 1234), new LoadMetric("metric1", 42) });
```

Services replicas or instances may only report load for the metrics that they were configured to use when they were created. The list of metrics a service can report is the same set specified when the service is created. The list of metrics associated with the service may also be updated dynamically. If a service replica or instance tries to report load for a metric that it is not currently configured to use, Service Fabric logs that report but ignores it. If there are other metrics reported in the same API call that are valid, those reports are accepted and used. This is neat because it allows for greater experimentation. The code can measure and report all metrics it knows about, and the operator can specify and update the metric configuration for that service without having to change the code. For example, the administrator or ops team could disable a metric with a buggy report for a particular service, reconfigure the weights of metrics based on behavior, or enable a new metric only after the code has already been deployed and validated via other mechanisms.

## Mixing default load values and dynamic load reports
If default load isn't sufficient, and reporting load dynamically is recommended, can both be used? Yes! In fact, this is the recommended configuration. When both default load is set and dynamic load reports are utilized, the default load serves as an estimate until dynamic reports show up. This is good because it gives the Cluster Resource Manager something to work with. The default load allows the Cluster Resource Manager to place the service objects in good places when they are created. If no default load information is provided placement of services is random. When load reports come in later the Cluster Resource Manager almost always has to move services around.

Let’s take our previous example and see what happens when we add some custom metrics and dynamic load reporting. In this example, we use “Memory” as an example metric. Let’s presume that we initially created the stateful service with the following command:

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("MemoryInMb,High,21,11”,"PrimaryCount,Medium,1,0”,"ReplicaCount,Low,1,1”,"Count,Low,1,1”)
```

As a reminder, this syntax is ("MetricName, MetricWeight, PrimaryDefaultLoad, SecondaryDefaultLoad").

Let's see what one possible cluster layout could look like:

<center>
![Cluster Balanced with both Default and Custom metrics][Image2]
</center>

Some things that are worth noting:

* Because replicas or instances use the service’s default load until they report their own, we know that the replicas inside partition 1 of the stateful service haven’t reported load dynamically
* Secondary replicas within a partition can have their own load
* Overall the metrics look balanced. For memory, the ratio between the maximum and minimum load is 1.75 (the node with the most load is N3, the least is N2, and 28/16 = 1.75).

There are some things that we still need to explain:

* What determined whether a ratio of 1.75 was reasonable or not? How does the Cluster Resource Manager know if that’s good enough or if there is more work to do?
* When does balancing happen?
* What does it mean that Memory was weighted “High”?

## Metric weights
Being able to track the same metrics across different services is important. That view is what allows the Cluster Resource Manager to track consumption in the cluster, balance consumption across nodes, and ensure that nodes don’t go over capacity. However, services may have different views as to the importance of the same metric. Also, in a cluster with many metrics and lots of services, perfectly balanced solutions may not exist for all metrics. How should the Cluster Resource Manager handle these situations?

Metric weights allow the Cluster Resource Manager to decide how to balance the cluster when there’s no perfect answer. Metric weights also allow the Cluster Resource Manager to balance specific services differently. Metrics can have four different weight levels: Zero, Low, Medium, and High. A metric with a weight of Zero contributes nothing when considering whether things are balanced or not, but its load does still contribute to things like capacity.

The real impact of different metric weights in the cluster is that the Cluster Resource Manager generates different solutions. Metric weights tell the Cluster Resource Manager that certain metrics are more important than others. When there's no perfect solution the Cluster Resource Manager can prefer solutions which balance the higher weighted metrics better. If one service thinks a metric is unimportant, it may find their use of that metric imbalanced. This allows another service to get an even distribution that is important to it.

Let’s look at an example of some load reports and how different metric weights can result in different allocations in the cluster. In this example, we see that switching the relative weight of the metrics results in the Cluster Resource Manager preferring different solutions and creating different arrangements of services.

<center>
![Metric Weight Example and Its Impact on Balancing Solutions][Image3]
</center>

In this example, there are four different services, all reporting different values for two different metrics A and B. In one case all the services define Metric A is the most important one (Weight = High) and MetricB as unimportant (Weight = Low). In this case, we see that the Cluster Resource Manager places the services so that MetricA is better balanced (has a lower standard deviation) than MetricB. In the second case, we reverse the metric weights. As a result, the Cluster Resource Manager would probably swap services A and B to come up with an allocation where MetricB is better balanced than MetricA.

### Global metric weights
So if ServiceA defines MetricA as most important, and ServiceB doesn’t care about it at all, what’s the actual weight that ends up getting used?

There are actually multiple weights that are tracked for every metric. The first set are the weights that each service defined for the metric. The other weight is a global weight, which is the average from all the services that report that metric. The Cluster Resource Manager uses both these weights when calculating the scores of the solutions. This is because it is important that a service is balanced according to its own priorities, but also that the cluster as a whole is allocated correctly.

What would happen if the Cluster Resource Manager didn’t care about both global and local balance? Well, it’s trivial to construct solutions that are globally balanced but which result in poor resource allocations for individual services. In the following example, let’s look at the default metrics that a stateful service is configured with and see what happens when if only global balance is considered:

<center>
![The Impact of a Global Only Solution][Image4]
</center>

In the top example where we only looked at global balance, the cluster as a whole is indeed balanced. All nodes have the same count of primaries and the same number total replicas. However, if you look at the actual impact of this allocation it’s not so good: the loss of any node impacts a particular workload disproportionately, because it takes out all its primaries. For example, if the first node fails the three primaries for the three different partitions of the Circle service would all be lost. Conversely, the other two services (Triangle and Hexagon) have their partitions lose a replica, which causes no disruption (other than having to recover the down replica).

In the bottom example, the Cluster Resource Manager has distributed the replicas based on both the global and per-service balance. When calculating the score of the solution it gives most of the weight to the global solution, and a (configurable) portion to individual services. Global balance is calculated based on the average of the metric weights configured for each of the services. Each service is balanced according to its own defined metric weights. This ensures that the services are balanced within themselves according to their own needs as much as possible. As a result, if the same first node fails the loss of primaries (and secondaries) is distributed across all partitions of all services. The impact to each is the same.

## Next steps
* For more information about the other options available for configuring services, check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
* Defining Defragmentation Metrics is one way to consolidate load on nodes instead of spreading it out. To learn how to configure defragmentation, refer to [this article](service-fabric-cluster-resource-manager-defragmentation-metrics.md)
* To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
* Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
* Movement Cost is one way of signaling to the Cluster Resource Manager that certain services are more expensive to move than others. To learn more about movement cost, refer to [this article](service-fabric-cluster-resource-manager-movement-cost.md)

[Image1]:./media/service-fabric-cluster-resource-manager-metrics/cluster-resource-manager-cluster-layout-with-default-metrics.png
[Image2]:./media/service-fabric-cluster-resource-manager-metrics/Service-Fabric-Resource-Manager-Dynamic-Load-Reports.png
[Image3]:./media/service-fabric-cluster-resource-manager-metrics/cluster-resource-manager-metric-weights-impact.png
[Image4]:./media/service-fabric-cluster-resource-manager-metrics/cluster-resource-manager-global-vs-local-balancing.png
