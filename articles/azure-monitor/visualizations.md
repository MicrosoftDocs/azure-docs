---
title: Visualize data from Azure Monitor | Microsoft Docs
description: Get a summary of the available methods to visualize metric and log data stored in Azure Monitor.

ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 07/28/2021

---

# Deploy Azure Monitor - analyze and visualize data
Azure Monitor provides multiple ways to interactively work with data that it collects. The Azure portal provides multiple builtin features that you to work with this data, and you can configure additional features to meet the requirements of administrators and other users in your organization. Visualizations such as charts and graphs can help you analyze your monitoring data to drill down on issues and identify patterns. Depending on the tool that you use, you might also have the option to share visualizations with other users inside and outside your organization.

This article summarizes the available methods to work with metric and log data stored in Azure Monitor and recommendations on when to create additional resources for analysis.

## Overview page
Most Azure services will have an **Overview** page in the Azure portal that includes a **Monitor** section with charts showing recent charts for critical metrics. This is intended for owners of individual services to quickly assess the performance of the resource. There's no configuration required for this feature.

## Metrics explorer
Metrics explorer allows users to interactively work with metric data and create metric alerts. Most users will be able to use metrics explorer with minimal training but must be familiar with the metrics they want to analyze. There's no configuration required for this feature.


## Log Analytics
Log Analytics allows users to create log queries to interactively work with log data and create log query alerts. There is some training required for users to become familiar with the query language, although they can use prebuilt queries provided by Microsoft. You can also add [query packs](logs/query-packs.md) with queries that are unique to your organization. This allows users who are familiar with the query language to make queries available to others in the organization.


## Workbooks
[Workbooks](./visualize/workbooks-overview.md) are interactive documents that provide deep insights into your data, investigation, and collaboration inside the team. Workbooks are especially useful for troubleshooting guides and incident postmortems. Insights will provide workbooks to present users with critical health and performance information for a particular service. You can access a gallery of additional workbooks in the **Workbooks** tab of the Azure Monitor menu and create custom workbooks to meet requirements of your different users.

![Diagram that shows screenshots of three pages from a workbook, including Analysis of Page Views, Usage, and Time Spent on Page.](media/visualizations/workbook.png)

Unique advantages of custom workbooks include:

- Include both metric data and log data in the same workbooks.
- Define parameters that enable interactive reports, where selecting an element in a table will dynamically update associated charts and visualizations.
- Document-like usage flow.
- Options for personal or shared workbooks. Allows centralized administrators to provide custom workbooks to other users in the organization.
- Collaborative authoring experience that requires minimal training.
- Templates that support a public GitHub-based template gallery.


## Azure Dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are the primary dashboarding technology for Azure. They're useful in providing a single pane of glass over your Azure infrastructure and services, so you can quickly identify important issues.

See [Create and share dashboards of Log Analytics data](visualize/tutorial-logs-dashboards.md) for details on creating a dashboard that includes data from Azure Monitor Logs. See [Create custom KPI dashboards using Azure Application Insights](app/tutorial-app-dashboards.md) for details on creating a dashboard that includes data from Application Insights. 

![Screenshot that shows an example of an Azure dashboard with customizable information.](media/visualizations/dashboard.png)

Here's a video walkthrough on creating dashboards:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4AslH]

Advantages of a dashboard include:

- Deep integration into Azure. Visualizations can be pinned to dashboards from multiple Azure pages, including [Metrics Explorer](essentials/metrics-charts.md), [Log Analytics](logs/log-analytics-overview.md), and [Application Insights](app/app-insights-overview.md).
- Support for both metrics and logs.
- The ability to combine data from multiple sources, including output from [Metrics Explorer](essentials/metrics-charts.md), [log queries](logs/log-query-overview.md), and [maps](app/app-map.md), and availability in [Application Insights](app/app-insights-overview.md).
- Options for personal or shared dashboards through integration with [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).
- Automatic refresh. Metric refresh depends on the time range, with a minimum of five minutes. Logs refresh every hour. You can manually refresh on demand by selecting the **Refresh** icon on a visualization, or by refreshing the full dashboard.
- Parameterized metric dashboards with time stamps and custom parameters.
- Flexible layout options.
- Full-screen mode.


Limitations include:

- Limited control over log visualizations, with no support for data tables. The total number of data series is limited to 50, with further data series grouped under an _other_ bucket.
- No custom parameter support for log charts.
- A limited period for log charts (last 30 days).
- A requirement that log charts must be pinned to shared dashboards.
- No interactivity with dashboard data.
- Limited contextual drill-down.


## Power BI
[Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/) is useful for creating business-centric dashboards and reports, along with reports that analyze long-term KPI trends. You can [import the results of a log query](visualize/powerbi.md) into a Power BI dataset and then take advantage of its features, such as combining data from different sources and sharing reports on the web and mobile devices.

![Screenshot that shows an example Power B I report for I T operations.](media/visualizations/power-bi.png)

Advantages of Power BI include:

- Rich visualizations.
- Extensive interactivity, including zoom-in and cross-filtering.
- Ease of sharing throughout your organization.
- Integration with other data from multiple data sources.
- Better performance with results cached in a cube.

Limitations include:

- Support for logs but not metrics.
- No Azure integration. You can't manage dashboards and models through Azure Resource Manager.
- The need for query results to be imported into a Power BI model for configuration. 
- Limited result size and refresh.
- Limited data refresh (eight times per day).


## Grafana
[Grafana](https://grafana.com/) is an open platform that excels in operational dashboards. It's useful for detecting, isolating, and triaging operational incidents. You can add the [Azure Monitor data source plug-in for Grafana](visualize/grafana-plugin.md) to your Azure subscription to have it visualize your Azure metric data.

![Screenshot that shows Grafana visualizations.](media/visualizations/grafana.png)

> [!IMPORTANT]
> The Internet Explorer browser and older Microsoft Edge browsers are not compatible with Grafana. You must use a Chromium-based browser, including Microsoft Edge. See [Supported browsers for Grafana](https://grafana.com/docs/grafana/latest/installation/requirements/#supported-web-browsers).

Advantages of Grafana include:

- Rich visualizations.
- A rich ecosystem of data sources.
- Data interactivity, including zoom-in.
- Support for parameters.

Limitations include:

- No Azure integration. You can't manage dashboards and models through Azure Resource Manager.
- The cost to support additional Grafana infrastructure or additional cost for Grafana Cloud.

## Azure Monitor partners
Some Azure Monitor partners provide visualization functionality. For a list of partners that Microsoft has evaluated, see [Azure Monitor partner integrations](./partners.md). 

An Azure Monitor partner might provide out-of-the-box visualizations to save you time. 

Limitations include:

- Potential for additional costs.
- The need for time to research and evaluate partner offerings.

## Your own custom application
You can access metric and log data in Azure Monitor through an API by using any REST client. You can then build your own custom websites and applications.

Advantages of building a custom application include:

- Complete flexibility in UI, visualization, interactivity, and features.
- The ability to combine metric and log data with other data sources.

One significant disadvantage is that it requires engineering effort.


## Next steps
- Learn about the [data that Azure Monitor collects](data-platform.md).
- Learn about [Azure dashboards](../azure-portal/azure-portal-dashboards.md).
- Learn about [Metrics Explorer](essentials/metrics-getting-started.md).
- Learn about [workbooks](./visualize/workbooks-overview.md).
- Learn about [importing log data into Power BI](./visualize/powerbi.md).
- Learn about the [Azure Monitor data source plug-in for Grafana](./visualize/grafana-plugin.md).
- Learn about [views in Azure Monitor](visualize/view-designer.md).