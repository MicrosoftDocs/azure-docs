---
title: Tutorial - Alert when Azure virtual is down
description: Create an alert rule in Azure Monitor to proactively notify you if a virtual machine is unavailable.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/19/2021
---

# Tutorial: Alert when Azure virtual is down
One of the most common alerting conditions for a virtual machine is whether the virtual machine is running. Once you enable monitoring for the virtual machine, a heartbeat is sent to Azure Monitor every minute. You can create a log query alert rule that sends an alert if a heartbeat isn't detected. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * View log data collected by VM insights in Azure Monitor for a virtual machine.
> * Create an alert rule from log data that will proactively notify you if the virtual machine is unavailable.

## Prerequisites
To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.
- Monitoring with VM insights enabled for the virtual machine. See [Tutorial: Enable monitoring for Azure virtual machine](tutorial-monitor-vm-enable.md).



## Create a heartbeat query
There are multiple ways to create a log query alert rule. For this tutorial, we'll start from the **Logs Events** tab in the **Map** view. This gives a summary of the log data that's been collected for the data. 

:::image type="content" source="media/tutorial-monitor-vm/map-logs.png" lightbox="media/tutorial-monitor-vm/map-logs.png" alt-text="Map view with log events tab":::

Click on **Heartbeat**. This opens Log Analytics, which is a tool that you can use to analyze events and performance data collected from the virtual machine, with a simple query for heartbeat events. If you click on **TimeGenerated** to sort by that column, you can see that a heartbeat is created each minute.

:::image type="content" source="media/tutorial-monitor-vm/log-query-heartbeat.png" lightbox="media/tutorial-monitor-vm/log-query-heartbeat.png" alt-text="Log query alert with heartbeat events.":::


For the alert, you want to return only heartbeat records in the last 5 minutes. If no records are returned, then you can assume the virtual machine is down.

Add a line to the query to filter the results to only records created in the last 5 minutes.

```
Heartbeat
| where Computer == 'computer-name'
| where TimeGenerated > ago(5m)
```

Click **Run** to see the results of this query, which should include just the heartbeats in the last 5 minutes.

:::image type="content" source="media/tutorial-monitor-vm/log-query-heartbeat-time-filter.png" lightbox="media/tutorial-monitor-vm/log-query-heartbeat-time-filter.png" alt-text="Log query alert with heartbeat events using time filter.":::

## Create alert rule
Now that you have the log query, you can create an alert rule that will send an alert when that query doesn't return any records. Click **New alert rule**.

:::image type="content" source="media/tutorial-monitor-vm/new-alert-rule.png" lightbox="media/tutorial-monitor-vm/new-alert-rule.png" alt-text="New alert rule.":::


The alert rule will already have the **Log query** filled in. The **Measurement** is also already correct since we want to count the number of table rows returned from the query.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-01.png" lightbox="media/tutorial-monitor-vm/alert-rule-01.png" alt-text="Alert rule condition 1.":::

Scroll down to **Alert logic** and change **Operator** to **Equal to** and provide a **Threshold value** of **0**. This means that we want to create an alert when no records are returned, or when the record count from the query is zero.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-02.png" lightbox="media/tutorial-monitor-vm/alert-rule-02.png" alt-text="Alert rule condition 2.":::

## Configure action group
[!INCLUDE [Action groups](../../../includes/azure-monitor-tutorial-action-group.md)]

## Configure details
The **Details** page allows you to configure different settings for the alert rule.

- **Subscription** and **Resource group** for the alert rule. This doesn't need to be in the same resource group as the resource that you're monitoring.
- **Severity** for the alert. The severity allows you to group alerts with a similar relative importance.
- Keep the box checked to **Enable alert upon creation**.
- Keep the box checked to **Automatically resolve alerts**. This will automatically resolve the alert when the virtual machine comes back online and heartbeat records are seen again.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-details.png" lightbox="media/tutorial-monitor-vm/alert-rule-details.png" alt-text="Alert rule details.":::

Click **Review + create** to create the alert rule.

## View the alert
To test the alert rule, stop the virtual machine. If you configure a notification in your action group, then you should receive that notification within a few minutes. You'll also see the alert indicated in its categories in the **Alerts** page for the virtual machine.

:::image type="content" source="media/tutorial-monitor-vm/alerts-summary.png" lightbox="media/tutorial-monitor-vm/alerts-summary.png" alt-text="Alerts summary":::

Click on the category to see the list of alerts in that category. Click on the alert itself to view its details.

:::image type="content" source="media/tutorial-monitor-vm/alerts-summary.png" lightbox="media/tutorial-monitor-vm/alerts-summary.png" alt-text="Alerts list":::
## Next steps


