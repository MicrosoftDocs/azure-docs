---
title: Common Workbooks tasks
description: Learn how to perform the commonly used tasks in Workbooks.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Common Workbooks tasks
## Start a new Workbook
To start a new workbook, you may select the **Empty** template under **Quick start**, or the **New** icon in the top navigation bar. To view templates or return to saved workbooks, select the item from the gallery or search for the name in the search bar.

## Save a workbook
To save a workbook, you will need to save the report with a specific title, subscription, resource group, and location.
The workbook will autofill to the same settings as the LA workspace, with the same subscription, resource group, however, users may change these report settings. Workbooks are shared resources that require write access to the parent resource group to be saved.

### Pin a Visualization

Text, query, and metrics steps in a workbook can be pinned by using the pin button on those items while the workbook is in pin mode, or if the workbook author has enabled settings for that element to make the pin icon visible.

To access pin mode, select **Edit** to enter editing mode, and select the blue pin icon in the top bar. An individual pin icon will then appear above each corresponding workbook part's *Edit* box on the right-hand side of your screen.

:::image type="content" source="./media/workbooks-overview/pin-experience.png" alt-text="Screenshot of the pin experience." border="false":::

> [!NOTE]
> The state of the workbook is saved at the time of the pin, and pinned workbooks on a dashboard will not update if the underlying workbook is modified. In order to update a pinned workbook part, you will need to delete and re-pin that part.

## Share a workbook template

Once you start creating your own workbook templates you might want to share it with the wider community. To learn more, and to explore other templates that aren't part of the default Azure Monitor gallery view visit our [GitHub repository](https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/README.md). To browse existing workbooks, visit the [Workbook library](https://github.com/microsoft/Application-Insights-Workbooks/tree/master/Workbooks) on GitHub.

## Print a Workbook
*** needs content
## Auto-Refresh
Clicking on the Auto-Refresh button opens a list of intervals to let the user pick up the interval. The Workbook will keep refreshing after the selected time interval. 
* Auto-Refresh only refreshes when the Workbook is in read mode. If a user sets an interval of say 5 minutes and after 4 minutes switches to edit mode then there is no refreshing when the user is still in edit mode. But if the user comes back to read mode, the interval of 5 minutes resets and the Workbook will be refreshed after 5 minutes. 
* Clicking on the Refresh button on Read mode also reset the interval. Say a user sets the interval to 5 minutes and after 3 minutes, the user clicks on the refresh button to manually refresh the Workbook, then the Auto-refresh interval resets and the Workbook will be auto refreshed after 5 minutes. 
* This setting is not saved with Workbook. Every time a user opens a Workbook, the Auto-refresh is Off initially and needs to be set again.
* Switching Workbooks, going out of gallery will clear the Auto refresh interval.

![Auto refresh](./Images/AutoRefresh.PNG)

![Auto refresh with interval set](./Images/AutoRefreshWithIntervalSet.PNG)