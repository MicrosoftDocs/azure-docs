---
title: Monitor Azure Stream Analytics
description: Start here to learn how to monitor Azure Stream Analytics.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: spelluru
ms.author: spelluru
ms.service: stream-analytics
---

# Monitor Azure Stream Analytics

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

For instructions on how to monitor and manage Azure Stream Analytics resources with Azure PowerShell cmdlets and PowerShell scripting, see [Monitor and manage Stream Analytics jobs with Azure PowerShell cmdlets](stream-analytics-monitor-and-manage-jobs-use-powershell.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Stream Analytics, see [Azure Stream Analytics monitoring data reference](monitor-azure-stream-analytics-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

### Azure Stream Analytics metrics

For a description of how to monitor metrics in the Azure portal, see [Monitor Stream Analytics job with Azure portal](stream-analytics-monitoring.md).

>[!NOTE]
>Azure Stream Analytics jobs that are created via REST APIs, Azure SDK, or PowerShell don't have monitoring enabled by default. To enable monitoring, follow the steps in [Programmatically create a Stream Analytics job monitor](stream-analytics-monitor-jobs.md). The monitoring data then appears in the **Metrics** area of the Azure portal page for your Stream Analytics job.

The following table lists conditions and corrective actions for some commonly monitored Azure Stream Analytics metrics.

[!INCLUDE [metrics-scenarios](./includes/metrics-scenarios.md)]

For a list and descriptions of all available metrics for Azure Stream Analytics, see [Azure Stream Analytics monitoring data reference](monitor-azure-stream-analytics-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

### Azure Stream Analytics logs

[!INCLUDE [resource-logs](./includes/resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure Stream Analytics, see [Azure Stream Analytics monitoring data reference](monitor-azure-stream-analytics-reference.md#resource-logs).

For a detailed walkthrough of how to troubleshoot Azure Stream Analytics job failures by using resource logs, see [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

For a detailed walkthrough of how to troubleshoot Azure Stream Analytics job failures by using the activity log, see [Debugging using activity logs](stream-analytics-job-diagnostic-logs.md#debugging-using-activity-logs).

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Sample queries

Following are sample queries that you can use to help monitor your Azure Stream Analytics resources:

- List all input data errors. The following query shows all errors that occurred while processing the data from inputs. 

    ```kusto
    AzureDiagnostics 
    | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" and parse_json(properties_s).Type == "DataError" 
    | project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId        
    ```
- Events that arrived late. The following query shows errors due to events where difference between application time and arrival time is greater than the late arrival policy. 

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" and  parse_json(properties_s).DataErrorType == "LateInputEvent"
    | project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId
    ```
- Events that arrived early. The following query shows errors due to events where difference between Application time and Arrival time is greater than 5 minutes. 
    
    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" and parse_json(properties_s).DataErrorType == "EarlyInputEvent"
    | project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId    
    ```
- Events that arrived out of order. The following query shows errors due to events that arrive out of order according to the out-of-order policy. 
    
    ```kusto
    // To create an alert for this query, click '+ New alert rule'
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" and parse_json(properties_s).DataErrorType == "OutOfOrderEvent"
    | project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId    
    ```
- All output data errors. The following query shows all errors that occurred while writing the results of the query to the outputs in your job. 

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" and parse_json(properties_s).DataErrorType in ("OutputDataConversionError.RequiredColumnMissing", "OutputDataConversionError.ColumnNameInvalid", "OutputDataConversionError.TypeConversionError", "OutputDataConversionError.RecordExceededSizeLimit", "OutputDataConversionError.DuplicateKey")
    | project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId
    ```
- The following query shows the summary of failed operations in the last seven days. 

    ```kusto
    AzureDiagnostics
    | where TimeGenerated > ago(7d) //last 7 days
    | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" and status_s == "Failed" 
    | summarize Count=count(), sampleEvent=any(properties_s) by JobName=Resource        
    ```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure Stream Analytics alert rules

The following table lists some suggested alert rules for Azure Stream Analytics. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Stream Analytics monitoring data reference](monitor-azure-stream-analytics-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Platform metrics | Streaming unit (SU) Memory Utilization | Whenever average SU (Memory) % Utilization is greater than 80% |
| Activity log | Failed operations | Whenever the activity log has an event with Category='Administrative', Signal name='All Administrative operations', Status='Failed' |

For detailed instructions on how to set up an alert for Azure Stream Analytics, see [Set up alerts for Azure Stream Analytics jobs](stream-analytics-set-up-alerts.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for general details on monitoring Azure resources.
- See [Azure Stream Analytics monitoring data reference](monitor-azure-stream-analytics-reference.md) for a reference of the metrics, logs, and other important values created for Azure Stream Analytics.
- See the following Azure Stream Analytics monitoring and troubleshooting articles:
  - [Monitor jobs using Azure portal](stream-analytics-monitoring.md)
  - [Monitor jobs using Azure PowerShell](stream-analytics-monitor-and-manage-jobs-use-powershell.md)
  - [Monitor jobs using Azure .NET SDK](stream-analytics-monitor-jobs.md)
  - [Set up alerts](stream-analytics-set-up-alerts.md)
  - [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
  - [Use activity and resource logs](stream-analytics-job-diagnostic-logs.md)
