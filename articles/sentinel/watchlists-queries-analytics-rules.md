---
title: Use Microsoft Sentinel watchlists
description: This article describes how to use Microsoft Sentinel watchlists to create allowlists/blocklists, enrich event data, and assist in investigating threats.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

# Search and build detection rules with watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. Use watchlists in your search, detection rules, threat hunting, and response playbooks.

## Build queries with watchlists

For optimal query performance, use **SearchKey** (representing the field you defined in creating the watchlist) as the key for joins in your queries. See the example below.

1. In the Azure portal, go to **Microsoft Sentinel** > **Configuration** > **Watchlist**, select the watchlist you want to use, and then select **View in Log Analytics**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-queries-list.png" alt-text="use watchlists in queries" lightbox="./media/watchlists/sentinel-watchlist-queries-list.png" :::

1. The items in your watchlist are automatically extracted for your query, and will appear on the **Results** tab. The example below shows the results of the extraction of the **Name** and **IP Address** fields. The **SearchKey** is shown as its own column.

    > [!NOTE]
    > The timestamp on your queries will be ignored in both the query UI and in scheduled alerts.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-queries-fields.png" alt-text="queries with watchlist fields" lightbox="./media/watchlists/sentinel-watchlist-queries-fields.png":::

1. You can query data in any table against data from a watchlist by treating the watchlist as a table for joins and lookups. Use **SearchKey** as the key for your join.

    ```kusto
    Heartbeat
    | lookup kind=leftouter _GetWatchlist('mywatchlist') 
     on $left.RemoteIPCountry == $right.SearchKey
    ```
    :::image type="content" source="./media/watchlists/sentinel-watchlist-queries-join.png" alt-text="queries against watchlist as lookup" lightbox="./media/watchlists/sentinel-watchlist-queries-join.png":::

## Create analytics rules with watchlists

When you create an analytics rule, you can include watchlists in the rule query.

For optimal query performance, use **SearchKey** as the key for joins in your queries. **Searchkey** represents the field you defined when creating the watchlist.  See the example below.

To use watchlists in analytics rules, 
1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **Configuration**, select **Analytics**.
1. Select **Create** and the type of rule you want to create.
1. In the **Set rule logic** tab, under **Rule query** use the `_GetWatchlist('<watchlist>')` function in the query.

1. For example, let's say you have a watchlist named “ipwatchlist” with the following values:

    :::image type="content" source="./media/watchlists/create-watchlist.png" alt-text="list of four items for watchlist":::

    :::image type="content" source="./media/watchlists/sentinel-watchlist-new-other.png" alt-text="create watchlist with four items":::

1. Next, create the analytics rule.  In this example, we only include events from IP addresses in the watchlist:

    ```kusto
    //Watchlist as a variable
    let watchlist = (_GetWatchlist('ipwatchlist') | project IPAddress);
    Heartbeat
    | where ComputerIP in (watchlist)
    ```
    ```kusto
    //Watchlist inline with the query
    //Use SearchKey for the best performance
    Heartbeat
    | where ComputerIP in ( 
        (_GetWatchlist('ipwatchlist')
        | project SearchKey)
    )
    ```

    :::image type="content" source="./media/watchlists/sentinel-watchlist-analytics-rule.png" alt-text="use watchlists in analytics rules":::


## Next steps
In this document, you learned how to use watchlists in Microsoft Sentinel to enrich data and improve investigations. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
