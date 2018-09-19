---
title: Overview of metrics in Microsoft Azure
description: Overview of metrics and their use in Microsoft Azure
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 06/05/2018
ms.author: ancav
ms.component: metrics
---

# Overview of metrics in Microsoft Azure
This article describes what metrics are in Microsoft Azure, their benefits, and how to start using them.  

## What are metrics?
Azure Monitor enables you to consume telemetry to gain visibility into the performance and health of your workloads on Azure. The most important type of Azure telemetry data is the metrics (also called performance counters) emitted by most Azure resources. Azure Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

## What are the characteristics of metrics?
Metrics have the following characteristics:

* All metrics have **one-minute frequency** (unless specified otherwise in a metric's definition). You receive a metric value every minute from your resource, giving you near real-time visibility into the state and health of your resource.
* Metrics are **available immediately**. You don't need to opt in or set up additional diagnostics.
* You can access **93 days of history** for each metric. You can quickly look at the recent and monthly trends in the performance or health of your resource.
* Some metrics can have name-value pair attributes called **dimensions**. These enable you to further segment and explore a metric in a more meaningful way.

## What can you do with metrics?
Metrics enable you to do the following tasks:


- Configure a metric **alert rule that sends a notification or takes automated action** when the metric crosses the threshold that you have set. Actions are controlled through [action groups](monitoring-action-groups.md). Example actions include email, phone, and SMS notifications, calling a webhook, starting a runbook, and more. **Autoscale** is a special automated action that enables you to scale your a resource up and down to handle load yet keep costs lower when not under load. You can configure an autoscale setting rule to scale in or out based on a metric crossing a threshold.
- **Route** all metrics to *Application Insights* or *Log Analytics* to enable instant analytics, search, and custom alerting on metrics data from your resources. You can also stream metrics to an *Event Hub*, enabling you to then route them to Azure Stream Analytics or to custom apps for near-real time analysis. You set up Event Hub streaming using diagnostic settings.
- **Archive** the performance or health history of your resource for compliance, auditing, or offline reporting purposes.  You can route your metrics to Azure Blob storage when you configure diagnostic settings for your resource.
- Use the **Azure portal** to discover, access, and view all metrics when you select a resource and plot the metrics on a chart. You can track the performance of your resource (such as a VM, website, or logic app) by pinning that chart to your dashboard.  
- **Perform advanced analytics** or reporting on performance or usage trends of your resource.
- **Query** metrics by using the PowerShell cmdlets or the Cross-Platform REST API.
- **Consume** the metrics via the new Azure Monitor REST APIs.

  ![Routing of Metrics in Azure Monitor](./media/monitoring-overview-metrics/Metrics_Overview_v4.png)

## Access metrics via the portal
Following is a quick walkthrough of how to create a metric chart by using the Azure portal.

### To view metrics after creating a resource
1. Open the Azure portal.
2. Create an Azure App Service website.
3. After you create a website, go to the **Overview** blade of the website.
4. You can view new metrics as a **Monitoring** tile. You can then edit the tile and select more metrics.

   ![Metrics on a resource in Azure Monitor](./media/monitoring-overview-metrics/MetricsOverview1.png)

### To access all metrics in a single place
1. Open the Azure portal.
2. Navigate to the new **Monitor** tab, and then and select the **Metrics** option underneath it.
3. Select your subscription, resource group, and the name of the resource from the drop-down list.
4. View the available metrics list. Then select the metric you are interested in and plot it.
5. You can pin it to the dashboard by clicking the pin on the upper-right corner.

   ![Access all metrics in a single place in Azure Monitor](./media/monitoring-overview-metrics/MetricsOverview2.png)

> [!NOTE]
> You can access host-level metrics from VMs (Azure Resource Manager-based) and virtual machine scale sets without any additional diagnostic setup. These new host-level metrics are available for Windows and Linux instances. These metrics are not to be confused with the Guest-OS-level metrics that you have access to when you turn on Azure Diagnostics on your VMs or virtual machine scale sets. To learn more about configuring Diagnostics, see [What is Microsoft Azure Diagnostics](../azure-diagnostics.md).
>
>

Azure Monitor also has a new metrics charting experience available in preview. This experience enables users to overlay metrics from multiple resources on one chart. Users can also plot, segment, and filter multi-dimensional metrics using this new metric charting experience. To learn more [click here](https://aka.ms/azuremonitor/new-metrics-charts)

## Access metrics via the REST API
Azure Metrics can be accessed via the Azure Monitor APIs. There are two APIs that help you discover and access metrics:

* Use the [Azure Monitor Metric definitions REST API](https://docs.microsoft.com/rest/api/monitor/metricdefinitions) to access the list of metrics, and any dimensions, that are available for a service.
* Use the [Azure Monitor Metrics REST API](https://docs.microsoft.com/rest/api/monitor/metrics) to segment, filter, and access the actual metrics data.

> [!NOTE]
> This article covers the metrics via the [new API for metrics](https://docs.microsoft.com/rest/api/monitor/) for Azure resources. The API version for the new metric definitions and metrics APIs is 2018-01-01. The legacy metric definitions and metrics can be accessed with the API version 2014-04-01.
>
>

For a more detailed walkthrough using the Azure Monitor REST APIs, see [Azure Monitor REST API walkthrough](monitoring-rest-api-walkthrough.md).

## Export metrics
You can go to the **Diagnostics settings** blade under the **Monitor** tab and view the export options for metrics. You can select metrics (and diagnostic logs) to be routed to Blob storage, to Azure Event Hubs, or to Log Analytics for use-cases that were mentioned previously in this article.

 ![Export options for metrics in Azure Monitor](./media/monitoring-overview-metrics/MetricsOverview3.png)

You can configure this via Resource Manager templates, [PowerShell](insights-powershell-samples.md), [Azure CLI](insights-cli-samples.md), or [REST APIs](https://msdn.microsoft.com/library/dn931943.aspx).

> [!NOTE]
> Sending multi-dimensional metrics via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
>
> *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.
>
>

## Take action on metrics
To receive notifications or take automated actions on metric data, you can configure alert rules or Autoscale settings.

### Configure alert rules
You can configure alert rules on metrics. These alert rules can check if a metric has crossed a certain threshold. There are two metric alerting capabilities offered by Azure Monitor.

Metric alerts: They can then notify you via email or fire a webhook that can be used to run any custom script. You can also use the webhook to configure third-party product integrations.

 ![Metrics and alert rules in Azure Monitor](./media/monitoring-overview-metrics/MetricsOverview4.png)

Newer metric alerts have the ability to monitor multiple metrics, and thresholds, for a resource and then notify you via an [Action Group](monitoring-action-groups.md). Learn more about [newer alerts here](https://aka.ms/azuremonitor/near-real-time-alerts).


### Autoscale your Azure resources
Some Azure resources support the scaling out or in of multiple instances to handle your workloads. Autoscale applies to App Service (Web Apps), virtual machine scale sets, and classic Azure Cloud Services. You can configure Autoscale rules to scale out or in when a certain metric that impacts your workload crosses a threshold that you specify. For more information, see [Overview of autoscaling](monitoring-overview-autoscale.md).

 ![Metrics and Autoscale in Azure Monitor](./media/monitoring-overview-metrics/MetricsOverview5.png)

## Learn about supported services and metrics
You can view a detailed list of all the supported services and their metrics at [Azure Monitor metrics--supported metrics per resource type](monitoring-supported-metrics.md).

## Next steps
Refer to the links throughout this article. Additionally, learn about:  

* [Common metrics for autoscaling](insights-autoscale-common-metrics.md)
* [How to create alert rules](insights-alerts-portal.md)
* [Analyze logs from Azure storage with Log Analytics](../log-analytics/log-analytics-azure-storage.md)
