---
title: Monitoring Azure Functions with Azure Monitor Logs
description: Learn how to use Azure Monitor Logs with Azure Functions to monitor function executions.
author: craigshoemaker
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: cshoe
ms.custom: tracking-python
# Customer intent: As a developer, I want to monitor my functions so I can know if they're running correctly.
---

# Monitoring Azure Functions with Azure Monitor Logs

Azure Functions offers an integration with [Azure Monitor Logs](../azure-monitor/platform/data-platform-logs.md) to monitor functions. This article shows you how to configure Azure Functions to send system-generated and user-generated logs to Azure Monitor Logs.

Azure Monitor Logs gives you the ability to consolidate logs from different resources in the same workspace, where it can be analyzed with [queries](../azure-monitor/log-query/log-query-overview.md) to quickly retrieve, consolidate, and analyze collected data.  You can create and test queries using [Log Analytics](../azure-monitor/log-query/portals.md) in the Azure portal and then either directly analyze the data using these tools or save queries for use with [visualizations](../azure-monitor/visualizations.md) or [alert rules](../azure-monitor/platform/alerts-overview.md).

Azure Monitor uses a version of the [Kusto query language](/azure/kusto/query/) used by Azure Data Explorer that is suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. You can quickly learn the query language using [multiple lessons](../azure-monitor/log-query/get-started-queries.md).

> [!NOTE]
> Integration with Azure Monitor Logs is currently in public preview for function apps running on Windows Consumption, Premium, and Dedicated hosting plans.

## Setting up

1. From the **Monitoring** section of your function app in the [Azure portal](https://portal.azure.com), select **Diagnostic settings**, and then select **Add diagnostic setting**.

   :::image type="content" source="media/functions-monitor-log-analytics/diagnostic-settings-add.png" alt-text="Select diagnostic settings":::

1. In the **Diagnostics settings** page, under **Category details** and **log**, choose **FunctionAppLogs**.

   The **FunctionAppLogs** table contains the desired logs.

1. Under **Destination details**, choose **Send to Log Analytics**.and then select your **Log Analytics workspace**. 

1. Enter a **Diagnostic settings name**, and then select **Save**.

   :::image type="content" source="media/functions-monitor-log-analytics/choose-table.png" alt-text="Add a diagnostic setting":::

## User-generated logs

To generate custom logs, use the logging statement specific to your language. Here are sample code snippets:


# [C#](#tab/csharp)

```csharp
log.LogInformation("My app logs here.");
```

# [Java](#tab/java)

```java
context.getLogger().info("My app logs here.");
```

# [JavaScript](#tab/javascript)

```javascript
context.log('My app logs here.');
```

# [PowerShell](#tab/powershell)

```powershell
Write-Host "My app logs here."
```

# [Python](#tab/python)

```python
logging.info('My app logs here.')
```

---

## Querying the logs

To query the generated logs:
 
1. From your function app, select **Diagnostic settings**. 

1. From the **Diagnostic settings** list, select the Log Analytics workspace that you configured to send the function logs to. 

1. From the **Log Analytics workspace** page, select **Logs**.

   Azure Functions writes all logs to the **FunctionAppLogs** table under **LogManagement**. 

   :::image type="content" source="media/functions-monitor-log-analytics/querying.png" alt-text="Query window in Log Analytics workspace":::

Here are some sample queries:

### All logs

```

FunctionAppLogs
| order by TimeGenerated desc

```

### Specific function logs

```

FunctionAppLogs
| where FunctionName == "<Function name>" 

```

### Exceptions

```

FunctionAppLogs
| where ExceptionDetails != ""  
| order by TimeGenerated asc

```

## Next steps

- Review the [Azure Functions overview](functions-overview.md).
- Learn more about [Azure Monitor Logs](../azure-monitor/platform/data-platform-logs.md).
- Learn more about the [query language](../azure-monitor/log-query/get-started-queries.md).
