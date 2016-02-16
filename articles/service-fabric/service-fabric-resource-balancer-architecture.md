<properties
   pageTitle="Resource Balancer architecture | Microsoft Azure"
   description="An architectural overview of Service Fabric Resource Balancer."
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

# Resource Balancer architecture overview

![Resource Balancer Architecture][Image1]

Resource Balancer in Azure Service Fabric consists of a single centralized resource-balancing service and a component that exists on every node. These are conceptually collocated with Service Fabric Failover Manager and with the local Service Fabric node, respectively.

The local agent is responsible for collecting and buffering load reports from the services that are running on the local node, for sending them to the Resource Balancer service, and also for reporting failures and other events to Failover Manager and Resource Balancer (1 and 2 above). Resource Balancer and Failover Manager collaborate to respond to load events and other events in the system. These events may include replica or node failures, load reports, and services and applications that are created and deleted.

For example, when a replica fails, Failover Manager requests that Resource Balancer suggest a location for the replacement, based on load data from the different nodes. Similarly, when a new service request is received, Failover Manager requests recommendations from Resource Balancer for where to place that service. In all these cases, Resource Balancer responds with changes to various service configurations (3). These changes are then enacted by Failover Manager. In the preceding example, Failover Manager creates a new replica on the node, which results in the best overall balance (4).

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Resource-balancing features:

- [Describe the cluster](service-fabric-resource-balancer-cluster-description.md)
- [Describe services](service-fabric-resource-balancer-service-description.md)
- [Report dynamic load](service-fabric-resource-balancer-dynamic-load-reporting.md)
- [Proactive metric packing](service-fabric-resource-balancer-proactive-metric-packing.md)
- [Node buffer percentage](service-fabric-resource-balancer-node-buffer-percentage.md)

[Image1]: media/service-fabric-resource-balancer-architecture/Service-Fabric-Resource-Balancer-Architecture.png
