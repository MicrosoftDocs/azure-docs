---
title: Monitor Azure Service Fabric
description: Start here to learn how to monitor Service Fabric.
ms.date: 03/26/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
---

# Monitor Azure Service Fabric

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Azure Service Fabric monitoring

Azure Service Fabric has the following layers that you can monitor:

- Service health and performance counters for the service *infrastructure*. For more information, see [Performance metrics](service-fabric-diagnostics-event-generation-perf.md).
- Client metrics, logs, and events for the *platform* or *cluster* nodes, including container metrics. The metrics and logs are different for Linux or Windows nodes. For more information, see [Monitor the cluster](service-fabric-diagnostics-event-generation-infra.md).
- The *applications* that run on the nodes. You can monitor applications with Application Insights key or SDK, EventStore, or ASP.NET Core logging. For more information, see [Application logging](service-fabric-diagnostics-event-generation-app.md).

You can monitor how your applications are used, the actions taken by the Service Fabric platform, your resource utilization with performance counters, and the overall health of your cluster. [Azure Monitor logs](service-fabric-diagnostics-event-analysis-oms.md) and [Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) offer built-in integration with Service Fabric.

- For an overview of monitoring and diagnostics for Service Fabric infrastructure, platform, and applications, see [Monitoring and diagnostics for Azure Service Fabric](service-fabric-diagnostics-overview.md).
- For a tutorial that shows how to view Service Fabric events and health reports, query the EventStore APIs, and monitor performance counters, see [Tutorial: Monitor a Service Fabric cluster in Azure](service-fabric-tutorial-monitor-cluster.md).

### Service Fabric Explorer

[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md), a desktop application for Windows, macOS, and Linux, is an open-source tool for inspecting and managing Azure Service Fabric clusters. To enable automation, every action that can be taken through Service Fabric Explorer can also be done through PowerShell or a REST API.

### EventStore

[EventStore](service-fabric-diagnostics-eventstore.md) is a feature that shows Service Fabric platform events in Service Fabric Explorer and programmatically through the [Service Fabric Client Library](/dotnet/api/overview/azure/service-fabric#client-library) REST API. You can see a snapshot view of what's going on in your cluster for each node, service, and application, and query based on the time of the event.

The EventStore APIs are available only for Windows clusters running on Azure. On Windows machines, these events are fed into the Event Log, so you can see Service Fabric Events in Event Viewer.

### Application Insights

Application Insights integrates with Service Fabric to provide Service Fabric specific metrics and tooling experiences for Visual Studio and Azure portal. Application Insights provides a comprehensive out-of-the-box logging experience. For more information, see [Event analysis and visualization with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Service Fabric, see [Service Fabric monitoring data reference](monitor-service-fabric-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]

[!INCLUDE [horz-monitor-non-monitor-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]

### Performance counters

Service Fabric system performance is usually measured through performance counters. These performance counters can come from various sources including the operating system, the .NET framework, or the Service Fabric platform itself. For a list of performance counters that should be collected at the infrastructure level, see [Performance metrics](service-fabric-diagnostics-event-generation-perf.md).

Service Fabric also provides a set of performance counters for the Reliable Services and Actors programming models. For more information, see [Monitoring for Reliable Service Remoting](service-fabric-reliable-serviceremoting-diagnostics.md#performance-counters) and [Performance monitoring for Reliable Actors](service-fabric-reliable-actors-diagnostics.md#performance-counters).

Azure Monitor Logs is recommended for monitoring cluster level events. After you configure the [Log Analytics agent](service-fabric-diagnostics-oms-agent.md) with your workspace, you can collect:

- Performance metrics such as CPU Utilization.
- .NET performance counters such as process level CPU utilization.
- Service Fabric performance counters such as number of exceptions from a reliable service.
- Container metrics such as CPU Utilization.

### Guest OS metrics

Metrics for the guest operating system (OS) that runs on Service Fabric cluster nodes must be collected through one or more agents that run on the guest OS. Guest OS metrics include performance counters that track guest CPU percentage or memory usage, both of which are frequently used for autoscaling or alerting.

A best practice is to use and configure the Azure Monitor agent to send guest OS performance metrics through the custom metrics API into the Azure Monitor metrics database. You can send the guest OS metrics to Azure Monitor Logs by using the same agent. Then you can query on those metrics and logs by using Log Analytics.

>[!NOTE]
>The Azure Monitor agent replaces the Azure Diagnostics extension and Log Analytics agent for guest OS routing. For more information, see [Overview of Azure Monitor agents](/azure/azure-monitor/agents/agents-overview).

[!INCLUDE [horz-monitor-no-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]

## Service Fabric logs and events

Service Fabric can collect the following logs:

- For Windows clusters, you can set up cluster monitoring with [Diagnostics Agent](service-fabric-diagnostics-event-aggregation-wad.md) and [Azure Monitor logs](service-fabric-diagnostics-oms-setup.md).
- For Linux clusters, Azure Monitor Logs is also the recommended tool for Azure platform and infrastructure monitoring. Linux platform diagnostics require different configuration. For more information, see [Service Fabric Linux cluster events in Syslog](service-fabric-diagnostics-oms-syslog.md).
- You can configure the Azure Monitor agent to send guest OS logs to Azure Monitor Logs, where you can query on them by using Log Analytics.
- You can write Service Fabric container logs to *stdout* or *stderr* so they're available in Azure Monitor Logs.

### Service Fabric events

Service Fabric provides a comprehensive set of diagnostics events out of the box, which you can access through the EventStore or the operational event channel the platform exposes. These [Service Fabric events](service-fabric-diagnostics-events.md) illustrate actions done by the platform on different entities such as nodes, applications, services, and partitions. The same events are available on both Windows and Linux clusters.

On Windows, Service Fabric events are available from a single Event Tracing for Windows (ETW) provider with a set of relevant `logLevelKeywordFilters` used to pick between Operational and Data & Messaging channels. On Linux, Service Fabric events come through LTTng and are put into one Azure Storage table, from where they can be filtered as needed. Diagnostics can be enabled at cluster creation time, which creates a Storage table where the events from these channels are sent.

The events are sent through standard channels on both Windows and Linux and can be read by any monitoring tool that supports them, including Azure Monitor Logs. For more information, see [Azure Monitor logs integration](service-fabric-diagnostics-event-analysis-oms.md).

### Health monitoring

The Service Fabric platform includes a health model, which provides extensible health reporting for the status of entities in a cluster. Each node, application, service, partition, replica, or instance has a continuously updatable health status. Each time the health of a particular entity transitions, an event is also emitted. You can set up queries and alerts for health events in your monitoring tool, just like any other event.

## Partner logging solutions

Many events are written out through ETW providers and are extensible with other logging solutions. Examples are [Elastic Stack](https://www.elastic.co/products), especially if you're running a cluster in an offline environment, or [Dynatrace](https://www.dynatrace.com/). For a list of integrated partners, see [Azure Service Fabric Monitoring Partners](service-fabric-diagnostics-partners.md).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

For an overview of common Service Fabric monitoring analytics scenarios, see [Diagnose common scenarios with Service Fabric](service-fabric-diagnostics-common-scenarios.md).

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Sample queries

The following queries return Service Fabric Events, including actions on nodes. For other useful queries, see [Service Fabric Events](service-fabric-tutorial-monitor-cluster.md#view-service-fabric-events-including-actions-on-nodes).

Return operational events recorded in the last hour:

```kusto
ServiceFabricOperationalEvent
| where TimeGenerated > ago(1h)
| join kind=leftouter ServiceFabricEvent on EventId
| project EventId, EventName, TaskName, Computer, ApplicationName, EventMessage, TimeGenerated
| sort by TimeGenerated
```

Return Health Reports with HealthState == 3 (Error), and extract more properties from the `EventMessage` field:

```kusto
ServiceFabricOperationalEvent
| join kind=leftouter ServiceFabricEvent on EventId
| extend HealthStateId = extract(@"HealthState=(\S+) ", 1, EventMessage, typeof(int))
| where TaskName == 'HM' and HealthStateId == 3
| extend SourceId = extract(@"SourceId=(\S+) ", 1, EventMessage, typeof(string)),
         Property = extract(@"Property=(\S+) ", 1, EventMessage, typeof(string)),
         HealthState = case(HealthStateId == 0, 'Invalid', HealthStateId == 1, 'Ok', HealthStateId == 2, 'Warning', HealthStateId == 3, 'Error', 'Unknown'),
         TTL = extract(@"TTL=(\S+) ", 1, EventMessage, typeof(string)),
         SequenceNumber = extract(@"SequenceNumber=(\S+) ", 1, EventMessage, typeof(string)),
         Description = extract(@"Description='([\S\s, ^']+)' ", 1, EventMessage, typeof(string)),
         RemoveWhenExpired = extract(@"RemoveWhenExpired=(\S+) ", 1, EventMessage, typeof(bool)),
         SourceUTCTimestamp = extract(@"SourceUTCTimestamp=(\S+)", 1, EventMessage, typeof(datetime)),
         ApplicationName = extract(@"ApplicationName=(\S+) ", 1, EventMessage, typeof(string)),
         ServiceManifest = extract(@"ServiceManifest=(\S+) ", 1, EventMessage, typeof(string)),
         InstanceId = extract(@"InstanceId=(\S+) ", 1, EventMessage, typeof(string)),
         ServicePackageActivationId = extract(@"ServicePackageActivationId=(\S+) ", 1, EventMessage, typeof(string)),
         NodeName = extract(@"NodeName=(\S+) ", 1, EventMessage, typeof(string)),
         Partition = extract(@"Partition=(\S+) ", 1, EventMessage, typeof(string)),
         StatelessInstance = extract(@"StatelessInstance=(\S+) ", 1, EventMessage, typeof(string)),
         StatefulReplica = extract(@"StatefulReplica=(\S+) ", 1, EventMessage, typeof(string))
```

Get Service Fabric operational events aggregated with the specific service and node:

```kusto
ServiceFabricOperationalEvent
| where ApplicationName  != "" and ServiceName != ""
| summarize AggregatedValue = count() by ApplicationName, ServiceName, Computer 
```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Service Fabric alert rules

The following table lists some alert rules for Service Fabric. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Service Fabric monitoring data reference](monitor-service-fabric-reference.md) or the [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md#application-events).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Node event | Node goes down | ServiceFabricOperationalEvent where EventID >= 25622 and EventID <= 25626. These Event IDs are found in the [Node events reference](service-fabric-diagnostics-event-generation-operational.md#node-events). |
| Application event | Application upgrade rollback | ServiceFabricOperationalEvent where EventID == 29623 or EventID == 29624. These Event IDs are found in the [Application events reference](service-fabric-diagnostics-event-generation-operational.md#application-events). |
| Resource health | Upgrade service unreachable/unavailable | Cluster goes to UpgradeServiceUnreachable state. |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Service Fabric monitoring data reference](monitor-service-fabric-reference.md) for a reference of the metrics, logs, and other important values created for Service Fabric.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See the [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md).