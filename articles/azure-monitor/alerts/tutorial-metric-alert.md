---
title: Tutorial - Create a metric alert for an Azure resource
description: Learn how to create a metric chart with Azure metrics explorer.
author: bwren
ms.author: bwren
ms.topic: tutorial
ms.date: 09/15/2021
---

# Tutorial: Create a metric alert for an Azure resource
Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. Metric alert rules create an alert when a metric value from an Azure resource exceeds a threshold.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a metric alert rule from metrics explorer
> * Configure the alert threshold
> * Create an action group to define notification details

## Prerequisites
To complete this tutorial you need the following: 

- An Azure resource to monitor. You can use any resource in your Azure subscription that supports metrics. To determine whether a resource supports metrics, go to its menu in the Azure portal and verify that there's a **Metrics** option in the **Monitoring** section of the menu.
- Chart in metrics explorer with one or more metrics that you want to alert on. Complete [Tutorial: Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md).

## Create new alert rule
From metrics explorer, click **New alert rule**. The rule will be preconfigured with the target object and the metric that you selected in metrics explorer.

:::image type="content" source="media/tutorial-metric-alert/new-alert-rule.png" alt-text="New alert rule" lightbox="media/tutorial-metric-alert/new-alert-rule.png":::

## Configure alert logic
The resource will already be selected. You need to modify the signal logic to specify the threshold value and any other details for the alert rule. 

Click on the **Condition name** to view these settings. 

:::image type="content" source="./media/tutorial-metric-alert/configuration.png" lightbox="./media/tutorial-metric-alert/configuration.png" alt-text="Alert rule configuration":::

The chart shows the value of the selected signal over time so that you can see when the alert would have been fired. This chart will update as you specify the signal logic.

:::image type="content" source="./media/tutorial-metric-alert/signal-logic.png" lightbox="./media/tutorial-metric-alert/signal-logic.png" alt-text="Alert rule signal logic":::

The **Alert logic** is defined by the condition and the evaluation time. The alert fires when this condition is true. Provide a **Threshold value** for your alert rule and modify the **Operator** and **Aggregation type** as needed.

:::image type="content" source="./media/tutorial-metric-alert/alert-logic.png" lightbox="./media/tutorial-metric-alert/alert-logic.png" alt-text="Alert rule alert logic":::

You can accept the default time granularity or modify it to your requirements. **Frequency of evaluation** defines how often the alert logic is evaluated. **Aggregation granularity** defines the time interval over which the collected values are aggregated.

Click **Done** when you're done configuring the signal logic.

## Add action group
[!INCLUDE [Action groups](../../../includes/azure-monitor-tutorial-action-group.md)]

## Configure alert rule details

Provide an **Alert rule name**. This should be descriptive since it will be displayed when the alert is fired. Optionally provide a description that's included in the details of the alert.



Specify a subscription and resource group for the alert rule. This doesn't need to be in the same resource group as the resource that you're monitoring. 

Specify a **Severity** for the alert. The severity allows you to group alerts with a similar relative importance.

Keep the box checked to **Enable alert upon creation**.

Keep the box checked to **Automatically resolve alerts**. This will automatically resolve the alert when the metric value drops below the threshold. For example, you may create an alert when the CPU of a virtual machine exceeds 80%. If the alert fires, then next time the CPU drops below 80%, the alert will be automatically resolved.

Click **Create alert rule** to create the alert rule.


## View the alert
When an alert fires, it will send any notifications in its action groups. You can also view the alert in the Azure portal.

Select **Alerts** from the resource's menu.

If there are any open alerts for the resources, they will be included in the view.

:::image type="content" source="./media/tutorial-metric-alert/alerts-view.png" lightbox="./media/tutorial-metric-alert/alerts-view.png" alt-text="Alerts view":::

Click on a severity to show the alerts with that severity. Select the **Alert state** and unselect **Closed** to view only open alerts.

:::image type="content" source="./media/tutorial-metric-alert/alert-state.png" lightbox="./media/tutorial-metric-alert/alert-state.png" alt-text="Alert state filter":::

Click on the name of an alert to view its detail.

:::image type="content" source="./media/tutorial-metric-alert/alert-detail.png" lightbox="./media/tutorial-metric-alert/alert-detail.png" alt-text="Alert detail":::


## Next steps
Now that you've learned how to create a metric alert for an Azure resource in Azure Monitor, create a Log Analytics workspace to collect log data for your resources.

> [!div class="nextstepaction"]
> [Create Log Analytics workspace in Azure Monitor](../logs/tutorial-workspace.md)

