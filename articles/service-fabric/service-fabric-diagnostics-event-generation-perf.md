---
title: Azure Service Fabric Performance Monitoring | Microsoft Docs
description: Learn about performance counters for monitoring and diagnostics of Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/21/2018
ms.author: srrengar
---

# Performance metrics

Metrics should be collected to understand the performance of your cluster as well as the applications running in it. For Service Fabric clusters, we recommend collecting the following performance counters.

## Nodes

For the machines in your cluster, consider collecting the following performance counters to better understand the load on each machine and make appropriate cluster scaling decisions.

| Counter Category | Counter Name |
| --- | --- |
| Logical Disk | Logical Disk Free Space |
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
| Processor(Total) | % Processor Time |
| Process (per service) | % Processor Time |
| Process (per service) | ID Process |
| Process (per service) | Private Bytes |
| Process (per service) | Thread Count |
| Process (per service) | Virtual Bytes |
| Process (per service) | Working Set |
| Process (per service) | Working Set - Private |
| Network Interface(all-instances) | Bytes recd |
| Network Interface(all-instances) | Bytes sent |
| Network Interface(all-instances) | Bytes total |
| Network Interface(all-instances) | Output Queue Length |
| Network Interface(all-instances) | Packets Outbound Discarded |
| Network Interface(all-instances) | Packets Received Discarded |
| Network Interface(all-instances) | Packets Outbound Errors |
| Network Interface(all-instances) | Packets Received Errors |

## .NET applications and services

Collect the following counters if you are deploying .NET services to your cluster. 

| Counter Category | Counter Name |
| --- | --- |
| .NET CLR Memory (per service) | Process ID |
| .NET CLR Memory (per service) | # Total committed Bytes |
| .NET CLR Memory (per service) | # Total reserved Bytes |
| .NET CLR Memory (per service) | # Bytes in all Heaps |
| .NET CLR Memory (per service) | Large Object Heap size |
| .NET CLR Memory (per service) | # GC Handles |
| .NET CLR Memory (per service) | # Gen 0 Collections |
| .NET CLR Memory (per service) | # Gen 1 Collections |
| .NET CLR Memory (per service) | # Gen 2 Collections |
| .NET CLR Memory (per service) | % Time in GC |

### Service Fabric's custom performance counters

Service Fabric generates a substantial amount of custom performance counters. If you have the SDK installed, you can see the comprehensive list on your Windows machine in your Performance Monitor application (Start > Performance Monitor). 

In the applications you are deploying to your cluster, if you are using Reliable Actors, add counters from `Service Fabric Actor` and `Service Fabric Actor Method` categories (see [Service Fabric Reliable Actors Diagnostics](service-fabric-reliable-actors-diagnostics.md)).

If you use Reliable Services or Service Remoting, we similarly have `Service Fabric Service` and `Service Fabric Service Method` counter categories that you should collect counters from, see [monitoring with service remoting](service-fabric-reliable-serviceremoting-diagnostics.md) and [reliable services performance counters](service-fabric-reliable-services-diagnostics.md#performance-counters). 

If you use Reliable Collections, we recommend adding the `Avg. Transaction ms/Commit` from the `Service Fabric Transactional Replicator` to collect the average commit latency per transaction metric.


## Next steps

* Learn more about [event generation at the platform level](service-fabric-diagnostics-event-generation-infra.md) in Service Fabric
* Collect performance metrics through [Log Analytics agent](service-fabric-diagnostics-oms-agent.md)
