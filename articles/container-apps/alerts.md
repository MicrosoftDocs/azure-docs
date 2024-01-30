---
title: Set up alerts in Azure Container Apps
description: Set up alerts to monitor your container app.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 08/30/2022
ms.author: v-wellsjason
---

# Set up alerts in Azure Container Apps

Azure Monitor alerts notify you so that you can respond quickly to critical issues.  There are two types of alerts that you can define:

- [Metric alerts](../azure-monitor/alerts/alerts-metric-overview.md) based on Azure Monitor metric data
- [Log alerts](../azure-monitor/alerts/alerts-unified-log.md) based on Azure Monitor Log Analytics data

You can create alert rules from metric charts in the metric explorer and from queries in Log Analytics.  You can also define and manage alerts from the **Monitor>Alerts** page.  To learn more about alerts, refer to [Overview of alerts in Microsoft Azure](../azure-monitor/alerts/alerts-overview.md).

The **Alerts** page in the **Monitoring** section on your container app page displays all of your app's alerts.  You can filter the list by alert type, resource, time and severity.  You can also modify and create new alert rules from this page.

## Create metric alert rules

When you create alerts rules based on a metric chart in the metrics explorer, alerts are triggered when the metric data matches alert rule conditions. For more information about creating metrics charts, see [Using metrics explorer](metrics.md#using-metrics-explorer)

After creating a metric chart, you can create a new alert rule.

1. Select **New alert rule**.  The **Create an alert rule** page is opened to the **Condition** tab.  Here you'll find a *condition* that is populated with the metric chart settings. 
1. Select the condition.
    :::image type="content" source="media/observability/metrics-alert-create-condition.png" alt-text="Screenshot of the metric explorer alert rule editor.  A condition is automatically created based on the chart settings.":::
1. Modify the **Alert logic** section to set the alert criteria. You can set the alert to trigger when the metric value is greater than, less than, or equal to a threshold value.  You can also set the alert to trigger when the metric value is outside of a range of values.  
    :::image type="content" source="media/observability/screenshot-configure-alert-signal-logic.png" alt-text="Screenshot of the configure alert signal logic in Azure Container Apps.":::
1. Select **Done**.
1. You can add more conditions to the alert rule by selecting **Add condition** on the **Create an alert rule** page.  
1. Select the **Details** tab.
1. Enter a name and description for the alert rule.
1. Select **Review + create**.
1. Select **Create**.
   :::image type="content" source="media/observability/screenshot-alert-details-dialog.png" alt-text="Screen shot of the alert details configuration page.":::


### Add conditions to an alert rule

To add more conditions to your alert rule:

1. Select **Alerts**  from the left side menu of your container app page.
1. Select **Alert rules** from the top menu.
1. Select an alert from the table.
1. Select **Add condition** in the **Condition** section.
1. Select from the metrics listed in the **Select a signal** pane.
  :::image type="content" source="media/observability/metrics-alert-select-a-signal.png" alt-text="Screenshot of the metric explorer alert rule editor showing the Select a signal pane.":::
1. Configure the settings for your alert condition.  For more information about configuring alerts, see [Manage metric alerts](../azure-monitor/alerts/alerts-metric.md).

 You can receive individual alerts for specific revisions or replicas by enabling alert splitting and selecting **Revision** or **Replica** from the **Dimension name** list.

Example of selecting a dimension to split an alert.

:::image type="content" source="media/observability/metrics-alert-split-by-dimension.png" alt-text="Screenshot of the metrics explorer alert rule editor.  This example shows the Split by dimensions options in the Configure signal logic pane.":::

 To learn more about configuring alerts, visit [Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md)

## Create log alert rules

You can create log alerts from queries in Log Analytics.  When you create an alert rule from a query, the query is run at set intervals triggering alerts when the log data matches the alert rule conditions.  To learn more about creating log alert rules, see [Manage log alerts](../azure-monitor/alerts/alerts-log.md).

To create an alert rule:

1. First, create and run a query to validate the query.  
1. Select **New alert rule**.  
:::image type="content" source="media/observability/log-alert-new-alert-rule.png" alt-text="Screenshot of the Log Analytics interface highlighting the new alert rule button.":::
1. The **Create an alert rule** editor is opened to the **Condition** tab, which is populated with your log query.  
  :::image type="content" source="media/observability/log-alerts-rule-editor.png" alt-text="Screenshot of the Log Analytics alert rule editor.":::
1. Configure the settings in the **Measurement**  section
  :::image type="content" source="media/observability/screenshot-metrics-alerts-measurements.png" alt-text="Screen shot of metrics Create an alert rule measurement section.":::
1. Optionally, you can enable alert splitting in the alert rule to send individual alerts for each dimension you select in the **Split by dimensions** section of the editor.
  :::image type="content" source="media/observability/log-alerts-splitting.png" alt-text="Screenshot of the Create an alert rule Split by dimensions section":::
1. Enter the threshold criteria in the**Alert logic** section.
    :::image type="content" source="media/observability/log-alert-alert-logic.png" alt-text="Screenshot of the Create an alert rule Alert logic section.":::
1. Select the **Details** tab.
1. Enter a name and description for the alert rule.
:::image type="content" source="media/observability/screenshot-alert-details-dialog.png" alt-text="Screen shot of the alert details configuration page.":::
1. Select **Review + create**.
1. Select **Create**.

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)