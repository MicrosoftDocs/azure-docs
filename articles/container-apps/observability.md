---
title: Observability in Azure Container Apps Preview
description: Monitor your running app in Azure Container Apps Preview
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/01/2022
ms.author: v-bcatherine
---

# Observability in Azure Container Apps Preview

Azure Container Apps provides several built-in observability features that give you a holistic view of your container app’s health throughout its application lifecycle.  These features help you monitor and analyze the state of your app to improve performance and respond to critical problems.

These features include:

- Log streaming
- Container console
- Azure Monitor metrics
- Azure Monitor Log Analytics
- Azure Monitor alerts

>[!NOTE]
> While not a built-in feature, [Azure Monitor's Application Insights](../azure-monitor/app/app-insights-overview.md) is a powerful tool to monitor your web and background applications.
> Although Container Apps doesn't support the Application Insights auto-instrumentation agent, you can instrument your application code using Application Insights SDKs.  

## Log streaming

While developing and troubleshooting an app, you often want to see your application logs in real-time.  Container Apps lets you view a stream of your container's `stdout` and `stderr` log messages.  

<!--
You can view log streams in the Azure portal or the Azure CLI.
-->
### View log streams from the Azure portal

Go you your container app page in the Azure portal.   Select **Log stream** under the **Monitoring** section of the sidebar menu.  Select a container from the drop-down lists. When there are multiple revisions and replicas, select the **Revision**, **Replica**, and then **Container**.

Select **Start** to begin the log streaming the logs. You can also pause and stop the log stream and clear the log messages from the page. To save the displayed log messages, you can copy and paste them into the editor of your choice.

:::image type="content" source="media/observability/log-stream.png" alt-text="Screenshot of Azure Container Apps Log stream page.":::

<!-- Add this in after the CLI is completed

### Tail log streams from Azure CLI

Tail a container's application logs from the Azure CLI with the ***need the command*** command.

***There may need to be some instructions to get the revision, replica, and container name if the command requires those parameters.***

```azurecli

```
-->

## Container console

Connecting to a container's console is useful when you want to see what's happening inside a container.  If your app isn't behaving as expected, you can access a container's console to run commands to troubleshoot issues.

<!-- Add this back in when the CLI is complete.

Azure Container Apps lets you access the consoles of your deployed containers through the Azure portal or the Azure CLI.
-->

### Connect to a container console via the Azure portal

You can access your container console by selecting the console **Console** menu item in the **Monitoring** group on your container app's page in the Azure portal. To connect to a container, select it from the drop-down list. When there are multiple revisions and replicas, first select **Revision**, **Replica**, and then **Container**.

You can choose to access your console via bash, sh, or a custom application.

:::image type="content" source="media/observability/console-ss.png" alt-text="Screenshot of Azure Container Apps Console page.":::

<!-- Add this back in when the CLI is complete

### Access container console via the Azure CLI

You can connect to a container console through the Azure CLI.  

***Need command information and how to terminate the console session.***

TO disconnect from the console, **NEED KEY COMBO OR COMMAND**
 -->

## Azure Monitor metrics

Azure Monitor collects metric data from your container app at regular intervals. These metrics help you gain insights into the performance and health of your container app. You can use metrics explorer in the Azure portal to monitor and analyze the metric data. You can also retrieve metric data through the [Azure CLI](/cli/azure/monitor/metrics) and Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).

### Available metrics for Container Apps

Container Apps track these metrics.

|Title  | Description | Metric ID |Unit  |
|---------|---------|---------|---------|
|CPU usage nanocores | CPU usage in nanocores (1,000,000,000 nanocores = 1 core) | UsageNanoCores| nanocores|
|Memory working set bytes |Working set memory used in bytes |WorkingSetBytes |bytes|
|Network in bytes|Network received bytes|RxBytes|bytes|
|Network out bytes|Network transmitted bytes|TxBytes|bytes|
|Requests|Requests processed|Requests|n/a|

The metrics namespace is `microsoft.app/containerapps`.

### View a current snapshot of your app's metrics

On your container app **Overview** page, in the Azure portal, the **Monitoring** section charts the current CPU, memory, and network utilization for your container app.

:::image type="content" source="media/observability/metrics-in-overview-page.png" alt-text="Screenshot of the Monitoring section in the container app overview page.":::

From this view, you can pin one or more charts to your dashboard or select a chart to open it in the metrics explorer.

### View and analyze metrics with metrics explorer

The Azure Monitor metrics explorer lets you create charts from metric values to help you analyze your container app's resource and network usage over time. Charts can be pinned to a dashboard or shared in a workbook.d

Open the metrics explorer in the Azure portal by selecting **Metrics** from the sidebar menu on your container app page.  To learn more about metrics explorer, go to [Getting started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md).

To create a chart, select a metric. You'll see the metric displayed in the chart. You can then add more metrics, change time ranges and intervals, add filters and apply splitting to the chart.

:::image type="content" source="media/observability/metrics-main-page.png" alt-text="Screenshot of the metrics explorer from the container app resource page.":::

You can filter your metrics by revision or replica.  For example, select **Add filter**, then select a replica from the **Value** drop-down to filter by a replica. 

:::image type="content" source="media/observability/metrics-add-filter.png" alt-text="Screenshot of the metrics explorer showing the chart filter options.":::

You can split the information in your chart by revision or replica. For example, select **Apply splitting** and select **Revision** from the **Values** drop-down list to split by revision. Splitting is only available when the chart contains a single metric.

:::image type="content" source="media/observability/metrics-apply-splitting.png" alt-text="Screenshot of the metrics explorer that shows a chart with metrics split by revision.":::

You can view metrics across multiple container apps to view resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Screenshot of the metrics explorer that shows a chart with metrics for multiple container apps.":::

## Azure Monitor Log Analytics

Azure Monitor collects application logs and stores them in a Log Analytics workspace.  Each Container Apps environment includes a Log Analytics workspace that provides a common repository to store the application log data from all containers running in the environment.  

Application logs consist of messages written to each container's `stdout` and `stderr`.  Additionally, if your container app is using Dapr, log entries from the Dapr sidecar are also collected.  

Log Analytics is a tool to view and analyze log data.  Using Log Analytics, you can create log queries to pull log data from the workspace data repository.  You can write simple or advanced queries and then sort, filter and visualize the results in charts to spot trends.  You can work interactively with the query results or use them with other features such as alerts, dashboards, and workbooks.

Log Analytics workspaces store log tables organized in separate columns.  Azure Monitor stores Container Apps log entries in the ContainerAppConsoleLogs_CL table in the CustomLogs group.

The most used columns in ContainerAppConsoleLogs_CL:

|Column  |Description |
|---------|---------|
|ContainerAppName_s | container app name |
|ContainerGroupName_g|replica name|
|ContainerId|container identifier|
|ContainerImage_s | container image name |
|EnvironmentName_s|Container Apps environment name|
|Message    | log message|
|RevisionName_s|revision name|

Log Analytics is available through the Azure portal.  You can also run log queries using Azure CLI or PowerShell commands from the command line.

### Use Log Analytics to query logs

Start Log Analytics from **Logs** in the sidebar menu on your container app page.  You can also start from **Monitor>Logs**, where you have access to the records from all your resources.  

You can query the logs from the Log Analytics interface using the column listed in the **CustomLogs>ContainerAppConsoleLogs_CL** table on the table tab in the sidebar.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Screenshot of the Log Analytics query editor.":::

Below is a simple query that displays log entries for the container app named *album-api*. 

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Message
| take 100
```

For more information regarding the Log Analytics interface and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Query logs via the Azure CLI and PowerShell

Application logs can be queried from the  [Azure CLI](/cli/azure/monitor/metrics) and [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).  

Here's an example Azure CLI query to display the log entries for a container app:

```azurecli
az monitor log-analytics query --workspace --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Message, LogLevel_s | take 100" --out table
```

For more information about viewing logs, see [Viewing Logs](monitor.md#viewing-logs).

## Azure Monitor alerts

Alerts allow you to respond quickly to critical issues.  You can set up alert thresholds based on metric and log data.  You can add alert rules to metric charts and log queries using the metrics explorer and the Log Analytics interface.

You can manage your alerts from the **Monitor>Alerts** page. You can create metrics and log alerts from this page without existing metric charts or log queries. 

To learn more about alerts, refer to [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

### Create alerts in the metrics explorer

You can add alert rules to your metric charts in the metrics explorer.  Metric alerts are triggered when metric data collected over set intervals meet alert rule conditions.  For more information, see [Metric alerts](../azure-monitor/alerts/alerts-metric-overview.md).

After creating a [metric chart](#view-and-analyze-metric-data-with-metrics-explorer), you can create alert rules based on the chart's settings by selecting **New alert rule**.

:::image type="content" source="media/observability/metrics-alert-new-alert-rule.png" alt-text="Screenshot of the metrics explorer highlighting the new rule button.":::

When you select **New alert rule**, the rule creation pane opens to the **Condition** tab.  You'll see an alert condition that contains the chart’s metrics.  To complete the condition, open the condition and add the threshold criteria.

:::image type="content" source="media/observability/metrics-alert-create-condition.png" alt-text="Screenshot of the metric explorer alert rule editor.  A condition is automatically created based on the chart settings.":::

Add more conditions to your alert rule by selecting the **Add condition** option in the **Create an alert rule** pane.

:::image type="content" source="media/observability/metrics-alert-add-condition.png" alt-text="Screenshot of the metric explorer alert rule editor highlighting the Add condition button.":::

When adding a new alert condition, select from the metrics listed in the **Select a signal** pane.

:::image type="content" source="media/observability/metrics-alert-select-a-signal.png" alt-text="Screenshot of the metric explorer alert rule editor showing the Select a signal pane.":::

After selecting the metric, you can configure the settings for your alert condition.  For more information about configuring alerts, see [Manage metric alerts](../azure-monitor/alerts/alerts-metric.md).

You can receive individual alerts for specific revisions or replicas by enabling alert splitting and selecting the **Revision** or **Replica** **Dimension name**.

Example of selecting a dimension to split an alert.

:::image type="content" source="media/observability/metrics-alert-split-by-dimension.png" alt-text="Screenshot of the metrics explorer alert rule editor.  This example shows the Split by dimensions options in the Configure signal logic pane.":::

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Create alerts using Log Analytics queries

You can create log alerts that periodically run Log Analytics queries to monitor your app and trigger alerts based on alert rule conditions.  You can add alert rules to your queries from the Log Analytics interface.  Once you have created and run a query, the **New alert rule** button is enabled.

:::image type="content" source="media/observability/log-alert-new-alert-rule.png" alt-text="Screenshot of the Log Analytics interface highlighting the new alert rule button.":::

Selecting **New alert rule** opens the **Create an alert rule** editor, where you can configure the settings for your alert.

:::image type="content" source="media/observability/log-alerts-rule-editor.png" alt-text="Screenshot of the Log Analytics alert rule editor.":::

To learn more about creating a log alert, see [Manage log alerts](../azure-monitor/alerts/alerts-log.md)

Enabling splitting will send individual alerts for each dimension you define.  Container Apps allows the following alert splitting dimensions:

- app name
- revision
- container
- log message

:::image type="content" source="media/observability/log-alerts-splitting.png" alt-text="Screenshot of the Log Analytics alert rule editor showing the Split by dimensions options":::

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md).

## Observability throughout the application lifecycle

With the Container Apps observability features, you can monitor your app throughout the development-to-production lifecycle. The following sections describe the most useful monitoring features for each phase. 

### Development and test phase

During the development and test phase, real-time access to your containers' application logs and console is critical for debugging issues.  Container Apps provides: 

- [log streaming](#log-streaming) for real-time monitoring.
- [container console](#container-console) access to debug your application.

### Deployment phase

Once you deploy your container app, it's essential to monitor your app. Continuous monitoring helps you quickly identify problems that may occur around error rates, performance, or metrics.

Azure Monitor features give you the ability to track your app with the following features:

- [Azure Monitor Metrics](#azure-monitor-metrics): monitor and analyze key metrics
- [Azure Monitor Alerts](#azure-monitor-alerts): send alerts for critical conditions
- [Azure Monitor Log Analytics](#azure-monitor-log-analytics): view and analyze application logs

### Maintenance phase

Container Apps manages updates to your container apps by creating [revisions](revisions.md).  You can concurrently run multiple revisions to perform A/B testing or monitor blue green deployments.  These observability features will help you monitor your app across revisions:

- [Azure Monitor Metrics](#azure-monitor-metrics): monitor and analyze key metrics
- [Azure Monitor Alerts](#azure-monitor-alerts): send alerts for critical conditions
- [Azure Monitor Log Analytics](#azure-monitor-log-analytics): view and analyze application logs

## Next steps

> [!div class="nextstepaction"]
> [Monitor an app in Azure Container Apps Preview](monitor.md)
> [Health probes in Azure Container Apps](health-probes.md)
