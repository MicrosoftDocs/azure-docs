---
title: Monitor Azure Logic Apps
description: Start here to learn how to monitor Azure Logic Apps.
ms.date: 03/11/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.service: logic-apps
---

# Monitor Azure Logic Apps

[!INCLUDE [horz-monitor-intro](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

For a detailed guide describing how to monitor Azure Logic Apps workflow run status, review trigger and workflow run history, and set up alerts, see [Monitor workflows](monitor-workflows.md).

[!INCLUDE [horz-monitor-insights](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

### Application Insights

You can set up Application Insights for a workspace or for a logic app after creation.

[Enable and view enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](enable-enhanced-telemetry-standard-workflows.md) shows how to turn on enhanced telemetry collection for a Standard logic app in Application Insights and view the collected data after the workflow finishes a run.

If your logic app's creation and deployment settings support using Application Insights, you can optionally enable diagnostics logging and tracing for your logic app's workflow. For more information, see [Enable or open Application Insights after deployment](create-single-tenant-workflows-azure-portal.md#enable-open-application-insights).

[!INCLUDE [horz-monitor-resource-types](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure Logic Apps, see [Logic Apps monitoring data reference](monitor-logic-apps-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

- For a detailed guide showing how to check health and performance metrics for both Consumption and Standard logic app workflows, see [View metrics for workflow health and performance](view-workflow-metrics.md).
- For a list of available metrics for Logic Apps, see [Logic Apps monitoring data reference](monitor-logic-apps-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

- For a detailed walkthrough showing how to set up Azure Monitor Logs and a Log Analytics workspace for Logic Apps workflows, see [Monitor and collect diagnostic data for workflows in Azure Logic Apps](monitor-workflows-collect-diagnostic-data.md).

- To learn how to set up diagnostic logging and monitor logic apps in Microsoft Defender for Cloud, see [Set up logging to monitor logic apps in Microsoft Defender for Cloud](healthy-unhealthy-resource.md).

- For the available resource log categories, their associated Log Analytics tables, and the logs schemas for Logic Apps, see [Logic Apps monitoring data reference](monitor-logic-apps-reference.md#resource-logs).

## Integration account B2B workflow

Logic Apps includes built-in tracking that you can enable for parts of your workflow. To help you monitor the successful delivery or receipt, errors, and properties for business-to-business (B2B) messages, you can create and use AS2, X12, and custom tracking schemas in your integration account.

- To monitor an automated business-to-business (B2B) messaging workflow in a Logic Apps integration account, see [Set up Azure Monitor logs and collect diagnostics data for B2B messages](monitor-b2b-messages-log-analytics.md).
- For a reference guide to the syntax and attributes for the tracking schemas, see [Tracking schemas for monitoring B2B messages](tracking-schemas-as2-x12-custom.md)

[!INCLUDE [horz-monitor-activity-log](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

For a detailed guide showing how to view and create queries for Logic Apps, see [View and create queries for monitoring and tracking](create-monitoring-tracking-queries.md).

### Sample Kusto queries

Here are some sample queries for analyzing Logic Apps workflow executions.

#### Total executions
Total billable executions by operation name.

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.LOGIC"
| where Category == "WorkflowRuntime" 
| where OperationName has "workflowTriggerStarted" or OperationName has "workflowActionStarted" 
| summarize dcount(resource_runId_s) by OperationName, resource_workflowName_s
```

#### Execution distribution
Hourly timechart for Logic App execution distribution by workflows.

```kusto
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.LOGIC"
| where Category == "WorkflowRuntime"
| where OperationName has "workflowRunStarted"
| summarize dcount(resource_runId_s) by bin(TimeGenerated, 1h), resource_workflowName_s
| render timechart 
```

#### Execution status summary
Completed executions by workflow, status, and error.

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.LOGIC"
| where OperationName has "workflowRunCompleted"
| summarize dcount(resource_runId_s) by resource_workflowName_s, status_s, error_code_s
| project LogicAppName = resource_workflowName_s , NumberOfExecutions = dcount_resource_runId_s , RunStatus = status_s , Error = error_code_s 
```

#### Triggered failures count
Action/trigger failures for all Logic App executions by resource name.

```kusto
AzureDiagnostics
| where ResourceProvider  == "MICROSOFT.LOGIC"  
| where Category == "WorkflowRuntime" 
| where status_s == "Failed" 
| where OperationName has "workflowActionCompleted" or OperationName has "workflowTriggerCompleted" 
| extend ResourceName = coalesce(resource_actionName_s, resource_triggerName_s) 
| extend ResourceCategory = substring(OperationName, 34, strlen(OperationName) - 43) | summarize dcount(resource_runId_s) by code_s, ResourceName, resource_workflowName_s, ResourceCategory, _ResourceId
| project ResourceCategory, ResourceName , FailureCount = dcount_resource_runId_s , ErrorCode = code_s, LogicAppName = resource_workflowName_s, _ResourceId 
| order by FailureCount desc 
```

[!INCLUDE [horz-monitor-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

> [!NOTE]
> Available alert signals differ between Consumption and Standard logic apps. For example, Consumption logic apps have many trigger-related signals, such as **Triggers Completed** and **Triggers Failed**, while Standard workflows have the **Workflow Triggers Completed Count** and **Workflow Triggers Failure Rate** signals.

### Logic Apps alert rules

The following table lists some alert rules for Logic Apps. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry that's listed in the [Logic Apps monitoring data reference](monitor-logic-apps-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Metric | Triggers Failed | Whenever the count Triggers Failed is greater than or equal to 1 |
| Activity Log | Workflow Deleted | Whenever the Activity Log has an event with Category='Administrative', Signal name='Delete Workflow (Workflow)' |

[!INCLUDE [horz-monitor-advisor-recommendations](~/articles/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Logic Apps monitoring data reference](monitor-logic-apps-reference.md) for a reference of the metrics, logs, and other important values created for Logic Apps.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
