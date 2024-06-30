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
- Windows performance counters on nodes and applications. For the list of performance counters, see [Performance metrics](service-fabric-diagnostics-event-generation-perf.md).
- Cluster, node, and system service health data. You can use the [FabricClient.HealthManager property](/dotnet/api/system.fabric.fabricclient.healthmanager) to get the health client to use for health related operations, like report health or get entity health.
- Metrics for the guest operating system (OS) that runs on a cluster node, through one or more agents that run on the guest OS.

  Guest OS metrics include performance counters that track guest CPU percentage or memory usage, which are frequently used for autoscaling or alerting. You can use the agent to send guest OS metrics to Azure Monitor Logs, where you can query them by using Log Analytics.

  > [!NOTE]
  > The Azure Monitor agent replaces the previously-used Azure Diagnostics extension and Log Analytics agent. For more information, see [Overview of Azure Monitor agents](/azure/azure-monitor/agents/agents-overview).

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Service Fabric Clusters
Microsoft.ServiceFabric/clusters

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.ServiceFabric resource provider operations](/azure/role-based-access-control/permissions/compute#microsoftservicefabric)

## Related content

- See [Monitor Service Fabric](monitor-service-fabric.md) for a description of monitoring Service Fabric.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
- See [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md) for the list of Service Fabric system, node, and application events.
- See [Performance metrics](service-fabric-diagnostics-event-generation-perf.md) for the list of Windows performance counters on nodes and applications.
