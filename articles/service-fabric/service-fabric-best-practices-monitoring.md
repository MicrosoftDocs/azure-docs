---
title: Azure Service Fabric Application and Cluster Best Practices | Microsoft Docs
description: Best practices for managing Service Fabric clusters and applications.
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: timlt
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/11/2019
ms.author: pepogors

---
# Monitoring and Diagnostics
[Monitoring and diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-overview) are critical to developing, testing, and deploying workloads in any cloud environment. For example, you can track how your applications are used, the actions taken by the Service Fabric platform, your resource utilization with performance counters, and the overall health of your cluster. You can use this information to diagnose and correct issues, and prevent them from occurring in the future.

## Application Monitoring
Application monitoring tracks how features and components of your application are being used. You want to monitor your applications to make sure issues that impact users are caught. The responsibility of application monitoring is on the users developing an application and its services since it is unique to the business logic of your application. It is recommended that you set up application monitoring with [Application Insights](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-monitoring-aspnet).

## Cluster Monitoring
One of Service Fabric's goals is to keep applications resilient to hardware failures. This goal is achieved through the platform's system services' ability to detect infrastructure issues and rapidly failover workloads to other nodes in the cluster. But in this particular case, what if the system services themselves have issues? Or if in attempting to deploy or move a workload, rules for the placement of services are violated? Service Fabric provides diagnostics for these and more to make sure you are informed about activity taking place in your cluster. It is recommended that you set up cluster monitoring with [Diagnostics Agent](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-diagnostics-event-aggregation-wad) and [Log Analytics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup).

## Infrastructure Monitoring
[Log Analytics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-agent) is our recommendation to monitor cluster level events.

## Watchdogs 
Generally, a watchdog is a separate service that can watch health and load across services, ping endpoints, and report health for anything in the cluster. This can help prevent errors that would not be detected based on the view of a single service. Watchdogs are also a good place to host code that performs remedial actions without user interaction (for example, cleaning up log files in storage at certain time intervals). You can find a sample watchdog service implementation [here](https://github.com/Azure-Samples/service-fabric-watchdog-service).


## Next steps

* For getting started with instrumenting your applications, see [Application level event and log generation](service-fabric-diagnostics-event-generation-app.md).
* Go through the steps to set up Application Insights for your application with [Monitor and diagnose an ASP.NET Core application on Service Fabric](service-fabric-tutorial-monitoring-aspnet.md).
* Learn more about monitoring the platform and the events Service Fabric provides for you at [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md).
* Configure the Log Analytics integration with Service Fabric at [Set up Log Analytics for a cluster](service-fabric-diagnostics-oms-setup.md)
* Learn how to set up Log Analytics for monitoring containers - [Monitoring and Diagnostics for Windows Containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md).
* See example diagnostics problems and solutions with Service Fabric in [diagnosing common scenarios](service-fabric-diagnostics-common-scenarios.md)
* Learn about general monitoring recommendations for Azure resources - [Best Practices - Monitoring and diagnostics](https://docs.microsoft.com/azure/architecture/best-practices/monitoring). 