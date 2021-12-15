---
title: Manage watchlists in Microsoft Sentinel
description: This article describes how to use Microsoft Sentinel watchlists to create allowlists/blocklists, enrich event data, and assist in investigating threats.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

# Manage watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. Use watchlists in your search, detection rules, threat hunting, and response playbooks.

## View list of watchlist aliases

You might need to see a list of watchlist aliases to identify a watchlist to use in a query or analytics rule.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **General**, select **Logs**.
1. If you see a list of queries, closes the **Queries** window.
1. On the **New Query** page, run the following query: `_GetWatchlistAlias`. 
1. Review the list of aliases in the **Results** tab.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-alias.png" alt-text="list watchlists" lightbox="./media/watchlists/sentinel-watchlist-alias.png":::

## Edit a watchlist in Microsoft Sentinel

Edit a watchlist to edit or add an item to the watchlist.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **Configuration**, select **Watchlist**.
1. Select the watchlist you want to edit.
1. Select **Edit watchlist items** on the details pane.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit.png" alt-text="Screen shot showing how to edit a watchlist" lightbox="./media/watchlists/sentinel-watchlist-edit.png":::

1. To edit an existing watchlist item, 
   1. Select the checkbox of that watchlist item.
   1. Edit the item.
   1. Select **Save**. 
   1. Select **Yes** at the confirmation prompt.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-change.png" alt-text="Screen shot showing how to mark and edit a watchlist item.":::

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-confirm.png" alt-text="Screen shot confirm your changes.":::

1. To add a new item to your watchlist, 
   1. Select **Add new**.
   1. Fill in the fields in the **Add watchlist item** panel.
   1. Select **Add** at the bottom of that panel.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-add.png" alt-text="Screen shot showing how to add a new item to your watchlist.":::

## Next steps

In this document, you learned how to use watchlists in Microsoft Sentinel to enrich data and improve investigations. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
