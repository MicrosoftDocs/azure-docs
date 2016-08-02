<properties
   pageTitle="Managing Metrics with the Azure Service Fabric Cluster Resource Manager | Microsoft Azure"
   description="Learn about how to configure and use metrics in Service Fabric."
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

# Managing resource consumption and load in Service Fabric with metrics
Metrics are the generic term within Service Fabric for the resources that your services care about. Generally, a metric is anything that you want to manage in terms of a resource in order to deal with the performance of your services.

In all of the examples above we kept referring to metrics implicitly; things like Memory, Disk, CPU usage – all of these are examples of metrics. These are physical metrics, resources that correspond to physical resources on the node that need to be managed. Metrics can also be logical metrics, things like “MyWorkQueueDepth” that are application-defined and which correspond to some level of resource consumption (but where the application don’t really know it or know how to measure it). In fact, most metrics that we see people use are logical metrics. There's a variety of reasons for this, but the most common is that today many of our customers write their services in managed code, and from within a given stateless service instance or stateful service replica object it is actually quite hard to measure and report your consumption of actual physical resources. The complexity of reporting your own metrics is also why we provide some default metrics out of the box.

## Default metrics
Let’s say that you just want to get started and don’t know what resources you are going to consume or even which ones would be important to you. So you go implement and then create your services without specifying any metrics. That’s fine! We’ll pick some metrics for you. The default metrics that we use for you today if you don’t specify any of your own are called PrimaryCount, ReplicaCount, and (somewhat vaguely, we realize) Count. The table below shows how much load for each of these metrics is associated with each service object:

| Metric | Stateless Instance Load |	Stateful Secondary Load |	Stateful Primary Load |
|--------|--------------------------|-------------------------|-----------------------|
| PrimaryCount | 0 |	0 |	1 |
| ReplicaCount | 0	| 1	| 1 |
| Count |	1 |	1 |	1 |

Ok, so with these default metrics, what do you get? Well it turns out that for basic workloads you get a pretty good distribution of work. In this example below let’s see what happens when we create one stateful service with three partitions and a target replica set size of three, and also a single stateless service with an instance count of three - you’ll get something like this!

![Cluster Layout with Default Metrics][Image1]

In this example we see
-	Primary replicas for the stateful service are not stacked up on a single node
-	Replicas for the same partition are not on the same node
-	The total number of primaries and secondaries is well distributed in the cluster
-	The total number of service objects (stateless and stateful) are evenly allocated on each node

Pretty good!  

This works great until you start to think about it: What's the likelihood that the partitioning scheme you picked will result in perfectly even utilization by all partitions over time? Coupled with that, what’s the chance that the load for a given service is constant over time, or even just the same right now? Turns, out for any serious workload it is actually rather low, so if you're interested in getting the most out of your cluster you'll probably want to start looking into custom metrics.

Realistically, you could absolutely run with the default metrics, or at least static custom metrics, but doing so usually means that your cluster utilization is lower than you’d like (since reporting isn’t adaptive); in the worst case it can also result in overscheduled nodes resulting in performance issues. We can do better with custom metrics and dynamic load reports.

This leads us to our next sections – custom metrics and dynamic loads.

## Custom metrics
We’ve already discussed that there can be both physical and logical metrics, and that people can define their own metrics. But how? Well, it's actually pretty easy! Just configure the metric and the default initial load when creating the service and you’re done! Any set of metrics and default values can be configured on a per-named-service-instance basis when you’re creating the service.

Note that when you start defining custom metrics you need to explicitly add back in the default metrics if you want us to use them to balance your service as well. This is because we want you to be clear about the relationship between the default metrics and your custom metrics – maybe you care about Memory consumption or WorkQueueDepth way more than you care about Primary distribution.

Let’s say you wanted to configure a service which would report a metric called “Memory” (in addition to the default metrics). For memory, let’s say that you’ve done some basic measurements and know that normally a primary replica of that service takes up 20Mb of Memory, while secondaries of that same service will take up 5Mb. You know that Memory is the most important metric in terms of managing the performance of this particular service, but you still want primary replicas to be balanced so that the loss of some node or fault domain doesn’t take an inordinate number of primary replicas along with it. Other than that you’ll take the defaults.

Here’s what you’d do:

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
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("Memory,High,20,5”,"PrimaryCount,Medium,1,0”,"ReplicaCount,Low,1,1”,"Count,Low,1,1”)
```

(Reminder that if you just want to use the default metrics, you don’t need to touch the metrics collection at all.)

Now that we’ve shown you how to define your own metrics, let’s talk about the different properties that metrics can have. We’ve already shown them to you, but it’s time to talk about what they actually mean! There are four different properties a metric can have today:

-	Metric Name: This is the name of the metric. This is a unique identifier for the metric within the cluster from the Resource Manager’s perspective.
-	PrimaryDefaultLoad: The default amount of load that this service will exert for this metric as a Primary
-	SecondaryDefaultLoad: The default amount of load that this service will exert for this metric as a Secondary replica
-	Weight: This is how important the metric is relative to the other configured metrics for this service.

## Load
Load is the general notion of how much of a given metric is consumed by some service instance or replica on a given node.

## Default load
Default load is how much load the Cluster Resource Manager should assume each service instance or replica of this service will consume until it receives any updates from the actual service instances or replicas. For simpler services, this ends up being a static definition that is never updated dynamically and hence will be used for the lifetime of the service. This works great for simple capacity planning because it’s exactly what we are used to doing – dedicating certain resources to certain workloads, but the benefit is that at least now we’re operating in the microservices mindset where resources aren’t actually statically assigned to particular workloads and where people aren’t in the decision-making loop.

We allow stateful services to specify default load for both their Primaries and Secondaries – realistically for a lot of services these numbers are different due to the different workloads executed by primary replicas and secondary replicas, and since primaries usually serve both reads and writes (as well as most of the computational burden) the default load for a primary replica is higher than for secondary replicas.

But now let’s say that you’ve been running your service for a while and you’ve noticed that some instances or replicas of your service consume way more resources than others or that their consumption varies over time – maybe they’re associated with a particular customer, maybe they just correspond to workloads that vary over the course of the day like messaging traffic or stock trades. At any rate, you notice that there’s no “single number” that you can use for the load without being off by a significant amount. You also notice that “being off” in your initial estimate results in Service Fabric either over or under allocating resources to your service, and consequently you have nodes which are over or under utilized.
What to do? Well, your service could be reporting load on the fly!

## Dynamic load
Dynamic Load reports allow replicas or instances to adjust their allocation/reported use of metrics in the cluster over their lifetime. A service replica or instance that was cold and not doing any work would usually report that it was using low amounts of resources, while busy replicas or instances report that they are using more. This general level of churn in the cluster allows us to reorganize the service replicas and instances in the cluster on the fly in order to ensure that the services and instances are getting the resources they require – in effect that busy services are able to reclaim resources from other replicas or instances which are currently cold or doing less work. Reporting load on the fly can be done via the ReportLoad method, available on the ServicePartition, available as a property on the base StatefulService. Within your service the code would look like this:

Code:

```csharp
this.ServicePartition.ReportLoad(new List<LoadMetric> { new LoadMetric("Memory", 1234), new LoadMetric("metric1", 42) });
```

Services replicas or instances may only report load for the metrics that they have been configured to use. The metric list is set when each service is created. If a service replica or instance tries to report load for a metric that it is not currently configured to use, Service Fabric logs the report but ignores it, meaning that we won’t use it when calculating or reporting on the state of the cluster. This is neat because it allows for greater experimentation – the code can measure and report on everything it knows how to, and the operator can configure, tweak, and update the resource balancing rules for that service on the fly without ever having to change the code. This can include for example, disabling a metric with a buggy report, reconfiguring the weights of metrics based on behavior, or enabling a new metric only after the code has already been deployed and validated.

## Mixing default load values and dynamic load reports
Does it make sense to have a default load specified for a service which is going to be reporting load dynamically? Absolutely! In this case the default load serves as an estimate until the real reports start to show up from the actual service replica or instance. This is great because it gives the Resource Manager something to work with when placing the replica or instance at the time of creation – the default load ends up as an initial estimate which allows the Resource Manager to place the service instances or replicas in good places right from the start; if no information were provided the placement would effectively be random and we’d almost certainly have to move things as soon as the real load reports started coming in.

So let’s take our previous example and see what happens when we add some custom load and then when after the service is created it gets updated dynamically. In this example, we’ll use “Memory” as an example, and let’s presume that we initially created the stateful service with the following command:

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 2 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("Memory,High,21,11”,"PrimaryCount,Medium,1,0”,"ReplicaCount,Low,1,1”,"Count,Low,1,1”)
```

We talked about this syntax earlier (MetricName, MetricWeight, PrimaryDefaultLoad, SecondaryDefaultLoad), but we’ll talk more about what the specific value for Weight means later.

Let's see what one possible cluster layout could look like:

![Cluster Balanced with both Default and Custom metrics][Image2]

Some things that are worth noting:

-	Since replicas or instances use the service’s default load until they report their own load, we know that the replicas inside of partition 1 of the stateful service haven’t reported load on their own
-	Secondary replicas within a partition can have their own load
-	Overall the metrics look pretty good, with the difference between the maximum and minimum load on a node (for memory – the custom metric we said we cared the most about) of only a factor of 1.75 (the node with the most load for the memory is N3, the least is N2, and 28/16 = 1.75) – pretty balanced!

There are some things that we still need to explain

-	What determined whether a ratio of 1.75 was reasonable or not? How do we know that’s good enough or if there is more work to do?
-	When does balancing happen?
-	What does it mean that Memory was weighted “High”?

## Metric weights
Metric Weights are what allows two different services to report the same metrics but to view the importance of balancing that metric differently. For example, consider an in-memory analytics engine and a persistent database; both probably care about the “Memory” metric, but the in-memory service probably doesn’t care much about the “Disk” metric – it might consume a little of it, but it is not critical to the service’s performance. Being able to track the same metrics across different services is great since that’s what allows the Resource Manager to track real consumption in the cluster, ensure that nodes don’t go over capacity, etc.

Metric weights allow the Resource Manager to make real decisions about how to balance the cluster when there’s no perfect answer (which is a lot of the time). Metrics can have four different weight levels: Zero, Low, Medium, and High. A metric with a weight of Zero contributes nothing when considering whether things are balanced or not, but its load does still contribute to things like capacity measurement.

The real impact of different metric weights in the cluster is that we arrive at materially different arrangements of the services since the Resource Manager has been told, in aggregate, that ensuring that certain metrics are more important than others, and therefore that they should be preferred for balancing if they conflict with other, lower priority metrics.

Let’s take a look at a simple example of some load reports and how different metric weights can result in different allocations in the cluster. In this example we see that switching the relative weight of the metrics results in the Resource Manager preferring certain solutions by creating different arrangements of services.

![Metric Weight Example and Its Impact on Balancing Solutions][Image3]

In this example there are four different services, all reporting different values for two different metrics A and B. In one case all the services define, Metric A is the most important one (Weight = High) and MetricB as relatively unimportant (Weight = Low), and indeed we see that the Service Fabric Resource Manager places the services so that MetricA is better balanced (has a lower deviation) than MetricB. In the second case, we reverse the metric weights, and we see that the Resource Manager would probably swap services A and B in order to come up with an allocation where MetricB is better balanced than MetricA.

### Global metric weights
So if ServiceA defines MetricA as most important, and ServiceB doesn’t care about it at all, what’s the actual weight that the Resource Manager ends up using?

Well there are actually two weights we keep track of for every metric – the weight the service itself defined and the global average weight across all of the services that care about that metric. We use both these weights when calculating the scores of the solutions we generate, since it is important to ensure that both a service is balanced with regard to its own priorities, but also that the cluster as a whole is allocated correctly.

What would happen if we didn’t care about both global and local balance? Well, it’s trivial to construct solutions that are globally balanced but which result in very poor balance and resource allocation for individual services. In the example below let’s consider the default metrics that a stateful service is configured with, PrimaryCount, ReplicaCount, and TotalCount, and see what happens when we only consider global balance:

![The Impact of a Global Only Solution][Image4]

In the top example where we only looked at global balance, the cluster as a whole is indeed balanced – all nodes have the same count of primaries, and total replicas, so great! Things are balanced. However if you look at the actual impact of this allocation it’s not so good: the loss of any node impacts a particular workload disproportionally, as it takes out all of its primaries. Take for example if we were to lose the first node. If this happened the three primaries for the three different partitions of the Circle service would all be lost simultaneously. Conversely, the other two services (Triangle and Hexagon) have their partitions lose a replica, which causes no disruption (other than having to recover the down replica).

In the bottom example we have distributed the replicas based on both the global and per-service balance. When calculating the score of the solution we give a majority of the weight to the global solution, but a (configurable) portion does go to ensuring that the services are balanced within themselves as much as possible as well. As a result, if we were to lose the same first node, we see that the loss of primaries (and secondaries) is distributed across all partitions of all services and the impact to each is the same.

Taking metric weights into account, the global balance is calculated based on the average of the metric weights. We balance a service with regard to its own defined metric weights.

## Next steps
- For more information about the other options available for configuring services check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
- Defining Defragmentation Metrics is one way to consolidate load on nodes instead of spreading it out. To learn how to configure defragmentation, refer to [this article](service-fabric-cluster-resource-manager-defragmentation-metrics.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
- Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
- Movement Cost is one way of signaling to the Cluster Resource Manager that certain services are more expensive to move than others. To learn more about movement cost, refer to [this article](service-fabric-cluster-resource-manager-movement-cost.md)

[Image1]:./media/service-fabric-cluster-resource-manager-metrics/cluster-resource-manager-cluster-layout-with-default-metrics.png
[Image2]:./media/service-fabric-cluster-resource-manager-metrics/Service-Fabric-Resource-Manager-Dynamic-Load-Reports.png
[Image3]:./media/service-fabric-cluster-resource-manager-metrics/cluster-resource-manager-metric-weights-impact.png
[Image4]:./media/service-fabric-cluster-resource-manager-metrics/cluster-resource-manager-global-vs-local-balancing.png
