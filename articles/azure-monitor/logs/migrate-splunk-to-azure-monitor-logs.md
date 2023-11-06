---
title: Migrate from Splunk to Azure Monitor Logs - Get started
description: Plan the phases of your migration from Splunk to Azure Monitor Logs and get started importing, collecting, and analyzing log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.topic: how-to 
ms.date: 01/27/2023

#customer-intent: As an IT manager, I want to understand the steps required to migrate my Splunk deployment to Azure Monitor Logs so that I can decide whether to migrate and plan and execute my migration.

---

# Migrate from Splunk to Azure Monitor Logs

[Azure Monitor Logs](../logs/data-platform-logs.md) is a cloud-based managed monitoring and observability service that provides many advantages in terms of cost management, scalability, flexibility, integration, and low maintenance overhead. The service is designed to handle large amounts of data and scale easily to meet the needs of organizations of all sizes.

Azure Monitor Logs collects data from a wide variety of sources, including Windows Event logs, Syslog, and custom logs, to provide a unified view of all Azure and non-Azure resources. Using a sophisticated query language and curated visualization you can quickly analyze millions of records to identify, understand, and respond to critical patterns in your monitoring data.

This article explains how to migrate your Splunk Observability deployment to Azure Monitor Logs for logging and log data analysis. 

For information on migrating your Security Information and Event Management (SIEM) deployment from Splunk Enterprise Security to Azure Sentinel, see [Plan your migration to Microsoft Sentinel](../../sentinel/migration.md).
## Why migrate to Azure Monitor?

The benefits of migrating to Azure Monitor include:

- Fully managed, Software as a Service (SaaS) platform with:
    - Automatic upgrades and scaling. 
    - [Simple per-GB pay-as-you-go pricing](https://azure.microsoft.com/pricing/details/monitor/). 
    - [Cost optimization and monitoring features](../../azure-monitor/best-practices-cost.md) and low-cost [Basic logs](../logs/basic-logs-configure.md).  
- Cloud-native monitoring and observability, including:
    - [End-to-end, at-scale monitoring](../overview.md).
    - [Native monitoring of Azure resources](../essentials/platform-logs-overview.md).
    - [Privacy and compliance](../security-controls-policy.md).
- Native integration with a range of complementary Azure services, such as [Microsoft Sentinel](../../sentinel/overview.md) for security information and event management, [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) for automation, [Azure Managed Grafana](../../managed-grafana/overview.md) for dashboarding, and [Azure Machine Learning](../../machine-learning/overview-what-is-azure-machine-learning.md)  for advanced analysis and response capabilities.

## Compare offerings 

|Splunk offering|Azure offering|
|---|---|
|Splunk Observability|[Azure Monitor](../overview.md) is an end-to-end solution for collecting, analyzing, and acting on telemetry from your cloud, multicloud, and on-premises environments, built over a powerful data ingestion pipeline that's shared with Microsoft Sentinel. Azure Monitor offers enterprises a comprehensive solution for monitoring cloud, hybrid, and on-premises environments, with [network isolation](../logs/private-link-security.md), [resilience features and protection from data center failures](../logs/availability-zones.md), [reporting](../overview.md#insights), and [alerts and response](../overview.md#respond) capabilities.|
|Splunk Security|[Microsoft Sentinel](../../sentinel/overview.md) is a cloud-native solution that runs over the Azure Monitor platform to provide intelligent security analytics and threat intelligence across the enterprise.|
## Introduction to key concepts


|Azure Monitor Logs|Similar Splunk concept|Description|
|---------|---------|---------|
|[Log Analytics workspace](../logs/log-analytics-workspace-overview.md)|Namespace|A Log Analytics workspace is an environment in which you can collect log data from all Azure and non-Azure monitored resources. The data in the workspace is available for querying and analysis, Azure Monitor features, and other Azure services. Similar to a Splunk namespace, you can manage access to the data and artifacts, such as alerts and workbooks, in your Log Analytics workspace.|
|[Table management](../logs/manage-logs-tables.md)|Indexing|Azure Monitor Logs ingests log data into tables in a managed [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) database. During ingestion, the service automatically indexes and timestamps the data, which means you can store various types of data and access the data quickly using Kusto Query Language (KQL) queries.<br/>Use table properties to manage the table schema, data retention and archive, and whether to store the data for occasional auditing and troubleshooting or for ongoing analysis and use by features and services.<br/>For a comparison of Splunk and Azure Data Explorer data handling and querying concepts, see [Splunk to Kusto Query Language map](/azure/data-explorer/kusto/query/splunk-cheat-sheet).         |
|[Basic and Analytics log data plans](../logs/basic-logs-configure.md)|         |Azure Monitor Logs offers two log data plans that let you reduce log ingestion and retention costs and take advantage of Azure Monitor's advanced features and analytics capabilities based on your needs.<br/>The **Analytics** plan makes log data available for interactive queries and use by features and services.<br/>The **Basic** log data plan provides a low-cost way to ingest and retain logs for troubleshooting, debugging, auditing, and compliance.|
|[Archiving and quick access to archived data](../logs/data-retention-archive.md)|Data bucket states (hot, warm, cold, thawed), archiving, Dynamic Data Active Archive (DDAA)|The cost-effective archive option keeps your logs in your Log Analytics workspace and lets you access archived log data immediately, when you need it. Archive configuration changes are effective immediately because data isn't physically transferred to external storage. You can [restore archived data](../logs/restore.md) or run a [search job](../logs/search-jobs.md) to make a specific time range of archived data available for real-time analysis.         |
|[Access control](../logs/manage-access.md)|Role-based user access, permissions|Role-based access control lets you define which people in your organization have access to read, write, and perform operations in a Log Analytics workspace. You can configure permissions at the workspace level, at the resource level, and at the table level, so you have granular control over specific resources and log types.|
|[Data transformations](../essentials/data-collection-transformations.md)|Transforms, field extractions|Transformations let you filter or modify incoming data before it's sent to a Log Analytics workspace. Use transformations to remove sensitive data, enrich data in your Log Analytics workspace, perform calculations, and filter out data you don't need to reduce data costs.|
|[Data collection rules](../essentials/data-collection-rule-overview.md)|Data inputs, data pipeline|Define which data to collect, how to transform that data, and where to send the data.|
|[Kusto Query Language (KQL)](/azure/kusto/query/)|Splunk Search Processing Language (SPL)|Azure Monitor Logs uses a large subset of KQL that's suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. Use the [Splunk to Kusto Query Language map](/azure/data-explorer/kusto/query/splunk-cheat-sheet) to translate your Splunk SPL knowledge to KQL. You can also [learn KQL with tutorials](../logs/get-started-queries.md) and [KQL training modules](/training/modules/analyze-logs-with-kql/). |
|[Log Analytics](../logs/log-analytics-tutorial.md)|Splunk Web, Search app, Pivot tool|A tool in the Azure portal for editing and running log queries in Azure Monitor Logs. Log Analytics also provides a rich set of tools for exploring and visualizing data without using KQL.|
|[Cost optimization](../../azure-monitor/best-practices-cost.md)|         |Azure Monitor provides [tools and best practices to help you understand, monitor, and optimize your costs](../../azure-monitor/best-practices-cost.md) based on your needs.|

## 1. Understand your current usage

Your current usage in Splunk will help you decide which [pricing tier](../logs/change-pricing-tier.md) to select in Azure Monitor and estimate your future costs:

- [Follow Splunk guidance](https://docs.splunk.com/Documentation/Splunk/latest/Admin/AboutSplunksLicenseUsageReportView) to view your usage report.
- [Azure Monitor cost estimates](../cost-estimate.md) using the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor). 

## 2. Set up a Log Analytics workspace

Your Log Analytics workspace is where you collect log data from all of your monitored resources. You can retain data in a Log Analytics workspace for up to seven years. Low-cost data archiving within the workspace lets you access archived data quickly and easily when you need it, without the overhead of managing an external data store.

We recommend collecting all of your log data in a single Log Analytics workspace for ease of management. If you're considering using multiple workspaces, see [Design a Log Analytics workspace architecture](../logs/workspace-design.md).

To set up a Log Analytics workspace for data collection:

1. [Create a Log Analytics workspace](../logs/quick-create-workspace.md).
    
    Azure Monitor Logs creates Azure tables in your workspace automatically based on Azure services you use and [data collection settings](#4-collect-data) you define for Azure resources.

1. Configure your Log Analytics workspace, including:
    1. [Pricing tier](../logs/change-pricing-tier.md).
    1. [Link your Log Analytics workspace to a dedicated cluster](../logs/availability-zones.md) to take advantage of advanced capabilities, if you're eligible, based on pricing tier.
    1. [Daily cap](../logs/daily-cap.md).
    1. [Data retention](../logs/data-retention-archive.md).
    1. [Network isolation](../logs/private-link-security.md).
    1. [Access control](../logs/manage-access.md).

1. Use [table-level configuration settings](../logs/manage-logs-tables.md) to: 
    1. [Define each table's log data plan](../logs/basic-logs-configure.md). 
    
        The default log data plan is Analytics, which lets you take advantage of Azure Monitor's rich monitoring and analytics capabilities.  
    
    1. [Set a data retention and archiving policy for specific tables](../logs/data-retention-archive.md), if you need them to be different from the workspace-level data retention and archiving policy. 
    1. [Modify the table schema](../logs/create-custom-table.md) based on your data model.

## 3. Migrate Splunk artifacts to Azure Monitor

To migrate most Splunk artifacts, you need to translate Splunk Processing Language (SPL) to Kusto Query Language (KQL). For more information, see the [Splunk to Kusto Query Language map](/azure/data-explorer/kusto/query/splunk-cheat-sheet) and [Get started with log queries in Azure Monitor](../logs/get-started-queries.md).

This table lists Splunk artifacts and links to guidance for setting up the equivalent artifacts in Azure Monitor:

|Splunk artifact| Azure Monitor artifact|
|---|---|
|Alerts|[Alert rules](../alerts/alerts-create-new-alert-rule.md)|
|Alert actions|[Action groups](../alerts/action-groups.md)|
|Apps|[Azure Monitor Insights](../insights/insights-overview.md) are a set of ready-to-use, curated monitoring experiences with pre-configured data inputs, searches, alerts, and visualizations to get you started analyzing data quickly and effectively. |
|Dashboards|[Workbooks](../visualize/workbooks-overview.md)|
|Lookups|Azure Monitor provides various ways to enrich data, including:<br>- [Data collection rules](../essentials/data-collection-rule-overview.md), which let you send data from multiple sources to a Log Analytics workspace, and perform calculations and transformations before ingesting the data.<br>- KQL operators, such as the [join operator](/azure/data-explorer/kusto/query/joinoperator), which combines data from different tables, and the [externaldata operator](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor), which returns data from external storage.<br>- Integration with services, such as [Azure Machine Learning](../../machine-learning/overview-what-is-azure-machine-learning.md) or [Azure Event Hubs](../../event-hubs/event-hubs-about.md), to apply advanced machine learning and stream in additional data.|
|Namespaces|You can grant or limit permission to artifacts in Azure Monitor based on [access control](../logs/manage-access.md) you define on your [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) or [Azure resource groups](../../azure-resource-manager/management/manage-resource-groups-portal.md).|
|Permissions|[Access management](../logs/manage-access.md)|
|Reports|Azure Monitor offers a range of options for analyzing, visualizing, and sharing data, including:<br>- [Integration with Grafana](../visualize/grafana-plugin.md)<br>- [Insights](../insights/insights-overview.md)<br>- [Workbooks](../visualize/workbooks-overview.md)<br>- [Dashboards](../visualize/tutorial-logs-dashboards.md)<br>- [Integration with Power BI](../logs/log-powerbi.md)<br>- [Integration with Excel](../logs/log-excel.md)|
|Searches|[Queries](../logs/log-query-overview.md)|
|Source types|[Define your data model in your Log Analytics workspace](../logs/manage-logs-tables.md). Use [ingestion-time transformations](../essentials/data-collection-transformations.md) to filter, format, or modify incoming data.|
|Data collections methods| See [Collect data](#4-collect-data) for Azure Monitor tools designed for specific resources.| 

For information on migrating Splunk SIEM artifacts, including detection rules and SOAR automation, see [Plan your migration to Microsoft Sentinel](../../sentinel/migration.md).
## 4. Collect data

Azure Monitor provides tools for collecting data from log [data sources](../data-sources.md) on Azure and non-Azure resources in your environment. 

To collect data from a resource:

1. Set up the relevant data collection tool based on the table below.
1. Decide which data you need to collect from the resource.
1. Use [transformations](../essentials/data-collection-transformations.md) to remove sensitive data, enrich data or perform calculations, and filter out data you don't need, to reduce costs.   

This table lists the tools Azure Monitor provides for collecting data from various resource types.  

| Resource type | Data collection tool |Similar Splunk tool| Collected data |
| --- | --- | --- |
| **Azure** | [Diagnostic settings](../essentials/diagnostic-settings.md)  | | **Azure tenant** - Microsoft Entra audit logs provide sign-in activity history and audit trail of changes made within a tenant.<br/>**Azure resources** - Logs and performance counters.<br/>**Azure subscription** - Service health records along with records on any configuration changes made to the resources in your Azure subscription. |
| **Application** | [Application insights](../app/app-insights-overview.md) |Splunk Application Performance Monitoring| Application performance monitoring data. |
| **Container** |[Container insights](../containers/container-insights-overview.md)|Container Monitoring| Container performance data. |
| **Operating system** | [Azure Monitor Agent](../vm/monitor-virtual-machine-agent.md) |Universal Forwarder, Heavy Forwarder | Monitoring data from the guest operating system of Azure and non-Azure virtual machines.|
| **Non-Azure source** | [Logs Ingestion API](../logs/logs-ingestion-api-overview.md) |HTTP Event Collector (HEC)| File-based logs and any data you send to a [data collection endpoint](../essentials/data-collection-endpoint-overview.md) on a monitored resource.|

:::image type="content" source="media/migrate-splunk-to-azure-monitor-logs/azure-monitor-logs-collect-data.png" alt-text="Diagram that shows various data sources being connected to Azure Monitor Logs." lightbox="media/migrate-splunk-to-azure-monitor-logs/azure-monitor-logs-collect-data.png":::

## 5. Transition to Azure Monitor Logs

A common approach is to transition to Azure Monitor Logs gradually, while maintaining historical data in Splunk. During this period, you can: 

- Use the [Log ingestion API](../logs/logs-ingestion-api-overview.md) to ingest data from Splunk. 
- Use [Log Analytics workspace data export](../logs/logs-data-export.md) to export data out of Azure Monitor.  

To export your historical data from Splunk: 

1. Use one of the [Splunk export methods](https://docs.splunk.com/Documentation/Splunk/8.2.5/Search/Exportsearchresults) to export data in CSV format.
1. To collect the exported data:
    1. Use Azure Monitor Agent to collect the data you export from Splunk, as described in [Collect text logs with Azure Monitor Agent](../agents/data-collection-text-log.md).
    
       or
    
    1. Collect the exported data directly with the Logs Ingestion API, as described in [Send data to Azure Monitor Logs by using a REST API](../logs/tutorial-logs-ingestion-api.md). 

:::image type="content" source="media/migrate-splunk-to-azure-monitor-logs/import-data-from-splunk-to-azure-monitor.png" alt-text="Diagram that shows data streaming in from Splunk to a Log Analytics workspace in Azure Monitor Logs." lightbox="media/migrate-splunk-to-azure-monitor-logs/import-data-from-splunk-to-azure-monitor.png":::

## Next steps

- Learn more about using [Log Analytics](../logs/log-analytics-overview.md) and the [Log Analytics Query API](../logs/api/overview.md).
- [Enable Microsoft Sentinel on your Log Analytics workspace](../../sentinel/quickstart-onboard.md).
- Take the [Analyze logs in Azure Monitor with KQL training module](/training/modules/analyze-logs-with-kql/).
