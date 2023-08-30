---
title: Common Azure Workbooks tasks
description: Learn how to perform the commonly used tasks in workbooks.
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr 
---

# Get started with Azure Workbooks

This article describes how to access Azure Workbooks and the common tasks used to work with workbooks.

You can access Azure Workbooks in a few ways:

- In the [Azure portal](https://portal.azure.com), select **Monitor** > **Workbooks** from the menu bars on the left.

   :::image type="content" source="./media/workbooks-overview/workbooks-menu.png" alt-text="Screenshot that shows Workbooks in the menu.":::

- On a **Log Analytics workspaces** page, select **Workbooks** at the top of the page.

  :::image type="content" source="media/workbooks-overview/workbooks-log-analytics-icon.png" alt-text="Screenshot of Workbooks on the Log Analytics workspaces page.":::

When the gallery opens, select a saved workbook or a template. You can also search for a name in the search box.

## Save a workbook

To save a workbook, save the report with a specific title, subscription, resource group, and location.

By default, the workbook is auto-filled with the same settings as the LA workspace, with the same subscription and resource group. Workbooks are saved to 'My Reports' by default, and are only accessible by the individual user, but they can be saved directly to shared reports or shared later on. Workbooks are shared resources and they require write access to the parent resource group to be saved.

## Share a workbook

When you want to share a workbook or template, keep in mind that the person you want to share with must have permissions to access the workbook. They must have an Azure account, and **Azure Sentinel Workbook Reader** permissions.
To share a workbook or workbook template:

1. In the Azure portal, select the workbook or template you want to share.
1. Select the **Share** icon from the top toolbar.
1. The **Share workbook** or **Share template** window opens with a URL to use for sharing the workbook.
1. Copy the link to share the workbook, or select **Share link via email** to open your default mail app.

:::image type="content" source="media/workbooks-getting-started/workbooks-share.png" alt-text="Screenshot of the steps to share an Azure workbook.":::

## Pin a visualization

You can pin text, query, or metrics components in a workbook by using the **Pin** button on those items while the workbook is in pin mode. Or you can use the **Pin** button if the workbook author has enabled settings for that element to make it visible.

To access pin mode, select **Edit** to enter editing mode. Select **Pin** on the top bar. An individual **Pin** then appears above each corresponding workbook part's **Edit** button on the right side of the screen.

:::image type="content" source="./media/workbooks-overview/pin-experience.png" alt-text="Screenshot that shows the Pin button." border="false":::

> [!NOTE]
> The state of the workbook is saved at the time of the pin. Pinned workbooks on a dashboard won't update if the underlying workbook is modified. To update a pinned workbook part, you must delete and re-pin that part.

### Time ranges for pinned queries

Pinned workbook query parts will respect the dashboard's time range if the pinned item is configured to use a *TimeRange* parameter. The dashboard's time range value will be used as the time range parameter's value. Any change of the dashboard time range will cause the pinned item to update. If a pinned part is using the dashboard's time range, you'll see the subtitle of the pinned part update to show the dashboard's time range whenever the time range changes.

Pinned workbook parts using a time range parameter will auto-refresh at a rate determined by the dashboard's time range. The last time the query ran will appear in the subtitle of the pinned part.

If a pinned component has an explicitly set time range and doesn't use a time range parameter, that time range will always be used for the dashboard, regardless of the dashboard's settings. The subtitle of the pinned part won't show the dashboard's time range. The query won't auto-refresh on the dashboard. The subtitle will show the last time the query executed.

> [!NOTE]
> Queries that use the *merge* data source aren't currently supported when pinning to dashboards.

## Auto refresh

Select **Auto refresh** to open a list of intervals that you can use to select the interval. The workbook will keep refreshing after the selected time interval.

* **Auto refresh** only refreshes when the workbook is in read mode. If a user sets an interval of 5 minutes and after 4 minutes switches to edit mode, refreshing doesn't occur if the user is still in edit mode. But if the user returns to read mode, the interval of 5 minutes resets and the workbook will be refreshed after 5 minutes.
* Selecting **Auto refresh** in read mode also resets the interval. If a user sets the interval to 5 minutes and after 3 minutes the user selects **Auto refresh** to manually refresh the workbook, the **Auto refresh** interval resets and the workbook will be auto-refreshed after 5 minutes.
* This setting isn't saved with the workbook. Every time a user opens a workbook, **Auto refresh** is **Off** and needs to be set again.
* Switching workbooks and going out of the gallery clears the **Auto refresh** interval.

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh.png" alt-text="Screenshot that shows workbooks with Auto refresh.":::

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh-interval.png" alt-text="Screenshot that shows workbooks with Auto refresh with an interval set.":::

## Next steps

[Azure Workbooks data sources](workbooks-data-sources.md)