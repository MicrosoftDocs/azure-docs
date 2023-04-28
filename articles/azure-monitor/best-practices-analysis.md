---
title: Azure Monitor best practices - Analysis and visualizations
description: Guidance and recommendations for customizing visualizations beyond standard analysis features in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/14/2023
ms.reviewer: bwren

---
# Analyzing and visualize data

This article describes built-in features for visualizing and analyzing collected data in Azure Monitor. Visualizations like charts and graphs can help you analyze your monitoring data to drill down on issues and identify patterns. You can create custom visualizations to meet the requirements of different users in your organization. 

## Built-in analysis features

This table describes Azure Monitor features that provide analysis of collected data without any configuration.

|Component  |Description | Required training and/or configuration|
|---------|---------|--------|
|Overview page|Most Azure services have an **Overview** page in the Azure portal that includes a **Monitor** section with charts that show recent critical metrics. This information is intended for owners of individual services to quickly assess the performance of the resource. |This page is based on platform metrics that are collected automatically. No configuration is required.         |
|[Metrics Explorer](essentials/metrics-getting-started.md)|You can use Metrics Explorer to interactively work with metric data and create metric alerts. You need minimal training to use Metrics Explorer, but you must be familiar with the metrics you want to analyze. |- Once data collection is configured, no another configuration is required.<br>- Platform metrics for Azure resources are automatically available.<br>- Guest metrics for virtual machines are available after an Azure Monitor agent is deployed to the virtual machine.<br>- Application metrics are available after Application Insights is configured.         |
|[Log Analytics](logs/log-analytics-overview.md)|With Log Analytics, you can create log queries to interactively work with log data and create log query alerts.| Some training is required for you to become familiar with the query language, although you can use prebuilt queries for common requirements. You can also add [query packs](logs/query-packs.md) with queries that are unique to your organization. Then if you're familiar with the query language, you can build queries for others in your organization.        |

## Built-in visualization tools

### Azure workbooks

 [Azure Workbooks](./visualize/workbooks-overview.md) provide a flexible canvas for data analysis and the creation of rich visual reports. You can use workbooks to tap into multiple data sources from across Azure and combine them into unified interactive experiences. They're especially useful to prepare end-to-end monitoring views across multiple Azure resources. Insights use prebuilt workbooks to present you with critical health and performance information for a particular service. You can access a gallery of workbooks on the **Workbooks** tab of the Azure Monitor menu and create custom workbooks to meet the requirements of your different users.

![Diagram that shows screenshots of three pages from a workbook, including Analysis of Page Views, Usage, and Time Spent on Page.](media/visualizations/workbook.png)

### Azure dashboards

[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are useful in providing a "single pane of glass" of your Azure infrastructure and services. While a workbook provides richer functionality, a dashboard can combine Azure Monitor data with data from other Azure services.

![Screenshot that shows an example of an Azure dashboard with customizable information.](media/visualizations/dashboard.png)

Here's a video about how to create dashboards:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4AslH]
### Grafana

[Grafana](https://grafana.com/) is an open platform that excels in operational dashboards. It's useful for:

- Detecting, isolating, and triaging operational incidents.
- Combining visualizations of Azure and non-Azure data sources. These sources include on-premises, third-party tools, and data stores in other clouds.

Grafana has popular plug-ins and dashboard templates for APM tools such as Dynatrace, New Relic, and AppDynamics. You can use these resources to visualize Azure platform data alongside other metrics from higher in the stack collected by other tools. It also has AWS CloudWatch and GCP BigQuery plug-ins for multicloud monitoring in a single pane of glass.

All versions of Grafana include the [Azure Monitor datasource plug-in](visualize/grafana-plugin.md) to visualize your Azure Monitor metrics and logs.

[Azure Managed Grafana](../managed-grafana/overview.md) also optimizes this experience for Azure-native data stores such as Azure Monitor and Azure Data Explorer. In this way, you can easily connect to any resource in your subscription and view all resulting telemetry in a familiar Grafana dashboard. It also supports pinning charts from Azure Monitor metrics and logs to Grafana dashboards. Grafana includes out-of-the-box dashboards for Azure resources. [Create your first Azure Managed Grafana workspace](../managed-grafana/quickstart-managed-grafana-portal.md) to get started.

![Screenshot that shows Grafana visualizations.](media/visualizations/grafana.png)

### Power BI

[Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/) is useful for creating business-centric dashboards and reports, along with reports that analyze long-term KPI trends. You can [import the results of a log query](./logs/log-powerbi.md) into a Power BI dataset. Then you can take advantage of its features, such as combining data from different sources and sharing reports on the web and mobile devices.

![Screenshot that shows an example Power B I report for I T operations.](media/visualizations/power-bi.png)

## Choose the right visualization tool

|Visualization tool|Benefits|Common use cases|Good fit for|
|:---------|:---------|:---------|:---------|
|[Azure Workbooks](./visualize/workbooks-overview.md)|- Native dashboarding platform in Azure.<br>- Designed for collaborating and troubleshooting.<br>- Out-of-the-box templates and reports.<br>- Fully customizable. |- Create an interactive report with parameters where selecting an element in a table dynamically updates associated charts and visualizations.<br>- Share a report with other users in your organization.<br>- Collaborate with other workbook authors in your organization by using a public GitHub-based template gallery.         |         |
|[Azure dashboards](../azure-portal/azure-portal-dashboards.md)|- Native dashboarding platform in Azure.<br>- Supports at scale deployments.<br>- Supports RBAC.<br>- No added cost|- Create a dashboard that combines a metrics graph and the results of a log query with operational data for related services.<br>- Share a dashboard with service owners through integration with [Azure role-based access control](../role-based-access-control/overview.md). |Azure/Arc exclusive environments|
|[Azure Managed Grafana](../managed-grafana/overview.md)|- Multi-platform, multicloud single pane of glass visualizations.<br>- Out-of-the-box plugins from most monitoring tools and platforms.<br>- Dashboard templates with focus on operations.<br>- Supports portability, multi-tenancy, and flexible RBAC.<br>- Azure managed Grafana provides seamless integration with Azure. |- Combine time-series and event data in a single visualization panel.<br>- Create a dynamic dashboard based on user selection of dynamic variables.<br>- Create a dashboard from a community-created and community-supported template.<br>- Create a vendor-agnostic business continuity and disaster scenario that runs on any cloud provider or on-premises.        |- Cloud Native CNCF monitoring.<br>- Best with Prometheus.<br>- Multicloud environments.<br>- Combining with 3rd party monitoring tools.|
|[Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/)     |- Helps design business centric KPI dashboards for long term trends.<br>- Supports BI analytics with extensive slicing and dicing. <br>- Create rich visualizations.<br>- Benefit from extensive interactivity, including zoom-in and cross-filtering.<br>- Share easily throughout your organization.<br>- Integrate data from multiple data sources.<br>- Experience better performance with results cached in a cube. |Dashboarding for long term trends.|

## Other options
Some Azure Monitor partners provide visualization functionality. For a list of partners that Microsoft has evaluated, see [Azure Monitor partner integrations](./partners.md). An Azure Monitor partner might provide out-of-the-box visualizations to save you time, although these solutions might have an extra cost.

You can also build your own custom websites and applications using metric and log data in Azure Monitor using the REST API. The REST API gives you flexibility in UI, visualization, interactivity, and features.

## Next steps
- [Deploy Azure Monitor: Alerts and automated actions](best-practices-alerts.md)
- [Optimize costs in Azure Monitor](best-practices-cost.md)
