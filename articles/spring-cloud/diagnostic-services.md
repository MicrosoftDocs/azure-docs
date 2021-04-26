---
title: Analyze logs and metrics in Azure Spring Cloud | Microsoft Docs
description: Learn how to analyze diagnostics data in Azure Spring Cloud
author: bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 01/06/2020
ms.author: brendm
ms.custom: devx-track-java
---

# Analyze logs and metrics with diagnostics settings

**This article applies to:** ✔️ Java ✔️ C#

Using the diagnostics functionality of Azure Spring Cloud, you can analyze logs and metrics with any of the following services:

* Use Azure Log Analytics, where the data is written to Azure Storage. There is a delay when exporting logs to Log Analytics.
* Save logs to a storage account  for auditing or manual inspection. You can specify the retention time (in days).
* Stream logs to your event hub for ingestion by a third-party service or custom analytics solution.

Choose the log category and metric category you want to monitor.

> [!TIP]
> Just want to stream your logs? Check out this [Azure CLI command](/cli/azure/spring-cloud/app#az_spring_cloud_app_logs)!

## Logs

|Log | Description |
|----|----|
| **ApplicationConsole** | Console log of all customer applications. |
| **SystemLogs** | Currently, only [Spring Cloud Config Server](https://cloud.spring.io/spring-cloud-config/reference/html/#_spring_cloud_config_server) logs in this category. |

## Metrics

For a complete list of metrics, see [Spring Cloud Metrics](./spring-cloud-concept-metrics.md#user-metrics-options).

To get started, enable one of these services to receive the data. To learn about configuring Log Analytics, see [Get started with Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-tutorial.md).

## Configure diagnostics settings

1. In the Azure portal, go to your Azure Spring Cloud instance.
1. Select **diagnostics settings** option, and then select **Add diagnostics setting**.
1. Enter a name for the setting, and then choose where you want to send the logs. You can select any combination of the following three options:
    * **Archive to a storage account**
    * **Stream to an event hub**
    * **Send to Log Analytics**

1. Choose which log category and metric category you want to monitor, and then specify the retention time (in days). The retention time applies only to the storage account.
1. Select **Save**.

> [!NOTE]
> 1. There might be a gap of up to 15 minutes between when logs or metrics are emitted and when they appear in your storage account, your event hub, or Log Analytics.
> 1. If the Azure Spring Cloud instance is deleted or moved, the operation will not cascade to the **diagnostics settings** resources. The **diagnostics settings** resources have to be deleted manually before the operation against its parent, i.e. the Azure Spring Cloud instance. Otherwise, if a new Azure Spring Cloud instance is provisioned with the same resource ID as the deleted one, or if the Azure Spring Cloud instance is moved back, the previous **diagnostics settings** resources continue extending it.

## View the logs and metrics
There are various methods to view logs and metrics as described under the following headings.

### Use the Logs blade

1. In the Azure portal, go to your Azure Spring Cloud instance.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Tables** search box
   * To view logs, enter a simple query such as:

    ```sql
    AppPlatformLogsforSpring
    | limit 50
    ```
   * To view metrics, enter a simple query such as:

    ```sql
    AzureMetrics
    | limit 50
    ```
1. To view the search result, select **Run**.

### Use Log Analytics

1. In the Azure portal, in the left pane, select **Log Analytics**.
1. Select the Log Analytics workspace that you chose when you added your diagnostics settings.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Tables** search box,
   * to view logs, enter a simple query such as:

    ```sql
    AppPlatformLogsforSpring
    | limit 50
    ```
    * to view metrics, enter a simple query such as:

    ```sql
    AzureMetrics
    | limit 50
    ```

1. To view the search result, select **Run**.
1. You can search the logs of the specific application or instance by setting a filter condition:

    ```sql
    AppPlatformLogsforSpring
    | where ServiceName == "YourServiceName" and AppName == "YourAppName" and InstanceName == "YourInstanceName"
    | limit 50
    ```
> [!NOTE]
> `==` is case sensitive, but `=~` is not.

To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, check out [Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/query-monitor-data).

### Use your storage account

1. In the Azure portal, find **Storage accounts** in left navigation panel or search box.
1. Select the storage account that you chose when you added your diagnostics settings.
1. To open the **Blob Container** pane, select **Blobs**.
1. To review application logs, search for a container called **insights-logs-applicationconsole**.
1. To review application metrics, search for a container called **insights-metrics-pt1m**.

To learn more about sending diagnostics information to a storage account, see [Store and view diagnostics data in Azure Storage](../storage/common/storage-introduction.md).

### Use your event hub

1. In the Azure portal, find **Event Hubs** in left navigation panel or search box.

1. Search for and select the event hub that you chose when you added your diagnostics settings.
1. To open the **Event Hub List** pane, select **Event Hubs**.
1. To review application logs, search for an event hub called **insights-logs-applicationconsole**.
1. To review application metrics, search for an event hub called **insights-metrics-pt1m**.

To learn more about sending diagnostics information to an event hub, see [Streaming Azure Diagnostics data in the hot path by using Event Hubs](../azure-monitor/agents/diagnostics-extension-stream-event-hubs.md).

## Analyze the logs

Azure Log Analytics is running with a Kusto engine so you can query your logs for analysis. For a quick introduction to querying logs by using Kusto, review the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

Application logs provide critical information and verbose logs about your application's health, performance, and more. In the next sections are some simple queries to help you understand your application's current and past states.

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

Azure Monitor provides extensive support for querying application logs by using Log Analytics. To learn more about this service, see [Get started with log queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md). For more information about building queries to analyze your application logs, see [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

## Frequently asked questions (FAQ)

### How to convert multi-line Java stack traces into a single line?

There is a workaround to convert your multi-line stack traces into a single line. You can modify the Java log output to reformat stack trace messages, replacing newline characters with a token. If you use Java Logback library, you can reformat stack trace messages by adding `%replace(%ex){'[\r\n]+', '\\n'}%nopex` as follows:

```xml
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>
                level: %level, message: "%logger{36}: %msg", exceptions: "%replace(%ex){'[\r\n]+', '\\n'}%nopex"%n
            </pattern>
        </encoder>
    </appender>
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```
And then you can replace the token with newline characters again in Log Analytics as below:

```sql
AppPlatformLogsforSpring
| extend Log = array_strcat(split(Log, '\\n'), '\n')
```
You may be able to use the same strategy for other Java log libraries.

## Next steps

* [Quickstart: Deploy your first Azure Spring Cloud application](spring-cloud-quickstart.md)
