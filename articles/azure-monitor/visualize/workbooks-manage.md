---
title: Manage Azure Monitor workbooks 
description: Understand how to Manage Azure Workbooks
services: azure-monitor
ms.topic: conceptual
ms.date: 06/21/2023
---

# Manage Azure Monitor Workbooks
This article describes how to manage Azure Workbooks in the Azure portal.

## Delete a workbook

1. In the Azure portal, select **Monitor**, and then select **Workbooks** from the left pane.
1. Select the checkbox next to the Workbook you want to delete.
1. Select **Delete** from the top toolbar.

## Recover a deleted workbook
When you delete an Azure Workbook, it is soft-deleted and can be recovered by contacting support. After the soft-delete period, the workbook and its content are nonrecoverable and queued for purge completely within 30 days.
 
> [!NOTE]
> Workbooks that were saved using bring your own storage cannot be recovered by support. You may be able to recover the workbook content from the storage account if the storage account used has enabled soft delete. 

## Share a workbook

When you want to share a workbook or template, keep in mind that the person you want to share with must have permissions to access the workbook. They must have an Azure account, and **Monitoring Reader** permissions.
To share a workbook or workbook template:

1. In the Azure portal, select **Monitor**, and then select **Workbooks** from the left pane.
1. Select the checkbox next to the workbook or template you want to share.
1. Select the **Share** icon from the top toolbar.
1. The **Share workbook** or **Share template** window opens with a URL to use for sharing the workbook.
1. Copy the link to share the workbook, or select **Share link via email** to open your default mail app.

:::image type="content" source="media/workbooks-getting-started/workbooks-share.png" alt-text="Screenshot of the steps to share an Azure workbook.":::

## Set up Auto refresh

1. In the Azure portal, select the workbook.
1. Select **Auto refresh**, and then to select from a list of intervals for the auto-refresh. The workbook will start refreshing after the selected time interval.

-  Auto refresh only applies when the workbook is in read mode. If a user sets an interval of 5 minutes and after 4 minutes switches to edit mode, refreshing doesn't occur if the user is still in edit mode. But if the user returns to read mode, the interval of 5 minutes resets and the workbook will be refreshed after 5 minutes.
-  Selecting **Auto refresh** in read mode also resets the interval. If a user sets the interval to 5 minutes and after 3 minutes the user selects **Auto refresh** to manually refresh the workbook, the **Auto refresh** interval resets and the workbook will be auto-refreshed after 5 minutes.
- The **Auto refresh** setting isn't saved with the workbook. Every time a user opens a workbook, **Auto refresh** is **Off** and needs to be set again.
- Switching workbooks and going out of the gallery clears the **Auto refresh** interval.

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh.png" alt-text="Screenshot that shows workbooks with Auto refresh.":::

:::image type="content" source="media/workbooks-getting-started/workbooks-auto-refresh-interval.png" alt-text="Screenshot that shows workbooks with Auto refresh with an interval set.":::

