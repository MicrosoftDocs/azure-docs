---
title: Edit watchlists - Microsoft Sentinel
description: Learn how to edit and add more items to Microsoft Sentinel watchlists to them to keep them up-to-date.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 3/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to manage Microsoft Sentinel watchlists so that I can efficiently monitor and respond to potential threats.

---

# Manage watchlists in Microsoft Sentinel

We recommend you edit an existing watchlist instead of deleting and recreating a watchlist. Log analytics has a five-minute SLA for data ingestion. If you delete and recreate a watchlist, you might see both the deleted and recreated entries in Log Analytics during this five-minute window. If you see these duplicate entries in Log Analytics for a longer period of time, submit a support ticket.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Edit a watchlist item

Edit a watchlist to edit or add an item to the watchlist.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Watchlist**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Watchlist**.
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

      :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-edit-add-new.png" alt-text="Screenshot of the new button at the top of the edit watchlist items page.":::

   1. Fill in the fields of the **Add watchlist item** panel.
   1. At the bottom of that panel, select **Add**.

## Bulk update a watchlist

When you have many items to add to a watchlist, use bulk update. A bulk update of a watchlist appends items to the existing watchlist. Then, it de-duplicates the items in the watchlist where all the value in each column match.

If you've deleted an item from your watchlist file and upload it, bulk update won't delete the item in the existing watchlist. Delete the watchlist item individually. Or, when you have a lot of deletions, delete and recreate the watchlist.

The updated watchlist file you upload must contain the search key field used by the watchlist with no blank values.

To bulk update a watchlist,

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Watchlist**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Watchlist**.
1. Select the watchlist you want to edit.
1. On the details pane, select **Update watchlist** > **Bulk update**.

   :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-bulk-update.png" alt-text="Screenshot of the bulk update option on the bottom of the details pane." lightbox="./media/watchlists-manage/sentinel-watchlist-bulk-update.png":::

1. Under **Upload file**, drag and drop or browse to  the file to upload.

   :::image type="content" source="./media/watchlists-manage/sentinel-watchlist-bulk-update-source.png" alt-text="Screenshot of the watchlist wizard source page where you select the file to upload and the search key field is disabled.":::

1. If you get an error, fix the issue in the file. Then select **Reset** and try the file upload again.
1. Select **Next: Review and update** > **Update**.

## Related content

To learn more about Microsoft Sentinel, see the following articles:

- [Use watchlists in Microsoft Sentinel](watchlists.md)
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.

