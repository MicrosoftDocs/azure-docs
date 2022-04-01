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

# Observability in Azure Container Apps

Observability features in Azure Container Apps provide a holistic view of the behavior and health of your running container apps. This article describes the built-in features available to monitor and analyze your container app.


<!-- Diagram here  - I think we should save this for when we have everything enabled. -->

Container Apps offers the following observability features:
<!-- 
* Container details and state
* Streaming logs
* Console
-->
<!--
* Events
-->

* Metrics
* Log Analytics
* Alerts

## Observability features

Azure Monitor automatically collects and stores metric and log data. You can view and analyze using Metrics Explorer and Log Analytics.  With these tools you can see how your container app is performing and set alerts to proactively notify you when important conditions occur.

>[!NOTE]
>While, this article focuses on built-in observability features, Azure Monitor's Application Insights is a powerful tool to monitor your web and background applications. Container Apps doesn't support Application Insights auto-instrumentation agent however, you can instrument your application code using Application Insights SDKs to take advantage of this feature.  For more information, see [Application Insights overview](../azure-monitor/app-insights-overview.md).

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

### Azure Monitor Metrics

Metric data is collected by Azure Monitor.  The Azure Monitor Metrics feature helps you monitor and analyze the resources your container app is using, such as, CPU usage, network activity, and the requests it's handling. 

These metrics can be viewed and analyzed through the Metrics Explorer in the Azure portal and retrieved through the Azure CLI, Azure PowerShell cmdlets or a custom application. For more information about how to use the metrics explorer, goto [Getting started with Azure Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md).  For more information about Azure CLI usage, see [az monitor metrics](https://docs.microsoft.com/en-us/cli/azure/monitor/metrics?view=azure-cli-latest).

> [!IMPORTANT]
> Azure Monitor metrics in Azure Container Apps are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).


#### Available metrics

Container Apps provides the following metrics for your container app.  

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

#### Container app overview page

On the **Overview** page for your container app, the **Monitoring** section displays the most recent metric information for your application.  The metrics include CPU, memory and network utilization.

:::image type="content" source="media/observability/overview-metrics.png" alt-text="Monitoring section in container app overview":::

From this view you can pin one or more charts to your dashboard.  You can, also, select a chart to enter the Metrics Explorer.

#### Metrics explorer

The Metrics explorer can be accessed from the *Metrics* menu option in the Container App page for your container app or Azure Monitor.
 
:::image type="content" source="media/observability/metrics-page.png" alt-text="Container Apps metrics main page":::

The Metric page allows you to select the metric, filter and split the information by revision and replica.    Visit [Getting started with Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) to learn more.

:::image type="content" source="media/observability/add-filter.png" alt-text="Add a filter to chart":::

:::image type="content" source="media/observability/apply-splitting.png" alt-text="Apply spitting to chart.":::

You can view metrics across multiple container apps to get a holistic view of the resource utilization over your entire application.

:::image type="content" source="media/observability/metrics-across-apps.png" alt-text="Create chart showing metrics over multiple container apps":::

### Log Analytics

Each Container Apps environment must include a Log Analytics workspace with provides a common log space for each container app in the environment.  When you create your Container Apps environment a Log Analytics workspace is automatically created by default.  All Container Apps included in a single environment share the same workspace.

The output to stdout and stderr from each running container (replica) is captured.  You can view the log output from the container app page in the portal or query the logs from the Azure CLI.

#### Log Analytics via the Azure Portal

Using the Azure portal, logs can be viewed from either the **Monitor**->**Logs** page or by navigating to your container app and selecting the **Logs** page.  Some there you can query the logs based on **LogManagement**->**Usage** or **CustomLogs**->**ContainerAppConsoleLogs_CL**

:::image type="content" source="media/observability/log-analytics-query-page.png" alt-text="Log Analytics query page":::

For more information regarding the Log Analytics interface and running log queries see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md)

#### Log Analytics via the Azure CLI

You can also view the logs by submitting a query to the Log Analytics workspace via the Azure CLI.  For more information see [Viewing Logs](monitor.md#viewing-logs)

### Alerts

You can set alerts to send you notifications based on metrics or log conditions.  

### Setting alerts in Metrics Explorer

You can setup alerts to send notifications via Email, SMS, push or voice messages.  You can define alert criteria based on any of the metrics tracked for Container Apps.

:::image type="content" source="media/observability/create-alert-1.png" alt-text="Metrics selection for alerts":::

You can apply alert criteria to specific revisions and replicas.

:::image type="content" source="media/observability/create-alert-2.png" alt-text="Select replica for alert criteria":::

 To learn more about configuring alerts visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

#### Log alerts

Log alerts allow you to run Log Analytics queries at set intervals and trigger an alert based on the results.  Similar to alerts in Metrics, you can set alerts to perform actions based on a set of conditions that you define.

Alerts can be split by dimensions, such as, revision and replica.  

To learn more about log alerts, refer to [Log alerts in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md)

## Observability throughout the application lifecycle

Container Apps provides continuous monitoring across each phase of your development-to-production life cycle. This helps to continuously ensure the health, performance, and reliability  of your application and infrastructure as it moves from development to production.  Azure Monitor, the unified monitoring solution, provides full-stack observability across applications and infrastructure. 

### Development and Test

During the development and test phase, Log Analytics provides access to your applications log information.  All output from stdout and stderr are captured so you can examine the behavior of your application.

<!-->
During development and test these observability features are key to building your container apps.

* Log streaming
* Console -->
* Log Analytics

### Deployment and Runtime

You can monitor performance and resource utilization and set up notifications when important conditions occur in your container apps using:

* Metrics
* Alerts
* Log Analytics
<!-- * Events -->
* Other Azure Monitor features

### Updates and Revisions

Container Apps supports the monitoring of every active revision.  You can monitor and compare the behavior and performance across revisions through:

<!-- * Log streaming
* Console access -->
* Metrics
* Log Analytics 
