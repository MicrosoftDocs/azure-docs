<properties
   pageTitle="Dynamic load reporting | Microsoft Azure"
   description="An overview of dynamic load reporting to Resource Balancer"
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

# Overview of dynamic load reporting

During run time, stateful and stateless service objects can report load via the ReportLoad method (member of the IStatefulServicePartition and IStatelessServicePartition interfaces). To report run-time load values is important. It enables accurate packing of services into the nodes and helps ensure that resource utilization is tracked accurately by the central Resource Balancer in Azure Service Fabric, as services are experiencing it on the nodes.

Note that when a replica reports the load, it is first batched up with other load reports locally, and then a single report is sent to Resource Balancer. This process means that if a service reports the load repeatedly and very quickly, only the last report actually gets sent to Resource Balancer.

When Service Fabric Resource Balancer runs, it examines all of the load information that is aggregated from all of the nodes and performs some checks. These checks include the balancing threshold and activity thresholds for the metrics, as defined in the cluster manifest. They determine whether the cluster is imbalanced enough to run Resource Balancer and whether any specific node is above capacity for any of the metrics for which it has a defined capacity. In the over-capacity case, Resource Balancer first only considers services on the node or nodes over capacity that share the metric, which is over capacity. For a cluster imbalance, Resource Balancer considers all services that are related by metrics to any service that reports the imbalanced metric. If Resource Balancer determines that any of these situations has occurred, it runs a simulation that attempts to find a better arrangement of services.

Services should report the load whenever the load changes. They should not perform any aggregation or smoothing of load reports on their own.

Note that when a service reports the load, those load reports replace the default primary and secondary load values that were defined when the service was created. They become the new load values that are used when Service Fabric Resource Balancer has to make balancing or placement decisions from then on.



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer architecture](service-fabric-resource-balancer-architecture.md)
