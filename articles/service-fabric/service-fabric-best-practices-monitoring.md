---
title: Azure Service Fabric monitoring best practices
description: Best practices and design considerations for monitoring clusters and applications using Azure Service Fabric.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Monitoring and diagnostic best practices for Azure Service Fabric

[Monitoring and diagnostics](./service-fabric-diagnostics-overview.md) are critical to developing, testing, and deploying workloads in any cloud environment. For example, you can track how your applications are used, the actions taken by the Service Fabric platform, your resource utilization with performance counters, and the overall health of your cluster. You can use this information to diagnose and correct issues, and prevent them from occurring in the future.

## Application monitoring

Application monitoring tracks how features and components of your application are being used. Monitor your applications to make sure issues that impact your users are caught. Application monitoring is the responsibility of those developing the application and its services because it is unique to the business logic of your application. It is recommended that you set up application monitoring with [Application Insights](./service-fabric-tutorial-monitoring-aspnet.md), Azure's application monitoring tool.

## Cluster monitoring

One of Service Fabric's goals is to make applications resilient to hardware failures. This goal is achieved through the platform's system services' ability to detect infrastructure issues and rapidly failover workloads to other nodes in the cluster. But what if the system services themselves have issues? Or if in attempting to deploy or move a workload, rules for the placement of services are violated? Service Fabric provides diagnostics for these, and other issues, to make sure you are informed about how the Service Fabric platform interacts with your applications, services, containers, and nodes.

For Windows clusters, it is recommended that you set up cluster monitoring with [Diagnostics Agent](./service-fabric-diagnostics-event-aggregation-wad.md) and [Azure Monitor logs](./service-fabric-diagnostics-oms-setup.md).

For Linux clusters, Azure Monitor logs is also the recommended tool for Azure platform and infrastructure monitoring. Linux platform diagnostics require different configuration as noted in [Service Fabric Linux cluster events in Syslog](./service-fabric-diagnostics-oms-syslog.md).

## Infrastructure monitoring

[Azure Monitor logs](./service-fabric-diagnostics-oms-agent.md) is recommended for monitoring cluster level events. Once you configure the Log Analytics agent with your workspace as described in previous link, you will be able to collect performance metrics such as CPU Utilization, .NET performance counters such as process level CPU utilization, Service Fabric performance counters such as # of exceptions from a reliable service, and container metrics such as CPU Utilization.  You will need to write container logs to stdout or stderr so that they will be available in Azure Monitor logs.

## Watchdogs

Generally, a watchdog is a separate service that watches health and load across services, pings endpoints, and reports unexpected health events in the cluster. This can help prevent errors that may not be detected based only on the performance of a single service. Watchdogs are also a good place to host code that performs remedial actions that don't require user interaction, such as cleaning up log files in storage at certain time intervals. If you want a fully implemented, open source SF watchdog service that includes an easy-to-use watchdog extensibility model and that runs in both Windows and Linux clusters, see the [FabricObserver](https://aka.ms/sf/FabricObserver) project. FabricObserver is production-ready software. We encourage you to deploy FabricObserver to your test and production clusters and extend it to meet your needs either through its plug-in model or by forking it and writing your own built-in observers. The former (plug-ins) is the recommended approach.

## Next steps

* Get started instrumenting your applications: [Application level event and log generation](service-fabric-diagnostics-event-generation-app.md).
* Go through the steps to set up Application Insights for your application with [Monitor and diagnose an ASP.NET Core application on Service Fabric](service-fabric-tutorial-monitoring-aspnet.md).
* Learn more about monitoring the platform and the events Service Fabric provides for you: [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md).
* Configure Azure Monitor logs integration with Service Fabric: [Set up Azure Monitor logs for a cluster](service-fabric-diagnostics-oms-setup.md)
* Learn how to set up Azure Monitor logs for monitoring containers: [Monitoring and Diagnostics for Windows Containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md).
* See example diagnostics problems and solutions with Service Fabric: [diagnosing common scenarios](service-fabric-diagnostics-common-scenarios.md)
* Learn about general monitoring recommendations for Azure resources: [Best Practices - Monitoring and diagnostics](/azure/architecture/best-practices/monitoring).
