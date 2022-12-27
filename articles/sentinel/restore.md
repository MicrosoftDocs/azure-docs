---
title: Restore archived logs from search - Microsoft Sentinel
description: Learn how to restore archived logs from search job results.
author: cwatson-cat
ms.topic: how-to
ms.date: 01/20/2022
ms.author: cwatson
---

# Restore archived logs from search

Restore data from an archived log to use in high performing queries and analytics.

Before you restore data in an archived log, see [Start an investigation by searching large datasets (preview)](investigate-large-datasets.md) and [Restore in Azure Monitor](../azure-monitor/logs/restore.md).


## Restore archived log data

To restore archived log data in Microsoft Sentinel, specify  the table and time range for the data you want to restore. Within a few minutes, the log data is available within the Log Analytics workspace. Then you can use the data in high-performance queries that support full KQL.

You can restore archived data directly from the **Search** page or from a saved search.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **General**, select **Search**.
1. Restore log data in one of two ways:
   - At the top of **Search** page, select **Restore**.
      :::image type="content" source="media/restore/search-page-restore.png" alt-text="Screenshot of restore button at the top of the search page.":::
   - Select the **Saved Searches** tab and **Restore** on the appropriate search.
     :::image type="content" source="media/restore/search-results-restore.png" alt-text="Screenshot of the restore link on a saved search.":::

1. Select the table you want to restore.
1. Select the time range of the data that you want restore.
1. Select **Restore**.

   :::image type="content" source="media/restore/restoration-page.png" alt-text="Screenshot of the restoration page with table and time range selected.":::

1. Wait for the log data to be restored. View the status of your restoration job by selecting on the **Restoration** tab.

## View restored log data

View the status and results of the log data restore by going to the **Restoration** tab. You can view the restored data when the status of the restore job shows **Data Available**.

1. In your Microsoft Sentinel workspace, select **Search** > **Restoration**.

   :::image type="content" source="media/restore/restoration-tab.png" alt-text="Screenshot of the restoration tab on the search page.":::

1. When your restore job is complete, select the table name.

   :::image type="content" source="media/restore/data-available-select-table.png" alt-text="Screenshot that shows rows with completed restore jobs and a table selected.":::

1. Review the results.

   :::image type="content" source="media/restore/restored-data-logs-view.png" alt-text="Screenshot that shows the logs query pane with the restored table results.":::

   The Logs query pane shows the name of table containing the restored data. The **Time range** is set to a custom time range that uses the start and end times of the restored data.

## Delete restored data tables

To save costs, we recommend you delete the restored table when you no longer need it. When you delete a restored table, Azure doesn't delete the underlying source data.


1. In your Microsoft Sentinel workspace, select **Search** > **Restoration**.
1. Identify the table you want to delete.
1. Select **Delete** for that table row.

   :::image type="content" source="media/restore/delete-restored-table.png" alt-text="Screenshot of restoration tab that shows the delete button on each row.":::

## Next steps

- [Hunt with bookmarks](bookmarks.md)
