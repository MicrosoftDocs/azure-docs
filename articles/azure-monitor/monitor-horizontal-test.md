---
title: Monitor App Service
description: Start here to learn how to monitor your Service.
ms.date: 07/08/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: AbbyMSFT
ms.author: abbyweisberg
ms.service: azure-monitor
---

# Monitor App Service

This article describes:

- The types of monitoring data you can collect for this service.
- Ways to analyze that data.

[Azure Monitor](/azure/azure-monitor/overview) collects and aggregates metrics and logs from every component of your system to monitor availability, performance, and resilience, and notify you of issues affecting your system. You can use the Azure portal, PowerShell, Azure CLI, REST API, or client libraries to set up and view monitoring data.

Different metrics and logs are available for different resource types. This table describes how you can use Azure Monitor to collect data to monitor your service and how to view and analyze the data:

|Data to collect|Description|Collection Method|Analyze monitoring data|Reference Information|
|---------|---------|---------|---------|
|Metrics     |Metrics are numerical values collected at regular intervals, that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|Collected automatically.|View in [metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started) or [create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to send it to other destinations.|[Supported metrics for App Service](../app-service/monitor-app-service-reference.md#supported-metrics-for-microsoftweb)|
|Logs|Logs are recorded system events. Logs can contain different types of data, be structured or free-form text, and they contain a timestamp. Azure Monitor stores structured and unstructured log data of all types in Azure Monitor Logs.|You must [create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect resources logs.|View in [Log Analytics](logs/log-analytics-overview.md) or [create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to send it to other destinations.|[Supported resource logs for App Service](../app-service/monitor-app-service-reference.md#supported-resource-logs-for-microsoftweb)|
|Activity log|The Azure Monitor activity log is a platform log that provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|Collected automatically. Can be collected in Log Analytics workspace at no charge | View in the Azure portal or [create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to send it to other destinations.|[Supported Activity Log for App Service](../app-service/monitor-app-service-reference.md#activity-log)|

For information about using Azure Monitor to monitor your resources, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).

## Analyze monitoring data using Azure Monitor

Azure Monitor supports several tools to help you analyze monitoring data:

### Out-of-the-box monitoring insights

Some Azure services have a built-in monitoring dashboard in the Azure portal. These dashboards are called *insights*, and you can find them in the **Insights** section of Azure Monitor in the Azure portal.

[Application Insights](/azure/azure-monitor/app/app-insights-overview) monitors the availability, performance, and usage of your web applications, so you can identify and diagnose errors without waiting for a user to report them. Application Insights includes connection points to various development tools and integrates with Visual Studio to support your DevOps processes. For more information, see [Application monitoring for App Service](/azure/azure-monitor/app/azure-web-apps).

### Analytics tools in Azure Monitor

- [Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started) allows you to view and analyze metrics for Azure resources.

- [Log Analytics](logs/log-analytics-overview.md) allows you to query and analyze log data using the [Kusto query language (KQL)](/azure/data-explorer/kusto/query). For more information, see [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).

- The [activity log](/azure/azure-monitor/essentials/activity-log) has a user interface in the Azure portal for viewing and basic searches. To do more in-depth analysis, route the data to Azure Monitor logs and run more complex queries in Log Analytics.

Tools that allow more complex visualization include:

- [Dashboards](/azure/azure-monitor/visualize/tutorial-logs-dashboards) that let you combine different kinds of data into a single pane in the Azure portal.
- [Workbooks](/azure/azure-monitor/visualize/workbooks-overview), customizable reports that you can create in the Azure portal. Workbooks can include text, metrics, and log queries.
- [Grafana](/azure/azure-monitor/visualize/grafana-plugin), an open platform tool that excels in operational dashboards. You can use Grafana to create dashboards that include data from multiple sources other than Azure Monitor.
- [Power BI](/azure/azure-monitor/logs/log-powerbi), a business analytics service that provides interactive visualizations across various data sources. You can configure Power BI to automatically import log data from Azure Monitor to take advantage of these visualizations.

## Use Kusto queries to analyze log data

You can analyze Azure Monitor Log data using the Kusto query language (KQL). For more information, see [Log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview).

For a list of common queries for any service, see the [Log Analytics queries interface](/azure/azure-monitor/logs/queries).

The following sample query can help you monitor app logs using `AppServiceAppLogs`:

```Kusto
AppServiceAppLogs 
| project CustomLevel, _ResourceId
| summarize count() by CustomLevel, _ResourceId
```

The following sample query can help you monitor HTTP logs using `AppServiceHTTPLogs` where the `HTTP response code` is `500` or higher:

```Kusto
AppServiceHTTPLogs 
//| where ResourceId = "MyResourceId" // Uncomment to get results for a specific resource Id when querying over a group of Apps
| where ScStatus >= 500
| reduce by strcat(CsMethod, ':\\', CsUriStem)
```

The following sample query can help you monitor HTTP 500 errors by joining `AppServiceConsoleLogs` and `AppserviceHTTPLogs`:

```Kusto
let myHttp = AppServiceHTTPLogs | where  ScStatus == 500 | project TimeGen=substring(TimeGenerated, 0, 19), CsUriStem, ScStatus;  

let myConsole = AppServiceConsoleLogs | project TimeGen=substring(TimeGenerated, 0, 19), ResultDescription;

myHttp | join myConsole on TimeGen | project TimeGen, CsUriStem, ScStatus, ResultDescription;   
```

See [Azure Monitor queries for App Service](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/App%20Services/Queries) for more sample queries.

## Use Azure Monitor alerts to notify you of issues 

Azure Monitor alerts proactively notify you when specific conditions are found in your monitoring data. Alerts allow you to identify and address issues in your system before your customers notice them. For more information, see [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview).

You can alert on any metric or log data source in the Azure Monitor data platform. There are different types of alerts depending on the services you're monitoring and the monitoring data you're collecting. See [Choose the right monitoring alert type](/azure/azure-monitor/alerts/alerts-types).

This table provides a brief description of each alert type.

|Alert type|Description|
|:---------|:---------|
|[Metric alerts](alerts/alerts-types.md#metric-alerts)|Metric alerts evaluate resource metrics at regular intervals. Metrics can be platform metrics, custom metrics, logs from Azure Monitor converted to metrics, or Application Insights metrics. Metric alerts can also apply multiple conditions and dynamic thresholds.|
|[Log search alerts](alerts/alerts-types.md#log-alerts)|Log search alerts allow users to use a Log Analytics query to evaluate resource logs at a predefined frequency.|
|[Activity log alerts](alerts/alerts-types.md#activity-log-alerts)|Activity log alerts are triggered when a new activity log event occurs that matches defined conditions. Resource Health alerts and Service Health alerts are activity log alerts that report on your service and resource health.|
|[Smart detection alerts](alerts/alerts-types.md#smart-detection-alerts)|Smart detection on an Application Insights resource automatically warns you of potential performance problems and failure anomalies in your web application. You can migrate smart detection on your Application Insights resource to create alert rules for the different smart detection modules.|
|[Prometheus alerts](alerts/alerts-types.md#prometheus-alerts)|Prometheus alerts are used for alerting on Prometheus metrics stored in [Azure Monitor managed service for Prometheus](essentials/prometheus-metrics-overview.md). The alert rules are based on the PromQL open-source query language.|

For examples of common alerts for Azure resources, see [Sample log search alert queries that include ADX and ARG](alerts/alerts-log-alert-query-samples.md).

### Implementing alerts at scale

For some services, you can monitor at scale by applying the same metric alert rule to multiple resources of the same type that exist in the same Azure region. [Azure Monitor Baseline Alerts (AMBA)](https://aka.ms/amba) provides a semi-automated method of implementing important platform metric alerts, dashboards, and guidelines at scale.

### App Service alert rules

The following table lists common and recommended alert rules for App Service.

| Alert type | Condition | Examples  |
|:---|:---|:---|
| Metric | Average connections| When number of connections exceed a set value|
| Metric | HTTP 404| When HTTP 404 responses exceed a set value|
| Metric | HTTP Server Errors| When HTTP 5xx errors exceed a set value|
| Activity Log | Create or Update Web App | When app is created or updated|
| Activity Log | Delete Web App | When app is deleted|
| Activity Log | Restart Web App| When app is restarted|
| Activity Log | Stop Web App| When app is stopped|

>[!NOTE]
>If you're creating or running an application that runs on your service, [Azure Monitor application insights](/azure/azure-monitor/overview#application-insights) might offer more types of alerts.

## Export Azure Monitor data to other tools

You can get data out of Azure Monitor into other tools by using the following methods:

- **Metrics:** Use the [REST API for metrics](/rest/api/monitor/operation-groups) to extract metric data from the Azure Monitor metrics database. For more information, see [Azure Monitor REST API reference](/rest/api/monitor/filter-syntax).

- **Logs:** Use the REST API or the [associated client libraries](/rest/api/loganalytics/query/get?tabs=HTTP).
- Another option is the [workspace data export](/azure/azure-monitor/logs/logs-data-export?tabs=portal).

To get started with the REST API for Azure Monitor, see [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough?tabs=portal).

## Other monitoring tools in App Service

- On the Azure portal page for your web app, you can select **Diagnose and solve problems** from the left navigation to access complete App Service diagnostics for your app. For more information about the App Service diagnostics tool, see [Azure App Service diagnostics overview](../app-service/overview-diagnostics.md).

- App Service provides built-in diagnostics logging to assist with debugging apps. For more information about the built-in logs, see [Stream diagnostics logs](../app-service/troubleshoot-diagnostic-logs.md#stream-logs).

- You can also use Azure Health check to monitor App Service instances. For more information, see [Monitor App Service instances using Health check](../app-service/monitor-instances-health-check.md).

## Get personalized monitoring recommendations using Advisor

For some services, if critical conditions or imminent changes occur during resource operations, an alert displays on the service **Overview** page in the portal. You can find more information and recommended fixes for the alert in **Advisor recommendations** under **Monitoring** in the left menu. During normal operations, no advisor recommendations display.

For more information on Azure Advisor, see [Azure Advisor overview](/azure/advisor/advisor-overview).

## Related content

- See [App Service monitoring data reference](/azure/app-service/monitor-app-service-reference) for a reference of the metrics, logs, and other important values created for App Service.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
