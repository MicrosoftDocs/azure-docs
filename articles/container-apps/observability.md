# Observability in Azure Container Apps Preview

Azure Container Apps provides several built-in observability features that give you a holistic view of your container app’s health throughout of the application lifecycle.  


With these features, you can monitor and analyze aggregated log and metric data streams and craft alerts for critical conditions. You have visibility over the entire app down to a single container. This visibility helps you identify and debug issues and proactively adjust for changing application usage and compute requirements. 

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

While developing an app, you often want to see your application logs in real-time.  Container Apps lets you view a stream of your container's `stdout` and `stderr` log messages.  You can view log streams in the Azure portal or the Azure CLI.

### View log streams from the Azure portal

View container logs from your container app page in the Azure portal. Go to the **Log stream** page from the **Monitoring** group in the menu on the left.  

Select the container whose log you want to view. When there are multiple revisions and replicas, select the revision, replica, and then the container from the drop-down lists.   

Select **Start** to begin streaming the logs. You can also pause and stop the log stream and clear the log messages from the page. To save the displayed log messages, you can copy and paste them into the editor of your choice.


***Insert screenshot here***

### Tail log streams from Azure CLI

Tail a container's application logs from the Azure CLI with the ***need the command*** command.

***There may need to be some instructions to get the revision, replica, and container name if the command requires those parameters.***

```azurecli

```

## Container console

Connecting to a container's console is useful when you want to see what's happening inside a container.  If your app isn't behaving as expected, you can access a container's console to run commands to troubleshoot issues.

Azure Container Apps lets you access the consoles of your deployed containers through the Azure portal or the Azure CLI.

### Access container console via the Azure portal

You can access your container console from **Console** in the **Monitoring** group of your container app's page in the Azure portal. To connect to a container, select the replica and container from the pull-down lists. When your app is in the *multiple revision mode*, the **Revision** pull-down list is shown so that you can select a revision. 

You can choose to access your console via bash, sh or another application.


***IMAGE GOES HERE***

### Access container console via the Azure CLI

You can connect to a container console through the Azure CLI.  

***Need command information, and how to terminate the console session.***

TO disconnect from the console, **NEED KEY COMBO OR COMMAND**


## Azure Monitor metrics

The Azure Monitor metrics feature lets you monitor your app's compute and network usage.  These metrics are available to view and analyze through the [metrics explorer in the Azure portal](../azure-monitor/essentials/metrics-getting-started.md).  Metric data is also available through the [Azure CLI](/cli/azure/monitor/metrics), and Azure [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).

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

### View and analyze metric data with metrics explorer

The Azure Monitor metrics explorer is available from the Azure portal through the **Metrics** menu option on your container app page or the Azure **Monitor>Metrics** page.

The metrics page allows you to create and view charts to display your container app's metrics over time.  Refer to [Getting started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md) to learn more.

When you first navigate to the metrics explorer, you'll see the main page.  From here, select the metric that you want to display.  You can add more metrics to the chart by selecting **Add Metric** in the upper left.

:::image type="content" source="media/observability/metrics-main-page.png" alt-text="Screenshot of the metrics explorer from the container app resource page.":::

You can filter your metrics by revision or replica.  For example, to filter by a replica, select **Add filter**, then select a replica from the *Value* drop-down.   You can also filter by your container app's revision.

:::image type="content" source="media/observability/metrics-add-filter.png" alt-text="Screenshot of the metrics explorer showing the chart filter options.":::

You can split the information in your chart by revision or replica. For example, to split by revision, select **Apply splitting** and select **Revision** as the value. Splitting is only available when the chart contains a single metric.

:::image type="content" source="media/observability/metrics-apply-splitting.png" alt-text="Screenshot of the metrics explorer that shows a chart with metrics split by revision.":::

You can view metrics across multiple container apps to view resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Screenshot of the metrics explorer that shows a chart with metrics for multiple container apps.":::

## Azure Monitor Log Analytics

Application logs are available through Azure Monitor Log Analytics. Each Container Apps environment includes a Log Analytics workspace, which provides a common log space for all containers running in the environment.  

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
|Message    |string| log message|
|RevisionName_s|string|revision name|

You can run log Analytic queries via the Azure portal, the Azure CLI, or PowerShell.  

### Query logs via the Azure portal

In the Azure portal, logs are available from either the **Monitor>Logs** page or by navigating to your container app and selecting the **Logs** menu item.  You can query the logs from the Log Analytics interface using the items in the **CustomLogs>ContainerAppConsoleLogs_CL** table.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Screenshot of the Log Analytics query editor.":::

Below is an example of a simple query that displays log entries for the container app named *album-api*. 

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == 'album-api'
| project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Message
| take 100
```

For more information regarding the Log Analytics interface and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Query logs via the Azure CLI and PowerShell

Application logs can be queried from the  [Azure CLI](/cli/azure/monitor/metrics) and [PowerShell cmdlets](/powershell/module/az.monitor/get-azmetric).  

Example Azure CLI query to display the log entries for a container app:

```azurecli
az monitor log-analytics query --workspace --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'album-api' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Message, LogLevel_s | take 100" --out table
```

For more information about viewing logs, see [Viewing Logs](monitor.md#viewing-logs).

## Azure Monitor alerts

You can configure alerts to send notifications based on metrics values and Log Analytics queries.  You can add alerts from the metrics explorer and the Log Analytics interface in the Azure portal.

Alerts are based on existing charts and queries in the metrics explorer and the Log Analytics interface.  You can manage your alerts from the **Monitor>Alerts** page.  You can create metric and log alerts from this page without existing metric charts or log queries.  To learn more about alerts, refer to [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

### Set alerts in the metrics explorer

With the metrics explorer, you define metric alerts that are triggered when metric data collected over set intervals meet alert rule conditions.  For more information, see [Metric alerts](../azure-monitor/alerts/alerts-metric-overview.md).

After you create a metric chart, you can create alert rules based on the chart's settings. You can create an alert rule by selecting **New alert rule**.

:::image type="content" source="media/observability/metrics-alert-new-alert-rule.png" alt-text="Screenshot of the metrics explorer highlighting the new rule button.":::

When you select **New alert rule**, the rule creation pane is opened to the **Condition** tab.  An alert condition is started for you containing the metrics you selected for the chart.  Edit the condition to configure threshold criteria and other settings.

:::image type="content" source="media/observability/metrics-alert-create-condition.png" alt-text="Screenshot of the metric explorer alert rule editor.  A condition is automatically created based on the chart settings.":::

Add more conditions to your alert rule by selecting the **Add condition** option in the **Create an alert rule** pane.

:::image type="content" source="media/observability/metrics-alert-add-condition.png" alt-text="Screenshot of the metric explorer alert rule editor highlighting the Add condition button.":::

When you add a new alert condition, you can select from the metrics listed in the  **Select a signal** pane.

:::image type="content" source="media/observability/metrics-alert-select-a-signal.png" alt-text="Screenshot of the metric explorer alert rule editor showing the Select a signal pane.":::

After selecting the metric, you can configure the settings for your alert condition.  For more information about configuring alerts, see [Manage metric alerts](../azure-monitor/alerts/alerts-metric.md).

To receive individual alerts for specific revisions or replicas, you can add alert splitting to the condition. 

Example of setting a dimension for a condition:

:::image type="content" source="media/observability/metrics-alert-split-by-dimension.png" alt-text="Screenshot of the metrics explorer alert rule editor.  This example shows the Split by dimensions options in the Configure signal logic pane.":::

Once you create the alert rule, it's added to your resource group.  To manage your alert rules, navigate to **Monitor>Alerts**. 

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Set alerts using Log Analytics queries

You can create log alerts that periodically run Log Analytics queries to monitor your app and trigger alerts based on alert rule conditions.  You can add alert rules to your queries from the Log Analytics interface.  Once you have created and run a query, the **New alert rule** button is enabled.

:::image type="content" source="media/observability/log-alert-new-alert-rule.png" alt-text="Screenshot of the Log Analytics interface highlighting the new alert rule button.":::

Selecting **New alert rule** opens the **Create an alert rule** editor, where you can configure the setting for your alerts.

:::image type="content" source="media/observability/log-alerts-rule-editor.png" alt-text="Screenshot of the Log Analytics alert rule editor.":::

To learn more about creating a log alert, see [Manage log alerts](../azure-monitor/alerts/alerts-log.md)

Enabling splitting will send individual alerts for each dimension you define.  Container Apps supports the following alert splitting dimensions:

- app name
- revision
- container
- log message

:::image type="content" source="media/observability/log-alerts-splitting.png" alt-text="Screenshot of the Log Analytics alert rule editor showing the Split by dimensions options":::

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md).

## Observability throughout the application lifecycle

You can monitor your app throughout the development-to-production lifecycle with Container Apps. The following sections describe the most useful monitoring features for each phase. 

### Development and test phase

Real-time access to your containers' application log and console is essential during the development and test phase.  Container Apps provides: 

- [log streaming](#streaming-logs) for real-time monitoring.
- [container console](#container-console) access to debug your application.

### Deployment phase

Once you deploy your container app, it's essential to monitor your app. Continuous monitoring helps you quickly identify problems that may occur around error rates, performance, or metrics.

Azure Monitor features give you the ability to track your app once it's deployed with the following features:

- [Azure Monitor Metrics](#azure-monitor-metrics): monitor and analyze key metrics
- [Azure Monitor Alerts](#azure-monitor-alerts): sends you notifications of critical conditions
- [Azure Monitor Log Analytics](#azure-monitor-log-analytics): view and analyze application logs

### Maintenance phase

Container Apps manages updates to your container apps by creating [revisions](revisions.md).  You can run concurrent revisions to test and compare the behavior and performance of different versions of your app.   These observability features are most valuable when monitoring revisions:

- [Azure Monitor Metrics](#azure-monitor-metrics): Monitor and analyze metrics across many revisions
- [Azure Monitor Log Analytics](#azure-monitor-log-analytics): set up queries to view and analyze log data across revisions
- [Azure Monitor Alerts](#azure-monitor-alerts): sends you notifications of critical conditions across multiple revisions

