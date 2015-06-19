<properties
   pageTitle="Proactive Metric Packing"
   description="An overview of using Proactive Metric Packing in the Resource Balancer"
   services="service-fabric"
   documentationCenter=".net"
   authors="abhic"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/27/2015"
   ms.author="abhic"/>

# Proactive Metric Packing

A common configuration for the Service Fabric Resource Balancer is to achieve equal utilization per every metric on every node. Resource Balancer is also in charge for finding a place for service when new service requests arrive. If there is not enough free space to place new service replicas (all replicas of all service's partitions), Resource Balancer will try to create space for it by moving existing workloads around. While this is perfectly normal, depending on how full the cluster is and the level of workload fragmentation, it can take time.

For example, if the cluster is decently utilized and if customer wants to add new service with a large default load (e.g. max node capacity for one or more metrics) it may happen that the Resource Balancer needs to move many replicas in order to place new service. Also, if services are stateful and large, executing the necessary moves could take some time since data needs to be copied. Both of these concerns can extend new service creation time. While generally services should be tolerant of occasional slow creation times, some workloads are less tolerant and want to be created as soon as possible, meaning that in a steady state the Resource Balancer needs to ensure that the cluster is “defragmented” in order to provide a greater chance that there is sufficient available room for new workloads.

The proactive metric packing (a.k.a. defragmentation) mechanism runs as a part of the Resource Balancer’s balancing phase with the goal to minimize the service creation time by packing workloads onto fewer nodes, rather than distributing them as during balancing. When a metrics is configured for defragmentation the Resource Balancer aims to achieve maximal average standard deviation, rather than the minimal average standard deviation used when balancing.

With maximum deviation, the Resource Balancer will try to place as many services as possible on some nodes while keeping as many nodes as possible empty. Besides that, one of the basic constraints for placing new services is that replicas cannot be in same upgrade domain or fault domain. As the goal is to be able to add new services quickly, Resource Balancer should aim to have minimal standard deviation of load distribution among upgrade domains and fault domains (sum of the services loads per upgrade domain/fault domain). The result will be same amount of free space per upgrade domain/fault domain. Defragmentation also respects all other constraints in the system such as Affinity, Placement Constraints, and node metric Capacity.

## Resource Balancer Cluster Configuration
Within the cluster manifest, the following several different configuration values that define the overall behavior of the metric packing feature under Resource Balancer:

### DefragmentationMetrics – Metrics that Resource Balancer should consider for proactive packing/defragmentation.

All configured metrics should be specified in this list (just like in the Activity and Balancing threshold lists). If the metric is specified with the value “true” it will be treated as a defragmentation metric, but with value “false” (or if it is not specified in this list) it will not be considered for defragmentation.

``` xml
<FabricSettings>
  <Section Name="DefragmentationMetrics">
    <Parameter Name="MetricName1" Value="true"/>
    <Parameter Name="MetricName2" Value="false"/>
  </Section>
</FabricSettings>
```

### BalacingThreshholds

Balancing thresholds govern how fragmented the cluster can become with regard to a particular metric before the Resource Balancer runs balancing phase (which will do metric packing logic). If the metric is considered as defragmentation metric, balancing threshold is the minimum ratio between the maximally used and minimally used nodes per upgrade or fault domain that the Resource Balancer allows to exist, before it does defragmentation in the cluster. If any upgrade or fault domain has this ration smaller than threshold, defragmentation phase will kick in.

The following figure shows two examples, where the balancing threshold for the given metric is 10.

![Balancing Threshold][Image1]

Note that at this time, the "utilization" on a node does not take into consideration the size of the node as determined by the capacity of the node, but only the absolute use that is currently reported on the node for the specified metric.

If the metric is not specified, default value is 1. In that case, defragmentation will be performed until cluster has at least 1 empty node in every upgrade domain and in every fault domain.

Value 0 means don’t take into account this metric during balancing phase – either if it is considered for defragmentation or not.

The code example shows that balancing thresholds for metrics are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name="MetricBalancingThresholds">
    <Parameter Name="MetricName" Value="10"/>
  </Section>
</FabricSettings>
```

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer Architecture](service-fabric-resource-balancer-architecture.md)

[Image1]: media/service-fabric-resource-balancer-proactive-metric-packing/PMP.png
