---
title: Monitor Azure Key Vault
description: Start here to learn how to monitor Azure Key Vault by using Azure Monitor.
ms.date: 07/09/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: conceptual
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-key-vault
ms.subservice: general
# Customer intent: As a key vault administrator, I want to learn the options available to monitor the health of my vaults.
---
# Monitor Azure Key Vault

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Key Vault Insights provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency. For full details, see [Monitoring your key vault service with Key Vault insights](../key-vault-insights-overview.md).

## Monitoring overview page in Azure portal

The **Overview** page in the Azure portal for each key vault includes the following metrics on the **Monitoring** tab:

- Total requests
- Average Latency
- Success ratio

You can select **additional metrics** or the **Metrics** tab in the left-hand sidebar, under **Monitoring**, to view the following metrics:

- Overall service API latency
- Overall vault availability
- Overall vault saturation
- Total service API hits
- Total service API results

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Key Vault, see [Azure Key Vault monitoring data reference](monitor-key-vault-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

### Collection and routing

Platform metrics and the Activity log are collected and stored automatically, but can be routed to other locations by using a diagnostic setting.  

Resource Logs aren't collected and stored until you create a diagnostic setting and route them to one or more locations.

See [Create diagnostic setting to collect platform logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md) for the detailed process for creating a diagnostic setting using the Azure portal, CLI, or PowerShell. When you create a diagnostic setting, you specify which categories of logs to collect. The categories for *Key Vault* are listed in [Key Vault monitoring data reference](monitor-key-vault-reference.md#resource-logs).

To create a diagnostic setting for your key vault, see [Enable Key Vault logging](howto-logging.md). The metrics and logs you can collect are discussed in the following sections.

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

You can analyze metrics for Key Vault with metrics from other Azure services using metrics explorer by opening **Metrics** from the **Azure Monitor** menu. See [Analyze metrics with Azure Monitor metrics explorer](../../azure-monitor/essentials/analyze-metrics.md) for details on using this tool.

For a list of available metrics for Key Vault, see [Azure Key Vault monitoring data reference](monitor-key-vault-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Key Vault, see [Azure Key Vault monitoring data reference](monitor-key-vault-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

## Analyzing logs

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties.  

All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](../../azure-monitor/essentials/resource-logs-schema.md) 

The [Activity log](../../azure-monitor/essentials/activity-log.md) is a type of platform log for Azure that provides insight into subscription-level events. You can view it independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.  

For a list of the types of resource logs collected for Key Vault, see [Monitoring Key Vault data reference](monitor-key-vault-reference.md#resource-logs)  

For a list of the tables used by Azure Monitor Logs and queryable by Log Analytics, see [Monitoring Key Vault data reference](monitor-key-vault-reference.md#azure-monitor-logs-tables)  

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

Here are some queries that you can enter into the **Log search** bar to help you monitor your Key Vault resources. These queries work with the [new language](../../azure-monitor/logs/log-query-overview.md).

- Are there any clients using old TLS version (<1.2)?

  ```kusto
  AzureDiagnostics
  | where TimeGenerated > ago(90d) 
  | where ResourceProvider =="MICROSOFT.KEYVAULT" 
  | where isnotempty(tlsVersion_s) and strcmp(tlsVersion_s,"TLS1_2") <0
  | project TimeGenerated,Resource, OperationName, requestUri_s, CallerIPAddress, OperationVersion,clientInfo_s,tlsVersion_s,todouble(tlsVersion_s)
  | sort by TimeGenerated desc
  ```

- Are there any slow requests?

  ```Kusto
  // List of KeyVault requests that took longer than 1sec. 
  // To create an alert for this query, click '+ New alert rule'
  let threshold=1000; // let operator defines a constant that can be further used in the query

  AzureDiagnostics
  | where ResourceProvider =="MICROSOFT.KEYVAULT" 
  | where DurationMs > threshold
  | summarize count() by OperationName, _ResourceId
  ```

- Are there any failures?

  ```Kusto
  // Count of failed KeyVault requests by status code. 
  // To create an alert for this query, click '+ New alert rule'

  AzureDiagnostics
  | where ResourceProvider =="MICROSOFT.KEYVAULT" 
  | where httpStatusCode_d >= 300 and not(OperationName == "Authentication" and httpStatusCode_d == 401)
  | summarize count() by requestUri_s, ResultSignature, _ResourceId
  // ResultSignature contains HTTP status, e.g. "OK" or "Forbidden"
  // httpStatusCode_d contains HTTP status code returned
  ```

- Are there any Input deserialization errors?

  ```Kusto
  // Shows errors caused due to malformed events that could not be deserialized by the job. 
  // To create an alert for this query, click '+ New alert rule'

  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.KEYVAULT" and parse_json(properties_s).DataErrorType in ("InputDeserializerError.InvalidData", "InputDeserializerError.TypeConversionError", "InputDeserializerError.MissingColumns", "InputDeserializerError.InvalidHeader", "InputDeserializerError.InvalidCompressionType")
  | project TimeGenerated, Resource, Region_s, OperationName, properties_s, Level, _ResourceId
  ```

- How active has this KeyVault been?

  ```Kusto
  // Line chart showing trend of KeyVault requests volume, per operation over time. 
  // KeyVault diagnostic currently stores logs in AzureDiagnostics table which stores logs for multiple services. 
  // Filter on ResourceProvider for logs specific to a service.

  AzureDiagnostics
  | where ResourceProvider =="MICROSOFT.KEYVAULT" 
  | summarize count() by bin(TimeGenerated, 1h), OperationName // Aggregate by hour
  | render timechart

  ```

- Who is calling this KeyVault?

  ```Kusto
  // List of callers identified by their IP address with their request count.  
  // KeyVault diagnostic currently stores logs in AzureDiagnostics table which stores logs for multiple services. 
  // Filter on ResourceProvider for logs specific to a service.

  AzureDiagnostics
  | where ResourceProvider =="MICROSOFT.KEYVAULT"
  | summarize count() by CallerIPAddress
  ```

- How fast is this KeyVault serving requests?

  ```Kusto
  // Line chart showing trend of request duration over time using different aggregations. 
 
  AzureDiagnostics
  | where ResourceProvider =="MICROSOFT.KEYVAULT" 
  | summarize avg(DurationMs) by requestUri_s, bin(TimeGenerated, 1h) // requestUri_s contains the URI of the request
  | render timechart
  ```

- What changes occurred last month?

  ```Kusto
  // Lists all update and patch requests from the last 30 days. 
  // KeyVault diagnostic currently stores logs in AzureDiagnostics table which stores logs for multiple services. 
  // Filter on ResourceProvider for logs specific to a service.

  AzureDiagnostics
  | where TimeGenerated > ago(30d) // Time range specified in the query. Overrides time picker in portal.
  | where ResourceProvider =="MICROSOFT.KEYVAULT" 
  | where OperationName == "VaultPut" or OperationName == "VaultPatch"
  | sort by TimeGenerated desc
  ```

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Key Vault alert rules

The following list contains some suggested alert rules for Key Vault. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Key Vault monitoring data reference](monitor-key-vault-reference.md).

- Key Vault Availability drops below 100% (Static Threshold)
- Key Vault Latency is greater than 1000 ms (Static Threshold)
- Overall Vault Saturation is greater than 75% (Static Threshold)
- Overall Vault Saturation exceeds average (Dynamic Threshold)
- Total Error Codes higher than average (Dynamic Threshold)

For more information, see [Alerting for Azure Key Vault](alert.md).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Key Vault monitoring data reference](monitor-key-vault-reference.md) for a reference of the metrics, logs, and other important values created for Key Vault.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
