<properties
   pageTitle="Resource Balancer Architecture"
   description="An architectural overview of Service Fabric's Resource Balancer"
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

# Resource Balancer Architecture Overview

![Resource Balancer Architecture][Image1]

The Service Fabric Resource Balancer consists of a single centralized Resource Balancing service and a component that exists on every node, which are conceptually collocated with the Service Fabric Failover Manager and with the local Service Fabric node, respectively.

The local agent is responsible for collecting and buffering load reports from the services that are running on the local node, for sending them to the Resource Balancer service, and also for reporting failures and other events to the Failover Manager and Resource Balancer (1 and 2 above). The Resource Balancer service and the Failover Manager collaborate to respond to load events and other events in the system, such as replica or node failures, load reports, and services and applications that are created and deleted. For example, when a replica fails, the Failover Manager requests that the Service Fabric Resource Balancer suggest a location for the replacement that is based on load data from the different nodes. Similarly, when a new service request is received, the Failover Manager requests recommendations from the Resource Balancer for where to place that service. In all these cases, the Resource Balancer responds with changes to various service configurations (3), which are then enacted by the Failover Manager. In the preceding example, the Failover Manager creates a new replica on the node, which results in the best overall balance (4).

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Resource Balancing Features:

- [Describe the Cluster](service-fabric-resource-balancer-cluster-description.md)
- [Describe Services](service-fabric-resource-balancer-service-description.md)
- [Report Dynamic Load](service-fabric-resource-balancer-dynamic-load-reporting.md)
- [Proactive Metric Packing](service-fabric-resource-balancer-proactive-metric-packing.md)
- [Node Buffer Percentage](service-fabric-resource-balancer-node-buffer-percentage.md)

[Image1]: media/service-fabric-resource-balancer-architecture/Service-Fabric-Resource-Balancer-Architecture.png
 