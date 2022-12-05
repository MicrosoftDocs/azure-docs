---
title: Create availability alert rule for Azure virtual machine (preview)
description: Create an alert rule in Azure Monitor to proactively notify you if a virtual machine is unavailable.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 11/04/2021
ms.reviewer: Xema Pathak
---

# Create availability alert run for Azure virtual machine (preview)
One of the most common alerting conditions for a virtual machine is whether the virtual machine is running. The best method is to create a metric alert rule in Azure Monitor using VM availability metric which is currently in public preview.

In this article, you learn how to:

> [!div class="checklist"]
> * View the VM availability metric that shows when a VM is running.
> * Create an alert rule using the VM availability metric to notify you if the virtual machine is unavailable.

## Prerequisites
To complete the steps in this article you need the following: 

- An Azure virtual machine to monitor.



## View the VM availability metric
Start by viewing the VM availability metric for your VM. Open the **Overview** page and then the **Monitoring** tab. This shows trending for several common metrics for the VM. Scroll down to view the chart for VM availability (preview). The value of the metric will be 1 when the VM is running and 0 when it's not.


## Create alert rule
There are multiple methods to create an alert rule in Azure Monitor. In this tutorial, we'll create it right from the metric value. Click on the VM availability chart to open the metric in [metrics explorer](). This is a tool in Azure Monitor that allows you to interactively analyze metrics collected from your Azure resources.


Click **New alert rule**. This starts the creation of a new alert rule using the VM availability metric and the current VM. You do need to provide a couple of details though. The logic you want is to fire an alert when the value of the metric is less than 1. We'll have the alert rule check every minute.

Set the following values for the **Alert logic**. This specifies that the alert will fire whenever the average value of the availability metric falls below 1, which indicates that the VM isn't running.

| Setting | Value |
|:---|:---|
| Threshold | Static |
| Aggregation Type | Average |
| Operator | Less than |
| Unit | Count |
| Threshold value | 1 |

Set the following values for **When to evaluate**. This specifies that the rule will run every minute, using the collected values from the previous minute.


| Setting | Value |
|:---|:---|
| Check every | 1 minute |
| Loopback period | 1 minute |


> [!TIP]
> You can create an alert rule for a group of VMs in the same region by changing the scope of the alert rule to a subscription or resource group.


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



## Next steps
Now that you know how to create an alert from log data, collect additional logs and performance data from the virtual machine with a data collection rule.

> [!div class="nextstepaction"]
> [Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md)

