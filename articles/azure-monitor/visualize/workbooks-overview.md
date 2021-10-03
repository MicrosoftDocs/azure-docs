---
title: Azure Monitor Workbooks Overview
description: Learn how workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal.
services: azure-monitor

ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/23/2020
---

# Azure Monitor Workbooks

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences.

Here is a video walkthrough on creating workbooks.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B4Ap]

> [!NOTE]
> Legacy and private workbooks have been removed. Use the the [workbook retrieval tool](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Documentation/LegacyAI/DeprecatedWorkbookRetrievalTool.md) to retrieve the contents of your old workbook.

## Data sources

Workbooks can query data from multiple sources within Azure. Authors of workbooks can transform this data to provide insights into the availability, performance, usage, and overall health of the underlying components. For instance, analyzing performance logs from virtual machines to identify high CPU or low memory instances and displaying the results as a grid in an interactive report.
  
But the real power of workbooks is the ability to combine data from disparate sources within a single report. This allows for the creation of composite resource views or joins across resources enabling richer data and insights that would otherwise be impossible.

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

### Pinning Visualizations

Text, query, and metrics steps in a workbook can be pinned by using the pin button on those items while the workbook is in pin mode, or if the workbook author has enabled settings for that element to make the pin icon visible.

To access pin mode, select **Edit** to enter editing mode, and select the blue pin icon in the top bar. An individual pin icon will then appear above each corresponding workbook part's *Edit* box on the right-hand side of your screen.

:::image type="content" source="./media/workbooks-overview/pin-experience.png" alt-text="Screenshot of the pin experience." border="false":::

> [!NOTE]
> The state of the workbook is saved at the time of the pin, and pinned workbooks on a dashboard will not update if the underlying workbook is modified. In order to update a pinned workbook part, you will need to delete and re-pin that part.

## Getting started

To explore the workbooks experience, first navigate to the Azure Monitor service. This can be done by typing **Monitor** into the search box in the Azure portal.

Then select **Workbooks**.

:::image type="content" source="./media/workbooks-overview/workbooks.png" alt-text="Screenshot of Workbooks button highlighted in a red box." border="false":::

### Gallery

The gallery makes it convenient to organize, sort, and manage workbooks of all types.

:::image type="content" source="./media/workbooks-overview/gallery-all-tab.png" alt-text="Screenshot of the gallery on the all tab." lightbox="media/workbooks-overview/gallery-all-tab.png":::

#### Gallery tabs

There are four tabs in the gallery to help organize workbook types.

| Tab              | Description                                       |
|------------------|---------------------------------------------------|
| All | Shows the top four items for each type - workbooks, public templates, and my templates. Workbooks are sorted by modified date so you will see the most recent eight modified workbooks.|
| Workbooks | Shows the list of all the available workbooks that you created or are shared with you. |
| Public Templates | Shows the list of all the available ready to use, get started functional workbook templates published by Microsoft. Grouped by category. |
| My Templates | Shows the list of all the available deployed workbook templates that you created or are shared with you. Grouped by category. |

#### Features

* In each tab, there is a grid with info on the workbooks. It includes description, last modified date, tags, subscription, resource group, region, and shared state. You can also sort the workbooks by this information.
* Filter by resource group, subscriptions, workbook/template name, or template category.
* Select multiple workbooks to delete or bulk delete.
* Each Workbook has a context menu (ellipsis/three dots at the end), selecting it will open a list of quick actions.
    * View resource - Access workbook resource tab to see the resource ID of the workbook, add tags, manage locks etc.
    * Delete or rename workbook.
    * Pin workbook to dashboard.

### Workbooks versus workbook templates

You can see a _workbook_ in green and a number of _workbook templates_ in purple. Templates serve as curated reports that are designed for flexible reuse by multiple users and teams. Opening a template creates a transient workbook populated with the content of the template.

You can adjust the template-based workbook's parameters and perform analysis without fear of breaking the future reporting experience for colleagues. If you open a template, make some adjustments, and then select the save icon you will be saving the template as a workbook which would then show in green leaving the original template untouched.

Under the hood, templates also differ from saved workbooks. Saving a workbook creates an associated Azure Resource Manager resource, whereas the transient workbook created when just opening a template has no unique resource associated with it. To learn more about how access control is managed in workbooks consult the [workbooks access control article](../visualize/workbooks-access-control.md).

### Exploring a workbook template

Select **Application Failure Analysis** to see one of the default application workbook templates.

:::image type="content" source="./media/workbooks-overview/failure-analysis.png" alt-text="Screenshot of application failure analysis template." border="false" lightbox="./media/workbooks-overview/failure-analysis.png":::

As stated previously, opening the template creates a temporary workbook for you to be able to interact with. By default, the workbook opens in reading mode which displays only the information for the intended analysis experience that was created by the original template author.

In the case of this particular workbook, the experience is interactive. You can adjust the subscription, targeted apps, and the time range of the data you want to display. Once you have made those selections the grid of HTTP Requests is also interactive whereby selecting an individual row will change what data is rendered in the two charts at the bottom of the report.

### Editing mode

To understand how this workbook template is put together you need to swap to editing mode by selecting **Edit**.

:::image type="content" source="./media/workbooks-overview/edit.png" alt-text="Screenshot of edit button in workbooks." border="false" :::

Once you have switched to editing mode you will notice a number of **Edit** boxes appear to the right corresponding with each individual aspect of your workbook.

:::image type="content" source="./media/workbooks-overview/edit-mode.png" alt-text="Screenshot of Edit button." border="false" lightbox="./media/workbooks-overview/edit-mode.png":::

If we select the edit button immediately under the grid of request data we can see that this part of our workbook consists of a Kusto query against data from an Application Insights resource.

:::image type="content" source="./media/workbooks-overview/kusto.png" alt-text="Screenshot of underlying Kusto query." border="false" lightbox="./media/workbooks-overview/kusto.png":::

Selecting the other **Edit** buttons on the right will reveal a number of the core components that make up workbooks like markdown-based [text boxes](../visualize/workbooks-text-visualizations.md), [parameter selection](../visualize/workbooks-parameters.md) UI elements, and other [chart/visualization types](#visualizations).

Exploring the pre-built templates in edit-mode and then modifying them to fit your needs and save your own custom workbook is an excellent way to start to learn about what is possible with Azure Monitor workbooks.

## Dashboard time ranges

Pinned workbook query parts will respect the dashboard's time range if the pinned item is configured to use a *Time Range* parameter. The dashboard's time range value will be used as the time range parameter's value, and any change of the dashboard time range will cause the pinned item to update. If a pinned part is using the dashboard's time range, you will see the subtitle of the pinned part update to show the dashboard's time range whenever the time range changes.

Additionally, pinned workbook parts using a time range parameter will auto refresh at a rate determined by the dashboard's time range. The last time the query ran will appear in the subtitle of the pinned part.

If a pinned step has an explicitly set time range (does not use a time range parameter), that time range will always be used for the dashboard, regardless of the dashboard's settings. The subtitle of the pinned part will not show the dashboard's time range, and the query will not auto-refresh on the dashboard. The subtitle will show the last time the query executed.

> [!NOTE]
> Queries using the *merge* data source are not currently supported when pinning to dashboards.

## Sharing workbook templates

Once you start creating your own workbook templates you might want to share it with the wider community. To learn more, and to explore other templates that aren't part of the default Azure Monitor gallery view visit our [GitHub repository](https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/README.md). To browse existing workbooks, visit the [Workbook library](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks) on GitHub.


## Next step

* [Get started](#visualizations) learning more about workbooks many rich visualizations options.
* [Control](../visualize/workbooks-access-control.md) and share access to your workbook resources.