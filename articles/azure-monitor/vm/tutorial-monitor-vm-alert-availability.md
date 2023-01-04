---
title: Create availability alert rule for Azure virtual machine (preview)
description: Create an alert rule in Azure Monitor to proactively notify you if a virtual machine is unavailable.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 12/03/2022
ms.reviewer: Xema Pathak
---

# Tutorial: Create availability alert rule for Azure virtual machine (preview)
One of the most common monitoring requirements for a virtual machine is to create an alert if it stops running. The best method for this is to create a metric alert rule in Azure Monitor using the **VM availability** metric which is currently in public preview.

In this article, you learn how to:

> [!div class="checklist"]
> * View the VM availability metric that indicates whether a VM is running.
> * Create an alert rule using the VM availability metric to notify you if the virtual machine is unavailable.
> * Create an action group to be proactively notified when an alert is created.

## Prerequisites
To complete the steps in this article you need the following: 

- An Azure virtual machine to monitor.

## View the VM availability metric
Start by viewing the VM availability metric for your VM. Open the **Overview** page for the VM and then the **Monitoring** tab. This shows trending for several common metrics for the VM. Scroll down to view the chart for VM availability (preview). The value of the metric will be 1 when the VM is running and 0 when it's not.

:::image type="content" source="media/tutorial-monitor-vm/vm-availability-metric.png" alt-text="Screenshot of VM Availability metric for a VM." lightbox="media/tutorial-monitor-vm/vm-availability-metric.png":::


## Create alert rule
There are multiple methods to create an alert rule in Azure Monitor. In this tutorial, we'll create it right from the metric value. This will prefill required values such as the VM and metric we want to monitor. You'll just need to provide the detailed logic for the alert rule.

> [!TIP]
> You can create an alert rule for a group of VMs in the same region by changing the scope of the alert rule to a subscription or resource group.

Click on the **VM availability** chart to open the metric in [metrics explorer](../essentials/metrics-getting-started.md). This is a tool in Azure Monitor that allows you to interactively analyze metrics collected from your Azure resources. Click **New alert rule**. This starts the creation of a new alert rule using the VM availability metric and the current VM. 

:::image type="content" source="media/tutorial-monitor-vm/vm-availability-metric-explorer.png" alt-text="Screenshot of VM Availability metric in metrics explorer." lightbox="media/tutorial-monitor-vm/vm-availability-metric-explorer.png":::

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

:::image type="content" source="media/tutorial-monitor-vm/vm-availability-metric-alert-logic.png" alt-text="Screenshot of alert rule details for VM Availability metric." lightbox="media/tutorial-monitor-vm/vm-availability-metric-alert-logic.png":::



## Configure action group
The **Actions** page allows you to add one or more [action groups](../alerts/action-groups.md) to the alert rule. Action groups define a set of actions to take when an alert is fired such as sending an email or an SMS message.

> [!TIP]
> If you already have an action group, click **Add action group** to add an existing group to the alert rule instead of creating a new one.

Click **Create action group** to create a new one. 

:::image type="content" source="media/tutorial-monitor-vm/vm-availability-metric-create-action-group.png" alt-text="Screenshot of option to create new action group." lightbox="media/tutorial-monitor-vm/vm-availability-metric-create-action-group.png":::

Select a **Subscription** and **Resource group** for the action group and give it an **Action group name** that will appear in the portal and a **Display name** that will appear in email and SMS notifications.

:::image type="content" source="media/tutorial-monitor-vm/vm-availability-metric-action-group-basics.png" lightbox="./media/tutorial-monitor-vm/vm-availability-metric-action-group-basics.png" alt-text="Screenshot of action group basics":::

Select **Notifications** and add one or more methods to notify appropriate people when the alert is fired.

:::image type="content" source="media/tutorial-monitor-vm/action-group-notifications.png" lightbox="./media/tutorial-monitor-vm/action-group-notifications.png" alt-text="Action group notifications":::

## Configure details
The **Details** page allows you to configure different settings for the alert rule.

| Setting | Description |
|:---|:---|
| Subscription | Subscription where the alert rule will be stored. |
| Resource group | Resource group where the alert rule will be stored. This doesn't need to be in the same resource group as the resource that you're monitoring. |
| Severity | The severity allows you to group alerts with a similar relative importance. A severity of **Error** is appropriate for an unresponsive virtual machine. |
| Alert rule name | Name of the alert that's displayed when it fires. |
| Alert rule description | Optional description of the alert rule. |


:::image type="content" source="media/tutorial-monitor-vm/alert-rule-details.png" lightbox="media/tutorial-monitor-vm/alert-rule-details.png" alt-text="Alert rule details.":::

Click **Review + create** to create the alert rule.

## View the alert
To test the alert rule, stop the virtual machine. If you configured a notification in your action group, then you should receive that notification within a few seconds. You'll also see an alert indicated in the summary shown in the **Alerts** page for the virtual machine.

:::image type="content" source="media/tutorial-monitor-vm/vm-availability-metric-alert.png" lightbox="media/tutorial-monitor-vm/alerts-summary.png" alt-text="Alerts summary":::


## Next steps
Now that you have alerting in place when the VM goes down, enable VM insights to install the Azure Monitor agent which collects 

> [!div class="nextstepaction"]
> [Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md)


