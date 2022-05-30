---
title: Azure Workbooks Overview
description: Learn how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Azure Workbooks

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences. Workbooks let you combine multiple kinds of visualizations and analyses, making them great for free-form exploration.

Workbooks combine text, [log queries](/azure/data-explorer/kusto/query/), metrics, and parameters into rich interactive reports. Team members with the same access to Azure resources are also able to edit workbooks.

Workbooks are helpful for scenarios such as:

- 	Exploring the usage of your virtual machine when you don't know the metrics of interest in advance: CPU utilization, disk space, memory, network dependencies, etc.
-	Explaining to your team how a recently provisioned VM is performing, by showing metrics for key counters and other log events.
-	Sharing the results of a resizing experiment of your VM with other members of your team. You can explain the goals for the experiment with text, then show each usage metric and analytics queries used to evaluate the experiment, along with clear call-outs for whether each metric was above or below target.
-	Reporting the impact of an outage on the usage of your VM, combining data, text explanation, and a discussion of next steps to prevent outages in the future.

Here is a video walkthrough on creating workbooks.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B4Ap]

> [!NOTE]
> Legacy and private workbooks have been removed. Use the the [workbook retrieval tool](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Documentation/LegacyAI/DeprecatedWorkbookRetrievalTool.md) to retrieve the contents of your old workbook.

## Getting started

You can access Workbooks in a few ways:
- In the [Azure portal](https://portal.azure.com), click on **Monitor**, then select **Workbooks**.

   :::image type="content" source="./media/workbooks-overview/workbooks.png" alt-text="Screenshot of Workbooks button highlighted in a red box." border="false":::

- Open workbooks from the Workbooks tile under your Log Analytics workspace.

   ![Workbooks navigation](media/view-designer-conversion-overview/workbooks-nav.png)

## The Gallery
The gallery opens listing all the saved workbooks and templates for your workspace.

![Workbooks gallery](media/view-designer-conversion-overview/workbooks-gallery.png)

The gallery makes it convenient to organize, sort, and manage workbooks of all types.

#### Gallery tabs

There are four tabs in the gallery to help organize workbook types.

| Tab              | Description                                       |
|------------------|---------------------------------------------------|
| All | Shows the top four items for each type - workbooks, public templates, and my templates. Workbooks are sorted by modified date so you will see the most recent eight modified workbooks.|
| Workbooks | Shows the list of all the available workbooks that you created or are shared with you. |
| Public Templates | Shows the list of all the available ready to use, get started functional workbook templates published by Microsoft. Grouped by category. |
| My Templates | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

:::image type="content" source="./media/workbooks-overview/gallery-all-tab.png" alt-text="Screenshot of the gallery on the all tab." lightbox="media/workbooks-overview/gallery-all-tab.png":::

## Data sources

Workbooks can query data from multiple Azure sources. You can transform this data to provide insights into the availability, performance, usage, and overall health of the underlying components. For example:
- You can analyze performance logs from virtual machines to identify high CPU or low memory instances and display the results as a grid in an interactive report.
- You can combine data from several different sources within a single report. This allows you to create composite resource views or joins across resources enabling richer data and insights that would otherwise be impossible.

Workbooks are currently compatible with the following data sources:

* [Logs](../visualize/workbooks-data-sources.md#logs)
* [Metrics](../visualize/workbooks-data-sources.md#metrics)
* [Azure Resource Graph](../visualize/workbooks-data-sources.md#azure-resource-graph)
* [Alerts (Preview)](../visualize/workbooks-data-sources.md#alerts-preview)
* [Workload Health](../visualize/workbooks-data-sources.md#workload-health)
* [Azure Resource Health](../visualize/workbooks-data-sources.md#azure-resource-health)
* [Azure Data Explorer](../visualize/workbooks-data-sources.md#azure-data-explorer)

## Visualizations

Workbooks provide a rich set of capabilities for visualizing your data. For detailed examples of each visualization type, you can consult the links below:

* [Text](../visualize/workbooks-text-visualizations.md)
* [Charts](../visualize/workbooks-chart-visualizations.md)
* [Grids](../visualize/workbooks-grid-visualizations.md)
* [Tiles](../visualize/workbooks-tile-visualizations.md)
* [Trees](../visualize/workbooks-tree-visualizations.md)
* [Graphs](../visualize/workbooks-graph-visualizations.md)
* [Composite bar](../visualize/workbooks-composite-bar.md)
* [Honey comb](workbooks-honey-comb.md)
* [Map](workbooks-map-visualizations.md)

:::image type="content" source="./media/workbooks-overview/visualizations.png" alt-text="Example of workbook visualizations." border="false" lightbox="./media/workbooks-overview/visualizations.png":::

#### Features

* In each tab, there is a grid with info on the workbooks. It includes the description, last modified date, tags, subscription, resource group, region, and shared state. You can also sort the workbooks by this information.
* Filter by resource group, subscriptions, workbook/template name, or template category.
* Select multiple workbooks to delete or bulk delete.
* Each Workbook has a context menu (ellipsis/three dots at the end), selecting it will open a list of quick actions.
    * View resource - Access workbook resource tab to see the resource ID of the workbook, add tags, manage locks etc.
    * Delete or rename workbook.
    * Pin workbook to dashboard.



## Dashboard time ranges

Pinned workbook query parts will respect the dashboard's time range if the pinned item is configured to use a *Time Range* parameter. The dashboard's time range value will be used as the time range parameter's value, and any change of the dashboard time range will cause the pinned item to update. If a pinned part is using the dashboard's time range, you will see the subtitle of the pinned part update to show the dashboard's time range whenever the time range changes.

Additionally, pinned workbook parts using a time range parameter will auto refresh at a rate determined by the dashboard's time range. The last time the query ran will appear in the subtitle of the pinned part.

If a pinned step has an explicitly set time range (does not use a time range parameter), that time range will always be used for the dashboard, regardless of the dashboard's settings. The subtitle of the pinned part will not show the dashboard's time range, and the query will not auto-refresh on the dashboard. The subtitle will show the last time the query executed.

> [!NOTE]
> Queries using the *merge* data source are not currently supported when pinning to dashboards.



## Next step

* [Get started](#visualizations) learning more about workbooks many rich visualizations options.
* [Control](../visualize/workbooks-access-control.md) and share access to your workbook resources.