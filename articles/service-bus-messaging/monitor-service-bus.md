---
title: Monitor Azure Service Bus
description: Start here to learn how to monitor Azure Service Bus by using Azure Monitor metrics, logs, and tools.
ms.date: 07/22/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: spelluru
ms.author: spelluru 
ms.service: service-bus-messaging
---

# Monitor Azure Service Bus

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

The following sections build on these articles by describing the specific data gathered for Azure Service Bus. These sections also provide examples for configuring data collection and analyzing this data with Azure tools.

> [!TIP]
> To understand costs associated with Azure Monitor, see [Azure Monitor cost and usage](../azure-monitor/cost-usage.md). To understand the time it takes for your data to appear in Azure Monitor, see [Log data ingestion time](../azure-monitor/logs/data-ingestion-time.md).

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

For more information, see [Azure Monitor - Service Bus insights](service-bus-insights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Service Bus, see [Azure Service Bus monitoring data reference](monitor-service-bus-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

The diagnostic logging information is stored in containers named **insights-logs-operationlogs** and **insights-metrics-pt1m**.

Sample URL for an operation log: `https://<Azure Storage account>.blob.core.windows.net/insights-logs-operationallogs/resourceId=/SUBSCRIPTIONS/<Azure subscription ID>/RESOURCEGROUPS/<Resource group name>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<Namespace name>/y=<YEAR>/m=<MONTH-NUMBER>/d=<DAY-NUMBER>/h=<HOUR>/m=<MINUTE>/PT1H.json`. The URL for a metric log is similar.

The diagnostic logging information is stored in event hubs named **insights-logs-operationlogs** and **insights-metrics-pt1m**. You can also select your own event hub.

The diagnostic logging information is stored in tables named **AzureDiagnostics** and **AzureMetrics**.

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

For a list of available metrics for Service Bus, see [Azure Service Bus monitoring data reference](monitor-service-bus-reference.md#metrics).

You can analyze metrics for Azure Service Bus, along with metrics from other Azure services, by selecting **Metrics** from the **Monitoring** section on the home page for your Service Bus namespace. See [Analyze metrics with Azure Monitor metrics explorer](../azure-monitor/essentials/analyze-metrics.md) for details on using this tool. For a list of the platform metrics collected, see [Monitoring Azure Service Bus data reference metrics](monitor-service-bus-reference.md#metrics).

:::image type="content" source="./media/monitor-service-bus/metrics.png" alt-text="Screenshot shows Metrics Explorer with Service Bus namespace selected.":::

> [!TIP]
> Azure Monitor metrics data is available for 90 days. However, when creating charts only 30 days can be visualized. For example, if you want to visualize a 90 day period, you must break it into three charts of 30 days within the 90 day period.

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Service Bus, see [Azure Service Bus monitoring data reference](monitor-service-bus-reference.md#resource-logs).

### Sample operational log output (formatted)

```json
{
    "Environment": "PROD",
    "Region": "East US",
    "ScaleUnit": "PROD-BL2-002",
    "ActivityId": "a097a88a-33e5-4c9c-9c64-20f506ec1375",
    "EventName": "Retrieve Namespace",
    "resourceId": "/SUBSCRIPTIONS/<Azure subscription ID>/RESOURCEGROUPS/SPSBUS0213RG/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/SPSBUS0213NS",
    "SubscriptionId": "<Azure subscription ID>",
    "EventTimeString": "5/18/2021 3:25:55 AM +00:00",
    "EventProperties": "{\"SubscriptionId\":\"<Azure subscription ID>\",\"Namespace\":\"spsbus0213ns\",\"Via\":\"https://spsbus0213ns.servicebus.windows.net/$Resources/topics?api-version=2017-04&$skip=0&$top=100\",\"TrackingId\":\"a097a88a-33e5-4c9c-9c64-20f506ec1375_M8CH3_M8CH3_G8\"}",
    "Status": "Succeeded",
    "Caller": "rpfrontdoor",
    "category": "OperationalLogs"
}
```

### Sample metric log output (formatted)

```json
{
    "count": 1,
    "total": 4,
    "minimum": 4,
    "maximum": 4,
    "average": 4,
    "resourceId": "/SUBSCRIPTIONS/<Azure subscription ID>/RESOURCEGROUPS/SPSBUS0213RG/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/SPSBUS0213NS",
    "time": "2021-05-18T03:27:00.0000000Z",
    "metricName": "IncomingMessages",
    "timeGrain": "PT1M"
}
```

> [!IMPORTANT]
> Enabling these settings requires additional Azure services (storage account, event hub, or Log Analytics), which may increase your cost. To calculate an estimated cost, visit the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

> [!NOTE]
> When you enable metrics in a diagnostic setting, dimension information is not currently included as part of the information sent to a storage account, event hub, or log analytics.

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Following are sample queries that you can use to help you monitor your Azure Service Bus resources:

### [AzureDiagnostics](#tab/AzureDiagnostics)

- Get management operations in the last seven days.

  ```kusto
  AzureDiagnostics
  | where TimeGenerated > ago(7d)
  | where ResourceProvider =="MICROSOFT.SERVICEBUS"
  | where Category == "OperationalLogs"
  | summarize count() by EventName_s, _ResourceId
  ```

- Get runtime audit logs generated in the last one hour.

  ```kusto
  AzureDiagnostics
  | where TimeGenerated > ago(1h)
  | where ResourceProvider =="MICROSOFT.SERVICEBUS"
  | where Category == "RuntimeAuditLogs"    
  ```

- Get access attempts to a key vault that resulted in "key not found" error.

  ```kusto
  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.SERVICEBUS" 
  | where Category == "Error" and OperationName == "wrapkey"
  | project Message, _ResourceId
  ```

- Get errors from the past seven days.

  ```kusto
  AzureDiagnostics
  | where TimeGenerated > ago(7d)
  | where ResourceProvider =="MICROSOFT.SERVICEBUS"
  | where Category == "Error" 
  | summarize count() by EventName_s, _ResourceId
  ```

- Get operations performed with a key vault to disable or restore the key.

  ```kusto
  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.SERVICEBUS"
  | where (Category == "info" and (OperationName == "disable" or OperationName == "restore"))
  | project Message, _ResourceId
  ```

- Get all the entities that were autodeleted.

  ```kusto
  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.SERVICEBUS"
  | where Category == "OperationalLogs"
  | where EventName_s startswith "AutoDelete"
  | summarize count() by EventName_s, _ResourceId    
  ```

### [Resource Specific Table](#tab/Resourcespecifictable)

- Get deny connection events for namespace.

  ```kusto
  AZMSVNetConnectionEvents
  | extend NamespaceName = tostring(split(_ResourceId, "/")[8])
  | where Provider =~ "ServiceBus"
  | where Action == "Deny Connection"
  | project Action, SubscriptionId, NamespaceName, AddressIp, Reason, Count
  | summarize by Action, NamespaceName 
  ```

- Get failed operation logs  for namespace.

  ```kusto
  AZMSOperationalLogs
  | extend NamespaceName = tostring(split(_ResourceId, "/")[8])
  | where Provider =~ "ServiceBus"
  | where isnotnull(NamespaceName) and Status != "Succeeded"
  | project NamespaceName, ResourceId, EventName, Status, Caller, SubscriptionId
  | summarize by NamespaceName, EventName
  ```

- Get Send message events for namespace.

  ```kusto
  AZMSRunTimeAuditLogs
  | extend NamespaceInfo = tostring(split(_ResourceId, "/")[8])
  | where Provider =~ "ServiceBus"
  | where isnotnull(NamespaceInfo) and ActivityName = "SendMessage"
  | project NamespaceInfo, ActivityName, Protocol, NetworkType, ClientIp, ResourceId
  | summarize by NamespaceInfo, ActivityName
  ```

- Get Failed authorization results for Microsoft Entra ID.

  ```kusto
  AZMSRunTimeAuditLogs
  | extend NamespaceInfo = tostring(split(_ResourceId, "/")[8])
  | where Provider =~ "ServiceBus"
  | where isnotnull(NamespaceInfo) and isnotnull(AuthKey) and AuthType == "AAD" and Status != "Success" 
  | project NamespaceInfo, AuthKey, ActivityName, Protocol, NetworkType, ClientIp, ResourceId
  | summarize by NamespaceInfo, AuthKey, ActivityName
  ```

---

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Service Bus alert rules

You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Service Bus monitoring data reference](monitor-service-bus-reference.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Service Bus monitoring data reference](monitor-service-bus-reference.md) for a reference of the metrics, logs, and other important values created for Service Bus.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
