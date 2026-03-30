---
title: Stream Execution Logs in Azure Functions
description: Learn how you can stream logs for functions in near real time.
ms.date: 12/17/2025
ms.topic: how-to
ms.devlang: azurecli
ms.custom: devx-track-azurepowershell
# Customer intent: As a developer, I want to be able to configure streaming logs so that I can see what's happening in my functions in near real time.
---

# Enable streaming execution logs in Azure Functions

While developing an application, you often want to see what's being written to the logs in near real time when running in Azure.

There are two ways to view the stream of log files that your function executions generate.

## [Live Metrics](#tab/live-metrics)

When your function app is [connected to Application Insights](configure-monitoring.md#enable-application-insights-integration), you can use [Live Metrics Stream](/azure/azure-monitor/app/live-stream) to view log data and other metrics in near real-time in the Azure portal. Live Metrics stream is *the recommended way to view streaming logs* it supports all plan types and is the method to use when monitoring functions running on multiple-instances. It also uses [sampled data](configure-monitoring.md#configure-sampling), so it can protect you from producing too much data during times of peak loads. 

>[!IMPORTANT]
>By default, the Live Metrics stream includes logs from all apps connected to a given Application Insights instance. When you have more than one app sending log data, you should [filter your log stream data](/azure/azure-monitor/app/live-stream#filter-by-server-instance).  

## [Built-in logs](#tab/built-in)

The App Service platform lets you view a stream of your application log files. This method is equivalent to the output seen when you debug your functions during [local development](functions-develop-local.md) and when you use the **Test** tab in the portal. All log-based information is displayed. For more information, see [Stream logs](../app-service/troubleshoot-diagnostic-logs.md#stream-logs). This streaming method supports only a single instance, and can't be used with an app running on Linux in a Consumption plan. When your function is scaled to multiple instances, data from other instances isn't shown using this method. 

---

Log streams can be viewed both in the portal and in most local development environments. The way that you enable and view streaming logs depends on your log streaming method, either Live Metrics or built-in. 

## [Azure portal](#tab/azure-portal/live-metrics)

1. To view the Live Metrics Stream for your app, select the **Overview** tab of your function app.

1. When you have Application Insights enabled, you see an **Application Insights** link under **Configured features**. This link takes you to the Application Insights page for your app.

1. In Application Insights, select **Live Metrics Stream**. [Sampled log entries](configure-monitoring.md#configure-sampling) are displayed under **Sample Telemetry**.

:::image type="content" source="./media/functions-monitoring/live-metrics-stream.png" alt-text="Screenshot showing how to view Live Metrics Stream in the portal.":::

## [Visual Studio Code](#tab/vs-code/live-metrics)

Run this command in the Terminal to display the Live Metrics Stream in a new browser window:

```bash
func azure functionapp logstream <FunctionAppName> --browser
```

## [Core Tools](#tab/core-tools/live-metrics)

Use this command to display the Live Metrics Stream in a new browser window:

```bash
func azure functionapp logstream <FunctionAppName> --browser
```

## [Azure portal](#tab/azure-portal/built-in)

To view streaming logs in the portal, select the **Platform features** tab in your function app. Then, under **Monitoring**, choose **Log streaming**.

:::image type="content" source="./media/functions-monitoring/enable-streaming-logs-portal.png" alt-text="Screenshot showing how to enable streaming logs in the portal.":::

This setting connects your app to the log streaming service and application logs are displayed in the window. You can toggle between **Application logs** and **Web server logs**.  

:::image type="content" source="./media/functions-monitoring/streaming-logs-window.png" alt-text="Screenshot showing how to view streaming logs in the portal.":::

## [Visual Studio Code](#tab/vs-code/built-in)

To turn on the streaming logs for your function app in Azure:

1. Select F1 to open the command palette, and then search for and run the command **Azure Functions: Start Streaming Logs**.

1. Select your function app in Azure, and then select **Yes** to enable application logging for the function app.

1. Trigger your functions in Azure. Notice that log data is displayed in the Output window in Visual Studio Code.

1. When you're done, remember to run the command **Azure Functions: Stop Streaming Logs** to disable logging for the function app.

## [Core Tools](#tab/core-tools/built-in)

Use the [`func azure functionapp logstream`](functions-core-tools-reference.md#func-azure-functionapp-list-functions) command to start receiving streaming logs of a specific function app running in Azure, as in this example:

```bash
func azure functionapp logstream <FunctionAppName>
```

---

## Next steps

- [Monitor Azure Functions](functions-monitoring.md)
- [Analyze Azure Functions telemetry in Application Insights](analyze-telemetry-data.md)
