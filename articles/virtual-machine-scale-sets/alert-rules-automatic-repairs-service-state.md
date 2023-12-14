---
title: Use Azure Alert Rules to monitor changes in Automatic Instance Repairs ServiceState
description: Learn how to use Azure Alert Rules to get notified of changes to Automatic Instance Repairs ServiceState.
author: hilaryw29
ms.author: hilarywang
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/14/2023
---

# Use Azure Alert Rules to monitor changes in Automatic Instance Repairs ServiceState

This article shows you how to use [Alert Rules from Azure Monitor](../azure-monitor/alerts/alerts-overview.md) to receive custom notifications every time the ServiceState for Automatic Repairs is updated on your scale set. This will help track if Automatic Repairs become _Suspended_ due to VM instances remaining unhealthy after multiple repair operations. To learn more about Azure Monitor alerts, see the [alerts overview](../azure-monitor/alerts/alerts-overview.md). 

To follow this tutorial, ensure that you have a Virtual Machine scale set with [Automatic Repairs](./virtual-machine-scale-sets-automatic-instance-repairs.md) enabled.

## Azure portal
1.	In the [portal](https://portal.azure.com/), navigate to your VM scale set resource
2.	Select **Alerts** from the left pane, and then select **+ Create > Alert rule**. :::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-1.png" alt-text="Create monitoring alert in the Azure portal":::
3.	Under the **Condition** tab, select **See all signals** and choose the signal name called “Sets the state of an orchestration service in a Virtual Machine Scale set”. Select **Apply**. :::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-2.png" alt-text="Select alert signal to monitor scale set orchestration service state":::
4.	Set **Event Level** to “Informational” and **Status** to “Succeeded”. :::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-3.png" alt-text="Configure event level and status for alert rule":::
5.	Under the **Actions** tab, select an existing action group or see [Create action group](#creating-an-action-group) 
6.	Under the **Details** tab > **Alert rule name**, set a name for your alert. Then select **Review + create** > **Create** to create your alert.
:::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-4.png" alt-text="Review and create alert rule":::

Once the alert is created and enabled on your scale set, you'll receive a notification every time a change to the ServiceState is detected on your scale set.

### Sample email notification from alert rule
Below is an example of an email notification created from a configured alert rule. 
:::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-5.png" alt-text="Sample email notification from alert rule":::

## Creating an action group
1. Under the **Actions** tab, select **Create action group**.
:::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-6.png" alt-text="Create action group on portal":::
2. In the **Basics** tab, provide an **Action group name** and **Display name**.
3. Under the **Notifications** tab **> Notification type**, select “Email/SMS message/Push/Voice”. Select the **edit** button to configure how you’d like to be notified.
:::image type="content" source="media/alert-rules-automatic-repairs-service-state/picture-7.png" alt-text="Configure notification type for action group":::
4. Select **Review + Create > Create**
