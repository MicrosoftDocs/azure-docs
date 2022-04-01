---
title: 'Observability in Azure Container Apps Preview'
description: Observability in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: v-bcatherine
---

# Observability in Azure Container Apps Preview

Azure Container Apps provides built-in  observability features to give you a holistic view of the behavior, performance and health of your running container apps.

These feature include: 

- Azure Monitor Metrics
- Azure Monitor Log Analytics
- Alerts

>[!NOTE]
> While not a built-in feature, [Azure Monitor's Application Insights](../azure-monitor/app-insights-overview.md) is a powerful tool to monitor your web and background applications.
> Container Apps doesn't support the Application Insights auto-instrumentation agent however, you can instrument your application code using Application Insights SDKs.  


## Azure Monitor Metrics

The Azure Monitor Metrics feature allows you to monitor your app's compute and network usage.  These metrics can be viewed and analyzed through the Metrics Explorer in the Azure portal.  Metric data can be retrieved through the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/monitor/metrics?view=azure-cli-latest), Azure PowerShell cmdlets and custom applications.

> [!IMPORTANT]
> Azure Monitor metrics in Azure Container Apps are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).


### Available metrics

Container Apps provides these metrics for your container app.  

* CPU usage nanocores
  * CPU usage in nanocores
  * Metric ID: UsageNanoCores
  * Namespace: microsoft.app/containerapps
  * Unit: nanocores
* Memory working set byte
  * Working set memory used in bytes
  * Metric ID: WorkingSetBytes
  * Namespace: microsoft.app/containerapps
  * Unit: bytes
* Network in bytes
  * Network received bytes
  * Metric ID: RxBytes
  * Namespace: microsoft.app/containerapps
  * Unit: bytes
* Network out bytes
  * Network transmitted bytes
  * Metric ID: TxBytes
  * Namespace: microsoft.app/containerapps
  * Unit: bytes
* Requests
  * Requests processed
  * Metric ID: Requests
  * Namespace: microsoft.app/containerapps

### Container app overview page

In the **Overview** page for your container app, the **Monitoring** section displays the CPU, memory and network utilization.

:::image type="content" source="media/observability/metrics-in-overview-page.png" alt-text="Monitoring section in container app overview":::

From this view, you can pin one or more charts to your dashboard.  When you select a chart, it is opened in Metrics Explorer.

### Metrics explorer

The Metrics explorer can be accessed from the *Metrics* menu option in your container app page or Azure Monitor.

The Metric page allows you to select create charts by selecting  Container Apps metrics, filtering based on revisions and replicas and apply splitting by revisions or replicas.    Visit [Getting started with Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) to learn more.


:::image type="content" source="media/observability/metrics-main-page-cropped.png" alt-text="Container Apps metrics main page." lightbox="media/observability/metrics-main-page.png":::



Filtering by replica:
:::image type="content" source="media/observability/add-filter.png" alt-text="Add a filter to chart":::

Splitting by Replica:

:::image type="content" source="media/observability/apply-splitting.png" alt-text="Apply spitting to chart.":::

You can view metrics across multiple container apps to view resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Create chart showing metrics over multiple container apps":::

## Azure Monitor Log Analytics

Application Logs are accessed through Azure Monitor Log Analytics. Each Container Apps environment includes a Log Analytics workspace which provides a common log space for each container app in the environment.  

Application logs, consisting of the stdout and stderr from each running container (replica), are collected and stored in the Log Analytics workspace.

The data entries are accessed through Log Analytic queries via the Azure portal or using the Azure CLI.

### Log Analytics via the Azure portal

In the Azure portal, logs can be viewed from either the **Monitor**->**Logs** page or by navigating to your container app and selecting the **Logs** page.  Some there you can query the logs based on **LogManagement**->**Usage** or **CustomLogs**->**ContainerAppConsoleLogs_CL**

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Log Analytics query page":::

For more information regarding the Log Analytics interface and log queries, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md)

### Log Analytics via the Azure CLI and PowerShell

Application logs can be queried from the Azure CLI and PowerShell cmdlets.  For more information, see [Viewing Logs](monitor.md#viewing-logs).

## Alerts

Alerts can be configured to send notifications based on metrics and log criteria.  Both Metrics explorer and Log Analytics provide the ability to create alerts.

### Setting alerts in Metrics Explorer

 You can define alert criteria based on any of the metrics tracked for Container Apps. 

:::image type="content" source="media/observability/create-alert-1.png" alt-text="Metrics selection for alerts":::

Alert criteria can be applied to selected container app revisions and replicas.

:::image type="content" source="media/observability/create-alert-2.png" alt-text="Select replica for alert criteria":::

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Log alerts

Log alerts allow you to run Log Analytics queries at set intervals and trigger an alert based on the results.  Similar to alerts in Metrics, you can set alerts to perform actions based on a set of conditions that you define.

Alerts can be split by dimensions, such as, revision and replica.  

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md)

## Observability throughout the application lifecycle

Container Apps provides continuous monitoring across each phase of your development-to-production life cycle. This monitoring helps to continuously ensure the health, performance, and reliability  of your application as it moves from development to production.  Azure Monitor, the unified monitoring solution, provides full-stack observability across applications and infrastructure. 

### Development and Test

During the development and test phase, Log Analytics provides access to your applications log information.  All output from stdout and stderr is made available so you can examine the behavior of your application.

### Deployment and Runtime

You can monitor performance and resource utilization and set up notifications when important conditions occur in your container apps using:

* Metrics
* Alerts
* Log Analytics
* Other Azure Monitor features

### Updates and Revisions

Container Apps supports the monitoring of every active revision.  You can monitor and compare the behavior and performance across revisions through:

* Metrics
* Log Analytics 
