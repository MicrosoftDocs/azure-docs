---
title: Common Workbooks tasks
description: Learn how to perform the commonly used tasks in Workbooks.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Getting started with Azure Workbooks

This article describes how to access Azure Workbooks and the common tasks used to work with Workbooks.

You can access Workbooks in a few ways:
- In the [Azure portal](https://portal.azure.com), click on **Monitor**, and then select **Workbooks** from the menu bar on the left.

   :::image type="content" source="./media/workbooks-overview/workbooks-menu.png" alt-text="Screenshot of Workbooks icon in the menu.":::

- From a **Log Analytics workspace** page, select the **Workbooks** icon at the top of the page.

  :::image type="content" source="media/workbooks-overview/workbooks-log-analytics-icon.png" alt-text="Screenshot of Workbooks icon on Log analytics workspace page.":::

The gallery opens. Select a saved workbook or a template from the gallery, or search for the name in the search bar.

## Start a new workbook
To start a new workbook, select the **Empty** template under **Quick start**, or the **New** icon in the top navigation bar. For more information on creating new workbooks, see [Create a workbook](workbooks-create-a-workbook.md).

## Save a workbook
To save a workbook, save the report with a specific title, subscription, resource group, and location.
The workbook will autofill to the same settings as the LA workspace, with the same subscription, resource group, however, users may change these report settings. Workbooks are shared resources that require write access to the parent resource group to be saved.

## Share a workbook template

Once you start creating your own workbook template, you may want to share it with the wider community. To learn more, and to explore other templates that aren't part of the default Azure Monitor gallery, visit our [GitHub repository](https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/README.md). To browse existing workbooks, visit the [Workbook library](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks) on GitHub.

## Pin a visualization

Use the pin button next to a text, query, or metrics steps in a workbook can be pinned by using the pin button on those items while the workbook is in pin mode, or if the workbook author has enabled settings for that element to make the pin icon visible.

To access pin mode, select **Edit** to enter editing mode, and select the blue pin icon in the top bar. An individual pin icon will then appear above each corresponding workbook part's *Edit* box on the right-hand side of your screen.

:::image type="content" source="./media/workbooks-overview/pin-experience.png" alt-text="Screenshot of the pin experience." border="false":::

> [!NOTE]
> The state of the workbook is saved at the time of the pin, and pinned workbooks on a dashboard will not update if the underlying workbook is modified. In order to update a pinned workbook part, you will need to delete and re-pin that part.

### Time ranges for pinned queries

Pinned workbook query parts will respect the dashboard's time range if the pinned item is configured to use a *Time Range* parameter. The dashboard's time range value will be used as the time range parameter's value, and any change of the dashboard time range will cause the pinned item to update. If a pinned part is using the dashboard's time range, you will see the subtitle of the pinned part update to show the dashboard's time range whenever the time range changes.

Additionally, pinned workbook parts using a time range parameter will auto refresh at a rate determined by the dashboard's time range. The last time the query ran will appear in the subtitle of the pinned part.

If a pinned step has an explicitly set time range (does not use a time range parameter), that time range will always be used for the dashboard, regardless of the dashboard's settings. The subtitle of the pinned part will not show the dashboard's time range, and the query will not auto-refresh on the dashboard. The subtitle will show the last time the query executed.

> [!NOTE]
> Queries using the *merge* data source are not currently supported when pinning to dashboards.

## Auto-Refresh
Clicking on the Auto-Refresh button opens a list of intervals to let the user pick up the interval. The Workbook will keep refreshing after the selected time interval. 
* Auto-Refresh only refreshes when the Workbook is in read mode. If a user sets an interval of say 5 minutes and after 4 minutes switches to edit mode then there is no refreshing when the user is still in edit mode. But if the user comes back to read mode, the interval of 5 minutes resets and the Workbook will be refreshed after 5 minutes. 
* Clicking on the Refresh button on Read mode also reset the interval. Say a user sets the interval to 5 minutes and after 3 minutes, the user clicks on the refresh button to manually refresh the Workbook, then the Auto-refresh interval resets and the Workbook will be auto refreshed after 5 minutes. 
* This setting is not saved with Workbook. Every time a user opens a Workbook, the Auto-refresh is Off initially and needs to be set again.
* Switching Workbooks, going out of gallery will clear the Auto refresh interval.

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh.png" alt-text="Screenshot of workbooks with auto refresh.":::

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh-interval.png" alt-text="Screenshot of workbooks with auto-refresh with interval set.":::

## Next Steps
 - [Azure workbooks data sources](workbooks-data-sources.md).