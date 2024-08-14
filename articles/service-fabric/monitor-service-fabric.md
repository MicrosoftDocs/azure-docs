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

- [Application monitoring](#application-monitoring): The *applications* that run on the nodes. You can monitor applications with Application Insights key or SDK, EventStore, or ASP.NET Core logging.
- [Platform (cluster) monitoring](#platform-cluster-monitoring): Client metrics, logs, and events for the *platform* or *cluster* nodes, including container metrics. The metrics and logs are different for Linux or Windows nodes.
- [Infrastructure (performance) monitoring](#infrastructure-performance-monitoring): Service health and performance counters for the service *infrastructure*.

You can monitor how your applications are used, the actions taken by the Service Fabric platform, your resource utilization with performance counters, and the overall health of your cluster. [Azure Monitor logs](service-fabric-diagnostics-event-analysis-oms.md) and [Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) offer built-in integration with Service Fabric.

- To learn about best practices, see [Monitoring and diagnostic best practices for Azure Service Fabric](service-fabric-best-practices-monitoring.md).
- For a tutorial that shows how to view Service Fabric events and health reports, query the EventStore APIs, and monitor performance counters, see [Tutorial: Monitor a Service Fabric cluster in Azure](service-fabric-tutorial-monitor-cluster.md).
- To learn how to configure Azure Monitor logs to monitor your Windows containers orchestrated on Service Fabric, see [Tutorial: Monitor Windows containers on Service Fabric using Azure Monitor logs](service-fabric-tutorial-monitoring-wincontainers.md).

### Service Fabric Explorer

[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md), a desktop application for Windows, macOS, and Linux, is an open-source tool for inspecting and managing Azure Service Fabric clusters. To enable automation, every action that can be taken through Service Fabric Explorer can also be done through PowerShell or a REST API.

## Application monitoring

Application monitoring tracks how features and components of your application are being used. You want to monitor your applications to make sure issues that impact users are caught. The responsibility of application monitoring is on the users developing an application and its services since it is unique to the business logic of your application. Monitoring your applications can be useful in the following scenarios:
* How much traffic is my application experiencing? - Do you need to scale your services to meet user demands or address a potential bottleneck in your application?
* Are my service-to-service calls successful and tracked?
* What actions are taken by the users of my application? - Collecting telemetry can guide future feature development and better diagnostics for application errors
* Is my application throwing unhandled exceptions?
* What is happening within the services running inside my containers?

The great thing about application monitoring is that developers can use whatever tools and framework they'd like since it lives within the context of your application! You can learn more about the Azure solution for application monitoring with Azure Monitor Application Insights in [Event analysis with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md).

We also have a tutorial with how to [set this up for .NET Applications](service-fabric-tutorial-monitoring-aspnet.md). This tutorial goes over how to install the right tools, an example to write custom telemetry in your application, and viewing the application diagnostics and telemetry in the Azure portal.

### Application logging

Instrumenting your code is not only a way to gain insights about your users, but also the only way you can know whether something is wrong in your application, and to diagnose what needs to be fixed. Although technically it's possible to connect a debugger to a production service, it's not a common practice. So, having detailed instrumentation data is important.

Some products automatically instrument your code. Although these solutions can work well, manual instrumentation is almost always required to be specific to your business logic. In the end, you must have enough information to forensically debug the application. Service Fabric applications can be instrumented with any logging framework. This section describes a few different approaches to instrumenting your code, and when to choose one approach over another.

- **Application Insights SDK**: Application Insights has a rich integration with Service Fabric out of the box. Users can add the AI Service Fabric nuget packages and receive data and logs created and collected viewable in the Azure portal. Additionally, users are encouraged to add their own telemetry in order to diagnose and debug their applications and track which services and parts of their application are used the most. The [TelemetryClient](/dotnet/api/microsoft.applicationinsights.telemetryclient) class in the SDK provides many ways to track telemetry in your applications. For more information, see [Event analysis and visualization with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md).

    Check out an example of how to instrument and add application insights to your application in our tutorial for [monitoring and diagnosing a .NET application](service-fabric-tutorial-monitoring-aspnet.md).

- **EventSource**: When you create a Service Fabric solution from a template in Visual Studio, an **EventSource**-derived class (**ServiceEventSource** or **ActorEventSource**) is generated. A template is created, in which you can add events for your application or service. The **EventSource** name **must** be unique, and should be renamed from the default template string MyCompany-&lt;solution&gt;-&lt;project&gt;. Having multiple **EventSource** definitions that use the same name causes an issue at run time. Each defined event must have a unique identifier. If an identifier is not unique, a runtime failure occurs. Some organizations preassign ranges of values for identifiers to avoid conflicts between separate development teams. For more information, see [Vance's blog](/archive/blogs/vancem/introduction-tutorial-logging-etw-events-in-c-system-diagnostics-tracing-eventsource) or the [MSDN documentation](/previous-versions/msp-n-p/dn774985(v=pandp.20)).

- **ASP.NET Core logging**: It's important to carefully plan how you will instrument your code. The right instrumentation plan can help you avoid potentially destabilizing your code base, and then needing to reinstrument the code. To reduce risk, you can choose an instrumentation library like [Microsoft.Extensions.Logging](https://www.nuget.org/packages/Microsoft.Extensions.Logging/), which is part of Microsoft ASP.NET Core. ASP.NET Core has an [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger) interface that you can use with the provider of your choice, while minimizing the effect on existing code. You can use the code in ASP.NET Core on Windows and Linux, and in the full .NET Framework, so your instrumentation code is standardized.

For examples on how to use these suggestions, see [Add logging to your Service Fabric application](service-fabric-how-to-diagnostics-log.md).

## Platform (cluster) monitoring

A user is in control over what telemetry comes from their application since a user writes the code itself, but what about the diagnostics from the Service Fabric platform? One of Service Fabric's goals is to keep applications resilient to hardware failures. This goal is achieved through the platform's system services' ability to detect infrastructure issues and rapidly failover workloads to other nodes in the cluster. But in this particular case, what if the system services themselves have issues? Or if in attempting to deploy or move a workload, rules for the placement of services are violated? Service Fabric provides diagnostics for these and more to make sure you are informed about activity taking place in your cluster. Some sample scenarios for cluster monitoring include:

For more information on platform (cluster) monitoring, see [Monitoring the cluster](service-fabric-diagnostics-event-generation-infra.md).

### Service Fabric events

Service Fabric provides a comprehensive set of diagnostics events out of the box, which you can access through the EventStore or the operational event channel the platform exposes. These [Service Fabric events](service-fabric-diagnostics-events.md) illustrate actions done by the platform on different entities such as nodes, applications, services, and partitions. The same events are available on both Windows and Linux clusters.

- **Service Fabric event channels**: On Windows, Service Fabric events are available from a single ETW provider with a set of relevant `logLevelKeywordFilters` used to pick between Operational and Data & Messaging channels. This is the way in which we separate out outgoing Service Fabric events to be filtered on as needed. On Linux, Service Fabric events come through LTTng and are put into one Storage table, from where they can be filtered as needed. These channels contain curated, structured events that can be used to better understand the state of your cluster. Diagnostics are enabled by default at the cluster creation time, which create an Azure Storage table where the events from these channels are sent for you to query in the future.

- [EventStore](service-fabric-diagnostics-eventstore.md) is a feature that shows Service Fabric platform events in Service Fabric Explorer and programmatically through the [Service Fabric Client Library](/dotnet/api/overview/azure/service-fabric#client-library) REST API. You can see a snapshot view of what's going on in your cluster for each node, service, and application, and query based on the time of the event. The EventStore APIs are available only for Windows clusters running on Azure. On Windows machines, these events are fed into the Event Log, so you can see Service Fabric Events in Event Viewer.

![Screenshot shows the EVENTS tab of the Nodes pane several events, including a NodeDown event.](media/service-fabric-diagnostics-overview/eventstore.png)

The diagnostics provided are in the form of a comprehensive set of events out of the box. These [Service Fabric events](service-fabric-diagnostics-events.md) illustrate actions done by the platform on different entities such as Nodes, Applications, Services, Partitions etc. In the last scenario above, if a node were to go down, the platform would emit a `NodeDown` event and you could be notified immediately by your monitoring tool of choice. Other common examples include `ApplicationUpgradeRollbackStarted` or `PartitionReconfigured` during a failover. **The same events are available on both Windows and Linux clusters.**

The events are sent through standard channels on both Windows and Linux and can be read by any monitoring tool that supports these. The Azure Monitor solution is Azure Monitor logs. Feel free to read more about our [Azure Monitor logs integration](service-fabric-diagnostics-event-analysis-oms.md) which includes a custom operational dashboard for your cluster and some sample queries from which you can create alerts. More cluster monitoring concepts are available at [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md).

### Health monitoring

The Service Fabric platform includes a health model, which provides extensible health reporting for the status of entities in a cluster. Each node, application, service, partition, replica, or instance, has a continuously updatable health status. The health status can either be "OK", "Warning", or "Error". Think of Service Fabric events as verbs done by the cluster to various entities and health as an adjective for each entity. Each time the health of a particular entity transitions, an event will also be emitted. This way you can set up queries and alerts for health events in your monitoring tool of choice, just like any other event.

Additionally, we even let users override health for entities. If your application is going through an upgrade and you have validation tests failing, you can write to Service Fabric Health using the Health API to indicate your application is no longer healthy, and Service Fabric will automatically roll back the upgrade! For more on the health model, check out the [introduction to Service Fabric health monitoring](service-fabric-health-introduction.md)

![Screenshot of SFX health dashboard.](media/service-fabric-diagnostics-overview/sfx-healthstatus.png)

### Watchdogs

Generally, a watchdog is a separate service that watches health and load across services, pings endpoints, and reports unexpected health events in the cluster. This can help prevent errors that may not be detected based only on the performance of a single service. Watchdogs are also a good place to host code that performs remedial actions that don't require user interaction, such as cleaning up log files in storage at certain time intervals. If you want a fully implemented, open source SF watchdog service that includes an easy-to-use watchdog extensibility model and that runs in both Windows and Linux clusters, see the [FabricObserver](https://github.com/microsoft/service-fabric-observer) project. FabricObserver is production-ready software. We encourage you to deploy FabricObserver to your test and production clusters and extend it to meet your needs either through its plug-in model or by forking it and writing your own built-in observers. The former (plug-ins) is the recommended approach.

## Infrastructure (performance) monitoring

Now that we've covered the diagnostics in your application and the platform, how do we know the hardware is functioning as expected? Monitoring your underlying infrastructure is a key part of understanding the state of your cluster and your resource utilization. Measuring system performance depends on many factors that can be subjective depending on your workloads. These factors are typically measured through performance counters. These performance counters can come from a variety of sources including the operating system, the .NET framework, or the Service Fabric platform itself. Some scenarios in which they would be useful are

* Am I utilizing my hardware efficiently? Do you want to use your hardware at 90% CPU or 10% CPU. This comes in handy when scaling your cluster, or optimizing your application's processes.
* Can I predict infrastructure issues proactively? - many issues are preceded by sudden changes (drops) in performance, so you can use performance counters such as network I/O and CPU utilization to predict and diagnose the issues proactively.

A list of performance counters that should be collected at the infrastructure level can be found at [Performance metrics](monitor-service-fabric-reference.md#performance-metrics).

Azure Monitor Logs is recommended for monitoring cluster level events. After you configure the [Log Analytics agent](service-fabric-diagnostics-oms-agent.md) with your workspace, you can collect:

- Performance metrics such as CPU utilization.
- .NET performance counters such as process level CPU utilization.
- Service Fabric performance counters such as number of exceptions from a reliable service.
- Container metrics such as CPU utilization.

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Azure Service Fabric, see [Service Fabric monitoring data reference](monitor-service-fabric-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-no-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]

[!INCLUDE [horz-monitor-non-monitor-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]

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
- You can set up the [container monitoring solution](service-fabric-diagnostics-oms-containers.md) for Azure Monitor Logs to view container events.

### Other logging solutions

Although the two solutions we recommended, [Azure Monitor logs](service-fabric-diagnostics-event-analysis-oms.md) and [Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md), have built in integration with Service Fabric, many events are written out through ETW providers and are extensible with other logging solutions. You should also look into the [Elastic Stack](https://www.elastic.co/products) (especially if you are considering running a cluster in an offline environment), [Dynatrace](https://www.dynatrace.com/), or any other platform of your preference. For a list of integrated partners, see [Azure Service Fabric Monitoring Partners](service-fabric-diagnostics-partners.md).

The key points for any platform you choose should include how comfortable you are with the user interface, the querying capabilities, the custom visualizations and dashboards available, and the additional tools they provide to enhance your monitoring experience.

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

## Recommended setup

Now that we've gone over each area of monitoring and example scenarios, here is a summary of the Azure monitoring tools and set up needed to monitor all areas above.

* Application monitoring with [Application Insights](service-fabric-tutorial-monitoring-aspnet.md)
* Cluster monitoring with [Diagnostics Agent](service-fabric-diagnostics-event-aggregation-wad.md) and [Azure Monitor logs](service-fabric-diagnostics-oms-setup.md)
* Infrastructure monitoring with [Azure Monitor logs](service-fabric-diagnostics-oms-agent.md)

You can also use and modify the [sample ARM template](service-fabric-diagnostics-oms-setup.md#deploy-azure-monitor-logs-with-azure-resource-manager) to automate deployment of all necessary resources and agents.

## Related content

- See [Service Fabric monitoring data reference](monitor-service-fabric-reference.md) for a reference of the metrics, logs, and other important values created for Service Fabric.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
- See the [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md).