---
title: Monitor Azure Data Factory
description: Start here to learn how to monitor Azure Data Factory.
ms.date: 02/26/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: jonburchel
ms.author: jburchel
ms.service: data-factory
---

<!-- 
IMPORTANT 
To make this template easier to use, first:
1. Search and replace Data Factory with the official name of your service.
2. Search and replace data-factory with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_07
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Most services can use the following sections unchanged. The sections use #included text you don't have to maintain, which changes when Azure Monitor functionality changes. Add info into the designated service-specific places if necessary. Remove #includes or template content that aren't relevant to your service.

At a minimum your service should have the following two articles:

1. The primary monitoring article (based on this template)
   - Title: "Monitor Data Factory"
   - TOC title: "Monitor"
   - Filename: "monitor-data-factory.md"

2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "Data Factory monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-data-factory-reference.md".
-->

# Monitor Azure Data Factory

<!-- Intro. Required. -->
[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Monitoring methods

There are several ways to monitor Azure Data Factory.

### Azure Data Factory Studio

You can monitor all of your Data Factory pipeline runs natively in Azure Data Factory Studio. To open the monitoring experience, select **Launch Studio** from your Azure portal Data Factory page. In Azure Data Factory Studio, select **Monitor** from the left menu. 

For more information about monitoring in Azure Data Factory Studio, see the following articles:

- [Visually monitor Azure Data Factory](monitor-visually.md)
- [Data flow monitoring](concepts-data-flow-monitoring.md)
- [Monitor copy activity](copy-activity-monitoring.md)
- [Session log in a Copy activity](copy-activity-log.md)

### Azure portal

Several metrics graphs appear on the **Overview** page for your Data Factory in the Azure portal. To access Azure Monitor monitoring capabilities, select **Alerts**, **Metrics**, **Diagnostic settings**, or **Logs** from the **Monitoring** section of the left menu on the Data Factory page. This article describes the Azure Monitor monitoring capabilities for Data Factory.

### Monitor programmatically

You can monitor Data Factory pipelines programmatically by using .NET, PowerShell, Python, or the REST API. For more information, see the following articles:

- [Programmatically monitor Azure Data Factory](monitor-programmatically.md)
- [Set up diagnostics logs via the Azure Monitor REST API](monitor-logs-rest.md)

## Monitor integration runtimes

Integration runtime is the compute infrastructure Data Factory uses to provide data integration capabilities across different network environments. Data Factory offers several types of integration runtimes:

- Azure integration runtime
- Self-hosted integration runtime
- Azure-SQL Server Integration Services (SSIS) integration runtime
- Managed Airflow integration runtime

Azure Monitor collects metrics and diagnostics logs for all types of integration runtimes. For detailed instructions on monitoring integration runtimes, see the following articles:

- [Monitor an integration runtime in Azure Data Factory](monitor-integration-runtime.md)
- [Monitor an integration runtime within a managed virtual network](monitor-managed-virtual-network-integration-runtime.md)
- [Monitor self-hosted integration runtime in Azure](monitor-shir-in-azure.md)
- [Configure self-hosted integration runtime for log analytics collection](how-to-configure-shir-for-log-analytics-collection.md)
- [Monitor SSIS operations with Azure Monitor](monitor-ssis.md)
- [Diagnostics logs and metrics for Managed Airflow](how-to-diagnostic-logs-and-metrics-for-managed-airflow.md)

<!-- ## Insights. Optional section. If your service has insights, add the following include and information. 
[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]
Insights service-specific information. Add brief information about what your Azure Monitor insights provide here. You can refer to another article that gives details or add a screenshot. -->

<!-- ## Resource types. Required section. -->
[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Data Factory, see [Data Factory monitoring data reference](monitor-data-factory-reference.md).

<!-- ## Data storage. Required section. Optionally, add service-specific information about storing your monitoring data after the include. -->
[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]
<!-- Add service-specific information about storing monitoring data here, if applicable. For example, SQL Server stores other monitoring data in its own databases. -->
### Store Data Factory metrics and pipeline run data

Data Factory stores pipeline run data for only 45 days. Use Azure Monitor to route diagnostic logs if you want to keep the data for a longer time.

- **Storage Account**: Save your diagnostic logs to a storage account for auditing or manual inspection. You can use diagnostic settings to specify the retention time in days.
- **Event Hub**: Stream the logs to Azure Event Hubs to become input to a partner service or custom analytics solution like Power BI.
- **Log Analytics**: Analyze the logs with Log Analytics if you want to write complex queries, create custom alerts, or monitor across data factories. You can route data from multiple data factories to a single Monitor workspace.
- **Partner solutions:** Diagnostic logs can be sent to partner solutions through integration.

You can also use a storage account or event hub namespace that isn't in the subscription of the resource that emits logs. The user who configures the setting must have appropriate Azure role-based access control (Azure RBAC) access to both subscriptions.

<!-- METRICS SECTION START ------------------------------------->

<!-- ## Platform metrics. Required section.
  - If your service doesn't collect platform metrics, use the following include: [!INCLUDE [horz-monitor-no-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-platform-metrics.md)]
  - If your service collects platform metrics, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Data Factory, see [Data Factory monitoring data reference](monitor-data-factory-reference.md#metrics).
<!-- Platform metrics service-specific information. Add service-specific information about your platform metrics here.-->

<!-- ## Prometheus/container metrics. Optional. If your service uses containers/Prometheus metrics, add the following include and information. 
[!INCLUDE [horz-monitor-container-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-container-metrics.md)]
Add service-specific information about your container/Prometheus metrics here.-->

<!-- ## System metrics. Optional. If your service uses system-imported metrics, add the following include and information. 
[!INCLUDE [horz-monitor-system-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-system-metrics.md)]
Add service-specific information about your system-imported metrics here.-->

<!-- ## Custom metrics. Optional. If your service uses custom imported metrics, add the following include and information.
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-custom-metrics.md)]
Custom imported service-specific information. Add service-specific information about your custom imported metrics here.-->

<!-- ## Non-Azure Monitor metrics. Optional. If your service uses any non-Azure Monitor based metrics, add the following include and information.
[!INCLUDE [horz-monitor-custom-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-non-monitor-metrics.md)]
Non-Monitor metrics service-specific information. Add service-specific information about your non-Azure Monitor metrics here.-->

<!-- METRICS SECTION END ------------------------------------->

<!-- LOGS SECTION START -------------------------------------->

<!-- ## Resource logs. Required section.
  - If your service doesn't collect resource logs, use the following include [!INCLUDE [horz-monitor-no-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-no-resource-logs.md)]
  - If your service collects resource logs, add the following include, statement, and service-specific information as appropriate. -->
[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]
For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Data Factory, see [Data Factory monitoring data reference](monitor-data-factory-reference.md#resource-logs).
<!-- Resource logs service-specific information. Add service-specific information about your resource logs here.
NOTE: Azure Monitor already has general information on how to configure and route resource logs. See https://learn.microsoft.com/azure/azure-monitor/platform/diagnostic-settings. Ideally, don't repeat that information here. You can provide a single screenshot of the diagnostic settings portal experience if you want. -->

<!-- ## Activity log. Required section. Optionally, add service-specific information about your activity log after the include. -->
[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]
<!-- Activity log service-specific information. Add service-specific information about your activity log here. -->

<!-- ## Imported logs. Optional section. If your service uses imported logs, add the following include and information. 
[!INCLUDE [horz-monitor-imported-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-imported-logs.md)]
Add service-specific information about your imported logs here. -->

<!-- ## Other logs. Optional section.
If your service has other logs that aren't resource logs or in the activity log, add information that states what they are and what they cover here. You can describe how to route them in a later section. -->

<!-- LOGS SECTION END ------------------------------------->

<!-- ANALYSIS SECTION START -------------------------------------->

<!-- ## Analyze data. Required section. -->
[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

<!-- ### External tools. Required section. -->
[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

For detailed instructions on configuring diagnostic logs by using the REST API, see [Set up diagnostic logs via the Azure Monitor REST API](monitor-logs-rest.md).

<!-- ### Sample Kusto queries. Required section. If you have sample Kusto queries for your service, add them after the include. -->
[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]
<!-- Add sample Kusto queries for your service here. -->

For example queries, select **Logs** under **Monitoring** in the left navigation of your Data Factory page in the Azure portal, and then select the **Queries** tab. Here are some example queries:

```kusto
// PipelineRuns Availability 
// Gives the availability of the Pipeline Runs. 
ADFPipelineRun
| where Status != 'InProgress' and Status != 'Queued'
| where FailureType != 'UserError'
| summarize availability = 100.00 - (100.00*countif(Status != 'Succeeded') / count())  by bin(TimeGenerated, 1h)), _ResourceId
| order by TimeGenerated asc
| render timechart
```

```kusto
// Activity runs Top 5 Failures 
// Returns Top 5 Activities failing with systemErrors. 
let name = ADFActivityRun
| where Status != 'InProgress' and Status != 'Queued'
| where FailureType != 'UserError'
| summarize failureCount = countif(Status != 'Succeeded') by ActivityName
| top 5 by failureCount desc nulls last
| where failureCount != 0
| project ActivityName;
ADFActivityRun 
| where TimeGenerated >= ago(24h)
| where Status != 'InProgress' and Status != 'Queued'
| where FailureType != 'UserError'
| where ActivityName  in (name)
| summarize failureCount = countif(Status != 'Succeeded') by bin(TimeGenerated, 1h), ActivityName
| order by TimeGenerated asc
| render timechart
```

```kusto
// Pipeline runs latest Status 
// Returns latest Status of pipeline runs. 
ADFPipelineRun
| summarize argmax(TimeGenerated, * ) by RunId, Status, _ResourceId
```

<!-- ### Data Factory service-specific analytics. Optional section.
Add short information or links to specific articles that outline how to analyze data for your service. -->

<!-- ANALYSIS SECTION END ------------------------------------->

<!-- ALERTS SECTION START -------------------------------------->

<!-- ## Alerts. Required section. -->
[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

<!-- ONLY if your service (Azure VMs, AKS, or Log Analytics workspaces) offer out-of-the-box recommended alerts, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-recommended-alert-rules.md)]

<!-- ONLY if applications run on your service that work with Application Insights, add the following include. 
[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

<!-- ### Data Factory alert rules. Required section.
**MUST HAVE** service-specific alert rules. Include useful alerts on metrics, logs, log conditions, or activity log.
Fill in the following table with metric and log alerts that would be valuable for your service. Change the format as necessary for readability. You can instead link to an article that discusses your common alerts in detail.
Ask your PMs if you don't know. This information is the BIGGEST request we get in Azure Monitor, so don't avoid it long term. People don't know what to monitor for best results. Be prescriptive. -->

### Data Factory alert rules

To create and manage alerts, select **Alerts** under **Monitoring** in the left navigation of your Data Factory page in the Azure portal.

The following table lists popular alert rules for Data Factory. This is just a recommended list. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Data Factory monitoring data reference](monitor-data-factory-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
|Metric | Failed pipeline runs metrics | Whenever the total Failed pipeline runs metrics is greater than 0
|Metric | Total entities count | Whenever the maximum Total entities count is greater than 1700000
|Metric | Maximum allowed entities count | Whenever the maximum Total factory size (GB unit) is greater than 6

Notifications provide proactive alerting during or after execution of a pipeline.

- [Send an email with an Azure Data Factory pipeline](how-to-send-email.md) shows how to configure email notifications from pipeline alerts.
- [Send notifications to a Microsoft Teams channel from an Azure Data Factory pipeline](how-to-send-notifications-to-teams.md) shows how to configure notifications from pipeline alerts into Microsoft Teams. 

<!-- ### Advisor recommendations. Required section. -->
[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]
<!-- Add any service-specific advisor recommendations or screenshots here. -->

<!-- ALERTS SECTION END -------------------------------------->

## Related content
<!-- You can change the wording and add more links if useful. -->

- See [Data Factory monitoring data reference](monitor-data-factory-reference.md) for a reference of the metrics, logs, and other important values created for Data Factory.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
