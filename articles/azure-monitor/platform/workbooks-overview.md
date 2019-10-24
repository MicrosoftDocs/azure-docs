---
title: Create interactive reports with Azure Monitor workbooks | Microsoft docs
description: Simplify complex reporting with prebuilt and custom parameterized workbooks
services: azure-monitor
author: mrbullwinkle
manager: carmonm
ms.service: azure-monitor
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/15/2019
ms.author: mbullwin
---

# Azure Monitor Workbooks

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences. 

## Data sources

Workbooks can query data from multiple sources within Azure. Authors of workbooks can transform this data to provide insights into the availability, performance, usage, and overall health of the underlying components. For instance, analyzing performance logs from virtual machines to identify high CPU or low memory instances and displaying the results as a grid in an interactive report.
  
But the real power of workbooks is the ability to combine data from disparate sources within a single report. This allows for the creation of composite resource views or joins across resources enabling richer data and insights that would otherwise be impossible.

Workbooks are currently compatible with the following data sources:

* [Logs](workbooks-data-sources.md#logs)
* [Metrics](workbooks-data-sources.md#metrics)
* [Azure Resource Graph](workbooks-data-sources.md#azure-resource-graph)
* [Alerts (Preview)](workbooks-data-sources.md#alerts-preview)
* [Workload Health (Preview)](workbooks-data-sources.md#workload-health-preview)
* [Azure Resource Health (Preview)](workbooks-data-sources.md#azure-resource-health)
* [Custom Endpoints (Preview)](workbooks-data-sources.md#custom-endpoints-preview)
* [Azure Data Explorer (Preview)](workbooks-data-sources.md#azure-data-explorer-preview)

## Visualizations

Workbooks provide a rich set of capabilities for visualizing your data. For detailed examples of each visualization type you can consult the example links below:

* [Text](workbooks-visualizations.md#text)
* [Charts](workbooks-visualizations.md#charts)
* [Grids](workbooks-visualizations.md#grids)
* [Tiles](workbooks-visualizations.md#tiles)
* [Trees](workbooks-visualizations.md#trees)
* [Graphs](workbooks-visualizations.md#graphs)

![Example workbook visualizations](./media/workbooks-overview/visualizations.png)

## Getting started

To explore the workbooks experience, first navigate to the Azure Monitor service. This can be done by typing **Monitor** into the search box in the Azure portal.

Then select **Workbooks (preview)**.

![Screenshot of Workbooks preview button highlighted in a red box](./media/workbooks-overview/workbooks-preview.png)

### Gallery

This takes you to the workbooks gallery:

![Screenshot of Azure Monitor workbooks gallery view](./media/workbooks-overview/gallery.png)

### Workbooks versus workbook templates

You can see a _workbook_ in green and a number of _workbook templates_ in purple. Templates serve as curated reports that are designed for flexible reuse by multiple users and teams. Opening a template creates a transient workbook populated with the content of the template. 

You can adjust the template-based workbook's parameters and perform analysis without fear of breaking the future reporting experience for colleagues. If you open a template, make some adjustments, and then select the save icon you will be saving the template as a workbook which would then show in green leaving the original template untouched. 

Under the hood, templates also differ from saved workbooks. Saving a workbook creates an associated Azure Resource Manager resource, whereas the transient workbook created when just opening a template has no unique resource associated with it.

### Exploring a workbook template

Select **Application Failure Analysis** to see one of the default application workbook templates.

![Screenshot of application failure analysis template](./media/workbooks-overview/failure-analysis.png)

As stated previously, opening the template creates a temporary workbook for you to be able to interact with. By default, the workbook opens in reading mode which displays only the information for the intended analysis experience that was created by the original template author.

In the case of this particular workbook, the experience is interactive. You can adjust the Subscription, targeted apps, and the time range of the data you want to display. Once you have made those selections the grid of HTTP Requests is also interactive whereby selecting an individual row will change what data is rendered in the two charts at the bottom of the report.

### Editing mode

To understand how the this workbook template is put together you need to swap to editing mode by selecting **Edit**. 

![Screenshot of application failure analysis template](./media/workbooks-overview/edit.png)

Once you have switched to editing mode you will notice a number of **Edit** boxes appear to the right corresponding with each individual aspect of your workbook.

![Screenshot of Edit button](./media/workbooks-overview/edit-mode.png)

If we select the edit button immediately under the grid of request data we can see that this part of our workbook consists of a Kusto query against data from an Application Insights resource.

![Screenshot of underlying Kusto query](./media/workbooks-overview/kusto.png)

Clicking the other **Edit** buttons on the right will reveal a number of the core components that make up workbooks like markdown-based [text boxes](workbooks-visualizations.md#text), [parameter selection](workbooks-parameters.md) UI elements, and other [chart/visualization types](workbooks-visualizations.md). 

Exploring the pre-built templates in edit-mode and then modifying them to fit your needs and save your own custom workbook is an excellent way to start to learn about what is possible with Azure Monitor workbooks.

## Sharing workbook templates

Once you start creating your own workbook templates you might want to share it with the wider community. To learn more, and to explore other templates that aren't part of the default Azure Monitor gallery view visit our [GitHub repository](https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/README.md). To browse existing workbooks, visit the [Workbook library](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks) on GitHub.

## Next steps

* [Get started](workbooks-visualizations.md) with learning more about workbook visualizations.
