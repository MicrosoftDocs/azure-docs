---
title: Downtime, SLA, and outages workbook - Application Insights
description: Calculate and report SLA for web test through a single pane of glass across your Application Insights resources and Azure subscriptions.
ms.topic: conceptual
ms.date: 04/28/2024
ms.reviewer: cogoodson
---

# Downtime, SLA, and outages workbook

This article introduces a simple way to calculate and report service-level agreement (SLA) for web tests through a single pane of glass across your Application Insights resources and Azure subscriptions. The downtime and outage report provides powerful prebuilt queries and data visualizations to enhance your understanding of your customer's connectivity, typical application response time, and experienced downtime.

The SLA workbook template is accessible through the workbook gallery in your Application Insights resource. Or, in the left pane, select **Availability** and then select **SLA Report** at the top of the screen.
:::image type="content" source="./media/sla-report/availability.png" alt-text="Screenshot that shows the Availability tab with SLA Report highlighted." lightbox="./media/sla-report/availability.png":::

:::image type="content" source="./media/sla-report/workbook-gallery.png" alt-text="Screenshot of the workbook gallery with the Downtime & Outages workbook highlighted." lightbox ="./media/sla-report/workbook-gallery.png":::

## Parameter flexibility

The parameters set in the workbook influence the rest of your report.

:::image type="content" source="./media/sla-report/parameters.png" alt-text=" Screenshot that shows parameters." lightbox= "./media/sla-report/parameters.png":::

* `Subscriptions`, `App Insights Resources`, and `Web Test`: These parameters determine your high-level resource options. They're based on Log Analytics queries and are used in every report query.
* `Failure Threshold` and `Outage Window`: You can use these parameters to determine your own criteria for a service outage. An example is the criteria for an App Insights Availability alert based on a failed location counter over a chosen period. The typical threshold is three locations over a five-minute window.
* `Maintenance Period`: You can use this parameter to select your typical maintenance frequency. `Maintenance Window` is a datetime selector for an example maintenance period. All data that occurs during the identified period will be ignored in your results.
* `Availability Target %`: This parameter specifies your target objective and takes custom values.

## Overview page

The overview page contains high-level information about your:

- Total SLA (excluding maintenance periods, if defined).
- End-to-end outage instances.
- Application downtime.

Outage instances are defined by when a test starts to fail until it's successful, based on your outage parameters. If a test starts failing at 8:00 AM and succeeds again at 10:00 AM, that entire period of data is considered the same outage.

:::image type="content" source="./media/sla-report/overview.png" alt-text="Screenshot that shows an overview page showing the Overview Table by Test." lightbox="./media/sla-report/overview.png":::

You can also investigate the longest outage that occurred over your reporting period.

Some tests are linkable back to their Application Insights resource for further investigation. But that's only possible in the [workspace-based Application Insights resource](create-workspace-resource.md).

## Downtime, outages, and failures

The **Outages & Downtime** tab has information on total outage instances and total downtime broken down by test.

:::image type="content" source="./media/sla-report/outages-downtime.png" alt-text="Screenshot that shows the Outages & Downtime tab in the downtime and outages workbook." lightbox="./media/sla-report/outages-downtime.png":::

The **Failures by Location** tab has a geo-map of failed testing locations to help identify potential problem connection areas.

:::image type="content" source="./media/sla-report/failure-location.png" alt-text="Screenshot that shows the Failure by Location tab in the downtime and outages workbook." lightbox="./media/sla-report/failure-location.png":::

## Edit the report

You can edit the report like any other [Azure Monitor workbook](../visualize/workbooks-overview.md).

:::image type="content" source="./media/sla-report/customize-visualization-edit.png" alt-text="Screenshot that shows selecting the Edit button to change the visualization to a pie chart.":::

You can customize the queries or visualizations based on your team's needs.

:::image type="content" source="./media/sla-report/customize-visualization-pie-chart.png" alt-text="Screenshot that shows changing the visualization to a pie chart." lightbox="./media/sla-report/customize-visualization-pie-chart.png":::

### Log Analytics

The queries can all be run in [Log Analytics](../logs/log-analytics-overview.md) and used in other reports or dashboards.

:::image type="content" source="./media/sla-report/reuse-query.png" alt-text="Screenshot that shows how to access a log query." lightbox="./media/sla-report/reuse-query.png":::

Remove the parameter restriction and reuse the core query.

:::image type="content" source="./media/sla-report/edit-query.png" alt-text="Screenshot that shows a log query that you can reuse." lightbox="./media/sla-report/edit-query.png":::

## Access and sharing

The report can be shared with your teams and leadership or pinned to a dashboard for further use. The user needs to have read permission/access to the Application Insights resource where the actual workbook is stored.

:::image type="content" source="./media/sla-report/share.png" alt-text=" Screenshot that shows the Share Template pane." lightbox= "./media/sla-report/share.png":::

## Next steps

- Learn some [Log Analytics query optimization tips](../logs/query-optimization.md).
- Learn how to [create a chart in workbooks](../visualize/workbooks-chart-visualizations.md).
- Learn how to monitor your website with [availability tests](availability-overview.md).