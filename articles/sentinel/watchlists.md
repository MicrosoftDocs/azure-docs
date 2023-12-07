---
title: What is a watchlist - Microsoft Sentinel
description: Learn what watchlists are in Microsoft and when to use them.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 01/05/2023
---

# Use watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high-value assets, terminated employees, or service accounts in your environment.

Use watchlists in your search, detection rules, threat hunting, and response playbooks.

Watchlists are stored in your Microsoft Sentinel workspace as name-value pairs and are cached for optimal query performance and low latency.

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

- The use of watchlists should be limited to reference data, as they aren't designed for large data volumes.
- The **total number of active watchlist items** across all watchlists in a single workspace is currently limited to **10 million**. Deleted watchlist items don't count against this total. If you require the ability to reference large data volumes, consider ingesting them using [custom logs](../azure-monitor/agents/data-sources-custom-logs.md) instead.
- Watchlists are refreshed in your workspace every 12 days, updating the `TimeGenerated` field.
- Watchlists can only be referenced from within the same workspace. Cross-workspace and/or Lighthouse scenarios are currently not supported.
- Local file uploads are currently limited to files of up to 3.8 MB in size.
- File uploads from an Azure Storage account (in preview) are currently limited to files up to 500 MB in size.

## Options to create watchlists

Create a watchlist in Microsoft Sentinel from a file you upload from a local folder or from a file in your Azure Storage account.

You have the option to download one of the watchlist templates from Microsoft Sentinel to populate with your data. Then upload that file when you create the watchlist in Microsoft Sentinel.  

To create a watchlist from a large file that's up to 500 MB in size, upload the file to your Azure Storage account. Then create a shared access signature URL for Microsoft Sentinel to retrieve the watchlist data. A shared access signature URL is an URI that contains both the resource URI and shared access signature token of a resource like a csv file in your storage account. Finally, add the watchlist to your workspace in Microsoft Sentinel.

For more information, see the following articles:

- [Create watchlists in Microsoft Sentinel](watchlists-create.md)
- [Built-in watchlist schemas](watchlist-schemas.md)
- [Azure Storage SAS token](../storage/common/storage-sas-overview.md#sas-token)

## Watchlists in queries for searches and detection rules

Query data in any table against data from a watchlist by treating the watchlist as a table for joins and lookups. When you create a watchlist, you define the *SearchKey*. The search key is the name of a column in your watchlist that you expect to use as a join with other data or as a frequent object of searches. For example, suppose you have a server watchlist that contains country names and their respective two-letter country codes. You expect to use the country codes often for search or joins. So you use the country code column as the search key.

The following example query joins the `RemoteIPCountry` column in the `Heartbeat` table with the search key defined for the watchlist named mywatchlist.

  ```kusto
     Heartbeat
    | lookup kind=leftouter _GetWatchlist('mywatchlist') 
     on $left.RemoteIPCountry == $right.SearchKey
  ```

Let's look some other example queries. 

Suppose you want to use a watchlist in an analytics rule. You create a watchlist called “ipwatchlist” that includes columns for "IPAddress" and "Location". You define "IPAddress" as the search key.

   |IPAddress,Location   |
   |---------|
   | 10.0.100.11,Home     |
   |172.16.107.23,Work     |
   |10.0.150.39,Home     |
   |172.20.32.117,Work   |

To only include events from IP addresses in the watchlist, you might use a query where watchlist is used as a variable or where the watchlist is used inline. 

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

## Next steps

To learn more about Microsoft Sentinel, see the following articles:

- [Create watchlists](watchlists-create.md)
- [Build queries and detection rules with watchlists](watchlists-queries.md)
- [Manage watchlists](watchlists-manage.md)
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
