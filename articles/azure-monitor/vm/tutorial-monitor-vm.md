---
title: Tutorial - Collect guest metrics and logs from Azure virtual machine
description: Create data collection rule to collect guest logs and metrics from Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/19/2021
---

# Tutorial: Collect guest metrics and logs from Azure virtual machine
Logs and metrics from the guest operating system of an Azure virtual machine can be be valuable to determine the health of the workflows running on it. To collect guest metrics and logs from an Azure virtual machine, you must install the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and create a [data collection rule](../agents/data-collection-rule-overview.md) (DCR) that defines the data to collect and where to send it. 

> [!NOTE]
> Prior to the Azure Monitor agent, guest metrics for Azure virtual machines were collected with the [Azure diagnostic extension](../agents/diagnostics-extension-overview.md) for Windows (WAD) and Linux (LAD). These agents are still available and can be configured with the **Diagnostic settings** menu item for the virtual machine, but they are in the process of being replaced with Azure Monitor agent.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable VM insights for the virtual machine. This installs the Log Analytics agent and begins sending guest performance data to Azure Monitor Logs. This enables performance views in VM insights and the map feature that allows you to view dependencies between processes running on your virtual machine and other devices.
> * Create a data collection rule that send guest performance data to Azure Monitor metrics and log events to Azure Monitor Logs. This lets you use metrics explorer to analyze guest performance data and to view and alert on guest logs.

## Prerequisites
To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.



## Create a Log Analytics workspace
[!INCLUDE [Create workspace](../../../includes/azure-monitor-tutorial-workspace.md)]


## Enable monitoring for the virtual machine
Select **Insights** from your virtual machine's menu in the Azure portal. If VM insights hasn't yet been enabled for it, you should see a screen similar to the following allowing you to enable monitoring. Click **Enable**.

> [!NOTE]
> If you selected the option to **Enable detailed monitoring** when you created your virtual machine, VM insights may already be enabled.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights.png" lightbox="media/tutorial-monitor-vm/enable-vminsights.png" alt-text="Enable VM insights":::

Select your workspace and click **Enable**. This is the workspace where data collected by VM insights will be sent.

:::image type="content" source="media/tutorial-monitor-vm/enable-vminsights-02.png" lightbox="media/tutorial-monitor-vm/enable-vminsights-02.png" alt-text="Enable VM insights with workspace":::

You'll see a message saying that monitoring is being enabled. It may take several minutes for the agent to be installed and for data collection to begin. When the deployment is complete, you'll see views in the **Performance** tab in VM insights with performance data for the machine.

> [!NOTE]
> You may receive a message about an upgrade being available for VM insights. If so, select the option to perform the upgrade before proceeding.

## View logs and create a heartbeat alert
Now that the virtual machine is being monitored, you can view logs that are being collected and then use those logs to create an alert rule that will notify you when the machine is unavailable. The heartbeat table receives an event from the virtual machine every minute to verify that it's still communicating. You can create a log query alert rule that sends an alert if a heartbeat isn't detected. For the alert, we want to return only heartbeat records in the last 5 minutes. If no records are returned, then we assume the virtual machine is down and send an alert.

Select the **Maps** tab to view processes and dependencies for the virtual machine.

Click through the page to view the different data available, including **Log Events** which gives a summary of the log data that's been collected for the data. 

Click on **Heartbeat**. This opens Log Analytics, which is a tool that you can use to analyze events and performance data collected from the virtual machine, with a simple query for heartbeat events. 

Add a line to the query to filter the results to only records created in the last 5 minutes.

```
Heartbeat
| where Computer == 'computer-name'
| where TimeGenerated > ago(5m)
```

Click **Run** to see the results of this query, which should include just the heartbeats in the last 5 minutes.


To create the alert rule, click **New alert rule**.


The alert rule will already have the **Log query** filled in. The **Measurement** is also already correct since we want to count the number of table rows returned from the query. This is the same thing as the number of heartbeats in the last minute 5 minutes.

Scroll down to **Alert logic** and change **Operator** to **Equal to** and provide a **Threshold value** of **0**. This means that we want to create an alert when no records are returned, or when the record count is zero.



## Create data collection rule
[Data collection rules](../agents/data-collection-rule-overview.md) in Azure Monitor define data to collect and where it should be sent. When you define the data collection rule using the Azure portal, you specify the virtual machines it should be applied to. The Azure Monitor agent will automatically be installed on any virtual machines that don't already have it.

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
A single data collection rule can have multiple data sources. For this tutorial, we'll use the same rule to collect both guest metrics and guest logs. We'll also send metrics to both to Azure Monitor Metrics and to Azure Monitor Logs so that they can be analyzed both with metrics explorer and Log Analytics.

On the **Collect and deliver** tab, click **Add data source**. For the **Data source type**, select **Performance counters**. Leave the **Basic** setting and select the counters that you want to collect. **Custom** allows you to select individual metric values. 

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-metric.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-metric.png" alt-text="Data collection rule metric data source":::

Select the **Destination** tab. **Azure Monitor Metrics** should already be listed. Click **Add destination** to add another. Select **Azure Monitor Logs** for the **Destination type**. Select your Log Analytics workspace for the **Account or namespace**. Click **Add data source** to save the data source.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-destination-metric.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-destination-metric.png" alt-text="Data collection rule destination":::

Click **Add data source** again to add logs to the data collection rule. For the **Data source type**, select **Windows event logs** or **Linux syslog**. Select the types of log data that you want to collect. 

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-windows.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-windows.png" alt-text="Data collection rule Windows log data source":::

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-linux.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs-linux.png" alt-text="Data collection rule Linux log data source":::

Select the **Destination** tab. *Azure Monitor Logs* should already be selected for the **Destination type**. Select your Log Analytics workspace for the **Account or namespace**. If you don't already have a workspace, then you can select the default workspace for your subscription, which will automatically be created. Click **Add data source** to save the data source.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-data-source-logs.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-data-source-logs.png" alt-text="Data collection rule Linux log data source":::

Click **Review + create** to create the data collection rule and install the Azure Monitor agent on the selected virtual machines.

:::image type="content" source="media/tutorial-monitor-vm/data-collection-rule-save.png" lightbox="media/tutorial-monitor-vm/data-collection-rule-save.png" alt-text="Save data collection rule":::

## Analyzing logs
Data is retrieved from a Log Analytics workspace using a log query written in Kusto Query Language (KQL). While a set of pre-created queries are available for virtual machines, we'll use a simple query to have a look at the events that we're collecting. 

Select **Logs** from your virtual machines's menu. Log Analytics opens with an empty query window with the scope set to that machine. Any queries will include only records collected from that machine.


In the empty query window, type either `Event` or `Syslog` depending on whether your machine is running Windows or Linux and then click **Run**. The events collected within the **Time range** are displayed.




## Next steps


