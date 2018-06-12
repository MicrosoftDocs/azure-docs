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


1. For clusters with more than 20 cores, create separate primary and secondary node types. 
2. Production clusters must be [secure](service-fabric-cluster-security.md).
3. For clusters with multiple node types, add [placement constraints](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md) to ensure that the primary node type is reserved for system services.
4. Add [resource constraints on containers and services](service-fabric-resource-governance.md), so that they never exceed 75% of node resources. 
5. Understand and set the [durability level](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster). Silver or higher durability level is recommended for node types running stateful workloads. The primary node type should have a durability level set to Silver or higher.
6. Understand and pick the [reliability level](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) of the node type. Silver or higher reliability is recommended.
7. Perform load/perf/scale tests on your workloads to identify [capacity requirements](service-fabric-cluster-capacity.md) for your cluster. 
8. Your services and applications are monitored and application logs are being generated and stored, with alerting. For example, see [Add logging to your Service Fabric application](service-fabric-how-to-diagnostics-log.md) and [Monitor containers with Log Analytics](service-fabric-diagnostics-oms-containers.md).
9. The cluster is monitored with alerting (for example, with [OMS](service-fabric-diagnostics-event-analysis-oms.md)). 
10. The underlying VMSS infrastructure is monitored with alerting (for example, with [Log Analytics](service-fabric-diagnostics-oms-agent.md).
11. Ensure the cluster has [primary and secondary certificates](service-fabric-cluster-security-update-certs-azure.md) always (so you don't get locked out).
12. Keep separate clusters for development, staging and production. 
13. [Application upgrades](service-fabric-application-upgrade.md) and [cluster upgrades](service-fabric-tutorial-upgrade-cluster.md) are tested in development and staging clusters first. 
14. Turn off automatic upgrades in production clusters. 
16. Establish a Recovery Point Objective (RPO) for your service, and set up a [disaster recovery process](service-fabric-disaster-recovery.md) and test it out.
17. Ensure offline backup of [Reliable Services and Reliable Actors](service-fabric-reliable-services-backup-restore.md) and test the restoration process. 
18. Plan for [scaling](service-fabric-cluster-scaling.md) your cluster manually or programmatically.
19. Plan for [patching](service-fabric-patch-orchestration-application.md) your cluster nodes. 
20. Estabilish a CI/CD pipeline so that your latest changes are being continually tested. For example, using [VSTS](service-fabric-tutorial-deploy-app-with-cicd-vsts.md) or [Jenkins](service-fabric-cicd-your-linux-applications-with-jenkins.md)
21. Test your development & staging clusters with the [Fault Analysis Service](service-fabric-testability-overview.md) and induce controlled [chaos](service-fabric-controlled-chaos.md). Run chaos simultaneously with a load test, so you're stress testing the system under load. 
22. Plan for [scaling](service-fabric-concepts-scalability.md) your applications. 


If you're using the Service Fabric Reliable Services or Reliable Actors programming model, the following pre-requisites need to be checked off as well:
23. Upgrade applications during local development to ensure your service code is honoring the cancellation token in RunAsync and/or closing custom communication listeners when using Reliable Services.
24. Avoid [common pitfalls](service-fabric-work-with-reliable-collections.md) when using Reliable Collections.
25. Observe .NET CLR memory performance counters when running a load tests and look for high GC usage or runaway heap growth.


While the above lists are pre-requisites to go into production, the following items should also be considered:
26. Plug into the [Service Fabric health model](service-fabric-health-introduction.md) for extending the built-in health evaluation and reporting.
27. Deploy a custom watchdog that is monitoring your application and reports [load](service-fabric-cluster-resource-manager-metrics.md) for [resource balancing](service-fabric-cluster-resource-manager-balancing.md). 




## Next steps
* [Deploy a Service Fabric Windows cluster][service-fabric-tutorial-create-vnet-and-windows-cluster.md]
* [Deploy a Service Fabric Linux cluster][service-fabric-tutorial-create-vnet-and-linux-cluster.md]
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
