---
title: Watchlists in Microsoft Sentinel
titleSuffix: Microsoft Sentinel
description: Learn how watchlists allow you to correlate data with events and when to use them in Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: concept-article
ms.date: 3/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to understand how to use watchlists in Microsoft Sentinel so that I can efficiently correlate and enrich event data, reduce alert fatigue, and quickly respond to threats.

---

# Watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high-value assets, terminated employees, or service accounts in your environment.

Use watchlists in your search, detection rules, threat hunting, and response playbooks.

Watchlists are stored in your Microsoft Sentinel workspace in the `Watchlist` table as name-value pairs and are cached for optimal query performance and low latency.

> [!IMPORTANT]
> The features for watchlist templates and the ability to create a watchlist from a file in Azure Storage are currently in **PREVIEW**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## When to use watchlists

Use watchlists to help you with following scenarios:

- **Investigate threats** and respond to incidents quickly with the rapid import of IP addresses, file hashes, and other data from CSV files. After you import the data, use watchlist name-value pairs for joins and filters in alert rules, threat hunting, workbooks, notebooks, and general queries.

- **Import business data** as a watchlist. For example, import user lists with privileged system access, or terminated employees. Then, use the watchlist to create allowlists and blocklists to detect or prevent those users from logging in to the network.

- **Reduce alert fatigue**. Create allowlists to suppress alerts from a group of users, such as users from authorized IP addresses that perform tasks that would normally trigger the alert. Prevent benign events from becoming alerts.

- **Enrich event data**. Use watchlists to enrich your event data with name-value combinations derived from external data sources.

## Limitations of watchlists

Before you create a watchlist, be aware of the following limitations:

- When you create a watchlist, the watchlist name and alias must each be between 3 and 64 characters. The first and last characters must be alphanumeric. But you can include whitespaces, hyphens, and underscores in between the first and last characters.
- The use of watchlists should be limited to reference data, as they aren't designed for large data volumes.
- The **total number of active watchlist items** across all watchlists in a single workspace is currently limited to **10 million**. Deleted watchlist items don't count against this total. If you require the ability to reference large data volumes, consider ingesting them using [custom logs](/azure/azure-monitor/agents/data-sources-custom-logs) instead.
- Watchlists are refreshed in your workspace every 12 days, updating the `TimeGenerated` field.
- Using Lighthouse to manage watchlists across different workspaces is not supported at this time.
- Local file uploads are currently limited to files of up to 3.8 MB in size.
- File uploads from an Azure Storage account (in preview) are currently limited to files up to 500 MB in size.
- Watchlists must adhere to the same column and table restrictions as KQL entities. For more information, see [KQL entity names](/kusto/query/schema-entities/entity-names?view=microsoft-sentinel&preserve-view=true).

## Options to create watchlists

Create a watchlist in Microsoft Sentinel from a file you upload from a local folder or from a file in your Azure Storage account.

You have the option to download one of the watchlist templates from Microsoft Sentinel to populate with your data. Then upload that file when you create the watchlist in Microsoft Sentinel.  

To create a watchlist from a large file that's up to 500 MB in size, upload the file to your Azure Storage account. Then create a shared access signature URL for Microsoft Sentinel to retrieve the watchlist data. A shared access signature URL is an URI that contains both the resource URI and shared access signature token of a resource like a csv file in your storage account. Finally, add the watchlist to your workspace in Microsoft Sentinel.

For more information, see the following articles:

- [Create watchlists in Microsoft Sentinel](watchlists-create.md)
- [Built-in watchlist schemas](watchlist-schemas.md)
- [Azure Storage SAS token](../storage/common/storage-sas-overview.md#sas-token)

## Watchlists in queries for searches and detection rules

To correlate your watchlist data with other Microsoft Sentinel data, use Kusto tabular operators such as `join` and `lookup` with the `Watchlist` table. Microsoft Sentinel creates two functions in the workspace to help reference and query your watchlists.
- `_GetWatchlistAlias` - simply returns the aliases of all your watchlists
- `_GetWatchlist` - queries the name-value pairs of the specified watchlist

When you create a watchlist, you define the *SearchKey*. The search key is the name of a column in your watchlist that you expect to use as a join with other data or as a frequent object of searches. For example, suppose you have a server watchlist that contains country/region names and their respective two-letter country codes. You expect to use the country codes often for searches or joins. So you use the country code column as the search key.

  ```kusto
  Heartbeat
  | lookup kind=leftouter _GetWatchlist('mywatchlist') 
    on $left.RemoteIPCountry == $right.SearchKey
  ```

Let's look some other example queries. 

Suppose you want to use a watchlist in an analytics rule. You create a watchlist called `ipwatchlist` that includes columns for `IPAddress` and `Location`. You define `IPAddress` as the **SearchKey**.

   |`IPAddress,Location`   |
   |---------|
   |`10.0.100.11,Home`     |
   |`172.16.107.23,Work`   |
   |`10.0.150.39,Home`     |
   |`172.20.32.117,Work`   |

To only include events from IP addresses in the watchlist, you might use a query where `watchlist` is used as a variable or where the watchlist is used inline.

The following example query uses the watchlist as a variable:

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

For more information, see [Build queries and detection rules with watchlists in Microsoft Sentinel](watchlists-queries.md).

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***lookup*** operator](/kusto/query/lookup-operator?view=microsoft-sentinel&preserve-view=true)
- [***in*** operator](/kusto/query/in-cs-operator?view=microsoft-sentinel&preserve-view=true)
- [***let*** statement](/kusto/query/let-statement?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

## Next steps

To learn more about Microsoft Sentinel, see the following articles:

- [Create watchlists](watchlists-create.md)
- [Build queries and detection rules with watchlists](watchlists-queries.md)
- [Manage watchlists](watchlists-manage.md)
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
