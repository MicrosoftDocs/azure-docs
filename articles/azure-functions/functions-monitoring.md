---
title: Monitor Azure Functions
description: Learn how to use Azure Application Insights with Azure Functions to monitor function execution.
ms.assetid: 501722c3-f2f7-4224-a220-6d59da08a320
ms.topic: conceptual
ms.date: 04/04/2019
ms.custom: "devx-track-csharp, fasttrack-edit"
# Customer intent: As a developer, I want to monitor my functions so I can know if they're running correctly.
---

# Monitor Azure Functions

[Azure Functions](functions-overview.md) offers built-in integration with [Azure Application Insights](../azure-monitor/app/app-insights-overview.md) to monitor functions. This article shows you how to configure Azure Functions to send system-generated log files to Application Insights.

We recommend using Application Insights because it collects log, performance, and error data. It automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and to understand how your functions are used. It's designed to help you continuously improve performance and usability. You can even use Application Insights during local function app project development. For more information, see [What is Application Insights?](../azure-monitor/app/app-insights-overview.md).

As the required Application Insights instrumentation is built into Azure Functions, all you need is a valid instrumentation key to connect your function app to an Application Insights resource. The instrumentation key should be added to your application settings when your function app resource is created in Azure. If your function app doesn't already have this key, you can [set it manually](#enable-application-insights-integration).  

## Application Insights pricing and limits

You can try out Application Insights integration with Azure Functions for free. There's a daily limit to how much data can be processed for free. You might hit this limit during testing. Azure provides portal and email notifications when you're approaching your daily limit. If you miss those alerts and hit the limit, new logs won't appear in Application Insights queries. Be aware of the limit to avoid unnecessary troubleshooting time. For more information, see [Manage pricing and data volume in Application Insights](../azure-monitor/app/pricing.md).

> [!IMPORTANT]
> Application Insights has a [sampling](../azure-monitor/app/sampling.md) feature that can protect you from producing too much telemetry data on completed executions at times of peak load. Sampling is enabled by default. If you appear to be missing data, you might need to adjust the sampling settings to fit your particular monitoring scenario. To learn more, see [Configure sampling](configure-monitoring.md#configure-sampling).

The full list of Application Insights features available to your function app is detailed in [Application Insights for Azure Functions supported features](../azure-monitor/app/azure-functions-supported-features.md).

## View telemetry in Monitor tab

With [Application Insights integration enabled](configure-monitoring.md#enable-application-insights-integration), you can view telemetry data in the **Monitor** tab.

1. In the function app page, select a function that has run at least once after Application Insights was configured. Then, select **Monitor** from the left pane. Select **Refresh** periodically, until the list of function invocations appears.

   ![Invocations list](media/functions-monitoring/monitor-tab-ai-invocations.png)

    > [!NOTE]
    > It can take up to five minutes for the list to appear while the telemetry client batches data for transmission to the server. The delay doesn't apply to the [Live Metrics Stream](../azure-monitor/app/live-stream.md). That service connects to the Functions host when you load the page, so logs are streamed directly to the page.

1. To see the logs for a particular function invocation, select the **Date (UTC)** column link for that invocation. The logging output for that invocation appears in a new page.

   ![Invocation details](media/functions-monitoring/invocation-details-ai.png)

1. Choose **Run in Application Insights** to view the source of the query that retrieves the Azure Monitor log data in Azure Log. If this is your first time using Azure Log Analytics in your subscription, you're asked to enable it.

1. After you enable Log Analytics, the following query is displayed. You can see that the query results are limited to the last 30 days (`where timestamp > ago(30d)`). In addition, the results show no more than 20 rows (`take 20`). In contrast, the invocation details list for your function is for the last 30 days with no limit.

   ![Application Insights Analytics invocation list](media/functions-monitoring/ai-analytics-invocation-list.png)

For more information, see [Query telemetry data](#query-telemetry-data) later in this article.

## View telemetry in Application Insights

To open Application Insights from a function app in the Azure portal, select **Application Insights** under **Settings** in the left page. If this is your first time using Application Insights with your subscription, you'll be prompted to enable it: select **Turn on Application Insights**, and then select **Apply** on the next page.

![Open Application Insights from the function app Overview page](media/functions-monitoring/ai-link.png)

For information about how to use Application Insights, see the [Application Insights documentation](/azure/application-insights/). This section shows some examples of how to view data in Application Insights. If you're already familiar with Application Insights, you can go directly to [the sections about how to configure and customize the telemetry data](configure-monitoring.md#configure-log-levels).

![Application Insights Overview tab](media/functions-monitoring/metrics-explorer.png)

The following areas of Application Insights can be helpful when evaluating the behavior, performance, and errors in your functions:

| Investigate | Description |
| ---- | ----------- |
| **[Failures](../azure-monitor/app/asp-net-exceptions.md)** |  Create charts and alerts based on function failures and server exceptions. The **Operation Name** is the function name. Failures in dependencies aren't shown unless you implement custom telemetry for dependencies. |
| **[Performance](../azure-monitor/app/performance-counters.md)** | Analyze performance issues by viewing resource utilization and throughput per **Cloud role instances**. This data can be useful for debugging scenarios where functions are bogging down your underlying resources. |
| **[Metrics](../azure-monitor/platform/metrics-charts.md)** | Create charts and alerts that are based on metrics. Metrics include the number of function invocations, execution time, and success rates. |
| **[Live Metrics    ](../azure-monitor/app/live-stream.md)** | View metrics data as it's created in near real-time. |

## Query telemetry data

[Application Insights Analytics](../azure-monitor/log-query/log-query-overview.md) gives you access to all telemetry data in the form of tables in a database. Analytics provides a query language for extracting, manipulating, and visualizing the data. 

Choose **Logs** to explore or query for logged events.

![Analytics example](media/functions-monitoring/analytics-traces.png)

Here's a query example that shows the distribution of requests per worker over the last 30 minutes.

<pre>
requests
| where timestamp > ago(30m) 
| summarize count() by cloud_RoleInstance, bin(timestamp, 1m)
| render timechart
</pre>

The tables that are available are shown in the **Schema** tab on the left. You can find data generated by function invocations in the following tables:

| Table | Description |
| ----- | ----------- |
| **traces** | Logs created by the runtime and by function code. |
| **requests** | One request for each function invocation. |
| **exceptions** | Any exceptions thrown by the runtime. |
| **customMetrics** | The count of successful and failing invocations, success rate, and duration. |
| **customEvents** | Events tracked by the runtime, for example: HTTP requests that trigger a function. |
| **performanceCounters** | Information about the performance of the servers that the functions are running on. |

The other tables are for availability tests, and client and browser telemetry. You can implement custom telemetry to add data to them.

Within each table, some of the Functions-specific data is in a `customDimensions` field.  For example, the following query retrieves all traces that have log level `Error`.

<pre>
traces 
| where customDimensions.LogLevel == "Error"
</pre>

The runtime provides the `customDimensions.LogLevel` and `customDimensions.Category` fields. You can provide additional fields in logs that you write in your function code. For an example in C#, see [Structured logging](functions-dotnet-class-library.md#structured-logging) in the .NET class library developer guide.

## Write to logs 

The way that you write to logs and the APIs you use depend on the language of your function app project. 

See the developer guide for your language to learn more about writing logs from your functions.

+ [C# (.NET class library)](functions-dotnet-class-library.md#logging)
+ [Java](functions-reference-java.md#logger)
+ [JavaScript](functions-reference-node.md#write-trace-output-to-logs) 
+ [PowerShell](functions-reference-powershell.md#logging)
+ [Python](functions-reference-python.md#logging)

## Dependencies

Starting with version 2.x of Functions, the runtime automatically collects dependencies for HTTP requests, Service Bus, Event Hubs, and SQL. The following is an example of an _application map_ in Application Insights of an HTTP trigger function with a Queue storage output binding.  

![Application map with dependency](./media/functions-monitoring/app-map.png)

Dependencies are written at the `Information` level. If you filter at `Warning` or above, you won't see the dependency data. Also, automatic collection of dependencies happens at a non-user scope. To capture dependency data, make sure the level is set to at least `Information` outside the user scope (`Function.<YOUR_FUNCTION_NAME>.User`) in your host.

In addition to automatic dependency data collection, you can also use one of the language specific Application Insights SDKs to write custom dependency information to the logs. For an example how to write custom dependencies, see one of the following language-specific examples:

+ [Log custom telemetry in C# functions](functions-dotnet-class-library.md#log-custom-telemetry-in-c-functions)
+ [Log custom telemetry in JavaScript functions](functions-reference-node.md#log-custom-telemetry) 

## Streaming Logs

While developing an application, you often want to see what's being written to the logs in near real time when running in Azure.

There are two ways to view a stream of log files being generated by your function executions.

* **Built-in log streaming**: the App Service platform lets you view a stream of your application log files. This is equivalent to the output seen when you debug your functions during [local development](functions-develop-local.md) and when you use the **Test** tab in the portal. All log-based information is displayed. For more information, see [Stream logs](../app-service/troubleshoot-diagnostic-logs.md#stream-logs). This streaming method supports only a single instance, and can't be used with an app running on Linux in a Consumption plan.

* **Live Metrics Stream**: when your function app is [connected to Application Insights](configure-monitoring.md#enable-application-insights-integration), you can view log data and other metrics in near real-time in the Azure portal using [Live Metrics Stream](../azure-monitor/app/live-stream.md). Use this method when monitoring functions running on multiple-instances or on Linux in a Consumption plan. This method uses [sampled data](configure-monitoring.md#configure-sampling).

Log streams can be viewed both in the portal and in most local development environments. To learn how to enable log streams, see [Enable streaming execution logs in Azure Functions](streaming-logs.md).

## Scale controller logs (preview)

This feature is in preview. 

The [Azure Functions scale controller](./functions-scale.md#runtime-scaling) monitors instances of the Azure Functions host on which your app runs. This controller makes decisions about when to add or remove instances based on current performance. You can have the scale controller emit logs to either Application Insights or to Blob storage to better understand the decisions the scale controller is making for your function app.

To enable this feature, add a new application setting named `SCALE_CONTROLLER_LOGGING_ENABLED`. The value of this setting must be of the format `<DESTINATION>:<VERBOSITY>`, based on the following:

[!INCLUDE [functions-scale-controller-logging](../../includes/functions-scale-controller-logging.md)]

For example, the following Azure CLI command turns on verbose logging from the scale controller to Application Insights:

```azurecli-interactive
az functionapp config appsettings set --name <FUNCTION_APP_NAME> \
--resource-group <RESOURCE_GROUP_NAME> \
--settings SCALE_CONTROLLER_LOGGING_ENABLED=AppInsights:Verbose
```

In this example, replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and the resource group name, respectively. 

The following Azure CLI command disables logging by setting the verbosity to `None`:

```azurecli-interactive
az functionapp config appsettings set --name <FUNCTION_APP_NAME> \
--resource-group <RESOURCE_GROUP_NAME> \
--settings SCALE_CONTROLLER_LOGGING_ENABLED=AppInsights:None
```

You can also disable logging by removing the `SCALE_CONTROLLER_LOGGING_ENABLED` setting using the following Azure CLI command:

```azurecli-interactive
az functionapp config appsettings delete --name <FUNCTION_APP_NAME> \
--resource-group <RESOURCE_GROUP_NAME> \
--setting-names SCALE_CONTROLLER_LOGGING_ENABLED
```

## Report issues

To report an issue with Application Insights integration in Functions, or to make a suggestion or request, [create an issue in GitHub](https://github.com/Azure/Azure-Functions/issues/new).

## Next steps

For more information, see the following resources:

* [Application Insights](/azure/application-insights/)
* [ASP.NET Core logging](/aspnet/core/fundamentals/logging/)

