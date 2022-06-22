---
title: Creating an Azure Workbook
description: Learn how to create an Azure Workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Creating an Azure Workbook
This article describes how to create a new workbook and how to add elements to your Azure Workbook.

This video provides a walkthrough of creating workbooks.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B4Ap]

## Create a new Azure Workbook
To create a new Azure workbook:
1. From the Azure Workbooks page, select an empty template or select **New** in the top toolbar.
1. Combine any of these steps to include the elements you want to the workbook:
   - text
   - parameters
   - queries
   - metrics
   - links
   - groups
   - configuration options

## Adding text to your workbook

Workbooks allow authors to include text blocks in their workbooks. The text can be human analysis of the telemetry, information to help users interpret the data, section headings, etc. 

   :::image type="content" source="media/workbooks-add-text/workbooks-text-example.png" alt-text="Screenshot of adding text to a workbook.":::

Text is added through a markdown control into which an author can add their content. An author can use the full formatting capabilities of markdown. These include different heading and font styles, hyperlinks, tables, etc. This allows authors to create rich Word- or Portal-like reports or analytic narratives.  Text can contain parameter values in the markdown text, and those parameter references will be updated as the parameters change.

**Edit mode**:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-control-edit-mode.png" alt-text="Screenshot showing adding text to a workbook in edit mode.":::

**Preview mode**:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-control-edit-mode-preview.png" alt-text="Screenshot showing adding text to a workbook in preview mode.":::

### Add text to an Azure workbook
1. Make sure you are in **Edit** mode. Add a query by doing any one of the following:
    - Select **Add**, and **Add text** below an existing element
    - Select **Add**, and **Add text** at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook, then select **Add** and then **Add text**.
1. Enter markdown text into the editor field.
1. Use the **Text Style** option to switch between plain markdown, and markdown wrapped with the Azure portal's standard info/warning/success/error styling.
   
   > [!TIP]
   > Use this [markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to see the different formatting options.

1. Use the Preview tab to see how your content will look. While editing, the preview will show the content inside a scrollable area to limit its size, but when displayed at runtime, the markdown content will expand to fill whatever space it needs, with out a scrollbar.
1. Select **Done Editing**.

### Text styles
These text styles are available:

| Style     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| plain| No other formatting is applied                                                     |
|info| The portal's "info" style, with a `ℹ` or similar icon and blue background     |
|error| The portal's "error" style, with a `❌` or similar icon and red background     |
|success| The portal's "success" style, with a `✔` or similar icon and green background |
|upsell| The portal's "upsell" style, with a `🚀` or similar icon and purple background  |
|warning| The portal's "warning" style, with a `⚠` or similar icon and blue background  |


You can also choose a text parameter as the source of the style. The parameter value must be one of the above text values. The absence of a value, or any unrecognized value will be treated as `plain` style.

### Text style examples

**Info style example**:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-control-edit-mode-preview.png" alt-text="Screenshot of adding text to a workbook in preview mode showing info style.":::

**Warning style example**:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-example-warning.png" alt-text="Screenshot of a text visualization in warning style.":::

## Adding queries to your workbook

Azure Workbooks allow you to query any of the supported workbook [data sources](workbooks-data-sources.md). 

For example, you can query Azure Resource Health that helps you view any service problems affecting your resources, or you can query Azure Monitor Metrics, which are numeric data that is collected at regular intervals and describe some aspect of a system at a particular time.

### Add a query to an Azure Workbook

1. Make sure you are in **Edit** mode. Add a query by doing any one of the following:
    - Select **Add**, and **Add query** below an existing element
    - Select **Add**, and **Add query** at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook, then select **Add** and then **Add query**.
1. Select the [Data source](workbooks-data-sources.md) for your query. The other fields are determined based on the data source you choose.
1. Select any other values that are required based on the data source you selected.
1. Select the [Visualization](workbooks-visualizations.md) for your workbook.
1. In the query section, enter your query, or select from a list of sample queries by selecting **Samples**, and then edit the query to your liking.
1. Select **Run Query**.
1. When you are sure you have the query you want in your workbook, select **Done editing**.


## Next steps
- [Getting started with Azure Workbooks](workbooks-getting-started.md).
- [Azure workbooks data sources](workbooks-data-sources.md).