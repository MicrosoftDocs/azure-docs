---
title: Analyze Logs and Metrics in Azure Spring Apps
description: Learn how to analyze diagnostics data in Azure Spring Apps
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: conceptual
ms.date: 06/27/2024
ms.author: karler
ms.custom: devx-track-java
---

# Analyze logs and metrics with diagnostics settings

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ✅ C#

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article shows you how to analyze diagnostics data in Azure Spring Apps.

Using the diagnostics functionality of Azure Spring Apps, you can analyze logs and metrics with any of the following services:

* Use Azure Log Analytics. There's a delay when exporting logs to Log Analytics.
* Save logs to a storage account for auditing or manual inspection. You can specify the retention time (in days).
* Stream logs to your event hub for ingestion by a third-party service or custom analytics solution.

Choose the log category and metric category you want to monitor.

> [!TIP]
> If you just want to stream your logs, you can use the Azure CLI command [az spring app logs](/cli/azure/spring/app#az-spring-app-logs).

## Logs

| Log                    | Description                                                                                                                                                                                                                                                                                                 |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ApplicationConsole** | Console log of all customer applications.                                                                                                                                                                                                                                                                   |
| **SystemLogs**         | The available `LogType` values are `ConfigServer`(Basic/Standard only), `ServiceRegistry`(all plans), `ApiPortal`(Enterprise plan only), `ApplicationConfigurationService`(Enterprise plan only), `SpringCloudGateway` (Enterprise plan only), and `SpringCloudGatewayOperator` (Enterprise plan only) |
| **IngressLogs**        | [Ingress logs](#show-ingress-log-entries-containing-a-specific-host) of all customer's applications, only access logs.                                                                                                                                                                                      |
| **BuildLogs**          | [Build logs](#show-build-log-entries-for-a-specific-app) of all customer's applications for each build stage.                                                                                                                                                                                               |

> [!NOTE]
> To protect your application from potential *credential leak*, all log contents with credentials or other sensitive information are masked with `***`. For example, any log contents with the following patterns are handled as sensitive information, and the corresponding values are masked:
>
> - `dbpass`, `password`, `key`, `secret`, `sig`, and `signature` followed by `:` or `=`. These patterns typically appear in URL parameters and payload dumps. For example, `https://somestorage.blob.core.windows.net?sv=2021-08-06&st=2024-04-30T10%3A01%3A19Z&se=2024-04-30T11%3A01%3A19Z&sr=b&sp=r&sig=xxxxxxxxxxxxxx` becomes `https://somestorage.blob.core.windows.net?sv=2021-08-06&st=2024-04-30T10%3A01%3A19Z&se=2024-04-30T11%3A01%3A19Z&sr=b&sp=r&sig=***`
> - JWT token-like encoded strings in the format: `eyJxxxxxx.eyJxxxxxx`
>
> If you find masked values in your logs, be sure to update your application code to eliminate credential leak.

## Metrics

For a complete list of metrics, see the [User metrics options](./concept-metrics.md#user-metrics-options) section of [Metrics for Azure Spring Apps](concept-metrics.md).

To get started, enable one of these services to receive the data. To learn about configuring Log Analytics, see [Get started with Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-tutorial).

## Configure diagnostics settings

1. In the Azure portal, go to your Azure Spring Apps instance.
1. Select **diagnostics settings** option, and then select **Add diagnostics setting**.
1. Enter a name for the setting, and then choose where you want to send the logs. You can select any combination of the following options:

   * **Archive to a storage account**
   * **Stream to an event hub**
   * **Send to Log Analytics**
   * **Send to partner solution**

1. Choose which log category and metric category you want to monitor, and then specify the retention time (in days). The retention time applies only to the storage account.
1. Select **Save**.

> [!NOTE]
> There might be a gap of up to 15 minutes between when logs or metrics are emitted and when they appear in your storage account, your event hub, or Log Analytics.
> If the Azure Spring Apps instance is deleted or moved, the operation won't cascade to the **diagnostics settings** resources. The **diagnostics settings** resources have to be deleted manually before the operation against its parent, the Azure Spring Apps instance. Otherwise, if a new Azure Spring Apps instance is provisioned with the same resource ID as the deleted one, or if the Azure Spring Apps instance is moved back, the previous **diagnostics settings** resources continue extending it.

## View the logs and metrics

There are various methods to view logs and metrics as described under the following headings.

### Use the Logs pane

1. In the Azure portal, go to your Azure Spring Apps instance.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Tables** search box, use one of the following queries:

   * To view logs, enter a query such as the following example:

     ```kusto
     AppPlatformLogsforSpring
     | limit 50
     ```

   * To view metrics, enter a query such as the following example:

     ```kusto
     AzureMetrics
     | limit 50
     ```

1. To view the search result, select **Run**.

### Use Log Analytics

1. In the Azure portal, in the left pane, select **Log Analytics**.
1. Select the Log Analytics workspace that you chose when you added your diagnostics settings.
1. To open the **Log Search** pane, select **Logs**.
1. In the **Tables** search box, use one of the following queries:

   * To view logs, enter a query such as the following example:

     ```kusto
     AppPlatformLogsforSpring
     | limit 50
     ```

    * To view metrics, enter a query such as the following example:

     ```kusto
     AzureMetrics
     | limit 50
     ```

1. To view the search result, select **Run**.
1. You can search the logs of the specific application or instance by setting a filter condition, as shown in the following example:

   ```kusto
   AppPlatformLogsforSpring
   | where ServiceName == "YourServiceName" and AppName == "YourAppName" and InstanceName == "YourInstanceName"
   | limit 50
   ```

   > [!NOTE]
   > `==` is case sensitive, but `=~` is not.

To learn more about the query language that's used in Log Analytics, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/). To query all your Log Analytics logs from a centralized client, check out [Azure Data Explorer](/azure/data-explorer/query-monitor-data).

### Use your storage account

1. In the Azure portal, find **Storage accounts** in left navigation panel or search box.
1. Select the storage account that you chose when you added your diagnostics settings.
1. To open the **Blob Container** pane, select **Blobs**.
1. To review application logs, search for a container called **insights-logs-applicationconsole**.
1. To review application metrics, search for a container called **insights-metrics-pt1m**.

To learn more about sending diagnostics information to a storage account, see [Store and view diagnostics data in Azure Storage](../../storage/common/storage-introduction.md).

### Use your event hub

1. In the Azure portal, find **Event Hubs** in left navigation panel or search box.

1. Search for and select the event hub that you chose when you added your diagnostics settings.
1. To open the **Event Hub List** pane, select **Event Hubs**.
1. To review application logs, search for an event hub called **insights-logs-applicationconsole**.
1. To review application metrics, search for an event hub called **insights-metrics-pt1m**.

To learn more about sending diagnostics information to an event hub, see [Streaming Azure Diagnostics data in the hot path by using Event Hubs](/azure/azure-monitor/agents/diagnostics-extension-stream-event-hubs).

## Analyze the logs

Azure Log Analytics is running with a Kusto engine so you can query your logs for analysis. For a quick introduction to querying logs by using Kusto, review the [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

Application logs provide critical information and verbose logs about your application's health, performance, and more. In the next sections are some simple queries to help you understand your application's current and past states.

### Show application logs from Azure Spring Apps

To review a list of application logs from Azure Spring Apps, sorted by time with the most recent logs shown first, run the following query:

```kusto
AppPlatformLogsforSpring
| project TimeGenerated , ServiceName , AppName , InstanceName , Log
| sort by TimeGenerated desc
```

### Show logs entries containing errors or exceptions

To review unsorted log entries that mention an error or exception, run the following query:

```kusto
AppPlatformLogsforSpring
| project TimeGenerated , ServiceName , AppName , InstanceName , Log
| where Log contains "error" or Log contains "exception"
```

Use this query to find errors, or modify the query terms to find specific error codes or exceptions.

### Show the number of errors and exceptions reported by your application over the last hour

To create a pie chart that displays the number of errors and exceptions logged by your application in the last hour, run the following query:

```kusto
AppPlatformLogsforSpring
| where TimeGenerated > ago(1h)
| where Log contains "error" or Log contains "exception"
| summarize count_per_app = count() by AppName
| sort by count_per_app desc
| render piechart
```

### Show ingress log entries containing a specific host

To review log entries generated by a specific host, run the following query:

```kusto
AppPlatformIngressLogs
| where TimeGenerated > ago(1h) and Host == "ingress-asc.test.azuremicroservices.io"
| project TimeGenerated, RemoteIP, Host, Request, Status, BodyBytesSent, RequestTime, ReqId, RequestHeaders
| sort by TimeGenerated
```

Use this query to find response `Status`, `RequestTime`, and other properties of this specific host's ingress logs.

### Show ingress log entries for a specific requestId

To review log entries for a specific `requestId` value `<request_ID>`, run the following query:

```kusto
AppPlatformIngressLogs
| where TimeGenerated > ago(1h) and ReqId == "<request_ID>"
| project TimeGenerated, RemoteIP, Host, Request, Status, BodyBytesSent, RequestTime, ReqId, RequestHeaders
| sort by TimeGenerated
```

### Show build log entries for a specific app

To review log entries for a specific app during the build process, run the following query:

```kusto
AppPlatformBuildLogs
| where TimeGenerated > ago(1h) and PodName contains "<app-name>"
| sort by TimeGenerated
```

### Show build log entries for a specific app in a specific build stage

To review log entries for a specific app in a specific build stage, run the following query. Replace the `<app-name>` placeholder with your application name. Replace the `<build-stage>` placeholder with one of the following values, which represent the stages of the build process: `prepare`, `detect`, `restore`, `analyze`, `build`, `export`, or `completion`.

```kusto
AppPlatformBuildLogs
| where TimeGenerated > ago(1h) and PodName contains "<app-name>" and ContainerName == "<build-stage>"
| sort by TimeGenerated
```

### Show VMware Spring Cloud Gateway logs in the Enterprise plan

To review log entries for VMware Spring Cloud Gateway logs in the Enterprise plan, run the following query:

```kusto
AppPlatformSystemLogs 
| where LogType == "SpringCloudGateway"
| project TimeGenerated , LogType, Level , ServiceName , Thread , Stack , Log , _ResourceId 
| limit 100
```

Another component, named Spring Cloud Gateway Operator, controls the lifecycle of Spring Cloud Gateway and routes. If you encounter any issues with the route not taking effect, check the logs for this component. To review log entries for VMware Spring Cloud Gateway Operator in the Enterprise plan, run the following query:

```kusto
AppPlatformSystemLogs 
| where LogType == "SpringCloudGatewayOperator"
| project TimeGenerated , LogType, Level , ServiceName , Thread , Stack , Log , _ResourceId 
| limit 100
```

### Show Application Configuration Service for Tanzu logs in the Enterprise plan

To review log entries for Application Configuration Service for Tanzu logs in the Enterprise plan, run the following query:

```kusto
AppPlatformSystemLogs 
| where LogType == "ApplicationConfigurationService"
| project TimeGenerated , LogType, Level , ServiceName , Thread , Stack , Log , _ResourceId 
| limit 100
```

### Show Tanzu Service Registry logs in the Enterprise plan

To review log entries for Tanzu Service Registry logs in the Enterprise plan, run the following query:

```kusto
AppPlatformSystemLogs 
| where LogType == "ServiceRegistry"
| project TimeGenerated , LogType, Level , ServiceName , Thread , Stack , Log , _ResourceId 
| limit 100
```

### Show API portal for VMware Tanzu logs in the Enterprise plan

To review log entries for API portal for VMware Tanzu logs in the Enterprise plan, run the following query:

```kusto
AppPlatformSystemLogs 
| where LogType == "ApiPortal"
| project TimeGenerated , LogType, Level , ServiceName , Thread , Stack , Log , _ResourceId 
| limit 100
```

### Learn more about querying application logs

Azure Monitor provides extensive support for querying application logs by using Log Analytics. To learn more about this service, see [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries). For more information about building queries to analyze your application logs, see [Overview of log queries in Azure Monitor](/azure/azure-monitor/logs/log-query-overview).

### Convenient entry points in Azure portal

Use following steps to navigate to the **Log Analytics** pane with predefined queries:

1. Go to the **Overview** page for your Azure Spring Apps service instance and then select **Apps** in the navigation pane.

1. Find your target app and then select the context menu.

1. In the pop-up context menu, select **View logs**.

   :::image type="content" source="media/diagnostic-services/view-logs.png" alt-text="Screenshot of the Azure portal that shows the Apps page with the View logs context menu item highlighted." lightbox="media/diagnostic-services/view-logs.png":::

   This action navigates you to the **Log Analytics** pane with predefined queries.

There are other entry points to view logs. You can also find the **View logs** button for managed components such as Build Service and Service Registry.

## Frequently asked questions (FAQ)

### How do I convert multi-line Java stack traces into a single line?

There's a workaround to convert your multi-line stack traces into a single line. You can modify the Java log output to reformat stack trace messages, replacing newline characters with a token. If you use Java Logback library, you can reformat stack trace messages by adding `%replace(%ex){'[\r\n]+', '\\n'}%nopex` as follows:

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

You can then replace the token with newline characters in Log Analytics, as shown in the following example:

```kusto
AppPlatformLogsforSpring
| extend Log = array_strcat(split(Log, '\\n'), '\n')
```

You might be able to use the same strategy for other Java log libraries.

## Next steps

* [Quickstart: Deploy your first Spring Boot app in Azure Spring Apps](./quickstart.md)
