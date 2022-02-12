---
title: Edit watchlist - Microsoft Sentinel
description: Edit or add items to watchlists in Microsoft Sentinel watchlists.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 1/04/2022
---

# Manage watchlists in Microsoft Sentinel

We recommend you edit an existing watchlist instead of deleting and recreating a watchlist. Log analytics has a five-minute SLA for data ingestion. If you delete and recreate a watchlist, you might see both the deleted and recreated entries in Log Analytics during this five-minute window. If you see these duplicate entries in Log Analytics for a longer period of time, submit a support ticket.

## Edit a watchlist item

Edit a watchlist to edit or add an item to the watchlist.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **Configuration**, select **Watchlist**.
1. Select the watchlist you want to edit.
1. On the details pane, select **Update watchlist** > **Edit watchlist items**.

   :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-edit.png" alt-text="Screenshot of the edit watchlist option at the bottom of the details pane." lightbox="./media/watchlists-manage/sentinel-watchlist-edit.png":::

1. To edit an existing watchlist item, 
   1. Select the checkbox of that watchlist item.
   1. Edit the item.
   1. Select **Save**.

      :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-edit-change.png" alt-text="Screenshot showing how to mark and edit a watchlist item.":::

   1. Select **Yes** at the confirmation prompt.

      :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-edit-confirm.png" alt-text="Screenshot of the prompt to confirm your changes.":::

1. To add a new item to your watchlist,
   1. Select **Add new**.

      :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-edit-add-new.png" alt-text="Screenshot of the add new button at the top of the edit watchlist items page.":::

   1. Fill in the fields in the **Add watchlist item** panel.
   1. At the bottom of that panel, select **Add**.

## Bulk update a watchlist

- Appends and dedups
- Doesn't delete
- Search needs to be the same 
- Can't have blank fields in search key it will error out

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **Configuration**, select **Watchlist**.
1. Select the watchlist you want to edit.
1. On the details pane, select **Update watchlist** > **Bulk update**.

   :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-bulk-update.png" alt-text="Screen shot of the bulk update option on the bottom of the details pane." lightbox="./media/watchlists-manage/sentinel-watchlist-bulk-update.png":::

1.


## Next steps

To learn more about Microsoft Sentinel, see the following articles:

- [Use watchlists in Microsoft Sentinel](watchlists.md)
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.

