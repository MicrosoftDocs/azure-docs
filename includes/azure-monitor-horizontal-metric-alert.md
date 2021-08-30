---
title: "include file" 
description: "include file" 
services: azure-monitor
author: bwren
tags: azure-service-management
ms.topic: "include"
ms.date: 08/26/2021
ms.author: bwren
ms.custom: "include file"
---

[Alerts](../articles/azure-monitor/alerts/alerts-overview.md) in Azure Monitor proactively notify you when issues are identified in your monitoring data. [Metric alerts](../articles/azure-monitor/alerts/alerts-metric-overview.md) fire when the value of a metric exceeds a threshold. 

### Create alert rule

To create a metric alert, start by viewing the metric value as shown in the **Analyzing metrics** section above. Then click on **New alert rule** .

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-new.png" lightbox="./media/azure-monitor-horizontal/alert-rule-new.png" alt-text="Create alert rule":::

### Configure alert logic

The resource will already be selected. You need to modify the signal logic to specify the threshold value and any other details for the alert rule. Click on the **Condition name** to view these settings. 

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-configuration.png" lightbox="./media/azure-monitor-horizontal/alert-rule-configuration.png" alt-text="Alert rule configuration":::

The chart shows the value of the selected signal over time so that you can see when the alert would have been fired. This chart will update as you specify the signal logic.

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-signal-logic.png" lightbox="./media/azure-monitor-horizontal/alert-rule-signal-logic.png" alt-text="Alert rule signal logic":::

The **Alert logic** is defined by the condition and the evaluation time. The condition is specified by the **Operator**, **Aggregation type**, and **Threshold value**. The alert fires when this condition is true. **Frequency of evaluation** defines how often the alert logic is evaluated. **Aggregation granularity** defines the time interval over which the collected values are aggregated.

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-alert-logic.png" lightbox="./media/azure-monitor-horizontal/alert-rule-alert-logic.png" alt-text="Alert rule alert logic":::

### Add action group
[Action groups](../articles/azure-monitor/alerts/action-groups.md) define a set of actions to take when an alert is fired such as sending an email or an SMS message.

Click **Add action groups** to add one to the alert rule.

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-add-action-group.png" lightbox="./media/azure-monitor-horizontal/alert-rule-add-action-group.png" alt-text="Add action group":::


### Create action group

If you don't already have an action group in your subscription to select, then click **Create action group** to create a new one.

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-create-action-group.png" lightbox="./media/azure-monitor-horizontal/alert-rule-create-action-group.png" alt-text="Create action group":::

Select a **Subscription** and **Resource group** for the action group and give it an **Action group name** that will appear in the portal and a **Display name** that will appear in email and SMS notifications.

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-action-group-basics.png" lightbox="./media/azure-monitor-horizontal/alert-rule-create-action-basics.png" alt-text="Action group basics":::

Select **Notifications** and add one or mre methods to notify appropriate people when the alert is fired.

:::image type="content" source="./media/azure-monitor-horizontal/alert-rule-action-group-notifications.png" lightbox="./media/azure-monitor-horizontal/alert-rule-action-group-notifications.png" alt-text="Action group notifications":::


See [Create, view, and manage metric alerts using Azure Monitor](../includes/artices/azure-monitor/alerts/alerts-metric.md) for a description of all of the settings for an alert rule and additional options.
