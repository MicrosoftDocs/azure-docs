<properties
   pageTitle="Node Buffer Percentage"
   description="An overview of the role of Node Buffer Percentage in the Resource Balancer"
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

# Node Buffer Percentage Overview

Currently, customer can specify node capacity limit as a constraint that Resource Balancer respects based on constraint priority. If capacity constraint priority is high (node capacity cannot be breached) and if cluster nodes are highly utilized, it could happen that failover is not immediate or that node capacity is breached.

Problem scan happen if nodes with secondary replicas are near node capacity when a node with the primary replica goes down. In that case, if primary load is greater than secondary load, secondary replica cannot be immediately promoted without having node overcommit or replica copy.

Having proactive packing logic running, higher number of cluster nodes will be near node capacity limit. Node Buffer Percentage is a feature that prevents increased failover time or node overcommit during failover, by providing customers possibility to specify percentage of the node that should be kept free. Replicas of the new services should not be added to the node buffer space but Resource Balancer should be able to use total node capacity (accounting buffer space) for failovers and adding missing replicas.

This feature can be used even in case when proactive metric packing feature is turned off.

The code example shows that node buffer percentages for metrics are configured per metric via the FabricSettings element within the cluster manifest.

``` xml
<FabricSettings>
  <Section Name=" NodeBufferPercentage">
    <Parameter Name="MetricName" Value="0.1"/>
  </Section>
</FabricSettings>

```

Value 0.1 for metric with name “MetricName” means that 10% of every node capacity for metric “MetricName” should be kept free.

If the value is not specified in this section, 0 as default value will be used.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer Architecture](service-fabric-resource-balancer-architecture.md)
 