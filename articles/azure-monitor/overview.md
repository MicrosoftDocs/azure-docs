---
title: Azure Monitor overview | Microsoft Docs
description: Overview of Microsoft services and functionalities that contribute to a complete monitoring strategy for your Azure services and applications.
ms.topic: overview
author: bwren
ms.author: bwren
ms.date: 11/17/2019

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

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4qXeL]


[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

## Overview

The following diagram gives a high-level view of Azure Monitor. At the center of the diagram are the data stores for metrics and logs, which are the two fundamental types of data used by Azure Monitor. On the left are the [sources of monitoring data](agents/data-sources.md) that populate these [data stores](data-platform.md). On the right are the different functions that Azure Monitor performs with this collected data. This includes such actions as analysis, alerting, and streaming to external systems.

![Azure Monitor overview](media/overview/overview.png)

## Monitoring data platform

All data collected by Azure Monitor fits into one of two fundamental types, [metrics and logs](data-platform.md). [Metrics](essentials/data-platform-metrics.md) are numerical values that describe some aspect of a system at a particular point in time. They are lightweight and capable of supporting near real-time scenarios. [Logs](logs/data-platform-logs.md) contain different kinds of data organized into records with different sets of properties for each type. Telemetry such as events and traces are stored as logs in addition to performance data so that it can all be combined for analysis.

For many Azure resources, you'll see data collected by Azure Monitor right in their Overview page in the Azure portal. Have a look at any virtual machine for example, and you'll see several charts displaying performance metrics. Click on any of the graphs to open the data in [metrics explorer](essentials/metrics-charts.md) in the Azure portal, which allows you to chart the values of multiple metrics over time.  You can view the charts interactively or pin them to a dashboard to view them with other visualizations.

![Diagram shows Metrics data flowing into the Metrics Explorer to use in visualizations.](media/overview/metrics.png)

Log data collected by Azure Monitor can be analyzed with [queries](logs/log-query-overview.md) to quickly retrieve, consolidate, and analyze collected data.  You can create and test queries using [Log Analytics](./logs/log-query-overview.md) in the Azure portal. You can then either directly analyze the data using different tools or save queries for use with [visualizations](visualizations.md) or [alert rules](alerts/alerts-overview.md).

Azure Monitor uses a version of the [Kusto query language](/azure/kusto/query/) that is suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. You can quickly learn the query language using [multiple lessons](logs/get-started-queries.md).  Particular guidance is provided to users who are already familiar with [SQL](/azure/data-explorer/kusto/query/sqlcheatsheet) and [Splunk](/azure/data-explorer/kusto/query/splunk-cheat-sheet).

![Diagram shows Logs data flowing into Log Analytics for analysis.](media/overview/logs.png)

## What data does Azure Monitor collect?

Azure Monitor can collect data from a [variety of sources](monitor-reference.md). This ranges from your application, any operating system and services it relies on, down to the platform itself. Azure Monitor collects data from each of the following tiers:

- **Application monitoring data**: Data about the performance and functionality of the code you have written, regardless of its platform.
- **Guest OS monitoring data**: Data about the operating system on which your application is running. This could be running in Azure, another cloud, or on-premises. 
- **Azure resource monitoring data**: Data about the operation of an Azure resource.
- **Azure subscription monitoring data**: Data about the operation and management of an Azure subscription, as well as data about the health and operation of Azure itself. 
- **Azure tenant monitoring data**: Data about the operation of tenant-level Azure services, such as Azure Active Directory.

As soon as you create an Azure subscription and start adding resources such as virtual machines and web apps, Azure Monitor starts collecting data.  [Activity logs](essentials/platform-logs-overview.md) record when resources are created or modified. [Metrics](essentials/data-platform-metrics.md) tell you how the resource is performing and the resources that it's consuming. 

[Enable diagnostics](essentials/platform-logs-overview.md) to extend the data you're collecting into the internal operation of the resources.  [Add an agent](agents/agents-overview.md) to compute resources to collect telemetry from their guest operating systems. 

Enable monitoring for your application with [Application Insights](app/app-insights-overview.md) to collect detailed information including page views, application requests, and exceptions. Further verify the availability of your application by configuring an [availability test](app/monitor-web-app-availability.md) to simulate user traffic.

### Custom sources

Azure Monitor can collect log data from any REST client using the [Data Collector API](logs/data-collector-api.md). This allows you to create custom monitoring scenarios and extend monitoring to resources that don't expose telemetry through other sources.

## Insights and curated visualizations

Monitoring data is only useful if it can increase your visibility into the operation of your computing environment. Some Azure resource providers have a "curated visualization" which gives you a customized monitoring experience for that particular service or set of services. These visualizations generally require minimal configuration. Larger scalable curated visualizations are known at "insights" and marked with that name in the documentation and Azure portal.   VM insights and Container insights are examples.  

When you want to monitor a service/area, it's best to see if the area already has an insight/curated visualization that you can use.  If you need additional functionality, you can always add additional monitoring on top of what it already provides.

The following table lists services that have curated visualization. The [Insight hub in the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/more) also links to the official more in-depth insights.

|Name with docs link)| Azure Portal Link| Description
|:--|:--|:--|
 | [Log Analytics Workspace](/azure/azure-monitor/logs/log-analytics-workspace-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/lawsInsights) | Log Analytics Workspace Insights (preview) provides comprehensive monitoring of your workspaces through a unified view of your workspace usage, performance, health, agent, queries, and change log. This article will help you understand how to onboard and use Log Analytics Workspace Insights (preview).
 | Service Bus | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/serviceBusInsights) | 
 | [Stack HCL Insights](/azure-stack/hci/manage/azure-stack-hci-insights) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/azureStackHCIInsights) | Arpita Duppala
 | [Azure Monitor Workbooks for Active Directory](/azure/active-directory/reports-monitoring/howto-use-azure-monitor-workbooks) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Workbooks) | Azure Active Directory provides workbooks to understand the effect of your Conditional Access policies, to troubleshoot sign-in failures, and to identify legacy authentications.
 | [Application Insights](/azure/azure-monitor/app/app-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/applicationsInsights) | Extensible Application Performance Management (APM) service which monitors the availability, performance, and usage of your web applications whether they're hosted in the cloud or on-premises. It leverages the powerful data analysis platform in Azure Monitor to provide you with deep insights into your application's operations. It enables you to diagnose errors without waiting for a user to report them. Application Insights includes connection points to a variety of development tools and integrates with Visual Studio to support your DevOps processes.
 | [Azure Monitor for Backup](/azure/backup/backup-azure-monitoring-use-azuremonitor) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_DataProtection/BackupCenterMenuBlade/backupReportsConfigure/menuId/backupReportsConfigure) | Provides built-in monitoring and alerting capabilities in a Recovery Services vault.
 | [Azure Cache for Redis Insights(preview)](azure/azure-monitor/insights/redis-cache-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/redisCacheInsights) | Provides a unified, interactive view of overall performance, failures, capacity, and operational health
 | [Container Insights](/azure/azure-monitor/insights/container-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/containerInsights) | Monitors the performance of container workloads that are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). It gives you performance visibility by collecting metrics from controllers, nodes, and containers that are available in Kubernetes through the Metrics API. Container logs are also collected.  After you enable monitoring from Kubernetes clusters, these metrics and logs are automatically collected for you through a containerized version of the Log Analytics agent for Linux.
 | [Cosmos DB Insights](/azure/azure-monitor/insights/cosmosdb-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/cosmosDBInsights) | Provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience.
 | [Azure Data Explorer](/azure/azure-monitor/insights/data-explorer) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/adxClusterInsights) | Azure Data Explorer Insights provides comprehensive monitoring of your clusters by delivering a unified view of your cluster performance, operations, usage, and failures.
 | [IOT Edge Insights](https://www.youtube.com/embed/b2U21R2ZPfQ) | ? | TODO
 | [Key Vault Insights (preview)](/azure/azure-monitor/insights/key-vault-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/keyvaultsInsights) | Provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency.
 | [Resource Group Insights (preview)](/azure/azure-monitor/insights/resource-group-insights) |  | Triage and diagnose any problems your individual resources encounter, while offering context as to the health and performance of the resource group as a whole.
 | [Azure Monitor for SAP Solutions](/azure/virtual-machines/workloads/sap/azure-monitor-overview) |  | I’ll put together and share a video of Azure Monitor for SAP Solutions by beginning of next week.
 | [SQL Insights](/azure/azure-monitor/insights/sql-insights-overview) |  | A comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance.
 | [Storage Insights](/azure/azure-monitor/insights/storage-insights-overview)  | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/storageInsights) | Provides comprehensive monitoring of your Azure Storage accounts by delivering a unified view of your Azure Storage services performance, capacity, and availability.
 | [Azure Monitor for Windows Virtual Desktop (Preview)](/azure/virtual-desktop/azure-monitor) |  | Azure Monitor for Windows Virtual Desktop (preview) is a dashboard built on Azure Monitor Workbooks that helps IT professionals understand their Windows Virtual Desktop environments. This topic will walk you through how to set up Azure Monitor for Windows Virtual Desktop to monitor your Windows Virtual Desktop environments.
 | [VM Insights](/azure/azure-monitor/insights/vminsights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/virtualMachines) | Monitors your Azure virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. 
 | [Network Insights (preview)](/azure/azure-monitor/insights/network-insights-overview) | [Portal Link](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/networkInsights) | Provides a comprehensive view of health and metrics for all your network resource. The advanced search capability helps you identify resource dependencies, enabling scenarios like identifying resource that are hosting your website, by simply searching for your website name.

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
[Visualizations](visualizations.md) such as charts and tables are effective tools for summarizing monitoring data and presenting it to different audiences. Azure Monitor has its own features for visualizing monitoring data and leverages other Azure services for publishing it to different audiences.

### Dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) allow you to combine different kinds of data into a single pane in the [Azure portal](https://portal.azure.com). You can optionally share the dashboard with other Azure users. Add the output of any log query or metrics chart to an Azure dashboard. For example, you could create a dashboard that combines tiles that show a graph of metrics, a table of activity logs, a usage chart from Application Insights, and the output of a log query.

![Screenshot shows an Azure Dashboard, which includes Application and Security tiles, along with other customizable information.](media/overview/dashboard.png)

### Workbooks
[Workbooks](visualize/workbooks-overview.md) provide a flexible canvas for data analysis and the creation of rich visual reports in the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences. Use workbooks provided with Insights or create your own from predefined templates.


![Workbooks example](media/overview/workbooks.png)

### Power BI
[Power BI](https://powerbi.microsoft.com) is a business analytics service that provides interactive visualizations across a variety of data sources. It's an effective means of making data available to others within and outside your organization. You can configure Power BI to [automatically import log data from Azure Monitor](./visualize/powerbi.md) to take advantage of these additional visualizations.


![Power BI](media/overview/power-bi.png)


## Integrate and export data
You'll often have the requirement to integrate Azure Monitor with other systems and to build custom solutions that use your monitoring data. Other Azure services work with Azure Monitor to provide this integration.

### Event Hub
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