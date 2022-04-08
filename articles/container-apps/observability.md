---
title: Observability in Azure Container Apps Preview
description: Monitor your running app in Azure Container Apps Preview
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: v-bcatherine
---

# Observability in Azure Container Apps Preview

Azure Container Apps provides built-in  observability features that give you a holistic view of the behavior, performance, and health of your running container apps.

These features include:

- Azure Monitor metrics
- Azure Monitor Log Analytics
- Alerts

>[!NOTE]
> While not a built-in feature, [Azure Monitor's Application Insights](../azure-monitor/app/app-insights-overview.md) is a powerful tool to monitor your web and background applications.
> Although Container Apps doesn't support the Application Insights auto-instrumentation agent, you can instrument your application code using Application Insights SDKs.  

## Azure Monitor metrics

The Azure Monitor metrics feature allows you to monitor your app's compute and network usage.  These metrics are available to view and analyze through the [metrics explorer in the Azure portal](/../azure-monitor/essentials/metrics-getting-started).  Metric data is also available through the [Azure CLI](/cli/azure/monitor/metrics), Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric), and custom applications.

### Available metrics for Container Apps

Container Apps provides the following metrics for your container app.

|Title  | Description | Metric ID |Unit  |
|---------|---------|---------|---------|
|CPU usage nanocores | CPU usage in nanocores (1,000,000,000 nanocores = 1 core) | UsageNanoCores| nanocores|
|Memory working set bytes |Working set memory used in bytes |WorkingSetBytes |bytes|
|Network in bytes|Network received bytes|RxBytes|bytes|
|Network out bytes|Network transmitted bytes|TxBytes|bytes|
|Requests|Requests processed|Requests|n/a|

The metrics namespace is `microsoft.app/containerapps`.

### View a snapshot of your app's metrics

Using the Azure portal, navigate to your container apps **Overview** page.  The **Monitoring** section displays the current CPU, memory, and network utilization for your container app.

:::image type="content" source="media/observability/metrics-in-overview-page.png" alt-text="Monitoring section in container app overview":::

From this view, you can pin one or more charts to your dashboard.  When you select a chart, it's opened in the metrics explorer.

### View and analyze metric data with metrics explorer

The Azure Monitor metrics explorer is available from the Azure portal, through the **Metrics** menu option in your container app page or the Azure **Monitor**->**Metrics** page.

The metrics page allows you to create and view charts to display your container apps metrics.  Refer to [Getting started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md) to learn more.

When you first navigate to the metrics explorer, you'll see the main page.  From here, select the metric that you want to display.  You can add more metrics to the chart by selecting **Add Metric** in the upper left.

:::image type="content" source=" media/observability/metrics-main-page.png" alt-text="Main metrics page.":::

You can filter your metrics by revision or replica.  For example, o filter by a replica, select **Add filter**, then select a replica from the *Value* drop-down.   You can also filter by your container app's revision.

:::image type="content" source="media/observability/add-filter.png" alt-text="Add a filter to chart":::

You can split the information in your chart by revision or replica.For example, to split by revision, select **Applying splitting** and select **Revision** as the value. Splitting is only available when the chart contains a single metric.

:::image type="content" source="media/observability/apply-splitting.png" alt-text="Apply spitting to chart.":::

You can view metrics across multiple container apps to view resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Create chart showing metrics over multiple container apps":::

## Azure Monitor Log Analytics

Application logs are available through Azure Monitor Log Analytics. Each Container Apps environment includes a Log Analytics workspace, which provides a common log space for all container apps in the environment.  

Application logs, consisting of the logs written to `stdout` and `stderr` from the container(s) in each container app, are collected and stored in the Log Analytics workspace.  Additionally, if your container app is using Dapr, log entries from the Dapr sidecar are also collected.

To view these logs, you need use Log Analytics queries.  The log entries are stored in the ContainerAppConsoleLogs_CL table in the CustomLogs group.

The most commonly used Container Apps specific columns in ContainerAppConsoleLogs_CL:

|Column  |Type  |Description |
|---------|---------|---------|
|ContainerAppName_s | string | container app name |
|ContainerGroupName_g| string |replica name|
|ContainerId|string|container identifier|
|ContainerImage_s |string| container image name |
|EnvironmentName_s|string|Container Apps environment name|
|Log_s    |string| log message|
|RevisionName_s|string|revision name|

You can run Log Analytic queries via the Azure portal, the Azure CLI or PowerShell.  

### Log Analytics via the Azure portal

In the Azure portal, logs are available from either the **Monitor**->**Logs** page or by navigating to your container app and selecting the **Logs** menu item.  From Log Analytics interface, you can query the logs based on the **CustomLogs>ContainerAppConsoleLogs_CL** tables.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Log Analytics query page":::

Here's an example of a simple query, that displays log entries for the container app named *album-api*.  

```kusto
ContainerAppConsoleLogs_CL
| where ContainerName_s !startswith 'probe-shim' // filters out probe-shim-* containers which should not be showing
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s, LogLevel_s
| take 100
```

For more information regarding the Log Analytics interface and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Log Analytics via the Azure CLI and PowerShell

You can query Application logs from the  [Azure CLI](/cli/azure/monitor/metrics) and [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).  

Example Azure CLI query to display the log entries for a container app:

```azurecli
az monitor log-analytics query --workspace --analytics-query "ContainerAppConsoleLogs_CL | where ContainerName_s !startswith 'probe-shim' | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Message, LogLevel_s | take 100" --out table
```

For more information, see [Viewing Logs](monitor.md#viewing-logs).

## Azure Monitor alerts

You can configure alerts to send notifications based on metrics values and Log Analytics queries.  Alerts can be added from the metrics explorer and the Log Analytics interface in the Azure portal. In the metrics explorer and the Log Analytics interface, metrics are based on existing charts and queries.  You can create alerts "from scratch" and manage your alerts from the **Monitor>Alerts** page.  

### Setting alerts in metrics explorer

 You can create metric alerts from the metric explorer.  When you create a chart in metrics explorer, you can create an alert rule by selecting **New alert rule** located above the chart.   

when you create a new alert rule, the  rule creation pane is opened to the **Condition** tab  A condition is started for you based on the metric that you selected for the chart. You can edit the condition to add the threshold criteria and configure other settings for the alert.   You can add more conditions based on any of the available metrics.

You can split your alerts by revision or replica.  By splitting,  each revision or replica is monitored individually and you'll get individual notifications when the alert criteria is met.

Example of setting a dimension for a condition:

:::image type="content" source="media/observability/create-alert-2.png" alt-text="Select replica for alert criteria":::

Once you create the alert rule, it's a resource in your resource group.  To manage your alert rules, navigate to **Monitor>Alerts**. 

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Setting alerts using Log Analytics queries

The Log Analytics interface allows you to add alert rules to your queries.  When you set up an alert, the query is run at defined intervals.  Alerts are triggered when the query results match the alert conditions.  Alerts can be split by dimensions, such as, revision and replica.  

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md).

## Observability throughout the application lifecycle

Container Apps provides continuous monitoring across each phase of your development-to-production life cycle. This monitoring helps to ensure the health, performance, and reliability of your application as it moves from development to production.  

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Health probes in Azure Container Apps](health-probes.md)
> [Monitor an App in Azure Container Apps](monitor.md)
