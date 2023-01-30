---
title: Observability data in Azure Monitor
description: Describes the 
documentationcenter: ''
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 08/18/2022
---

# Observability data in Azure Monitor
Enabling observability across today's complex computing environments running distributed applications that rely on both cloud and on-premises services, requires collection of operational data from every layer and every component of the distributed system. You need to be able to perform deep insights on this data and consolidate it into a single pane of glass with different perspectives to support the multitude of stakeholders in your organization.

[Azure Monitor](overview.md) collects and aggregates data from various sources into a common data platform where it can be used for analysis, visualization, and alerting. It provides a consistent experience on top of data from multiple sources, which gives you deep insights across all your monitored resources and even with data from other services that store their data in Azure Monitor.


:::image type="content" source="media/overview/azure-monitor-overview-2022-08-25-change-analysis-opt.svg" alt-text="Diagram that shows an overview of Azure Monitor with data sources on the left sending data to a central data platform and features of Azure Monitor on the right that use the collected data." border="false" lightbox="media/overview/azure-monitor-overview-2022-08-25-change-analysis-opt.svg":::

## Pillars of observability

Metrics, logs, distributed traces, and changes are commonly referred to as the pillars of observability. These are the different kinds of data that a monitoring tool must collect and analyze to provide sufficient observability of a monitored system. Observability can be achieved by correlating data from multiple pillars and aggregating data across the entire set of resources being monitored. Because Azure Monitor stores data from multiple sources together, the data can be correlated and analyzed using a common set of tools. It also correlates data across multiple Azure subscriptions and tenants, in addition to hosting data for other services.

Azure resources generate a significant amount of monitoring data. Azure Monitor consolidates this data along with monitoring data from other sources into either a Metrics or Logs platform. Each is optimized for particular monitoring scenarios, and each supports different features in Azure Monitor. Features such as data analysis, visualizations, or alerting require you to understand the differences so that you can implement your required scenario in the most efficient and cost effective manner. Insights in Azure Monitor such as [Application Insights](app/app-insights-overview.md) or [VM insights](vm/vminsights-overview.md) have analysis tools that allow you to focus on the particular monitoring scenario without having to understand the differences between the two types of data. 


## Metrics
[Metrics](essentials/data-platform-metrics.md) are numerical values that describe some aspect of a system at a particular point in time. They are collected at regular intervals and are identified with a timestamp, a name, a value, and one or more defining labels. Metrics can be aggregated using a variety of algorithms, compared to other metrics, and analyzed for trends over time. 

Metrics in Azure Monitor are stored in a time-series database which is optimized for analyzing time-stamped data. This makes metrics ideal for alerting and fast detection of issues. They can tell you how your system is performing but typically need to be combined with logs to identify the root cause of issues.

Metrics are available for interactive analysis in the Azure portal with [Azure Metrics Explorer](essentials/metrics-getting-started.md). They can be added to an [Azure dashboard](app/tutorial-app-dashboards.md) for visualization in combination with other data and used for near-real time [alerting](alerts/alerts-metric.md).

Read more about Azure Monitor Metrics including their sources of data in [Metrics in Azure Monitor](essentials/data-platform-metrics.md).

## Logs
[Logs](logs/data-platform-logs.md) are events that occurred within the system. They can contain different kinds of data and may be structured or free-form text with a timestamp. They may be created sporadically as events in the environment generate log entries, and a system under heavy load will typically generate more log volume.

Logs in Azure Monitor are stored in a Log Analytics workspace that's based on [Azure Data Explorer](/azure/data-explorer/) which provides a powerful analysis engine and [rich query language](/azure/kusto/query/). Logs typically provide enough information to provide complete context of the issue being identified and are valuable for identifying root case of issues.

> [!NOTE]
> It's important to distinguish between Azure Monitor Logs and sources of log data in Azure. For example, subscription level events in Azure are written to an [activity log](essentials/platform-logs-overview.md) that you can view from the Azure Monitor menu. Most resources will write operational information to a [resource log](essentials/platform-logs-overview.md) that you can forward to different locations. Azure Monitor Logs is a log data platform that collects activity logs and resource logs along with other monitoring data to provide deep analysis across your entire set of resources.

You can work with [log queries](logs/log-query-overview.md) interactively with [Log Analytics](logs/log-query-overview.md) in the Azure portal or add the results to an [Azure dashboard](app/tutorial-app-dashboards.md) for visualization in combination with other data. You can also create [log alerts](alerts/alerts-log.md) which will trigger an alert based on the results of a schedule query.

Read more about Azure Monitor Logs including their sources of data in [Logs in Azure Monitor](logs/data-platform-logs.md).

## Distributed traces
Traces are series of related events that follow a user request through a distributed system. They can be used to determine behavior of application code and the performance of different transactions. While logs will often be created by individual components of a distributed system, a trace measures the operation and performance of your application across the entire set of components.

Distributed tracing in Azure Monitor is enabled with the [Application Insights SDK](app/distributed-tracing.md), and trace data is stored with other application log data collected by Application Insights. This makes it available to the same analysis tools as other log data including log queries, dashboards, and alerts.

Read more about distributed tracing at [What is Distributed Tracing?](app/distributed-tracing.md).

## Changes

Change Analysis alerts you to live site issues, outages, component failures, or other change data. It also provides insights into those application changes, increases observability, and reduces the mean time to repair. You automatically register the `Microsoft.ChangeAnalysis` resource provider with an Azure Resource Manager subscription by going to Change Analysis via the Azure portal. For web app in-guest changes, you can enable the [Change Analysis tool via the Change Analysis portal](./change/change-analysis-enable.md#enable-azure-functions-and-web-app-in-guest-change-collection-via-the-change-analysis-portal).

Change Analysis builds on [Azure Resource Graph](../governance/resource-graph/overview.md) to provide a historical record of how your Azure resources have changed over time. It detects managed identities, platform operating system upgrades, and hostname changes. Change Analysis securely queries IP configuration rules, TLS settings, and extension versions to provide more detailed change data.

Read more about Change Analysis at [Use Change Analysis in Azure Monitor](./change/change-analysis.md). [Try Change Analysis for observability into your Azure subscriptions](https://aka.ms/cahome).

## Next steps

- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.
