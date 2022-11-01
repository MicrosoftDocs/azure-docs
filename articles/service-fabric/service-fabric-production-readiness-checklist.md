---
title: Azure Service Fabric Production Readiness Checklist
description: Get your Service Fabric application and cluster production ready by following best practices.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Production readiness checklist

Is your application and cluster ready to take production traffic? Running and testing your application and your cluster doesn't necessarily mean it's ready to go into production. Keep your application and cluster running smoothly by going through the following checklist. We strongly recommend all these items to be checked off. Obviously, you can choose to use alternative solutions for a particular line item  (for example, your own diagnostics frameworks).


## Prerequisites for production
1. Azure Service Fabric best practices: [Application Design](./service-fabric-best-practices-applications.md), [Security](./service-fabric-best-practices-security.md), [Networking](./service-fabric-best-practices-networking.md), [Capacity planning and scaling](./service-fabric-best-practices-capacity-scaling.md), [Infrastructure as Code](./service-fabric-best-practices-infrastructure-as-code.md), and [Monitoring and Diagnostics](./service-fabric-best-practices-monitoring.md). 
1. [Configure FabricTransport settings](./service-fabric-reliable-actors-fabrictransportsettings.md) if you're using the Reliable Actors programming model and require secure inter-service communication.
1. For clusters with more than 20 cores or 10 nodes, create a dedicated primary node type for system services. Add [placement constraints](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md) to reserve the primary node type for system services.
1. Use a D2v2 or higher SKU for the primary node type. It is recommended to pick a SKU with at least 50 GB hard disk capacity.
1. Production clusters must be [secure](service-fabric-cluster-security.md). For an example of setting up a secure cluster, see this [cluster template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/7-VM-Windows-3-NodeTypes-Secure-NSG). Use common names for certificates and avoid using self signed certs.
1. Add [resource constraints on containers and services](service-fabric-resource-governance.md), so that they don't consume more than 75% of node resources. 
1. Understand and set the [durability level](service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster). Silver or higher durability level is recommended for node types running stateful workloads, and required for production.
1. Understand and pick the [reliability level](service-fabric-cluster-capacity.md#reliability-characteristics-of-the-cluster) of the node type. Silver or higher reliability is recommended, and required for production.
1. Load and scale test your workloads to identify [capacity requirements](service-fabric-cluster-capacity.md) for your cluster. 
1. Your services and applications are monitored and application logs are being generated and stored, with alerting. For example, see [Add logging to your Service Fabric application](service-fabric-how-to-diagnostics-log.md) and [Monitor containers with Azure Monitor logs](service-fabric-diagnostics-oms-containers.md).
1. The cluster is monitored with alerting (for example, with [Azure Monitor logs](service-fabric-diagnostics-event-analysis-oms.md)). 
1. The underlying virtual machine scale set infrastructure is monitored with alerting (for example, with [Azure Monitor logs](service-fabric-diagnostics-oms-agent.md).
1. The cluster has [primary and secondary certificates](service-fabric-cluster-security-update-certs-azure.md) always (so you don't get locked out).
1. Maintain separate clusters for development, staging, and production. 
1. [Application upgrades](service-fabric-application-upgrade.md) and [cluster upgrades](service-fabric-tutorial-upgrade-cluster.md) are tested in development and staging clusters first. 
1. Turn off automatic upgrades in production clusters, and turn it on for development and staging clusters (rollback as needed). 
1. Establish a Recovery Point Objective (RPO) for your service, and set up a [disaster recovery process](service-fabric-disaster-recovery.md) and test it out.
1. Plan for [scaling](service-fabric-cluster-scaling.md) your cluster manually or programmatically.
1. Plan for [patching](how-to-patch-cluster-nodes-windows.md) your cluster nodes. 
1. Establish a CI/CD pipeline so that your latest changes are being continually tested. For example, using [Azure DevOps](service-fabric-tutorial-deploy-app-with-cicd-vsts.md) or [Jenkins](/azure/developer/jenkins/deploy-to-service-fabric-cluster)
1. Test your development & staging clusters under load with the [Fault Analysis Service](service-fabric-testability-overview.md) and induce controlled [chaos](service-fabric-controlled-chaos.md). 
1. Plan for [scaling](service-fabric-concepts-scalability.md) your applications. 


If you're using the Service Fabric Reliable Services or Reliable Actors programming model, the following items need to be checked off:
1. Upgrade applications during local development to check that your service code is honoring the cancellation token in the `RunAsync` method and closing custom communication listeners.
1. Avoid [common pitfalls](service-fabric-work-with-reliable-collections.md) when using Reliable Collections.
1. Monitor the .NET CLR memory performance counters when running load tests and check for high rates of Garbage Collection or runaway heap growth.
1. Maintain offline backup of [Reliable Services and Reliable Actors](service-fabric-reliable-services-backup-restore.md) and test the restoration process.
1. Your Primary NodeType Virtual Machine instance count should ideally be equal to the minimum for your Clusters Reliability tier; conditions when appropriate to exceed the Tier minimum includes: temporarily when vertically scaling your Primary NodeTypes Virtual Machine Scale Set SKU.

## Optional best practices

While the above lists are pre-requisites to go into production, the following items should also be considered:
1. Plug into the [Service Fabric health model](service-fabric-health-introduction.md) for extending the built-in health evaluation and reporting.
1. Deploy a custom watchdog that is monitoring your application and reports [load](service-fabric-cluster-resource-manager-metrics.md) for [resource balancing](service-fabric-cluster-resource-manager-balancing.md). 


## Next steps
* [Deploy a Service Fabric Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md)
* [Deploy a Service Fabric Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md)
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).