---
title: Azure Monitor overview | Microsoft Docs
description: Overview of Microsoft services and functionalities that contribute to a complete monitoring strategy for your Azure services and applications.
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 04/27/2022

---

# Azure Monitor overview

Azure Monitor helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. This information helps you understand how your applications are performing and proactively identify issues affecting them and the resources they depend on.

Just a few examples of what you can do with Azure Monitor include:

- Detect and diagnose issues across applications and dependencies with [Application Insights](app/app-insights-overview.md).
- Correlate infrastructure issues with [VM insights](vm/vminsights-overview.md) and [Container insights](containers/container-insights-overview.md).
- Drill into your monitoring data with [Log Analytics](logs/log-query-overview.md) for troubleshooting and deep diagnostics.
- Support operations at scale with [smart alerts](alerts/alerts-smartgroups-overview.md) and [automated actions](alerts/alerts-action-rules.md).
- Create visualizations with Azure [dashboards](visualize/tutorial-logs-dashboards.md) and [workbooks](visualize/workbooks-overview.md).
- Collect data from [monitored resources](./monitor-reference.md) using [Azure Monitor Metrics](./essentials/data-platform-metrics.md).
- Investigate change data for routine monitoring or for triaging incidents using [Change Analysis](./change/change-analysis.md).

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

## Overview

The following diagram gives a high-level view of Azure Monitor. At the center of the diagram are the data stores for metrics and logs, which are the two fundamental types of data used by Azure Monitor. On the left are the [sources of monitoring data](agents/data-sources.md) that populate these [data stores](data-platform.md). On the right are the different functions that Azure Monitor performs with this collected data. This includes such actions as analysis, alerting, and streaming to external systems.

:::image type="content" source="media/overview/azure-monitor-overview-optm.svg" alt-text="Diagram that shows an overview of Azure Monitor." border="false" lightbox="media/overview/azure-monitor-overview-optm.svg":::

The video below uses an earlier version of the diagram above, but its explanations are still relevant. 
> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4qXeL]

## Monitoring data platform

All data collected by Azure Monitor fits into one of two fundamental types, [metrics and logs](data-platform.md). [Metrics](essentials/data-platform-metrics.md) are numerical values that describe some aspect of a system at a particular point in time. They are lightweight and capable of supporting near real-time scenarios. [Logs](logs/data-platform-logs.md) contain different kinds of data organized into records with different sets of properties for each type. Telemetry such as events and traces are stored as logs in addition to performance data so that it can all be combined for analysis.

For many Azure resources, you'll see data collected by Azure Monitor right in their Overview page in the Azure portal. Have a look at any virtual machine for example, and you'll see several charts displaying performance metrics. Click on any of the graphs to open the data in [metrics explorer](essentials/metrics-charts.md) in the Azure portal, which allows you to chart the values of multiple metrics over time.  You can view the charts interactively or pin them to a dashboard to view them with other visualizations.

![Diagram shows Metrics data flowing into the Metrics Explorer to use in visualizations.](media/overview/metrics.png)

Log data collected by Azure Monitor can be analyzed with [queries](logs/log-query-overview.md) to quickly retrieve, consolidate, and analyze collected data.  You can create and test queries using [Log Analytics](./logs/log-query-overview.md) in the Azure portal. You can then either directly analyze the data using different tools or save queries for use with [visualizations](best-practices-analysis.md) or [alert rules](alerts/alerts-overview.md).

Azure Monitor uses a version of the [Kusto query language](/azure/kusto/query/) that is suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. You can quickly learn the query language using [multiple lessons](logs/get-started-queries.md).  Particular guidance is provided to users who are already familiar with [SQL](/azure/data-explorer/kusto/query/sqlcheatsheet) and [Splunk](/azure/data-explorer/kusto/query/splunk-cheat-sheet).

![Diagram shows Logs data flowing into Log Analytics for analysis.](media/overview/logs.png)

Change Analysis not only alerts you to live site issues, outages, component failures, or other change data, but it provides insights into those application changes, increases observability, and reduces the mean time to repair (MTTR). You automatically register the `Microsoft.ChangeAnalysis` resource provider with an Azure Resource Manager subscription by navigating to the Change Analysis service via the Azure portal. For web app in-guest changes, you can enable Change Analysis using the [Diagnose and solve problems tool](./change/change-analysis-visualizations.md#diagnose-and-solve-problems-tool). 

Change Analysis builds on [Azure Resource Graph](../governance/resource-graph/overview.md) to provide a historical record of how your Azure resources have changed over time, detecting managed identities, platform OS upgrades, and hostname changes. Change Analysis securely queries IP Configuration rules, TLS settings, and extension versions to provide more detailed change data.

## What data does Azure Monitor collect?
Azure Monitor can collect data from a [variety of sources](monitor-reference.md). This ranges from your application, any operating system and services it relies on, down to the platform itself. Azure Monitor collects data from each of the following tiers:

- **Application monitoring data**: Data about the performance and functionality of the code you have written, regardless of its platform.
- **Guest OS monitoring data**: Data about the operating system on which your application is running. This could be running in Azure, another cloud, or on-premises. 
- **Azure resource monitoring data**: Data about the operation of an Azure resource. For a complete list of the resources that have metrics or logs, see [What can you monitor with Azure Monitor?](monitor-reference.md#azure-supported-services).
- **Azure subscription monitoring data**: Data about the operation and management of an Azure subscription, as well as data about the health and operation of Azure itself. 
- **Azure tenant monitoring data**: Data about the operation of tenant-level Azure services, such as Azure Active Directory.
- **Azure resource change data**: Data about changes within your Azure resource(s) and how to address and triage incidents and issues.

As soon as you create an Azure subscription and start adding resources such as virtual machines and web apps, Azure Monitor starts collecting data.  [Activity logs](essentials/platform-logs-overview.md) record when resources are created or modified. [Metrics](essentials/data-platform-metrics.md) tell you how the resource is performing and the resources that it's consuming. 

[Enable diagnostics](essentials/platform-logs-overview.md) to extend the data you're collecting into the internal operation of the resources.  [Add an agent](agents/agents-overview.md) to compute resources to collect telemetry from their guest operating systems. 

Enable monitoring for your application with [Application Insights](app/app-insights-overview.md) to collect detailed information including page views, application requests, and exceptions. Further verify the availability of your application by configuring an [availability test](app/monitor-web-app-availability.md) to simulate user traffic.

### Custom sources
Azure Monitor can collect log data from any REST client using the [Data Collector API](logs/data-collector-api.md). This allows you to create custom monitoring scenarios and extend monitoring to resources that don't expose telemetry through other sources.

## Insights and curated visualizations
Monitoring data is only useful if it can increase your visibility into the operation of your computing environment. Some Azure resource providers have a "curated visualization" which gives you a customized monitoring experience for that particular service or set of services. They generally require minimal configuration. Larger scalable curated visualizations are known as "insights" and marked with that name in the documentation and Azure portal.  

For more information, see [List of insights and curated visualizations using Azure Monitor](monitor-reference.md#insights-and-curated-visualizations). Some of the larger insights are also described below.

### Application Insights
[Application Insights](app/app-insights-overview.md) monitors the availability, performance, and usage of your web applications whether they're hosted in the cloud or on-premises. It leverages the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. It enables you to diagnose errors without waiting for a user to report them. Application Insights includes connection points to a variety of development tools and integrates with Visual Studio to support your DevOps processes.

![App Insights](media/overview/app-insights.png)

### Container insights
[Container insights](containers/container-insights-overview.md) monitors the performance of container workloads that are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). It gives you performance visibility by collecting metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. Container logs are also collected.  After you enable monitoring from Kubernetes clusters, these metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux.

![Container Health](media/overview/container-insights.png)

### VM insights
[VM insights](vm/vminsights-overview.md) monitors your Azure virtual machines (VM) at scale. It analyzes the performance and health of your Windows and Linux VMs and identifies their different processes and interconnected dependencies on external processes. The solution includes support for monitoring performance and application dependencies for VMs hosted on-premises or another cloud provider.  


![VM Insights](media/overview/vm-insights.png)



## Responding to critical situations
In addition to allowing you to interactively analyze monitoring data, an effective monitoring solution must be able to proactively respond to critical conditions identified in the data that it collects. This could be sending a text or mail to an administrator responsible for investigating an issue. Or you could launch an automated process that attempts to correct an error condition.

### Alerts
[Alerts in Azure Monitor](alerts/alerts-overview.md) proactively notify you of critical conditions and potentially attempt to take corrective action. Alert rules based on metrics provide near real time alerts based on numeric values. Rules based on logs allow for complex logic across data from multiple sources.

Alert rules in Azure Monitor use [action groups](alerts/action-groups.md), which contain unique sets of recipients and actions that can be shared across multiple rules. Based on your requirements, action groups can perform such actions as using webhooks to have alerts start external actions or to integrate with your ITSM tools.

![Screenshot shows alerts in Azure Monitor with severity, total alerts, and other information.](media/overview/alerts.png)

### Autoscale
Autoscale allows you to have the right amount of resources running to handle the load on your application. Create rules that use metrics collected by Azure Monitor to determine when to automatically add resources when load increases. Save money by removing resources that are sitting idle. You specify a minimum and maximum number of instances and the logic for when to increase or decrease resources.

![Diagram shows autoscale, with several servers on a line labeled Processor Time > 80% and two servers marked as minimum, three servers as current capacity, and five as maximum.](media/overview/autoscale.png)

## Visualizing monitoring data
[Visualizations](best-practices-analysis.md) such as charts and tables are effective tools for summarizing monitoring data and presenting it to different audiences. Azure Monitor has its own features for visualizing monitoring data and leverages other Azure services for publishing it to different audiences.

### Dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) allow you to combine different kinds of data into a single pane in the [Azure portal](https://portal.azure.com). You can optionally share the dashboard with other Azure users. Add the output of any log query or metrics chart to an Azure dashboard. For example, you could create a dashboard that combines tiles that show a graph of metrics, a table of activity logs, a usage chart from Application Insights, and the output of a log query.

![Screenshot shows an Azure Dashboard, which includes Application and Security tiles, along with other customizable information.](media/overview/dashboard.png)

### Workbooks
[Workbooks](visualize/workbooks-overview.md) provide a flexible canvas for data analysis and the creation of rich visual reports in the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences. Use workbooks provided with Insights or create your own from predefined templates.


![Workbooks example](media/overview/workbooks.png)

### Power BI
[Power BI](https://powerbi.microsoft.com) is a business analytics service that provides interactive visualizations across a variety of data sources. It's an effective means of making data available to others within and outside your organization. You can configure Power BI to [automatically import log data from Azure Monitor](./logs/log-powerbi.md) to take advantage of these additional visualizations.


![Power BI](media/overview/power-bi.png)


## Integrate and export data
You'll often have the requirement to integrate Azure Monitor with other systems and to build custom solutions that use your monitoring data. Other Azure services work with Azure Monitor to provide this integration.

### Event Hubs
[Azure Event Hubs](../event-hubs/index.yml) is a streaming platform and event ingestion service. It can transform and store data using any real-time analytics provider or batching/storage adapters. Use Event Hubs to [stream Azure Monitor data](essentials/stream-monitoring-data-event-hubs.md) to partner SIEM and monitoring tools.


### Logic Apps
[Logic Apps](https://azure.microsoft.com/services/logic-apps) is a service that allows you to automate tasks and business processes using workflows that integrate with different systems and services. Activities are available that read and write metrics and logs in Azure Monitor. This allows you to build workflows integrating with a variety of other systems.


### API
Multiple APIs are available to read and write metrics and logs to and from Azure Monitor in addition to accessing generated alerts. You can also configure and retrieve alerts. This provides you with essentially unlimited possibilities to build custom solutions that integrate with Azure Monitor.

## Next steps
Learn more about:

* [Metrics and logs](./data-platform.md#metrics) for the data collected by Azure Monitor.
* [Data sources](agents/data-sources.md) for how the different components of your application send telemetry.
* [Log queries](logs/log-query-overview.md) for analyzing collected data.
* [Best practices](/azure/architecture/best-practices/monitoring) for monitoring cloud applications and services.
