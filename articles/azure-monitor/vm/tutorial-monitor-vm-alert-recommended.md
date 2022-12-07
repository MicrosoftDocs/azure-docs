---
title: Create availability alert rule for Azure virtual machine (preview)
description: Create an alert rule in Azure Monitor to proactively notify you if a virtual machine is unavailable.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 11/04/2021
ms.reviewer: Xema Pathak
---

# Create availability alert rule for Azure virtual machine (preview)
When you create a new Azure virtual machine, you can quickly enable a set of recommended alert rules that will provide you with initial monitoring for a common set of performance counters. 

In this article, you learn how to:

> [!div class="checklist"]
> * View the VM availability metric that shows when a VM is running.
> * Create an alert rule using the VM availability metric to notify you if the virtual machine is unavailable.
> * Create an action group to be proactively notified when an alert is created.

## Prerequisites
To complete the steps in this article you need the following: 

- An Azure virtual machine to monitor.

> [!IMPORTANT]
> If the VM has any other alert rules associate with it, then recommended alerts will not be available.


## Create alert rules
From the menu for the VM, select **Alerts**. You'll se a brief description of recommended alerts and the option to enable them. Click **Enable recommended alert rules**.

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-enable.png" alt-text="Screenshot of option to enable recommended alerts for a virtual machine." lightbox="media/tutorial-monitor-vm/recommended-alerts-enable.png":::


A list of recommended alert rules is displayed. You can select which ones to create and change their recommended threshold if you want. Ensure that **Email** is enabled and provide an email address to be notified when any of the alert rules fires. An [action group](../alerts/action-groups.md) will be created with this address. If you already have an action group that you want to use, you can specify it instead.


:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-configure.png" alt-text="Screenshot of recommended alert rule configuration." lightbox="media/tutorial-monitor-vm/recommended-alerts-configure.png":::

## View created alert rules

When the alert rule creation is complete, you'll see the alerts screen for the VM. 

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-complete.png" alt-text="Screenshot of alert screen for a VM." lightbox="media/tutorial-monitor-vm/recommended-alerts-complete.png":::

Click **Alert rules** to view the alert rules that you just created. You can see that a rule has been created for each that you selected. If the threshold is exceeded for any of these rules, an Azure Monitor alert will be created, and an email will be sent to the address that you specified. 

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-rules.png" alt-text="Screenshot of list of created alert rules." lightbox="media/tutorial-monitor-vm/recommended-alerts-rules.png":::


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

