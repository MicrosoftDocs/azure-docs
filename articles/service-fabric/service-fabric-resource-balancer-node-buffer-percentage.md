<properties
   pageTitle="Node buffer percentage | Microsoft Azure"
   description="An overview of the role of node buffer percentage in Resource Balancer"
   services="service-fabric"
   documentationCenter=".net"
   authors="GaugeField"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/03/2015"
   ms.author="masnider"/>

# Overview of node buffer percentage

Currently, customers can specify the node capacity limit as a constraint that Resource Balancer respects based on constraint priority. If the capacity constraint priority is high (node capacity cannot be breached) and if cluster nodes are highly utilized, failover might not be immediate or node capacity might be breached.

Problems can happen if nodes with secondary replicas are near node capacity when a node with the primary replica goes down. In that case, if the primary load is greater than the secondary load, the secondary replica cannot be immediately promoted without having node overcommit or replica copy.

When proactive packing logic is running, a higher number of cluster nodes will be near the node capacity limit. Node buffer percentage is a feature that prevents increased failover time or node overcommit during failover, by enabling customers to specify the percentage of the node that should be kept free. Replicas of the new services should not be added to the node buffer space, but Resource Balancer should be able to use total node capacity (accounting for buffer space) for failovers and adding missing replicas.

This feature can be used even when the proactive metric-packing feature is turned off.

The code example below shows that node buffer percentages for metrics are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name=" NodeBufferPercentage">
    <Parameter Name="MetricName" Value="0.1"/>
  </Section>
</FabricSettings>

```

Value 0.1 for the metric with the name “MetricName” means that 10 percent of every node capacity for the metric “MetricName” should be kept free.

If the value is not specified in this section, 0 will be used as the default value.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer architecture](service-fabric-resource-balancer-architecture.md)
