---
title: Use Microsoft Sentinel watchlists
description: This article describes how to use Microsoft Sentinel watchlists to create allowlists/blocklists, enrich event data, and assist in investigating threats.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

# Use watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high value assets, terminated employees, or service accounts in your enviroment.

Use watchlists in your search, detection rules, threat hunting, and response playbooks. Watchlists are stored in your Microsoft Sentinel workspace as name-value pairs and are cached for optimal query performance and low latency.

## Common scenarios for using watchlists

- **Investigate threats** and respond to incidents quickly with the rapid import of IP addresses, file hashes, and other data from CSV files. After you import the data, use watchlist name-value pairs for joins and filters in alert rules, threat hunting, workbooks, notebooks, and general queries.

- **Import business data** as a watchlist. For example, import user lists with privileged system access, or terminated employees. Then, use the watchlist to create allowlists and blocklists to detect or prevent those users from logging in to the network.

- **Reduce alert fatigue**. Create allowlists to suppress alerts from a group of users, such as users from authorized IP addresses that perform tasks that would normally trigger the alert. Prevent benign events from becoming alerts.

- **Enrich event data**. Use watchlists to enrich your event data with name-value combinations derived from external data sources.

## Watchlist limitations

- The use of watchlists should be limited to reference data, as they are not designed for large data volumes.
- The **total number of active watchlist items** across all watchlists in a single workspace is currently limited to **10 million**. Deleted watchlist items do not count against this total. If you require the ability to reference large data volumes, consider ingesting them using [custom logs](../azure-monitor/agents/data-sources-custom-logs.md) instead.
- Watchlists can only be referenced from within the same workspace. Cross-workspace and/or Lighthouse scenarios are currently not supported.
- File uploads are currently limited to files of up to 3.8 MB in size.

## Options to create watchlists

Create a watchlist from a local file or by using a template. Each built-in watchlist template has it's own set of data listed in a CSV file attached to the template. For more information, see [Built-in watchlist schemas](watchlist-schemas.md).


## Use watchlists in queries

> [!TIP]
> For optimal query performance, use **SearchKey** (representing the field you defined in creating the watchlist) as the key for joins in your queries. See the example below.

1. From the Azure portal, navigate to **Microsoft Sentinel** > **Configuration** > **Watchlist**, select the watchlist you want to use, and then select **View in Log Analytics**.

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

## Use watchlists in analytics rules

> [!TIP]
> For optimal query performance, use **SearchKey** (representing the field you defined in creating the watchlist) as the key for joins in your queries. See the example below.

To use watchlists in analytics rules, from the Azure portal, navigate to **Microsoft Sentinel** > **Configuration** > **Analytics**, and create a rule using the `_GetWatchlist('<watchlist>')` function in the query.

1. In this example, create a watchlist called “ipwatchlist” with the following values:

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

## View list of watchlists aliases

To get a list of watchlist aliases, from the Azure portal, navigate to **Microsoft Sentinel** > **General** > **Logs**, and run the following query: `_GetWatchlistAlias`. You can see the list of aliases in the **Results** tab.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-alias.png" alt-text="list watchlists" lightbox="./media/watchlists/sentinel-watchlist-alias.png":::

## Manage your watchlist in the Microsoft Sentinel portal

You can also view, edit, and create new watchlist items directly from the Watchlist blade in the Microsoft Sentinel portal.

1. To edit your watchlist, navigate to **Microsoft Sentinel > Configuration > Watchlist**, select the watchlist you want to edit, and select **Edit watchlist items** on the details pane.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit.png" alt-text="Screen shot showing how to edit a watchlist" lightbox="./media/watchlists/sentinel-watchlist-edit.png":::

1. To edit an existing watchlist item, mark the checkbox of that watchlist item, edit the item, and select **Save**. Select **Yes** at the confirmation prompt.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-change.png" alt-text="Screen shot showing how to mark and edit a watchlist item.":::

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-confirm.png" alt-text="Screen shot confirm your changes.":::

1. To add a new item to your watchlist, select **Add new** on the **Edit watchlist items** screen, fill in the fields in the **Add watchlist item** panel, and select **Add** at the bottom of that panel.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-add.png" alt-text="Screen shot showing how to add a new item to your watchlist.":::

## Next steps
In this document, you learned how to use watchlists in Microsoft Sentinel to enrich data and improve investigations. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
