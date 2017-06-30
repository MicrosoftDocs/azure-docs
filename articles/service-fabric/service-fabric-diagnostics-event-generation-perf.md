---
title: Azure Service Fabric Performance Monitoring | Microsoft Docs
description: Learn about performance counters for monitoring and diagnostics of Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/30/2017
ms.author: dekapur

---

# Performance Counters

Metrics should be collected to understand the performance of your cluster as well as the applications running in it. For Service Fabric clusters, we recommend collecting the following performance counters.

## Nodes

For the machines in your cluster, consider collecting the following performance counters to better understand the load on each machine and make appropriate cluster scaling decisions.

| Counter Category | Counter Name |
| --- | --- |
| PhysicalDisk(Total) | Avg. Disk Read Queue Length |
| PhysicalDisk(Total) | Avg. Disk Write Queue Length |
| PhysicalDisk(Total) | Disk Reads/sec |
| PhysicalDisk(Total) | Disk Read Bytes/sec |
| PhysicalDisk(Total) | Disk Writes/sec |
| PhysicalDisk(Total) | Disk Write Bytes/sec |
| PhysicalDisk(per Disk) | Avg. Disk Read Queue Length |
| PhysicalDisk(per Disk) | Avg. Disk Write Queue Length |
| PhysicalDisk(per Disk) | Avg. Disk sec/Read |
| PhysicalDisk(per Disk) | Avg. Disk sec/Write |
| PhysicalDisk(per Disk) | Disk Reads/sec |
| PhysicalDisk(per Disk) | Disk Read Bytes/sec |
| PhysicalDisk(per Disk) | Disk Writes/sec |
| PhysicalDisk(per Disk) | Disk Write Bytes/sec |
| Memory | Available MBytes |
| PagingFile | % Usage |
| Process(Total) | % Processor Time |
| Process(per service) | % Processor Time |
| Process(per service) | ID Process |
| Process(per service) | Private Bytes |
| Process(per service) | Thread Count |
| Process(per service) | Virtual Bytes |
| Process(per service) | Working Set |
| Process(per service) | Working Set - Private |

## .NET applications and services

Collect the following counters if you are deploying .NET services to your cluster. 

| Counter Category | Counter Name |
| --- | --- |
| .NET CLR Memory (per service) | Process ID |
| .NET CLR Memory (per service) | # Total committed Bytes |
| .NET CLR Memory (per service) | # Total reserved Bytes |
| .NET CLR Memory (per service) | # Bytes in all Heaps |
| .NET CLR Memory (per service) | # Gen 0 Collections |
| .NET CLR Memory (per service) | # Gen 1 Collections |
| .NET CLR Memory (per service) | # Gen 2 Collections |
| .NET CLR Memory (per service) | % Time in GC |

### Service Fabric's custom performance counters

Service Fabric generates a substantial amount of custom performance counters. If you have the SDK installed, you can see the comprehensive list on your Windows machine in your Performance Monitor application (Start > Performance Monitor). 

In the applications you are deploying to your cluster, if you are using Reliable Actors, add countes from `Service Fabric Actor` and `Service Fabric Actor Method` categories (see [Service Fabric Reliable Actors Diagnostics](service-fabric-reliable-actors-diagnostics.md)).

If you use Reliable Services, we similarly have `Service Fabric Service` and `Service Fabric Service Method` counter categories that you should collect counters from. 

If you use Reliable Collections, we recommend adding the `Avg. Transaction ms/Commit` from the `Service Fabric Transactional Replicator` to collect the average commit latency per transaction metric.


## Next steps

* Learn more about [event generation at the infrastructure level](service-fabric-diagnostics-event-generation-infra.md) in Service Fabric
* Collect performance metrics through [Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md)