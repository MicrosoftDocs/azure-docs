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

Azure Container Apps provides built-in  observability features that give you a holistic view of the behavior, performance and health of your running container apps.

These features include: 

- Azure Monitor metrics
- Azure Monitor Log Analytics
- Alerts

>[!NOTE]
> While not a built-in feature, [Azure Monitor's Application Insights](../azure-monitor/app/app-insights-overview.md) is a powerful tool to monitor your web and background applications.
> Although Container Apps doesn't support the Application Insights auto-instrumentation agent, you can instrument your application code using Application Insights SDKs.  

## Azure Monitor Metrics

The Azure Monitor Metrics feature allows you to monitor your app's compute and network usage.  These metrics are available to view and analyze through the metrics explorer in the Azure portal.  Metric data is also available through the [Azure CLI](/cli/azure/monitor/metrics?view=azure-cli-latest), Azure PowerShell cmdlets, and custom applications.

### Available metrics

Container Apps provides the following metrics for your container app.

|Title  | Description | Metric ID |Unit  |
|---------|---------|---------|---------|
|CPU usage nanocores | CPU usage in nanocores | UsageNanoCores| nanocores |
|Memory working set byte |Working set memory used in bytes |WorkingSetBytes |bytes|
|Network in bytes|Network received bytes|RxBytes|bytes|
|Network out bytes|Network transmitted bytes|TxBytes|bytes|
|Requests|Requests processed|Requests|n/a|

The metrics namespace is microsoft.app/containerapps.

### View a snapshot of your app's metrics

Using the Azure portal, navigate to your container apps **Overview** page.  The **Monitoring** section displays the current CPU, memory and network utilization for your container app.

:::image type="content" source="media/observability/metrics-in-overview-page.png" alt-text="Monitoring section in container app overview":::

From this view, you can pin one or more charts to your dashboard.  When you select a chart, it's opened in the metrics explorer.

### View and analyze metric data with metrics explorer

The Azure Monitor metrics explorer is available from the Azure portal.  You can access it through the **Metrics** menu option in your container app page or the Azure **Monitor**->**Metrics** page.

The metric page allows you to create and view charts to display your container apps metrics.  Refer to [Getting started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md) to learn more.

When you first navigate to the metric explorer, you'll see the main page.  From here, you can select the information specific to Container Apps to display in your chart.  

:::image type="content" source=" media/observability/metrics-main-page.png":::

To filter by a replica, select a replica from the *Value* drop-down.   You can also filter by your container app's revision.

``
:::image type="content" source="media/observability/add-filter.png" alt-text="Add a filter to chart":::

To split by revision, select **Applying splitting** and select *Revision* as the value. You can also split by replica.

:::image type="content" source="media/observability/apply-splitting.png" alt-text="Apply spitting to chart.":::

You can view metrics across multiple container apps to view resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Create chart showing metrics over multiple container apps":::

## Azure Monitor Log Analytics

Application logs are accessed through Azure Monitor Log Analytics. Each Container Apps environment includes a Log Analytics workspace, which provides a common log space for each container app in the environment.  

Application logs, consisting of the logs written to `stdout` and `stderr` from each running container (replica), are collected and stored in the Log Analytics workspace.

Logs are viewed through Log Analytic queries via the Azure portal or using the Azure CLI.

### Log Analytics via the Azure portal

In the Azure portal, logs are available from either the **Monitor**->**Logs** page or by navigating to your container app and selecting the **Logs** menu item.  From Log Analytics interface, you can query the logs based on the **LogManagement**->**Usage** and **CustomLogs**->**ContainerAppConsoleLogs_CL** tables.

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Log Analytics query page":::

For more information regarding the Log Analytics interface and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Log Analytics via the Azure CLI and PowerShell

You can query Application logs from the Azure CLI and PowerShell cmdlets.  For more information, see [Viewing Logs](monitor.md#viewing-logs).

## Alerts

You can configure alerts to send notifications based on metrics and log criteria.  Alert definitions are made via the metrics explorer and the Log Analytics interface in the Azure portal.

### Setting alerts in metrics explorer

 You can define alert criteria based on any of the metrics tracked for Container Apps. 

:::image type="content" source="media/observability/create-alert-1.png" alt-text="Metrics selection for alerts":::

Alert criteria is applied to selected container app revisions and replicas.

:::image type="content" source="media/observability/create-alert-2.png" alt-text="Select replica for alert criteria":::

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Log alerts

Log alerts allow you to run Log Analytics queries at set intervals and trigger an alert based on the results.  Similar to alerts in metrics, you can configure alerts to perform actions based on a set of conditions that you define.  Alerts can be split by dimensions, such as, revision and replica.  

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md)

## Observability throughout the application lifecycle

Container Apps provides continuous monitoring across each phase of your development-to-production life cycle. This monitoring helps to ensure the health, performance, and reliability of your application as it moves from development to production.  Azure Monitor, the unified monitoring solution, provides full-stack observability across applications and infrastructure. 

### Development and Test

During the development and test phase, Log Analytics provides access to your applications log information.  All output from `stdout` and `stderr` is made available so you can examine the behavior of your application.

### Deployment and Runtime

You can monitor performance and resource utilization and set up notifications when important conditions occur in your container apps using:

- Metrics
- Alerts
- Log Analytics
- Other Azure Monitor features

### Updates and Revisions

Container Apps supports the monitoring of every active revision.  You can monitor and compare the behavior and performance across revisions through:

- Metrics
- Log Analytics 
