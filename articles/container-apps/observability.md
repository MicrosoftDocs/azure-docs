---
title: 'Observability'
description: Observability in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/25/2022
ms.author: v-bcatherine
---

# Observability in Container Apps

Observability features in Azure Container Apps provide a holistic view of the behavior and health of your container apps.  This information helps you understand how your applications are performing so you proactively identify and address issues. 

<!-- Diagram here  - I think we should save this for when we have everything inabled. -->

Container Apps offers the following features:
<!-- 
* Container details and state
* Streaming logs
* Console
-->
<!--
* Events
-->

* Metrics
* Alerts
* Log Analytics

## Observability features

There are many methods to observe running application.  Azure Monitor offers many features to view your log and metrics data. Two primary features are Metrics, that displays information automatically gathered information from your container app, and Log Analytics to display your your application log data.

With both Metrics and Log Analytics, you can set alerts to notify you when certain thresholds have been reached.

While Container Apps doesn't support Application Insights auto-instrumentation agent to monitor your application, you can instrument your application code using Application Insights SDKS.  For more information see [Application Insights overview](_../azure-monitor/app-insights-overview)

<!--  
### Container details and state

The details for each container app and individual containers are available via the Azure portal and the Azure CLI.  

> [!NOTE] 
> Add screen shot for portal. Add cli command and output

### Streaming Logs
-->
<!-- Screen shot of azure cli -->
<!-- Question:  can we get the same information from the CLI?  Are there APIs that could be used to programmatically gather this information? -->
<!--
## Console

You can connect to the console of a container that is part of your container app via bash or other shell providing they're installed in the container. Console access allows you to work in your container app to validate or diagnose your application. You can connect to the console of each running container revision and replica via the Azure portal.

> [!NOTE]
> Do we want all of the instructions here or do we want to just link to a separate doc?
> insert image of the portal page here
> Add instructions for connecting to and logging into the console.
> Insert CLI commands

-->
<!--
### Events

What events are available.  Is there a list?  Does the user have to enable them? 
-->

### Metrics

Metrics are collected by Azure Monitor and provide insight into the resources used by your container apps. This resource usage data helps you easily see the resources your container app is using such as CPU usage and network activity, and the number of requests it's handling. You can configure alerts so that you can quickly react if thresholds are exceeded. These metrics can be gathered using both and Azure portal and the Azure CLI.  For more information about how to use the metrics explorer, goto [Gettings started with Azure Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md)


<!--
> [!IMPORTANT]
> Azure Monitor metrics in Azure Container Apps are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).
-->

#### Available metrics

Azure Monitor provides the following metrics for your container app.  

* CPU usage nanocores
* Memory working set bytes
* Network in bytes
* Network out bytes
* Number of Requests


The information can be split by container app revisions and replica.  For more information regarding metrics

#### Overview page

The Metrics explorer can be accessed though the Azure portal from both the Metrics menu item on your container app page and via Azure Monitor.  

First navigate to your container app in the Azure portal.

On the **Overview** page, the **Monitoring** section displays the most recent metric information for your application.

:::image type="content" source="media/observability/overview-metrics.png" alt-text="Monitoring section in container app overview":::

From this view you can pin one or more charts to your dashboard, and select a chart to enlarge it. From the expanded view you can perform that same actions to the chart as you can from the Metrics page.


#### Metrics page

1. Select **Metrics** in the left side menu.
 
:::image type="content" source="media/observability/metrics-main-page.png" alt-text="Container Apps metrics main page":::


The Metric page allows you to select the metric, filter and split the information by revision and replica.    Visit [Getting started with Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) to learn more.

:::image type="content" source="media/observability/add-filter.png" alt-text="Add a filter to chart":::

:::image type="content" source="media/observability/apply-splitting.png" alt-text="Apply spitting to chart.":::

You can view metrics across multiple container apps to get a holistic view of the resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Create chart showing metrics over multiple container apps":::

### Setting alerts in Metrics Explorer

You can setup alerts to send notifications via Email, SMS, push or voice messages.  You can define alert criteria based on any of the metrics tracked for Container Apps.

:::image type="content" source="media/observability/create-alert-1.png" alt-text="Metrics selection for alerts":::

You can apply alert criteria to specific revisions and replicas.

:::image type="content" source="media/observability/create-alert-2.png" alt-text="Select replica for alert criteria":::

 To learn more about configuring alerts visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Log Analytics

Each Container Apps environment must include a Log Analytics workspace with provides a common log space for each container app in the environment.  When you create your Container Apps environment a Log Analytics workspace is automatically created by default.  All Container Apps included in a single environment share the same workspace.

The output to stdout and stderr from each running container (replica) is captured.  You can view the log output from the container app page in the portal or query the logs from the Azure CLI.

#### Log Analytics via the Azure Portal

Using the Azure portal, logs can be viewed from either the **Monitor**->**Logs** page or by navigating to your container app and selecting the **Logs** page.  Some there you can query the logs based on **LogManagement**->**Usage** or **CustomLogs**->**ContainerAppConsoleLogs_CL**

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Log Analytics query page":::

For more information regarding the Log Analytics interface and running log queries see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md)


#### Log Analytics via the Azure CLI

You can also view the logs by submitting a query to the Log Analytics workspace via the Azure CLI.  For more information see [Viewing Logs](monitor.md#viewing-logs)

#### Setting Log Analytics alerts



## Observability throughout the application lifecycle

Container Apps provides continuous monitoring across each phase of your development-to-production life cycle.  This help to continuously ensure the health, performance, and reliability  of your application and infrastructure as it moves from development to production.  Azure Monitor, the unified monitoring solution, provides full-stack observability across applications and infrastructure. 

### Development and Test

During development and test these observability features are key to building your container apps.

<!--
* Log streaming
* Console -->
* Log Analytics

### Deployment and Runtime

You can monitor the performance and resource utilization and  set up notifications when important events occur in your container apps using:

* Metrics
* Alerts
<!-- * Log Analytics -->
<!-- * Events -->
* Other Azure Monitor features

### Updates and Revisions

Container Apps supports the monitoring of every active revision.  You can monitor and compare the behavior and performance across revisions through:

<!-- * Log streaming
* Console access -->
* Metrics
* Log Analytics 
