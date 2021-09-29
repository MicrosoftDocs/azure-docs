---
title: Downtime, SLA, and outage workbook - Application Insights
description: Calculate and report SLA for Web Test through a single pane of glass across your Application Insights resources and Azure subscriptions.
ms.topic: conceptual
ms.date: 05/4/2021

---

# Downtime, SLA, and outages workbook

Introducing a simple way to calculate and report SLA (service-level agreement) for Web Tests through a single pane of glass across your Application Insights resources and Azure subscriptions. The Downtime and Outage report provides powerful pre-built queries and data visualizations to enhance your understanding of your customer's connectivity, typical application response time, and experienced down time.

The SLA workbook template is accessible through the workbook gallery in your Application Insights resource or through the availability tab by selecting **SLA Reports** at the top.
:::image type="content" source="./media/sla-report/availability.png" alt-text="Screenshot of availability tab with SLA Reports highlighted." lightbox="./media/sla-report/availability.png":::

:::image type="content" source="./media/sla-report/workbook-gallery.png" alt-text="Screenshot of the workbook gallery with downtime and outages workbook highlighted." lightbox ="./media/sla-report/workbook-gallery.png":::

## Parameter flexibility

The parameters set in the workbook influence the rest of your report.

:::image type="content" source="./media/sla-report/parameters.png" alt-text=" Screenshot of parameters." lightbox= "./media/sla-report/parameters.png":::

`Subscriptions`, `App Insights Resources`, and `Web Test` parameters determine your high-level resource options. These parameters are based on Log Analytics queries and used in every report query.

`Failure Threshold` and `Outage Window` allow you to determine your own criteria for a service outage, for example, the criteria for App Insights Availability alert based upon failed location counter over a chosen period. The typical threshold is three locations over a five-minute window.

`Maintenance Period` enables you to select your typical maintenance frequency and `Maintenance Window` is a datetime selector for an example maintenance period. All data that occurs during the identified period will be ignored in your results.

`Availability Target %` specifies your target objective & takes custom values.

## Overview page

The overview page contains high-level information about your total SLA (excluding maintenance periods if defined), end to end outage instances, and application downtime. Outage instances are defined by when a test starts to fail until it is successful based on your outage parameters. If a test starts failing at 8:00 am and succeeds again at 10:00 am, then that entire period of data is considered the same outage.

:::image type="content" source="./media/sla-report/overview.gif" alt-text=" GIF of overview page showing the overview table by test." lightbox="./media/sla-report/overview.gif":::

You can also investigate your longest outage that occurred over your reporting period.

Some tests are linkable back to their Application Insights resource for further investigation but that is only possible in the [Workspace-based Application Insights resource](create-workspace-resource.md).

## Downtime, outages, and failures

The **Outages and Downtime** tab has information on total outage instances and total down time broken down by test. The **Failures by Location** tab have a geo-map of failed testing locations to help identify potential problem connection areas.

:::image type="content" source="./media/sla-report/outages-failures.gif" alt-text=" GIF of Outages and Downtime tab and Failure by Location tab in the downtime and outages workbook." lightbox="./media/sla-report/outages-failures.gif":::

## Edit the report

You can edit the report like any other [Azure Monitor Workbook](../visualize/workbooks-overview.md). You can customize the queries or visualizations based on your team's needs.

:::image type="content" source="./media/sla-report/edit.gif" alt-text=" GIF of selecting the edit button to change the visualization to a pie chart." lightbox="./media/sla-report/edit.gif":::

### Log Analytics

The queries can all be run in [Log Analytics](../logs/log-analytics-overview.md) and used in other reports or dashboards. Remove the parameter restriction and reuse the core query.

:::image type="content" source="./media/sla-report/logs.gif" alt-text=" GIF of log query." lightbox="./media/sla-report/logs.gif":::

## Access and sharing

The report can be shared with your teams, leadership, or pinned to a dashboard for further use. The user needs to have read permission/access to the Applications Insights resource where the actual workbook is stored.

:::image type="content" source="./media/sla-report/share.png" alt-text=" Screenshot of share this template." lightbox= "./media/sla-report/share.png":::

## Next steps

- [Log Analytics query optimization tips](../logs/query-optimization.md).
- Learn how to [create a chart in workbooks](../visualize/workbooks-chart-visualizations.md).
- Learn how to monitor your website with [availability tests](monitor-web-app-availability.md).