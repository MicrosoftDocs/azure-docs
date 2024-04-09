---
title: Monitor Azure Data Factory
description: Start here to learn how to monitor Azure Data Factory.
ms.date: 03/19/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: jonburchel
ms.author: jburchel
ms.service: data-factory
---

# Monitor Azure Data Factory

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Monitoring methods

There are several ways to monitor Azure Data Factory.

### Azure Data Factory Studio

You can monitor all of your Data Factory pipeline runs natively in Azure Data Factory Studio. To open the monitoring experience, select **Launch Studio** from your Data Factory page in the Azure portal, and in Azure Data Factory Studio, select **Monitor** from the left menu. 

For more information about monitoring in Azure Data Factory Studio, see the following articles:

- [Visually monitor Azure Data Factory](monitor-visually.md)
- [Data flow monitoring](concepts-data-flow-monitoring.md)
- [Monitor copy activity](copy-activity-monitoring.md)
- [Session log in a Copy activity](copy-activity-log.md)

### Azure portal

You can also monitor Azure Data Factory directly from the Azure portal. Several metrics graphs appear on the Azure portal **Overview** page for your Data Factory. On the left sidebar menu, you can access the Azure **Activity log**, or select **Alerts**, **Metrics**, **Diagnostic settings**, or **Logs** from the **Monitoring** section.

### Monitor programmatically

You can monitor Data Factory pipelines programmatically by using .NET, PowerShell, Python, or the REST API. For more information, see the following articles:

- [Programmatically monitor Azure Data Factory](monitor-programmatically.md)
- [Set up diagnostics logs via the Azure Monitor REST API](monitor-logs-rest.md)

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Data Factory, see [Data Factory monitoring data reference](monitor-data-factory-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

### Store Data Factory pipeline run data

Data Factory stores pipeline run data for only 45 days. Use Azure Monitor to route diagnostic logs if you want to keep the data longer.

Route data to Log Analytics if you want to analyze it with complex queries, create custom alerts, or monitor across data factories. You can route data from multiple data factories to a single Log Analytics workspace.

You can use a storage account or event hub namespace that isn't in the subscription of the resource that emits logs. The user who configures the setting must have appropriate Azure role-based access control (Azure RBAC) access to both subscriptions.

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]
For a list of available metrics for Data Factory, see [Data Factory monitoring data reference](monitor-data-factory-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

- For the available Data Factory resource log categories, their associated Log Analytics tables, and the logs schemas, see [Data Factory monitoring data reference](monitor-data-factory-reference.md#resource-logs).

- To configure diagnostic settings and a Log Analytics workspace to monitor Data Factory, see [Configure diagnostic settings and a workspace](monitor-configure-diagnostics.md).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

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

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

For detailed instructions on configuring diagnostic logs by using the REST API, see [Set up diagnostic logs via the Azure Monitor REST API](monitor-logs-rest.md).

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

For example queries, select **Logs** under **Monitoring** in the left navigation of your Data Factory page in the Azure portal, and then select the **Queries** tab. Here are some example queries:

PipelineRuns availability: Gives the availability of the pipeline runs.

```kusto
ADFPipelineRun
| where Status != 'InProgress' and Status != 'Queued'
| where FailureType != 'UserError'
| summarize availability = 100.00 - (100.00*countif(Status != 'Succeeded') / count())  by bin(TimeGenerated, 1h)), _ResourceId
| order by TimeGenerated asc
| render timechart
```

Activity runs Top 5 failures: Returns top five activities failing with system errors.

```kusto
ADFActivityRun 
| where TimeGenerated >= ago(24h)
| where Status != 'InProgress' and Status != 'Queued'
| where FailureType != 'UserError'
| where ActivityName  in (name)
| summarize failureCount = countif(Status != 'Succeeded') by bin(TimeGenerated, 1h), ActivityName
| top 5 by failureCount desc nulls last
| order by TimeGenerated asc
| render timechart
```

Pipeline runs latest status: Returns latest status of pipeline runs.

```kusto
ADFPipelineRun
| summarize argmax(TimeGenerated, * ) by RunId, Status, _ResourceId
```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

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

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Data Factory monitoring data reference](monitor-data-factory-reference.md) for a reference of the metrics, logs, and other important values created for Data Factory.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
