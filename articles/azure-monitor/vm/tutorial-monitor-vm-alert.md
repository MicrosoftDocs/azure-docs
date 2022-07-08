---
title: Tutorial - Alert when Azure virtual is down
description: Create an alert rule in Azure Monitor to proactively notify you if a virtual machine is unavailable.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 11/04/2021
ms.reviewer: Xema Pathak
---

# Tutorial: Create alert when Azure virtual machine is unavailable
One of the most common alerting conditions for a virtual machine is whether the virtual machine is running. Once you enable monitoring with VM insights in Azure Monitor for the virtual machine, a heartbeat is sent to Azure Monitor every minute. You can create a log query alert rule that sends an alert if a heartbeat isn't detected. This method not only alerts if the virtual machine isn't running, but also if it's not responsive.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * View log data collected by VM insights in Azure Monitor for a virtual machine.
> * Create an alert rule from log data that will proactively notify you if the virtual machine is unavailable.

## Prerequisites
To complete this tutorial you need the following: 

- An Azure virtual machine to monitor.
- Monitoring with VM insights enabled for the virtual machine. See [Tutorial: Enable monitoring for Azure virtual machine](tutorial-monitor-vm-enable.md).



## Create a heartbeat query
There are multiple ways to create a log query alert rule. For this tutorial, we'll start from the **Logs Events** tab in the **Map** view. This gives a summary of the log data that's been collected for the virtual machine. 

:::image type="content" source="media/tutorial-monitor-vm/map-logs.png" lightbox="media/tutorial-monitor-vm/map-logs.png" alt-text="Map view with log events tab":::

Click on **Heartbeat**. This opens Log Analytics, which is the primary tool to analyze log data collected from the virtual machine, with a simple query for heartbeat events. If you click on **TimeGenerated** to sort by that column, you can see that a heartbeat is created each minute.

:::image type="content" source="media/tutorial-monitor-vm/log-query-heartbeat.png" lightbox="media/tutorial-monitor-vm/log-query-heartbeat.png" alt-text="Log query alert with heartbeat events.":::


For the alert, you want to return only heartbeat records in the last 5 minutes. If no records are returned, then you can assume the virtual machine is down.

Add a line to the query to filter the results to only records created in the last 5 minutes. This uses the [ago function](/azure/data-explorer/kusto/query/agofunction) that subtracts a particular time span from the current time.

```
Heartbeat
| where Computer == 'computer-name'
| where TimeGenerated > ago(5m)
```

Click **Run** to see the results of this query, which should now include just the heartbeats in the last 5 minutes.

:::image type="content" source="media/tutorial-monitor-vm/log-query-heartbeat-time-filter.png" lightbox="media/tutorial-monitor-vm/log-query-heartbeat-time-filter.png" alt-text="Log query alert with heartbeat events using time filter.":::

## Create alert rule
Now that you have the log query, you can create an alert rule that will send an alert when that query doesn't return any records. If it no heartbeat records are returned  from the last 5 minutes, then we can assume that machine hasn't been responsive in that time. 

Click **New alert rule** to create a rule from the current query.

:::image type="content" source="media/tutorial-monitor-vm/new-alert-rule.png" lightbox="media/tutorial-monitor-vm/new-alert-rule.png" alt-text="New alert rule.":::


The alert rule will already have the **Log query** filled in. The **Measurement** is also already correct since we want to count the number of table rows returned from the query. If the number of rows is zero, then we want to create an alert.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-01.png" lightbox="media/tutorial-monitor-vm/alert-rule-01.png" alt-text="Alert rule condition 1.":::

Scroll down to **Alert logic** and change **Operator** to **Equal to** and provide a **Threshold value** of **0**. This means that we want to create an alert when no records are returned, or when the record count from the query equals zero.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-02.png" lightbox="media/tutorial-monitor-vm/alert-rule-02.png" alt-text="Alert rule condition 2.":::

## Configure action group
The **Actions** page allows you to add one or more [action groups](../alerts/action-groups.md) to the alert rule. Action groups define a set of actions to take when an alert is fired such as sending an email or an SMS message.

If you already have an action group, click **Add action group** to add an existing group to the alert rule.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-actions.png" lightbox="media/tutorial-monitor-vm/alert-rule-actions.png" alt-text="Alert rule add action group.":::

If you don't already have an action group in your subscription to select, then click **Create action group** to create a new one. Select a **Subscription** and **Resource group** for the action group and give it an **Action group name** that will appear in the portal and a **Display name** that will appear in email and SMS notifications.

:::image type="content" source="media/tutorial-monitor-vm/action-group-basics.png" lightbox="./media/tutorial-monitor-vm/action-group-basics.png" alt-text="Action group basics":::

Select **Notifications** and add one or more methods to notify appropriate people when the alert is fired.

:::image type="content" source="media/tutorial-monitor-vm/action-group-notifications.png" lightbox="./media/tutorial-monitor-vm/action-group-notifications.png" alt-text="Action group notifications":::



## Configure details
The **Details** page allows you to configure different settings for the alert rule.

- **Subscription** and **Resource group** where the alert rule will be stored. This doesn't need to be in the same resource group as the resource that you're monitoring.
- **Severity** for the alert. The severity allows you to group alerts with a similar relative importance. A severity of **Error** is appropriate for an unresponsive virtual machine.
- Keep the box checked to **Enable alert upon creation**.
- Keep the box checked to **Automatically resolve alerts**. This will automatically resolve the alert when the virtual machine comes back online and heartbeat records are seen again.

:::image type="content" source="media/tutorial-monitor-vm/alert-rule-details.png" lightbox="media/tutorial-monitor-vm/alert-rule-details.png" alt-text="Alert rule details.":::

Click **Review + create** to create the alert rule.

## View the alert
To test the alert rule, stop the virtual machine. If you configured a notification in your action group, then you should receive that notification within a few minutes. You'll also see an alert indicated in the summary shown in the **Alerts** page for the virtual machine.

:::image type="content" source="media/tutorial-monitor-vm/alerts-summary.png" lightbox="media/tutorial-monitor-vm/alerts-summary.png" alt-text="Alerts summary":::

Click on the **Severity** to see the list of those alerts. Click on the alert itself to view its details.

:::image type="content" source="media/tutorial-monitor-vm/alerts-summary.png" lightbox="media/tutorial-monitor-vm/alerts-summary.png" alt-text="Alerts list":::

## Next steps
Now that you know how to create an alert from log data, collect additional logs and performance data from the virtual machine with a data collection rule.

> [!div class="nextstepaction"]
> [Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md)

