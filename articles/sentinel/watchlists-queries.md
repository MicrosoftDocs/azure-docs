---
title: Build queries or rules with watchlists - Microsoft Sentinel
description: Use watchlists in KQL search queries or detection rules with built-in functions for Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 3/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to use watchlists in my queries and detection rules so that I can efficiently correlate and analyze data to detect potential threats.

---

# Build queries or detection rules with watchlists in Microsoft Sentinel

Correlate your watchlist data against any Microsoft Sentinel data with Kusto tabular operators such as `join` and `lookup`. When you create a watchlist, you define the *SearchKey*. The search key is the name of a column in your watchlist that you expect to use as a join with other data or as a frequent object of searches.

For optimal query performance, use **SearchKey** as the key for joins in your queries.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Build queries with watchlists

To use a watchlist in search query, write a Kusto query that uses the _GetWatchlist('watchlist-name') function and uses **SearchKey** as the key for your join.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Watchlist**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Watchlist**.
1. Select the watchlist you want to use.
1. Select **View in Logs**.

    :::image type="content" source="./media/watchlists-queries/sentinel-watchlist-queries-list.png" alt-text="Screenshot that shows how to use watchlists in queries." lightbox="./media/watchlists-queries/sentinel-watchlist-queries-list.png" :::

1. Review the **Results** tab. The items in your watchlist are automatically extracted for your query. 

   The example below shows the results of the extraction of the **Name** and **IP Address** fields. The **SearchKey** is shown as its own column. 

    :::image type="content" source="./media/watchlists-queries/sentinel-watchlist-queries-fields.png" alt-text="Screenshot that shows queries with watchlist fields." lightbox="./media/watchlists-queries/sentinel-watchlist-queries-fields.png":::

    The timestamp on your queries will be ignored in both the query UI and in scheduled alerts.

1. Write a query that uses the _GetWatchlist('watchlist-name') function and uses **SearchKey** as the key for your join. 

   For example, the following example query joins the `RemoteIPCountry` column in the `Heartbeat` table with the search key defined for the watchlist named `mywatchlist`.

    ```kusto
    Heartbeat
    | lookup kind=leftouter _GetWatchlist('mywatchlist') 
     on $left.RemoteIPCountry == $right.SearchKey
    ```

    The following image shows the results of this example query in Log Analytics.
 
    :::image type="content" source="./media/watchlists-queries/sentinel-watchlist-queries-join.png" alt-text="Screenshot of queries against watchlist as lookup." lightbox="./media/watchlists-queries/sentinel-watchlist-queries-join.png":::

## Create an analytics rule with a watchlist

To use watchlists in analytics rules, create a rule using the _GetWatchlist('watchlist-name') function in the query.

1. Under **Configuration**, select **Analytics**.
1. Select **Create** and the type of rule you want to create.
1. On the **General** tab, enter the appropriate information.
1. On the **Set rule logic** tab, under **Rule query** use the `_GetWatchlist('<watchlist>')` function in the query.

   For example, let's say you have a watchlist named `ipwatchlist` that you created from a CSV file with the following values:

   |`IPAddress,Location`   |
   |---------|
   |`10.0.100.11,Home`    |
   |`172.16.107.23,Work`   |
   |`10.0.150.39,Home`     |
   |`172.20.32.117,Work`   |

    The CSV file looks something like the following image.
    :::image type="content" source="./media/watchlists-queries/create-watchlist.png" alt-text="Screenshot of four items in a CSV file that's used for the watchlist.":::

    To use the `_GetWatchlist` function for this example, your query would be `_GetWatchlist('ipwatchlist')`.

    :::image type="content" source="./media/watchlists-queries/sentinel-watchlist-new-other.png" alt-text="Screenshot that shows the query returns the four items from the watchlist.":::

    In this example, we only include events from IP addresses in the watchlist:

    ```kusto
    //Watchlist as a variable
    let watchlist = (_GetWatchlist('ipwatchlist') | project IPAddress);
    Heartbeat
    | where ComputerIP in (watchlist)
    ```

    The following example query uses the watchlist inline with the query and the search key defined for the watchlist.

    ```kusto
    //Watchlist inline with the query
    //Use SearchKey for the best performance
    Heartbeat
    | where ComputerIP in ( 
        (_GetWatchlist('ipwatchlist')
        | project SearchKey)
    )
    ```

    The following image shows this last query used in the rule query.

    :::image type="content" source="./media/watchlists-queries/sentinel-watchlist-analytics-rule.png" alt-text="Screenshot that shows how to use watchlists in analytics rules.":::

1. Complete the rest of the tabs in the **Analytics rule wizard**.

Watchlists are refreshed in your workspace every 12 days, updating the `TimeGenerated` field. For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

## View list of watchlist aliases

You might need to see a list of watchlist aliases to identify a watchlist to use in a query or analytics rule.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **General**, select **Logs**.<br> In the [Defender portal](https://security.microsoft.com/), select **Investigation & response** > **Hunting** > **Advanced hunting**.
1. On the **New Query** page, run the following query: `_GetWatchlistAlias`. 
1. Review the list of aliases in the **Results** tab.

   :::image type="content" source="./media/watchlists-queries/sentinel-watchlist-alias.png" alt-text="Screenshot that shows a list of watchlists." lightbox="./media/watchlists-queries/sentinel-watchlist-alias.png":::

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***lookup*** operator](/kusto/query/lookup-operator?view=microsoft-sentinel&preserve-view=true)
- [***in*** operator](/kusto/query/in-cs-operator?view=microsoft-sentinel&preserve-view=true)
- [***let*** statement](/kusto/query/let-statement?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

## Related content

In this document, you learned how to use watchlists in Microsoft Sentinel to enrich data and improve investigations. To learn more about Microsoft Sentinel, see the following articles:

- [Create watchlists](watchlists-create.md)
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
