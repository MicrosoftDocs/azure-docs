<properties
   pageTitle="Dynamic Load Reporting"
   description="An overview of Dynamic Load Reporting to the Resource Balancer"
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

# Dynamic Load Reporting Overview

During runtime, stateful and stateless service objects can report load via the ReportLoad method (member of the IStatefulServicePartition and IStatelessServicePartition interfaces). To report runtime load values is important because it enables accurate packing of services into the nodes and helps ensure that resource utilization is tracked accurately by the central Service Fabric Resource Balancer, as services are experiencing it on the nodes.

Note that when a replica reports load, it is first batched up with other load reports locally, and then a single report is sent to the Resource Balancer. This process means that if a service reports load repeatedly and very quickly, only the last report actually gets sent to the Resource Balancer.

When the Service Fabric Resource Balancer runs, it examines all of the load information that is aggregated from all of the nodes and performs some checks. These checks include the balancing threshold and activity thresholds for the metrics as defined in the cluster manifest. They determine whether the cluster is imbalanced enough to run the Resource Balancer and whether any specific node is above capacity for any of the metrics for which it has a defined capacity. In the over-capacity case, the Resource Balancer first only considers services on the node or nodes over capacity that share the metric, which is over capacity. For a cluster imbalance, the Resource Balancer considers all services that are related by metrics to any service that reports the imbalanced metric. If the Service Fabric Resource Balancer determines that any of these situations has occurred, it runs a simulation that attempts to find a better arrangement of services.

Services should report load whenever the load changes and not perform any aggregation or smoothing of load reports on their own.

Note that when a service reports load, those load reports replace the default Primary and Secondary load values that were defined when the service was created, and become the new load values that are used when the Service Fabric Resource Balancer has to make balancing or placement decisions from then on.



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Resource Balancer Architecture](service-fabric-resource-balancer-architecture.md)
