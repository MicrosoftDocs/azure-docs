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

This video walks you through creating workbooks.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B4Ap]

## Create a new Azure Workbook
To create a new Azure workbook:
1. From the Azure Workbooks page, select an empty template or select **New** in the top toolbar.
1. Combine any of these elements to add to your workbook:
   - [Text](#adding-text)
   - Parameters
   - [Queries](#adding-queries)
   - [Metric charts](#adding-metric-charts)
   - [Links](#adding-links)
   - Groups
   - Configuration options

## Adding text

Workbooks allow authors to include text blocks in their workbooks. The text can be human analysis of the telemetry, information to help users interpret the data, section headings, etc. 

   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-example.png" alt-text="Screenshot of adding text to a workbook.":::

Text is added through a markdown control into which an author can add their content. An author can use the full formatting capabilities of markdown. These include different heading and font styles, hyperlinks, tables, etc. Markdown allows authors to create rich Word- or Portal-like reports or analytic narratives.  Text can contain parameter values in the markdown text, and those parameter references will be updated as the parameters change.

**Edit mode**:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-control-edit-mode.png" alt-text="Screenshot showing adding text to a workbook in edit mode.":::

**Preview mode**:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-control-edit-mode-preview.png" alt-text="Screenshot showing adding text to a workbook in preview mode.":::

### Add text to an Azure workbook
1. Make sure you are in **Edit** mode. Add a query by doing any one of the following:
    - Select **Add**, and **Add text** below an existing element, or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook, then select **Add** and then **Add text**.
1. Enter markdown text into the editor field.
1. Use the **Text Style** option to switch between plain markdown, and markdown wrapped with the Azure portal's standard info/warning/success/error styling.
   
   > [!TIP]
   > Use this [markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to see the different formatting options.

1. Use the **Preview** tab to see how your content will look. The preview shows the content inside a scrollable area to limit its size, but when displayed at runtime, the markdown content will expand to fill whatever space it needs, without a scrollbar.
1. Select **Done Editing**.

### Text styles
These text styles are available:

| Style     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| plain| No formatting is applied                                                     |
|info| The portal's "info" style, with a `ℹ` or similar icon and blue background     |
|error| The portal's "error" style, with a `❌` or similar icon and red background     |
|success| The portal's "success" style, with a `✔` or similar icon and green background |
|upsell| The portal's "upsell" style, with a `🚀` or similar icon and purple background  |
|warning| The portal's "warning" style, with a `⚠` or similar icon and blue background  |


You can also choose a text parameter as the source of the style. The parameter value must be one of the above text values. The absence of a value, or any unrecognized value will be treated as `plain` style.

### Text style examples

**Info style example**:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-control-edit-mode-preview.png" alt-text="Screenshot of adding text to a workbook in preview mode showing info style.":::

**Warning style example**:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-example-warning.png" alt-text="Screenshot of a text visualization in warning style.":::

## Adding queries

Azure Workbooks allow you to query any of the supported workbook [data sources](workbooks-data-sources.md). 

For example, you can query Azure Resource Health to help you view any service problems affecting your resources, or you can query Azure Monitor Metrics, which is numeric data collected at regular intervals and provide information about an aspect of a system at a particular time.

### Add a query to an Azure Workbook

1. Make sure you are in **Edit** mode. Add a query by doing any one of the following:
    - Select **Add**, and **Add query** below an existing element, or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook, then select **Add** and then **Add query**.
1. Select the [data source](workbooks-data-sources.md) for your query. The other fields are determined based on the data source you choose.
1. Select any other values that are required based on the data source you selected.
1. Select the [visualization](workbooks-visualizations.md) for your workbook.
1. In the query section, enter your query, or select from a list of sample queries by selecting **Samples**, and then edit the query to your liking.
1. Select **Run Query**.
1. When you are sure you have the query you want in your workbook, select **Done editing**.

## Adding metric charts

Most Azure resources emit metric data about state and health such as CPU utilization, storage availability, count of database transactions, failing app requests, etc. Workbooks allow the visualization of this data as time-series charts. 

The example below shows the number of transactions in a storage account over the prior hour. This allows the storage owner to see the transaction trend and look for anomalies in behavior.  

:::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-area.png" alt-text="Screenshot showing a metric area chart for storage transactions in a workbook.":::

### Add a metric chart to an Azure Workbook
1.  Make sure you are in **Edit** mode. Add a query by doing any one of the following:
    - Select **Add**, and **Add metric** below an existing element, or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook, then select **Add** and then **Add metric**.
3. Select a resource type (for example, Storage Account), the resources to target, the metric namespace and name, and the aggregation to use.
4. Set other parameters if needed - like time range, split-by, visualization, size and color palette. 

Here is the edit mode version of the metric chart above:

:::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-area-edit.png" alt-text="Screenshot showing a metric area chart for Storage transactions in edit mode.":::

### Metric chart parameters

| Parameter | Explanation | Example |
| ------------- |:-------------|:-------------|
| Resource Type| The resource type to target | Storage or Virtual Machine. |
| Resources| A set of resources to get the metrics value from | MyStorage1 |
| Namespace | The namespace with the metric | Storage > Blob |
| Metric| The metric to visualize | Storage > Blob > Transactions |
| Aggregation | The aggregation function to apply to the metric | Sum, Count, Average, etc. |
| Time Range | The time window to view the metric in | Last hour, Last 24 hours, etc. |
| Visualization | The visualization to use | Area, Bar, Line, Scatter, Grid |
| Split By| Optionally split the metric on a dimension | Transactions by Geo type |
| Size | The vertical size of the control | Small, medium or large |
| Color palette | The color palette to use in the chart. Ignored if the `Split by` parameter is used | Blue, green, red, etc. |

### Metric chart examples
**Transactions split by API name as a line chart**

:::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-split-line.png" alt-text="Screenshot showing a metric line chart for Storage transactions split by API name.":::


**Transactions split by response type as a large bar chart**

:::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-bar-large.png" alt-text="Screenshot showing a large metric bar chart for Storage transactions split by response type.":::

**Average latency as a scatter chart**

:::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-scatter.png" alt-text="Screenshot showing a metric scatter chart for storage latency.":::

## Adding links 

Authors can use links to create links to other views, workbooks, other items inside a workbook, or to create tabbed views within a workbook. The links can be styled as hyperlinks, buttons, and tabs.  

:::image type="content" source="media/workbooks-create-workbook/workbooks-empty-links.png" alt-text="Screenshot of adding a link to a workbook.":::
### Link styles
You can apply styles to the link element itself as well as to individual links.

**Link element styles**


|Style  |Sample  |Notes  |
|---------|---------|---------|
|Bullet List     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-bullet.png" alt-text="Screenshot of bullet style workbook link.":::         |  The default, links, appears as a bulleted list of links, one on each line.  The **Text before link** and **Text after link** fields can be used to add additional text before or after the link items.       |
|List     |:::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-list.png" alt-text="Screenshot of list style workbook link.":::         | Links appear as a list of links, with no bullets.        |
|Paragraph     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-paragraph.png" alt-text="Screenshot of paragraph style workbook link.":::        |Links appear as a paragraph of links, wrapped like a paragraph of text.         |
|Navigation     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-navigation.png" alt-text="Screenshot of navigation style workbook link.":::        | Links appear as links, with vertical dividers, or pipes (`|`) between each link.        |
|Tabs     |  :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-tabs.png" alt-text="Screenshot of tabs style workbook link.":::       |Links appear as tabs. Each link appears as a tab, no link styling options apply to individual links. See the [tabs](#using-tabs) section below for how to configure tabs.         |
|Toolbar     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-toolbar.png" alt-text="Screenshot of toolbar style workbook link.":::        | Links appear an Azure Portal styled toolbar, with icons and text.  Each link appears as a toolbar button. See the [toolbar](#using-toolbars) section below for how to configure toolbars.        |


**Link styles**

| Style | Description |
|:------------- |:-------------|
| Link | The default - links appears as a hyperlink.  URL links can only be link style.  |
| Button (Primary) | the link appears as a "primary" button in the portal, usually a blue color |
| Button (Secondary) | the links appear as a "secondary" button in the portal, usually a "transparent" color, a white button in light themes and a dark gray button in dark themes.  |

When using buttons, if required parameters are used in Button text, Tooltip text, or Value fields, and the required parameter is unset, the button will be disabled. For example, this can be used to disable buttons when no value is selected in another parameter/control.

### Link actions
Links can use all of the link actions available in [link actions](workbooks-link-actions.md), and have 2 more available actions:

| Action | Description |
|:------------- |:-------------|
|Set a parameter value | When selecting a link/button/tab, a parameter can be set to a value. Commonly tabs are configured to set a parameter to a value, which hides and shows other parts of the workbook based on that value  |
|Scroll to a step| When selecting a link, the workbook will move focus and scroll to make another step visible. This action can be use to create a "table of contents", or a "go back to the top" style experience.   |

### Using tabs

Most of the time, tab links are combined with the **Set a parameter value** action. Here's an example showing the links step configured to create 2 tabs, where select either tab will set a **selectedTab** parameter to a different value (the example shows a third tab being edited to show the parameter name and parameter value placeholders):

:::image type="content" source="media/workbooks-create-workbook/workbooks-creating-tabs.png" alt-text="Screenshot of creating tabs in workbooks.":::


You can then add other items in the workbook that are conditionally visible if the **selectedTab** parameter value is "1" by using the advanced settings:

:::image type="content" source="media/workbooks-create-workbook/workbooks-selected-tab.png" alt-text="Screenshot of conditionally visible tab in workbooks.":::

When using tabs, the first tab will be selected by default, initially setting **selectedTab** to 1, and making that step visible. Selecting the second tab will change the value of the parameter to "2", and different content will be displayed:

:::image type="content" source="media/workbooks-create-workbook/workbooks-selected-tab2.png" alt-text="Screenshot of workbooks with content displayed when selected tab is 2.":::

A sample workbook with the above tabs is available in [sample Azure Workbooks with links](workbooks-sample-links.md#sample-workbook-with-links).

### Tabs limitations
 - When using tabs, URL links are not supported. A URL link in a tab appears as a disabled tab.
 - When using tabs, no item styling is available. Items will only be displayed as tabs, and only the tab name (link text) field will be displayed. Fields that are not used in tab style are hidden while in edit mode.
- When using tabs, the first tab will become selected by default, invoking whatever action that tab has specified. If the first tab's action opens another view, that means as soon as the tabs are created, a view appears.
- While having tabs open other views is *supported*, it should be used sparingly, as most users won't expect selecting a tab to navigate. (Also, if other tabs are setting parameter to a specific value, a tab that opens a view would not change that value, so the rest of the workbook content will continue to show the view/data for the previous tab.)

### Using toolbars

To have your links appear styled as a toolbar, use the Toolbar style.  In toolbar style, the author must fill in fields for:
- Button text, the text to display on the toolbar. Parameters may be used in this field.
- Icon, the icon to display in the toolbar.
- Tooltip Text, text to be displayed on the toolbar button's tooltip text. Parameters may be used in this field.

:::image type="content" source="media/workbooks-create-workbook/workbooks-links-create-toolbar.png" alt-text="Screenshot of creating links styled as a toolbar in workbooks.":::

If any required parameters are used in Button text, Tooltip text, or Value fields, and the required parameter is unset, the toolbar button will be disabled. For example, this can be used to disable toolbar buttons when no value is selected in another parameter/control.

A sample workbook with  toolbars, globals parameters, and ARM Actions is available in [sample Azure Workbooks with links](workbooks-sample-links.md#sample-workbook-with-toolbar-links).
