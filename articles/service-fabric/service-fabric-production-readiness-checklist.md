---
title: Azure Service Fabric Production Readiness Checklist| Microsoft Docs
description: Get your Service Fabric application and cluster production ready by following best practices.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy 
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/11/2018
ms.author: subramar 
---

# Production readiness checklist

Is your Service Fabric application and cluster production ready? You may have been running and testing your application in a cluster, but that doesn't imply it is ready to go into production. To ensure that your application and cluster keep running smoothly with zero downtime, it is important to go through this checklist and verify that each of these items are checked off. While, you may decide to use another solution than the articles linked for a particular line item  (for example, your own diagnostics frameworks), the key is to think through these and plan accordingly.


1. For clusters with more than 50 cores, create separate primary and secondary node types. 
2. Production clusters must be secure. For more information, see [Service Fabric cluster security scenarios](./service-fabric-cluster-security)
2. For clusters with multiple node types, add placement constraints to ensure that the primary node type is reserved for system services.
3. For clusters with multiple node types, set the primary node type durability level to silver or gold (since system services are stateful).
4. Add resource constraints on services, so that they never exceed 75% of node resources. 
5. For any node type running stateful workloads, set the durability level to silver or gold.
6. Perform load/perf/scale tests on your workloads to identify capacity requirements for your cluster. 
7. Your services and applications are monitored and application logs are being generated and stored, with alerting.
8. The cluster is monitored with alerting. 
9. The underlying VMSS infrastructure is monitored with alerting, so you are informed about high loads and can add capacity as required.
10. Ensure the cluster has primary and secondary certificates always (so you don't get locked out).
11. Keep separate clusters for development, staging and production. 
12. Applications and cluster upgrades are always tested in development and staging clusters first.
13. Turn off automatic upgrades in production clusters. 
14. Establish a Recovery Point Objective (RPO) for your service, and the process to handle it.
15. Ensure offline backup of all data, so you can recover from unlikely large scale outages. 
16. Plan for scaling your cluster in/out (manually or programmatically)
17. Estabilish a CI/CD pipeline so that your latest changes are being continually tested.

While the above list is a pre-requisite to go into production, the following items should also be considered:
18. Plug into the Service Fabric health and load reporting APIs.
19. Deploy a custom watchdog that is monitoring your application and reports load/health to the Service Fabric runtime.
20. Add custom metrics in the cluster to enable load balancing based on them. 

## Next steps
* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Read the [Deploy a .NET application in a container](service-fabric-host-app-in-a-container.md) tutorial.
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Checkout the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-containers) on GitHub.

[hello-world]: ./media/service-fabric-get-started-containers-linux/HelloWorld.png
[sf-yeoman]: ./media/service-fabric-get-started-containers-linux/YoSF.png

[1]: ./media/service-fabric-get-started-containers/HealthCheckHealthy.png
[2]: ./media/service-fabric-get-started-containers/HealthCheckUnhealthy_App.png
[3]: ./media/service-fabric-get-started-containers/HealthCheckUnhealthy_Dsp.png
