---
title: Monitoring data reference for Azure Service Fabric
description: This article contains important reference material you need when you monitor Service Fabric.
ms.date: 03/26/2024
ms.custom: horz-monitor
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
---

# Azure Service Fabric monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Service Fabric](monitor-service-fabric.md) for details on the data you can collect for Azure Service Fabric and how to use it.

Azure Monitor doesn't collect any platform metrics or resource logs for Service Fabric. You can monitor and collect:

- Service Fabric system, node, and application events. For the full event listing, see [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md).
- Windows performance counters on nodes and applications. For the list of performance counters, see [Performance metrics](#performance-metrics).
- Cluster, node, and system service health data. You can use the [FabricClient.HealthManager property](/dotnet/api/system.fabric.fabricclient.healthmanager) to get the health client to use for health related operations, like report health or get entity health.
- Metrics for the guest operating system (OS) that runs on a cluster node, through one or more agents that run on the guest OS.

  Guest OS metrics include performance counters that track guest CPU percentage or memory usage, which are frequently used for autoscaling or alerting. You can use the agent to send guest OS metrics to Azure Monitor Logs, where you can query them by using Log Analytics.

  > [!NOTE]
  > The Azure Monitor agent replaces the previously-used Azure Diagnostics extension and Log Analytics agent. For more information, see [Overview of Azure Monitor agents](/azure/azure-monitor/agents/agents-overview).

## Performance metrics

Metrics should be collected to understand the performance of your cluster as well as the applications running in it. For Service Fabric clusters, we recommend collecting the following performance counters.

### Nodes

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

### .NET applications and services

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

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Service Fabric clusters
Microsoft.ServiceFabric/clusters

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.ServiceFabric resource provider operations](/azure/role-based-access-control/permissions/compute#microsoftservicefabric)

## Related content

- See [Monitor Service Fabric](monitor-service-fabric.md) for a description of monitoring Service Fabric.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
- See [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md) for the list of Service Fabric system, node, and application events.
