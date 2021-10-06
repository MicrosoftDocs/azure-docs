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

The **Alert logic** is defined by the condition and the evaluation time. The alert fires when this condition is true. Provide a **Threshold value** for your alert rule and modify the **Operator** and **Aggregation type** to define the logic you need.

:::image type="content" source="./media/tutorial-metric-alert/alert-logic.png" lightbox="./media/tutorial-metric-alert/alert-logic.png" alt-text="Alert rule alert logic":::

You can accept the default time granularity or modify it to your requirements. **Frequency of evaluation** defines how often the alert logic is evaluated. **Aggregation granularity** defines the time interval over which the collected values are aggregated.

Click **Done** when you're done configuring the signal logic.

## Configure actions
[!INCLUDE [Action groups](../../../includes/azure-monitor-tutorial-action-group.md)]

## Configure details
[!INCLUDE [Alert details](../../../includes/azure-monitor-tutorial-alert-details.md)]


Keep the box checked to **Enable alert upon creation** and the box to **Automatically resolve alerts**. This will automatically resolve the alert when the metric value drops below the threshold. For example, you may create an alert when the CPU of a virtual machine exceeds 80%. If the alert fires, then next time the CPU drops below 80%, the alert will be automatically resolved.

Click **Create alert rule** to create the alert rule.


## View the alert
[!INCLUDE [View alert](../../../includes/azure-monitor-tutorial-view-alert.md)]


## Next steps
Now that you've learned how to create a metric alert for an Azure resource, use one of the following tutorials to collect log data.

> [!div class="nextstepaction"]
> [Collect resource logs from an Azure resource](../essentials/tutorial-resource-logs.md)
> [!div class="nextstepaction"]
> [Collect guest metrics and logs from Azure virtual machine](../vm/tutorial-data-collection-rule-vm.md)