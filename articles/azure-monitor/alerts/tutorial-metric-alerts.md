---
title: Tutorial - Create a metrics chart in Azure Monitor
description: Learn how to create a metric chart with Azure metrics explorer.
author: bwren
ms.author: bwren
ms.topic: tutorial
ms.date: 03/09/2020
---

# Tutorial: Create a metric alert in Azure Monitor
Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. Metric alert rules create an alert when a metric value from an Azure resource exceeds a threshold.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a metric alert rule from metrics explorer
> * Configure the alert threshold
> * Create an action group to define notification details



## Create new alert rule
Create an alert rule directly from metrics explorer. The rule will be preconfigured with the target object and the metric that you selected in metrics explorer.

1. From metrics explorer, click **New alert rule**.

    :::image type="content" source="media/tutorial-metric-alerts/new-alert-rule.png" alt-text="New alert rule" lightbox="media/tutorial-metric-alerts/new-alert-rule.png":::

## Configure alert logic
The resource will already be selected. You need to modify the signal logic to specify the threshold value and any other details for the alert rule. 

1. Click on the **Condition name** to view these settings. 

    :::image type="content" source="./media/tutorial-metric-alerts/configuration.png" lightbox="./media/tutorial-metric-alerts/configuration.png" alt-text="Alert rule configuration":::

2. The chart shows the value of the selected signal over time so that you can see when the alert would have been fired. This chart will update as you specify the signal logic.

    :::image type="content" source="./media/tutorial-metric-alerts/signal-logic.png" lightbox="./media/tutorial-metric-alerts/signal-logic.png" alt-text="Alert rule signal logic":::

3. The **Alert logic** is defined by the condition and the evaluation time. The alert fires when this condition is true. Provide a **Threshold value** for your alert rule and modify the **Operator** and **Aggregation type** as needed.

    :::image type="content" source="./media/tutorial-metric-alerts/alert-logic.png" lightbox="./media/tutorial-metric-alerts/alert-logic.png" alt-text="Alert rule alert logic":::

4. You can accept the default time granularity or modify it to your requirements. **Frequency of evaluation** defines how often the alert logic is evaluated. **Aggregation granularity** defines the time interval over which the collected values are aggregated.

5. Click **Done** when you're done configuring the signal logic.

## Add action group
[Action groups](../articles/azure-monitor/alerts/action-groups.md) define a set of actions to take when an alert is fired such as sending an email or an SMS message.

1. Click **Add action groups** to add one to the alert rule.

    :::image type="content" source="./media/tutorial-metric-alerts/add-action-group.png" lightbox="./media/tutorial-metric-alerts/add-action-group.png" alt-text="Add action group":::


2. If you don't already have an action group in your subscription to select, then click **Create action group** to create a new one.

    :::image type="content" source="./media/tutorial-metric-alerts/create-action-group.png" lightbox="./media/tutorial-metric-alerts/create-action-group.png" alt-text="Create action group":::

3. Select a **Subscription** and **Resource group** for the action group and give it an **Action group name** that will appear in the portal and a **Display name** that will appear in email and SMS notifications.

    :::image type="content" source="./media/tutorial-metric-alerts/action-group-basics.png" lightbox="./media/tutorial-metric-alerts/create-action-basics.png" alt-text="Action group basics":::

4. Select **Notifications** and add one or mre methods to notify appropriate people when the alert is fired.

    :::image type="content" source="./media/tutorial-metric-alerts/action-group-notifications.png" lightbox="./media/tutorial-metric-alerts/action-group-notifications.png" alt-text="Action group notifications":::

## Configure alert rule details

1. Provide an **Alert rule name**. This should be descriptive since it will be displayed when the alert is fired. Optionally provide a description that's included in the details of the alert.



2. Specify a subscription and resource group for the alert rule. This doesn't need to be in the same resource group as the resource that you're monitoring. 

3. Specify a **Severity** for the alert. The severity allows you to group alerts with a similar relative importance.

4. Keep the box checked to **Enable alert upon creation**.
5. Keep the box checked to **Automatically resolve alerts**. This will automatically resolve the alert when the metric value drops below the threshold. For example, you may create an alert when the CPU of a virtual machine exceeds 80%. If the alert fires, then next time the CPU drops below 80%, the alert will be automatically resolved.
6. Click **Create alert rule** to create the alert rule.


## View the alert
When an alert fires, it will send any notifications in its action groups. You can also view the alert in the Azure portal.

1. Select **Alerts** from the resource's menu.
2. If there are any open alerts for the resources, they will be included in the view.

    :::image type="content" source="./media/tutorial-metric-alerts/alerts-view.png" lightbox="./media/tutorial-metric-alerts/alerts-view.png" alt-text="Alerts view":::

3. Click on a severity to show the alerts with that severity.

    :::image type="content" source="./media/tutorial-metric-alerts/alert-severity.png" lightbox="./media/tutorial-metric-alerts/alert-severity.png" alt-text="Alert severity":::

4. Select the **Alert state** and unselect **Closed** to view only open alerts.

:::image type="content" source="./media/tutorial-metric-alerts/alert-state.png" lightbox="./media/tutorial-metric-alerts/alert-state.png" alt-text="Alert state filter":::

5. Click on the name of an alert to view its detail.

    :::image type="content" source="./media/tutorial-metric-alerts/alert-detail.png" lightbox="./media/tutorial-metric-alerts/alert-detail.png" alt-text="Alert detail":::


## Next steps
Now that you've learned how to work with metrics in Azure Monitor, learn how to use metrics to send proactive alerts.

> [!div class="nextstepaction"]
> [Create, view, and manage metric alerts using Azure Monitor](../essentials/metrics-charts.md#alert-rules)

