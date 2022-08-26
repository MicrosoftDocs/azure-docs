---
title: Set up alerts in Azure Container Apps
description: Set up alerts to monitor you container app.
services: container-apps
author: cebundy
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 07/29/2022
ms.author: v-bcatherine
---

# Set up alerts in Azure Container Apps

Azure Monitor alerts notify you so that you can respond quickly to critical issues.  There are two types of alerts that you can define:

- [metric alerts](../azure-monitor/alerts/alerts-metric-overview.md) based on metric data
- [log alerts](../azure-monitor/alerts/alerts-unified-log.md) based on log data

You can create alert rules from metric charts in the metric explorer and from queries in Log Analytics.  You can also define and manage alerts from the **Monitor>Alerts** page. 
 
To learn more about alerts, refer to [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

### Create metric alert rules

When you add alert rules to a metric chart in the metrics explorer, alerts are triggered when the collected metric data matches alert rule conditions.  

After creating a [metric chart](metrics.md#view-metrics-with-metrics-explorer), you can create a new alert rule.

1. Select **New alert rule**.  This opens the **Condition** tab that contains a condition populated with the metric chart settings. 
1. Select the condition.
    :::image type="content" source="media/observability/metrics-alert-create-condition.png" alt-text="Screenshot of the metric explorer alert rule editor.  A condition is automatically created based on the chart settings.":::
1. Enter the threshold values.
1. Modify the alert logic to meet your needs. For example to configure the alert to trigger when the metric value is above the threshold for 5 minutes, select **5 minutes** from the **For** drop-down list.
    :::image type="content" source="media/observability/screenshot-configure-alert-signal-logic.png" alt-text="Screenshot of the configure alert signal logic in Azure Container Apps.":::
1. Select **Done**.
1. You can add more conditions to the alert rule.  For example, you can add a condition that triggers when the metric value is below a threshold.  See 
1. Select the **Details** tab.
1. Enter a name and description for the alert rule.
1. Select **Review + create**.
1. Select **Create**.
   :::image type="content" source="media/observability/screenshot-alert-details-dialog.png" alt-text="Screen shot of the alert details configuration page.":::


#### Add conditions to an alert rule

You can add more conditions to your alert rule:

1. Select **Add condition** in the **Create an alert rule** pane.

1. Select from the metrics listed in the **Select a signal** pane.
:::image type="content" source="media/observability/metrics-alert-select-a-signal.png" alt-text="Screenshot of the metric explorer alert rule editor showing the Select a signal pane.":::
1. Configure the settings for your alert condition.  For more information about configuring alerts, see [Manage metric alerts](../azure-monitor/alerts/alerts-metric.md).

    You can receive individual alerts for specific revisions or replicas by enabling alert splitting and selecting **Revision** or **Replica** from the **Dimension name** list.

    Example of selecting a dimension to split an alert.

    :::image type="content" source="media/observability/metrics-alert-split-by-dimension.png" alt-text="Screenshot of the metrics explorer alert rule editor.  This example shows the Split by dimensions options in the Configure signal logic pane.":::

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

### Create log alert rules

Use Log Analytics to create alert rules from a log query.  When you create an alert rule from a query, the query is run at set intervals triggering alerts when the log data matches the alert rule conditions.  To learn more about creating log alert rules, see [Manage log alerts](../azure-monitor/alerts/alerts-log.md).

To create an alert rule:
1. First create and run a query to validate it.  
1. Select **New alert rule**.  
:::image type="content" source="media/observability/log-alert-new-alert-rule.png" alt-text="Screenshot of the Log Analytics interface highlighting the new alert rule button.":::
1. The **Create an alert rule** editor is opened to the **Condition** tab, which is populated with your log query.  Configure the settings in the **Measurement** and **Alert logic** sections to complete the alert rule.

:::image type="content" source="media/observability/log-alerts-rule-editor.png" alt-text="Screenshot of the Log Analytics alert rule editor.":::

Optionally, you can enable alert splitting in the alert rule to send individual alerts for each dimension you select in the **Split by dimensions** section of the editor.  The dimensions for Container Apps are:

- app name
- revision
- container
- log message

:::image type="content" source="media/observability/log-alerts-splitting.png" alt-text="Screenshot of the Log Analytics alert rule editor showing the Split by dimensions options":::

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)