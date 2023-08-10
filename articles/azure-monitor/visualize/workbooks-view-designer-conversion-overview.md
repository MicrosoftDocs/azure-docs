---
title: Transition from View Designer to workbooks
description: Transition from View Designer to workbooks.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr

---

# Transition from View Designer to Workbooks
[View designer](view-designer.md) is a feature of Azure Monitor that allows you to create custom views to help you visualize data in your Log Analytics workspace, with charts, lists, and timelines. View designer has been transitioned to workbooks to provide a flexible canvas for data analysis and creation of rich visual reports within the Azure portal. This article helps you make the transition from View designer to Workbooks. While this article describes simple steps to recreate some of the commonly used view designer views, workbooks allow you to create and design any of your own custom visualizations and metrics.

[Workbooks](../vm/vminsights-workbooks.md) combine text, [log queries](/azure/data-explorer/kusto/query/), metrics, and parameters into rich interactive reports. Team members with the same access to Azure resources are also able to edit workbooks.

You can use workbooks to:

 - Explore the usage of your virtual machine when you don't know the metrics of interest in advance: CPU utilization, disk space, memory, network dependencies, etc. Unlike other usage analytics tools, workbooks let you combine multiple kinds of visualizations and analyses, making them great for this kind of free-form exploration.
 - Explain to your team how a recently provisioned VM is performing, by showing metrics for key counters and other log events.
 - Share the results of a resizing experiment of your VM with other members of your team. You can explain the goals for the experiment with text, then show each usage metric and analytics queries used to evaluate the experiment, along with clear call-outs for whether each metric was above or below target.
 - Report the impact of an outage on the usage of your VM, combining data, text explanation, and a discussion of next steps to prevent outages in the future.

See the [getting started](workbooks-getting-started.md) article for common workbook tasks such as creating, opening or saving a workbook.
## Why move from view designer dashboards to workbooks?

With View designer, you can generate different query-based views and visualizations, but many high-level customizations remain limited, such as formatting the grids and tile layouts or selecting alternative graphics to represent your data. View designer is restricted to a total of nine distinct tiles to represent your data.

View designer has a fixed static style of representation, while workbooks enable freedom to include and modify how the data is represented.

Workbooks is a platform that unlocks the full potential of your data. workbooks not only retain all the capabilities, but also supports more functionality through text, metrics, parameters, and much more. For example, workbooks allow users to consolidate dense grids and add search bars to easily filter and analyze the data.

These workbooks features provide additional functionality that was not available in View Designer.
- Supports both logs and metrics.
- Allows both personal views for individual access control and shared workbooks views.
- Custom layout options with tabs, sizing, and scaling controls.
- Support for querying across multiple Log Analytics workspaces, Application Insights applications, and subscriptions.
- Enables custom parameters that dynamically update associated charts and visualizations.
- Template gallery support from public GitHub.

This screenshot is from the [Workspace usage template](https://go.microsoft.com/fwlink/?linkid=874159&resourceId=Azure%20Monitor&featureName=Workbooks&itemId=community-Workbooks%2FAzure%20Monitor%20-%20Workspaces%2FWorkspace%20Usage&workbookTemplateName=Workspace%20Usage&func=NavigateToPortalFeature&type=workbook) and shows an example of what you can create with workbooks:

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbook-template-example.jpg" alt-text="Screenshot of a workbook template.":::
## Replicate common View Designer views

While View Designer manages views through the workspace summary, workbooks have a gallery that displays saved workbooks and templates for your workspace. Users can utilize the gallery to access, modify, and create views.

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-gallery.png" alt-text="Screenshot of a workbooks gallery.":::

The examples below show commonly used View Designer styles and how they can be converted to workbooks.
### Vertical workspace

Use the [sample JSON](workbooks-view-designer-conversions.md#vertical-workspace) to create a workbook that looks similar to a View Designer vertical workspace.

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-view-designer-vertical.png" alt-text="Screenshot of a workbook that looks like a vertical View Designer layout.":::

### Tabbed workspace

Use the [sample JSON](workbooks-view-designer-conversions.md#tabbed-workspace) to create a workbook that looks similar to a View Designer tabbed workspace.

This is a workbook with a data type distribution tab:

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-tab-distribution.png" alt-text="Screenshot of a workbook with a distribution tab.":::

This is a workbook with a data types over time tab:

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-tab-over-time.png" alt-text="Screenshot of a workbook with a data types over time tab.":::

## Replicate the View Designer overview tile

In View Designer, you can use the overview tile to represent and summarize the overall state. These are presented in seven tiles, ranging from numbers to charts. In workbooks, you can create similar visualizations and pin them to your [Azure portal Dashboard](../../azure-portal/azure-portal-dashboards.md). Just like the overview tiles in the Workspace summary, pinned workbook items will link directly to the workbook view.

You can also take advantage of the high level of customization features provided with Azure Dashboard, which allows auto refresh, moving, sizing, and more filtering for your pinned items and visualizations.

:::image type="content" source="media/workbooks-view-designer-conversion-overview/dashboard.png" alt-text="Screenshot of an Azure Dashboard.":::

## Pin a workbook item

1. Create a new Azure Dashboard or select an existing Azure Dashboard.
1. Follow the instructions to [pin a visualization](workbooks-getting-started.md#pin-a-visualization).
1. Check the option to **Always show the pin icon on this step**. A pin icon appears in the upper right hand corner of your workbook item. This pin enables you to pin specific visualizations to your dashboard, just like the overview tiles.

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-pin-step.png" alt-text="Screenshot of a pinned item in a workbook.":::

You may also want to pin multiple visualizations from the workbook or the entire workbook content to a dashboard.

## Pin an entire workbook
1. Enter Edit mode by selecting **Edit** in the top toolbar.
1. Use the pin icon to pin the entire workbook item or any of the individual elements and visualizations within the workbook.

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-pin-all.png" alt-text="Screenshot of a workbook with all elements pinned.":::

## Replicate the View Designer 'Donut & List' tile

View designer tiles typically consist of two sections, a visualization and a list that matches the data from the visualization, for example the **Donut & List** tile.

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-view-designer-donut.png" alt-text="Screenshot of a View Designer donut tile.":::

With workbooks, you can choose to query one or both sections of the view. Formulating queries in workbooks is a simple two-step process. First, the data is generated from the query, and second, the data is rendered as a visualization.  An example of how this view would be recreated in workbooks is as follows:

:::image type="content" source="media/workbooks-view-designer-conversion-overview/workbooks-convert-donut.png" alt-text="Screenshot of a workbook similar to a view designer donut tile.":::

## Next steps

- [Sample conversions](workbooks-view-designer-conversions.md)