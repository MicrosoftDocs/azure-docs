---
title: Analyze logs and metrics in Azure Spring Cloud | Microsoft Docs
description: Learn how to analyze diagnostics data in Azure Spring Cloud
services: spring-cloud
author: jpconnock
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/06/2019
ms.author: jeconnoc

---
# Analyze logs and metrics with diagnostics settings

By using the diagnostics functionality of Azure Spring Cloud, you can analyze logs and metrics with any of the following services:

* Use Azure Log Analytics, where the data is written immediately without having to be written to storage first.
* Save them to a storage account  for auditing or manual inspection. You can specify the retention time (in days).
* Stream them to your event hub for ingestion by a third-party service or custom analytics solution.

To get started, enable one of these services to receive the data. To learn about configuring Log Analytics, review [Get started with Log Analytics in Azure Monitor](../azure-monitor/log-query/get-started-portal.md). 

## Configure diagnostics settings

1. In the Azure portal, go to your Azure Spring Cloud instance.
1. Select the **Diagnostics settings** option, and then select **Add Diagnostics setting**.
1. Enter a name for the setting, and then choose where you want to send the logs. You can select any combination of the following three options:
    * **Archive to a storage account**
    * **Stream to an event hub**
    * **Send to Log Analytics**

1. Choose which log category and metric category you want to monitor, and then specify the retention time (in days). The retention time applies only to the storage account.
1. Select **Save**.

> [!NOTE]
> There might be a gap of up to 15 minutes between when logs or metrics are emitted and when they appear in your storage account, your event hub, or Log Analytics.

## View the logs

### Use Log Analytics

1. In the Azure portal, in the left pane, select **Log Analytics**.
1. Select the Log Analytics workspace that you chose when you added your diagnostics settings.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Log** search box, enter a simple query such as:

    ```sql
    AppPlatformLogsforSpring
    | limit 50
    ```

1. To view the search result, select **Run**.
1. You can search the logs of the specific application or instance by setting a filter condition:

    ```sql
    AppPlatformLogsforSpring
    | where ServiceName == "YourServiceName" and AppName == "YourAppName" and InstanceName == "YourInstanceName"
    | limit 50
    ```

To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](../azure-monitor/log-query/query-language.md).

### Use your storage account 

1. In the Azure portal, in the left pane, select **Storage accounts**.

1. Select the storage account that you chose when you added your diagnostics settings.
1. To open the **Blob Container** pane, select **Blobs**.
1. To review application logs, search for a container called **insights-logs-applicationconsole**.
1. To review application metrics, search for a container called **insights-metrics-pt1m**.

To learn more about sending diagnostics information to a storage account, see [Store and view diagnostics data in Azure Storage](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostics-extension-to-storage).

### Use your event hub

1. In the Azure portal, in the left pane, select **Event Hubs**.

1. Search for and select the event hub that you chose when you added your diagnostics settings.
1. To open the **Event Hub List** pane, select **Event Hubs**.
1. To review application logs, search for an event hub called **insights-logs-applicationconsole**.
1. To review application metrics, search for an event hub called **insights-metrics-pt1m**.

To learn more about sending diagnostics information to an event hub, see [Streaming Azure Diagnostics data in the hot path by using Event Hubs](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostics-extension-stream-event-hubs).

## Analyze the logs

Azure Log Analytics provides Kusto so that you can query your logs for analysis. For a quick introduction to querying logs by using Kusto, review the [Log Analytics tutorial](../azure-monitor/log-query/get-started-portal.md).

Application logs provide critical information about your application's health, performance, and more. In the next sections are some simple queries to help you understand your application's current and past states.

### Show application logs from Azure Spring Cloud

To review a list of application logs from Azure Spring Cloud, sorted by time with the most recent logs shown first, run the following query:

```sql
AppPlatformLogsforSpring
| project TimeGenerated , ServiceName , AppName , InstanceName , Log
| sort by TimeGenerated desc
```

### Show logs entries containing errors or exceptions

To review unsorted log entries that mention an error or exception, run the following query:

```sql
AppPlatformLogsforSpring
| project TimeGenerated , ServiceName , AppName , InstanceName , Log
| where Log contains "error" or Log contains "exception"
```

Use this query to find errors, or modify the query terms to find specific error codes or exceptions. 

### Show the number of errors and exceptions reported by your application over the last hour

To create a pie chart that displays the number of errors and exceptions logged by your application in the last hour, run the following query:

```sql
AppPlatformLogsforSpring
| where TimeGenerated > ago(1h)
| where Log contains "error" or Log contains "exception"
| summarize count_per_app = count() by AppName
| sort by count_per_app desc
| render piechart
```

### Learn more about querying application logs

Azure Monitor provides extensive support for querying application logs by using Log Analytics. To learn more about this service, see [Get started with log queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md). For more information about building queries to analyze your application logs, see [Overview of log queries in Azure Monitor](../azure-monitor/log-query/log-query-overview.md).
