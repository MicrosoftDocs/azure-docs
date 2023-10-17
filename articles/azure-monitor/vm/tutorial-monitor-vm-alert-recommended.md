---
title: Enable recommended alert rules for Azure virtual machine
description: Enable set of recommended metric alert rules for an Azure virtual machine.
ms.service: azure-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 09/28/2023
ms.reviewer: Xema Pathak
---

# Tutorial: Enable recommended alert rules for Azure virtual machine
[Alerts in Azure Monitor](../alerts/alerts-overview.md) identify when a resource isn't healthy. When you create a new Azure virtual machine, you can quickly enable a set of recommended alert rules that will provide you with initial monitoring for a common set of metrics including CPU percentage and available memory.

> [!NOTE]
> If you selected the **Enable recommended alert rules** option when you created your virtual machine, then the recommended alert rules described in this tutorial will already exist.

In this article, you learn how to:

> [!div class="checklist"]
> * Enable recommended alerts for a new Azure virtual machine.
> * Specify an email address to be notified when an alert files.
> * View the resulting alert rules.

## Prerequisites
To complete the steps in this article you need the following: 

- An Azure virtual machine to monitor.

> [!IMPORTANT]
> If the VM has any other alert rules associate with it, then recommended alerts will not be available. You can access recommended alerts by removing any alert rules targeted to the VM.


## Create recommended alert rules
From the menu for the VM, select **Alerts**. You'll see a brief description of recommended alerts and the option to enable them. Click **Enable recommended alert rules**.

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-enable.png" alt-text="Screenshot of option to enable recommended alerts for a virtual machine." lightbox="media/tutorial-monitor-vm/recommended-alerts-enable.png":::


A list of recommended alert rules is displayed. You can select which ones to create and change their recommended threshold if you want. Ensure that **Email** is enabled and provide an email address to be notified when any of the alerts fire. An [action group](../alerts/action-groups.md) will be created with this address. If you already have an action group that you want to use, you can specify it instead.


:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-configure.png" alt-text="Screenshot of recommended alert rule configuration." lightbox="media/tutorial-monitor-vm/recommended-alerts-configure.png":::

Expand each of the alert rules to inspect its details. By default, the severity for each is **Informational**. You may want to change to another severity such as **Error**.

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-configure-severity.png" alt-text="Screenshot of recommended alert rule severity configuration." lightbox="media/tutorial-monitor-vm/recommended-alerts-configure-severity.png":::

Click **Enable** to create the alert rules.

## View created alert rules

When the alert rule creation is complete, you'll see the alerts screen for the VM. 

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-complete.png" alt-text="Screenshot of alert screen for a VM." lightbox="media/tutorial-monitor-vm/recommended-alerts-complete.png":::

Click **Alert rules** to view the rules you just created. You can click on any of the rules to view their details and to modify their threshold if you want.

:::image type="content" source="media/tutorial-monitor-vm/recommended-alerts-rules.png" alt-text="Screenshot of list of created alert rules." lightbox="media/tutorial-monitor-vm/recommended-alerts-rules.png":::


## Next steps
Now that you know have alerting for common VM metrics, create an alert rule to detect when the VM goes offline.

> [!div class="nextstepaction"]
> [Create availability alert rule for Azure virtual machine (preview)](tutorial-monitor-vm-alert-availability.md)

