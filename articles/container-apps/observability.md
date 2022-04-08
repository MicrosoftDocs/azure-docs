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
- Azure Monitor Alerts

>[!NOTE]
> While not a built-in feature, [Azure Monitor's Application Insights](../azure-monitor/app/app-insights-overview.md) is a powerful tool to monitor your web and background applications.
> Although Container Apps doesn't support the Application Insights auto-instrumentation agent, you can instrument your application code using Application Insights SDKs.  

## Azure Monitor metrics

The Azure Monitor metrics feature allows you to monitor your app's compute and network usage.  These metrics are available to view and analyze through the [metrics explorer in the Azure portal](/../azure-monitor/essentials/metrics-getting-started).  Metric data is also available through the [Azure CLI](/cli/azure/monitor/metrics), and Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).

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

:::image type="content" source="media/observability/metrics-main-page.png" alt-text="Metrics blade":::

You can filter your metrics by revision or replica.  For example, to filter by a replica, select **Add filter**, then select a replica from the *Value* drop-down.   You can also filter by your container app's revision.

:::image type="content" source="media/observability/metrics-add-filter.png" alt-text="Add a filter to chart":::

You can split the information in your chart by revision or replica. For example, to split by revision, select **Applying splitting** and select **Revision** as the value. Splitting is only available when the chart contains a single metric.

:::image type="content" source="media/observability/metrics-apply-splitting.png" alt-text="Apply spitting by revision to chart.":::

You can view metrics across multiple container apps to view resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Create chart showing metrics over multiple container apps":::

## Azure Monitor Log Analytics

Application logs are available through Azure Monitor Log Analytics. Each Container Apps environment includes a Log Analytics workspace, which provides a common log space for all container apps in the environment.  

Application logs, consisting of the logs written to `stdout` and `stderr` from the container(s) in each container app, are collected and stored in the Log Analytics workspace.  Additionally, if your container app is using Dapr, log entries from the Dapr sidecar are also collected.

To view these logs, you create Log Analytics queries.  The log entries are stored in the ContainerAppConsoleLogs_CL table in the CustomLogs group.

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

In the Azure portal, logs are available from either the **Monitor**->**Logs** page or by navigating to your container app and selecting the **Logs** menu item.  From Log Analytics interface, you can query the logs based on the **CustomLogs>ContainerAppConsoleLogs_CL** table.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Log Analytics query page":::

Here's an example of a simple query, that displays log entries for the container app named *album-api*.  

```kusto
ContainerAppConsoleLogs_CL
| where ContainerName_s !startswith 'probe-shim' // filters out probe-shim-* containers which should not be showing
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s
| take 100
```

For more information regarding the Log Analytics interface and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Log Analytics via the Azure CLI and PowerShell

Application logs can be queried from the  [Azure CLI](/cli/azure/monitor/metrics) and [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).  

Example Azure CLI query to display the log entries for a container app:

```azurecli
az monitor log-analytics query --workspace --analytics-query "ContainerAppConsoleLogs_CL | where ContainerName_s !startswith 'probe-shim' | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Message, LogLevel_s | take 100" --out table
```

For more information, see [Viewing Logs](monitor.md#viewing-logs).

## Azure Monitor alerts

You can configure alerts to send notifications based on metrics values and Log Analytics queries.  Alerts can be added from the metrics explorer and the Log Analytics interface in the Azure portal. 

In the metrics explorer and the Log Analytics interface, alerts are based on existing charts and queries.  You can manage your alerts from the **Monitor>Alerts** page.  From this page, you can create metric and log alerts without existing metric charts or log queries.  To learn more about alerts, refer to [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

### Setting alerts in metrics explorer

Metric alerts monitor metric data at set intervals and trigger when an alert rule condition is met.  For more information, see [Metric alerts](../azure-monitor/alerts/alerts-metric-overview.md).

In metrics explorer, you can create metric alerts based on Container Apps metrics.  Once you create a metric chart, you're able to create alert rules based on the chart's settings. You can create an alert rule by selecting **New alert rule**.

:::image type="content" source="media/observability/metrics-alert-new-alert-rule.png" alt-text="Create a new metric alert.":::

When you create a new alert rule, the rule creation pane is opened to the **Condition** tab.  An alert condition is started for you based on the metric that you selected for the chart, that you can edit to configure threshold and other settings.

:::image type="content" source="media/observability/metrics-alert-create-condition.png" alt-text="Automatically created condition.":::

You can add more conditions to your alert rule by selecting the **Add condition** option in the **Create an alert rule** pane.

:::image type="content" source="media/observability/metrics-alert-add-condition.png" alt-text="Add a condition to your alert rule.":::

The **Select a signal** pane lists the Container Apps metrics where you select a metric to base the alert condition on.

:::image type="content" source="media/observability/metrics-alert-select-a-signal.png" alt-text="Select a metric.":::

After you've selected the metric, you can configure the settings for your alert condition.  For more information about configuring alerts, see [Manage metric alerts](../azure-monitor/alerts/alerts-metric.md).

For Container Apps, you can split alerts by revision and replica.  Enabling splitting will send individual alerts for each dimension you define.

Example of setting a dimension for a condition:

:::image type="content" source="media/observability/metrics-alert-split-by-dimension.png" alt-text="Select split by replica":::

Once you create the alert rule, it's a resource in your resource group.  To manage your alert rules, navigate to **Monitor>Alerts**. 

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Setting alerts using Log Analytics queries

You can use Log Analytics queries to periodically monitor logs and trigger alerts based on the results.  The Log Analytics interface allows you to add alert rules to your queries.  Once you have created and run a query, you're able to create an alert rule.

:::image type="content" source="media/observability/log-alert-new-alert-rule.png" alt-text="Select new alert rule.":::

Selecting **New alert rule** opens the **Create an alert rule** editor, where you can configure the setting for your alerts.

:::image type="content" source="media/observability/log-alerts-rule-editor.png" alt-text="Create an alert rule.":::

To learn more about creating a log alert, see [Manage log alerts](../azure-monitor/alerts/alerts-log.md)

Enabling splitting will send individual alerts for each dimension you define.  Container Apps supports the following alert splitting dimensions:

- app name
- revision
- container
- log message

:::image type="content" source="media/observability/log-alerts-splitting.png" alt-text="Configure alert splitting":::

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md).

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Health probes in Azure Container Apps](health-probes.md)
> [Monitor an App in Azure Container Apps](monitor.md)
