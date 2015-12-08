<properties
   pageTitle="Resource Balancer Service Descriptions"
   description="An overview of configuring service descriptions for the resource balancer to use | Microsoft Azure"
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
   ms.date="09/15/2015"
   ms.author="masnider"/>

# Service description overview

## Placement constraints
[Placement constraints](../service-fabric-placement-constraint) on a service are the mechanism that a particular service instance uses to select the node properties it requires. Just like node properties, they are key/value pairs that describe the property name and the service’s requirements for the value. Individual statements can be grouped together with simple Boolean logic to create the necessary constraint. Note that the Service Fabric resource balancer interprets the constraints.

Service placement constraints can be defined via either the service or application manifest or directly in code.

The service manifest provides the `ServiceTypes` definitions.

``` xml
<ServiceTypes>
    <StatefulServiceType ServiceTypeName="QueueReplica" HasPersistedState="false" >
      <PlacementConstraints>(HasDisk == true  &amp;&amp; SpindleCount &gt;= 4)</PlacementConstraints>
    </StatefulServiceType>
</ServiceTypes>

```

The application manifest provides the `ServiceTemplates` or  `DefaultServices` definitions.

``` xml
<ServiceTemplates>
    <StatefulService ServiceTypeName="QueueReplica">
      <SingletonPartition></SingletonPartition>
      <PlacementConstraints>(HasDisk == true  &amp;&amp; SpindleCount &gt;= 4)</PlacementConstraints>
    </StatefulService>
  </ServiceTemplates>

  <DefaultServices>
    <Service Name="QR">
      <StatefulService MinReplicaSetSize="3" ServiceTypeName="QueueReplica" TargetReplicaSetSize="3">
        <SingletonPartition/>
        <PlacementConstraints>(HasDisk == true  &amp;&amp; SpindleCount &gt;= 4)</PlacementConstraints>
      </StatefulService>
    </Service>
  </DefaultServices>
```

``` cpp
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
serviceDescription.PlacementConstraints = "(HasDisk == true  && SpindleCount >= 4)";
Task t = fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

The following diagram shows that in the cluster with nodes, the only valid node for placement of this service is N5:

![Placement constraints][Image1]

If the service specifies a constraint for a property that a specific node doesn't have defined, that node isn't considered a match, regardless of the specified value.

## Service affinity
A special form of placement constraint, service affinity enables the description of different services that for varying reasons have a local dependency on each other. This means that both the services must be running on the same node for them to work. While this sort of architecture isn't expected to be common among Service Fabric applications, Service Fabric recognizes that it's a possible transitional architecture for certain types of legacy applications, and therefore makes this capability available.

Establishing service affinity between two services ensures that the primary replicas of those services are always co-located on the same node.

Affinity relationships are represented by a parent-child hierarchy--that is, there are "parents" and "children." The service that's established first is the parent, and the child service is established second in the relationship. The relationship is modeled as a "hard" constraint.

Service affinity currently has the following limitations:

- It can't be used across stateless and stateful services.
- It can't be used across stateless services with different instance counts. For example, both stateless services should have the same InstanceCount property when they are created.
- It can't be used across stateful volatile or persistent services with different numbers of replicas. For example, both services must have the same specified Target and Min ReplicaSetSizes values.
- It can't be used with partitioned services. Each service must have a FABRIC_PARTITION_SCHEME_SINGLETON partition scheme.
- Affinity relationships, like other properties of the service description, are set when the service is created and can't be modified.
- Chains of services are not allowed. If multiple services must be brought into an affinity relationship, they must use a "star" model.

``` xml
<ServiceTemplates>
  <StatelessService ServiceTypeName="StatelessCalculatorService" InstanceCount="5">
    <SingletonPartition></SingletonPartition>
      <ServiceCorrelations>
        <ServiceCorrelation Scheme="Affinity" ServiceName="fabric:/otherApplication/parentService"/>
      </ServiceCorrelations>
  </StatelessService>
</ServiceTemplates>
```

This code example shows the alternate use of the DefaultServices definitions:

``` xml
<DefaultServices>
  <Service Name="childService">
    <StatelessService InstanceCount="3" ServiceTypeName="calculatorService">
      <SingletonPartition/>
     <ServiceCorrelations>
        <ServiceCorrelation Scheme="Affinity" ServiceName="fabric:/otherApplication/parentService"/>
      </ServiceCorrelations>
    </StatelessService>
  </Service>
</DefaultServices>
```

This code example shows how to create an affinity relationship after the containing application has been created:

``` cpp
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
ServiceCorrelationDescription affinityDescription = new ServiceCorrelationDescription();
affinityDescription.Scheme = ServiceCorrelationScheme.Affinity;
affinityDescription.ServiceName = new Uri("fabric:/otherApplication/parentService");
serviceDescription.Correlations.Add(affinityDescription);
Task t = fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

## Resource balancing metrics
While service placement constraints and node properties represent the hard rules and policies that describe which arrangements of services are valid, resource balancing metrics generally help describe the optimal arrangement of services within the cluster. The metrics that are defined by the service have several properties that describe how they're used within the cluster.

### Using default metrics
The first thing to understand is that dealing with resource metrics is completely optional for services, and that by default the Service Fabric resource balancer uses some "built-in" system metrics to perform basic resource balancing without requiring service or cluster administrators to take any actions. The default metrics that the Service Fabric resource balancer tracks and balances within the cluster are PrimaryCount, ReplicaCount, and Count. PrimaryCount is the count of primary stateful service replicas on a node. ReplicaCount is the count of all stateful replicas on a node. Count is the total count of all service objects on the node, including both stateless and stateful services. Generally, the PrimaryCount metric is considered the most important, and it has the highest weight as described in the following section. The PrimaryCount metric is followed by the ReplicaCount metric, and then by the Count metric.

This diagram shows an example of default balancing of three stateful services with three replicas each:

![Default metrics][Image2]

Generally, the default metrics are sufficient for many services and should be used unless there is a specific requirement for additional metrics or capabilities.

### Defining custom metrics
If the default metrics are insufficient for a particular service, or that service has known requirements for requirements around a particular resource, such as disk space or memory, custom metrics should be used. Custom metrics are useful when a service has one or more resources that must be balanced well to prevent contention. The use of those metrics can vary significantly between replicas within the cluster. For example, one primary might be using 100 percent of the metric, while another may be using only 20 percent. It can also be useful to use custom metrics to capture any resource that is severely limited on a computer, such as memory, disk space, or connections. Additional custom metrics can sometimes be created that capture or represent metrics that have no upper limits on nodes, but do represent work and resource consumption from the service’s perspective--a "current outstanding transactions" metric, for example. While there might not be a limit to this metric a "capacity" on a given node, there is still a performance benefit by ensuring that this metric is distributed evenly throughout the cluster.

Note that if a service defines any custom metric, the service doesn't use the default system-provided metrics. The default metrics can still be used, but they must be explicitly re-included in the service’s list of metrics on creation.

### Metric names
Custom metrics can be created merely by defining a metric name when you create a service. Note that the Service Fabric resource balancer associates metrics via their name. If the metric is used as a capacity within node definitions or across services, the metric names must match exactly so the Service Fabric resource balancer can relate them.

### Metric weights
When a service defines multiple metrics, it's also useful to define the metric weights for those metrics. Different metric weights instruct the Service Fabric resource balancer which metric is more important to the function of the service. For example, an in-memory queue might be affected by network bandwidth, but it's probably constrained most by actual memory use on the node. Thus, while the queue might have multiple metrics, the metric that represents memory usage has the highest weight. Similarly, a persistent database probably depends on both memory and disk usage. While limited memory reduces the ability to process complex queries, running out of disk space would prevent further storage operations, which is probably a more critical situation. Therefore, the persistent store probably chooses disk space as the metric with the higher of those two weights.

Note that weight is used within the Service Fabric resource balancer only when it can't fully balance a set of metrics, and thus must find solutions where one metric ends up less balanced overall than another metric. In this case, the balance of the metric with the lower weight is determined to be of lower priority than the metric with the higher weight, so the Service Fabric resource balancer comes up with proposals that favor the balancer of the higher weighted metric.

Also, when the Service Fabric resource balancer recognizes that multiple services have defined the same metric by name, it considers those metrics to be the same metric. In cases where the metric is the same, but the weights are different, the resource balancer averages the specified weights to determine the actual weights to be used during run time. Therefore, if one service defines a weight of Zero, which indicates that it does not require balancing, but another service defines the same metric as having a weight of High, the real weight ends up somewhere in between.

![Metric weights][Image3]

This example shows how two metric-weight scenarios result in different balancing results where the more highly prioritized metric is distributed better overall. In the left example above, B is balanced better, while on the right, A is balanced better. Because in this example there is no balancing solution that results in balance of both metrics, the Service Fabric resource balancer uses the weight of the metrics to determine which is more important, and therefore which metric to prefer during balancing.

Note that the metric weight of Zero is provided for cases where a service tracks a metric but doesn't require balancing based on this metric. For example, consider a metric that has an explicit limit on several nodes, but for which "even utilization across nodes," (what resource balancing normally guarantees) is unimportant. For these sorts of metrics, which don't require balancing but do require enforcement of set limits at nodes, the balancing weight of Zero can be defined. During runtime, the Service Fabric resource balancer enforces capacity, but it doesn't attempt to balance the metric proactively, even if the use of that metric is very imbalanced across nodes.

### Metric default load for a primary or secondary role
When you define a metric for a service, you should provide the expected consumption for that metric when the service is in either a primary or secondary role. This information doesn't just help the resource balancer initially place the service in an efficient way, it can also serve as a good approximation of actual service use of the metrics that it's related to throughout its lifetime. The Service Fabric resource balancer automatically takes this metric consumption into account not only when placing your service, but also at any time it must move replicas around due to balancing or to other changes in the cluster. If a service’s load is fairly predictable and stable, this means that by setting these values, the service can opt out of having to report load during runtime.

This code example shows a service that fully defines two custom metrics, one for memory usage and the other for disk space:

``` cpp
ServiceLoadMetricDescription memoryMetric = new ServiceLoadMetricDescription();
memoryMetric.Name = "MemoryInMb";
memoryMetric.Weight = ServiceLoadMetricWeight.High;
memoryMetric.PrimaryDefaultLoad = 100;
memoryMetric.SecondaryDefaultLoad = 50;

ServiceLoadMetricDescription diskMetric = new ServiceLoadMetricDescription();
diskMetric.Name = "DiskInMb";
diskMetric.Weight = ServiceLoadMetricWeight.Medium;
diskMetric.PrimaryDefaultLoad = 1024;
diskMetric.SecondaryDefaultLoad = 750;

serviceDescription.Metrics.Add(memoryMetric);
serviceDescription.Metrics.Add(diskMetric);

Task t = fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

This code example shows ServiceTypes definitions via the service manifest:

``` xml
<ServiceTypes>
  <StatefulServiceType ServiceTypeName="QueueReplica" HasPersistedState="true">
    <LoadMetrics>
      <LoadMetric Name="MemoryInMb" Weight="High" PrimaryDefaultLoad="100" SecondaryDefaultLoad="50"/>
      <LoadMetric Name="DiskInMb" Weight="Medium" PrimaryDefaultLoad="1024" SecondaryDefaultLoad="750"/>
    </LoadMetrics>
  </StatefulServiceType>
</ServiceTypes>
```

This code example shows ServiceTemplates definitions via the application manifest:

``` xml
<ServiceTemplates>
   <StatefulService ServiceTypeName="QueueReplica">
     <SingletonPartition></SingletonPartition>
     <LoadMetrics>
       <LoadMetric Name="MemoryInMb" Weight="High" PrimaryDefaultLoad="100" SecondaryDefaultLoad="50"/>
       <LoadMetric Name="DiskInMb" Weight="Medium" PrimaryDefaultLoad="1024" SecondaryDefaultLoad="750"/>
     </LoadMetrics>
   </StatefulService>
 </ServiceTemplates>
```
This code example shows the DefaultServices definitions via the application manifest:

``` xml
<DefaultServices>
  <Service Name="QueueServiceInstance">
    <StatefulService MinReplicaSetSize="3" ServiceTypeName="QueueService" TargetReplicaSetSize="3">
      <SingletonPartition/>
      <LoadMetrics>
        <LoadMetric Name="MemoryInMb" Weight="High" PrimaryDefaultLoad="100" SecondaryDefaultLoad="50"/>
        <LoadMetric Name="DiskInMb" Weight="Medium" PrimaryDefaultLoad="1024" SecondaryDefaultLoad="750"/>
      </LoadMetrics>
    </StatefulService>
  </Service>
</DefaultServices>
```

Because the default load values aren't updated unless services specifically opt in to report load at runtime via code, the values can also be used to institute more of a "capacity reservation" resource-balancing model. For example, if workloads generally fall into several size buckets, and a known number of units of work can be placed on a node at any time, then a custom metric of "units" can be created, and thus both node capacity and service default load are defined in terms of units.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information, see [Resource balancer architecture](service-fabric-resource-balancer-architecture.md) and [Placement constraints](service-fabric-placement-constraint.md).

[Image1]: media/service-fabric-resource-balancer-service-description/PC.png
[Image2]: media/service-fabric-resource-balancer-service-description/DM.png
[Image3]: media/service-fabric-resource-balancer-service-description/MW.png
