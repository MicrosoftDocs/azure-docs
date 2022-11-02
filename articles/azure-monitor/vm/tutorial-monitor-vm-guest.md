---
title: Collect guest logs and metrics from Azure virtual machine
description: Create data collection rule to collect guest logs and metrics from Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 11/08/2021
ms.reviewer: Xema Pathak
---

# Collect guest logs and metrics from Azure virtual machine
When you [enable monitoring with VM insights](tutorial-monitor-vm-enable.md), it collects performance data using the Log Analytics agent. To collect logs from the guest operating system and to send performance data to Azure Monitor Metrics, install the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and create a [data collection rule](../essentials/data-collection-rule-overview.md) (DCR) that defines the data to collect and where to send it. 

> [!NOTE]
> Prior to the Azure Monitor agent, guest metrics for Azure virtual machines were collected with the [Azure diagnostic extension](../agents/diagnostics-extension-overview.md) for Windows (WAD) and Linux (LAD). These agents are still available and can be configured with the **Diagnostic settings** menu item for the virtual machine, but they are in the process of being replaced with Azure Monitor agent.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a data collection rule that send guest performance data to Azure Monitor metrics and log events to Azure Monitor Logs. 
> * View guest metrics in metrics explorer.
> * View guest logs in Log Analytics.

## Prerequisites
To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.


## Create data collection rule
[Data collection rules](../essentials/data-collection-rule-overview.md) in Azure Monitor define data to collect and where it should be sent. When you define the data collection rule using the Azure portal, you specify the virtual machines it should be applied to. The Azure Monitor agent will automatically be installed on any virtual machines that don't already have it.

> [!NOTE]
> You must currently install the Azure Monitor agent from **Monitor** menu in the Azure portal. This functionality is not yet available from the virtual machine's menu. 

From the **Monitor** menu in the Azure portal, select **Data Collection Rules** and then **Create** to create a new data collection rule.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-create.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-create.png" alt-text="Create data collection rule":::

On the **Basics** tab, provide a **Rule Name** which is the name of the rule displayed in the Azure portal. Select a **Subscription**, **Resource Group**, and **Region** where the DCR and its associations will be stored. These do not need to be the same as the resources being monitored. The **Platform Type** defines the options that are available as you define the rest of the DCR. Select *Windows* or *Linux* if it will be associated only those resources or *Custom* if it will be associated with both types.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-basics.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-basics.png" alt-text="Data collection rule basics":::

## Select resources
On the **Resources** tab, identify one or more virtual machines that the data collection rule will apply to. The Azure Monitor agent will be installed on any that don't already have it. Click **Add resources** and select either your virtual machines or the resource group or subscription where your virtual machine is located. The data collection rule will apply to all virtual machines in the selected scope.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-resources.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-resources.png" alt-text="Data collection rule resources":::

## Select data sources
A single data collection rule can have multiple data sources. For this tutorial, we'll use the same rule to collect both guest metrics and guest logs. We'll send metrics to both to Azure Monitor Metrics and to Azure Monitor Logs so that they can be analyzed both with metrics explorer and Log Analytics.

On the **Collect and deliver** tab, click **Add data source**. For the **Data source type**, select **Performance counters**. Leave the **Basic** setting and select the counters that you want to collect. **Custom** allows you to select individual metric values. 

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-metric.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-metric.png" alt-text="Data collection rule metric data source":::

Select the **Destination** tab. **Azure Monitor Metrics** should already be listed. Click **Add destination** to add another. Select **Azure Monitor Logs** for the **Destination type**. Select your Log Analytics workspace for the **Account or namespace**. Click **Add data source** to save the data source.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-destination-metric.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-destination-metric.png" alt-text="Data collection rule destination":::

Click **Add data source** again to add logs to the data collection rule. For the **Data source type**, select **Windows event logs** or **Linux syslog**. Select the types of log data that you want to collect. 

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-windows.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-windows.png" alt-text="Data collection rule Windows log data source":::

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-linux.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-linux.png" alt-text="Data collection rule Linux log data source":::

Select the **Destination** tab. **Azure Monitor Logs** should already be selected for the **Destination type**. Select your Log Analytics workspace for the **Account or namespace**. If you don't already have a workspace, then you can select the default workspace for your subscription, which will automatically be created. Click **Add data source** to save the data source.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-destination-logs.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-destination-logs.png" alt-text="Data collection rule Logs destination":::

Click **Review + create** to create the data collection rule and install the Azure Monitor agent on the selected virtual machines.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-save.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-save.png" alt-text="Save data collection rule":::

## Viewing logs
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). While a set of pre-created queries are available for virtual machines, we'll use a simple query to have a look at the events that we're collecting. 

Select **Logs** from your virtual machines's menu. Log Analytics opens with an empty query window with the scope set to that machine. Any queries will include only records collected from that machine. 

> [!NOTE]
> The **Queries** window may open when you open Log Analytics. This includes pre-created queries that you can use. For now, close this window since we're going to manually create a simple query.

:::image type="content" source="media/tutorial-monitor-vm/log-analytics.png" lightbox="media/tutorial-monitor-vm/log-analytics.png" alt-text="Log Analytics":::


In the empty query window, type either `Event` or `Syslog` depending on whether your machine is running Windows or Linux and then click **Run**. The events collected within the **Time range** are displayed.

> [!NOTE]
> If the query doesn't return any data, then you may need wait a few minutes until events are created on the virtual machine to be collected. You may also need to modify the data source in the data collection rule to include additional categories of events.

:::image type="content" source="media/tutorial-monitor-vm/log-analytics-query.png" lightbox="media/tutorial-monitor-vm/log-analytics-query.png" alt-text="Log Analytics with query results":::

For a tutorial on using Log Analytics to analyze log data, see [Log Analytics tutorial](../logs/log-analytics-tutorial.md). For a tutorial on creating alert rules from log data, see [Tutorial: Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md).

## View guest metrics
You can view metrics for your host virtual machine with metrics explorer without a data collection rule just like [any other Azure resource](../essentials/tutorial-metrics.md). With the data collection rule though, you can use metrics explorer to view guest metrics in addition to host metrics.

Select **Metrics** from your virtual machines's menu. Metrics explorer opens with the scope set to your virtual machine. Click **Metric Namespace**, and select **Virtual Machine Guest**. 

> [!NOTE]
> If you don't see **Virtual Machine Guest**, you may just need to wait a few more minutes for the agent to be deployed and data to begin collecting.


:::image type="content" source="media/tutorial-monitor-vm/metrics-explorer.png" lightbox="media/tutorial-monitor-vm/metrics-explorer.png" alt-text="Metrics explorer":::

The available guest metrics are displayed. Select a **Metric** to add to the chart.

:::image type="content" source="media/tutorial-monitor-vm/metrics-explorer-guest-metrics.png" lightbox="media/tutorial-monitor-vm/metrics-explorer-guest-metrics.png" alt-text="Metrics explorer with guest metrics":::

You can get a complete tutorial on viewing and analyzing metric data using metrics explorer in [Tutorial: Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md) and on creating metrics alerts in [Tutorial: Create a metric alert for an Azure resource](../alerts/tutorial-metric-alert.md). 



## Next steps
Now that you're collecting guest metrics for the virtual machine, you can create metric alerts based on guest metrics such as available memory and logical disk space.

> [!div class="nextstepaction"]
> [Create a metric alert in Azure Monitor](../alerts/tutorial-metric-alert.md)


