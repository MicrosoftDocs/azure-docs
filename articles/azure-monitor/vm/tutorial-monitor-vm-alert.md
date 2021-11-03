---
title: Tutorial - Alert when Azure virtual is down
description: Create an alert rule in Azure Monitor to proactively notify you if a virtual machine is unavailable.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/19/2021
---

# Tutorial: Alert when Azure virtual is down
One of the most common alerting conditions for a virtual machine is whether the virtual machine is running. 
You can create a log query alert rule that sends an alert if a heartbeat isn't detected. 

> [!NOTE]
> Prior to the Azure Monitor agent, guest metrics for Azure virtual machines were collected with the [Azure diagnostic extension](../agents/diagnostics-extension-overview.md) for Windows (WAD) and Linux (LAD). These agents are still available and can be configured with the **Diagnostic settings** menu item for the virtual machine, but they are in the process of being replaced with Azure Monitor agent.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable VM insights for the virtual machine. This installs the Log Analytics agent and begins sending guest performance data to Azure Monitor Logs. This enables performance views in VM insights and the map feature that allows you to view dependencies between processes running on your virtual machine and other devices.
> * Create a data collection rule that send guest performance data to Azure Monitor metrics and log events to Azure Monitor Logs. This lets you use metrics explorer to analyze guest performance data and to view and alert on guest logs.

## Prerequisites
To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.
- VM insights enabled for the virtual machine. See [Tutorial: Enable monitoring for Azure virtual machine](tutorial-monitor-vm-enable.md).



## Create a heartbeat query
There are multiple ways to create a log query alert rule. For this tutorial, we'll start from the **Logs Events** tab in the **Map** view. This gives a summary of the log data that's been collected for the data. 

:::image type="content" source="media/tutorial-monitor-vm/map-logs.png" lightbox="media/tutorial-monitor-vm/map-logs.png" alt-text="Map view with log events tab":::

Click on **Heartbeat**. This opens Log Analytics, which is a tool that you can use to analyze events and performance data collected from the virtual machine, with a simple query for heartbeat events. 

:::image type="content" source="media/tutorial-monitor-vm/log-query-heartbeat.png" lightbox="media/tutorial-monitor-vm/log-query-heartbeat.png" alt-text="Log query alert with heartbeat events.":::


For the alert, we want to return only heartbeat records in the last 5 minutes. If no records are returned, then we assume the virtual machine is down and send an alert.

Add a line to the query to filter the results to only records created in the last 5 minutes.

```
Heartbeat
| where Computer == 'computer-name'
| where TimeGenerated > ago(5m)
```

Click **Run** to see the results of this query, which should include just the heartbeats in the last 5 minutes.

:::image type="content" source="media/tutorial-monitor-vm/log-query-heartbeat-time-filter.png" lightbox="media/tutorial-monitor-vm/log-query-heartbeat-time-filter.png" alt-text="Log query alert with heartbeat events using time filter.":::

## Create alert rule
Create an alert rule from the current query by clicking **New alert rule**.

:::image type="content" source="media/tutorial-monitor-vm/new-alert-rule.png" lightbox="media/tutorial-monitor-vm/new-alert-rule.png" alt-text="New alert rule.":::


The alert rule will already have the **Log query** filled in. The **Measurement** is also already correct since we want to count the number of table rows returned from the query. This is the same thing as the number of heartbeats in the last minute 5 minutes.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-01.png" lightbox="media/tutorial-monitor-vm/alert-rule-01.png" alt-text="Alert rule condition 1.":::

Scroll down to **Alert logic** and change **Operator** to **Equal to** and provide a **Threshold value** of **0**. This means that we want to create an alert when no records are returned, or when the record count is zero.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-02.png" lightbox="media/tutorial-monitor-vm/alert-rule-02.png" alt-text="Alert rule condition 2.":::

## Configure action group
[!INCLUDE [Action groups](../../../includes/azure-monitor-tutorial-action-group.md)]

## Configure details
Provide the following information on the **Details** page.

- **Subscription** and **Resource group** for the alert rule. This doesn't need to be in the same resource group as the resource that you're monitoring.
- **Severity** for the alert. The severity allows you to group alerts with a similar relative importance.
- **Alert rule name**. This should be descriptive since it will be displayed when the alert is fired. Optionally provide a description that's included in the details of the alert.
- Keep the box checked to **Enable alert upon creation**.
- Keep the box checked to **Automatically resolve alerts**. This will automatically resolve the alert when the virtual machine comes back online and heartbeat records are seen again.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-02.png" lightbox="media/tutorial-monitor-vm/alert-rule-02.png" alt-text="Alert rule condition 2.":::

Click **Review + create** to create the alert rule.



## Next steps


