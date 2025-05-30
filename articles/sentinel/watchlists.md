---
title: Use Watchlists to Correlate and Enrich Event Data in Microsoft Sentinel
description: Learn how to use watchlists in Microsoft Sentinel to efficiently correlate and enrich event data, reduce alert fatigue, and respond to threats. Discover best practices and get started today.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 05/27/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to understand how to use watchlists in Microsoft Sentinel so that I can efficiently correlate and enrich event data, reduce alert fatigue, and quickly respond to threats.

---

# Watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel help security analysts efficiently correlate and enrich event data. They give you a flexible way to manage reference data, like lists of high-value assets or terminated employees. Integrate watchlists into your detection rules, threat hunting, and response workflows to reduce alert fatigue and respond to threats faster. This article explains how to use watchlists in Microsoft Sentinel, outlines key scenarios and limitations, and gives guidance on creating and querying watchlists to enhance your security operations.

Use watchlists in your search, detection rules, threat hunting, and response playbooks. Watchlists are stored in your Microsoft Sentinel workspace in the `Watchlist` table as name-value pairs. They're cached for optimal query performance and low latency.

> [!IMPORTANT]
> The features for watchlist templates and the ability to create a watchlist from a file in Azure Storage are currently in **PREVIEW**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## When to use watchlists

Use watchlists in these scenarios:

- **Investigate threats** and respond to incidents quickly by importing IP addresses, file hashes, and other data from CSV files. After you import the data, use watchlist name-value pairs for joins and filters in alert rules, threat hunting, workbooks, notebooks, and queries.

- **Import business data** as a watchlist. For example, import user lists with privileged system access or lists of terminated employees. Then, use the watchlist to create allowlists and blocklists to detect or prevent those users from signing in to the network.

- **Reduce alert fatigue**. Create allowlists to suppress alerts from a group of users, like users from authorized IP addresses who perform tasks that would normally trigger the alert. Prevent benign events from becoming alerts.

- **Enrich event data**. Use watchlists to add name-value combinations from external data sources to your event data.

## Watchlist limitations

We recommend reviewing the following limitations before creating watchlists:

| Limitation | Details |
|------------|---------|
| **Watchlist name and alias length** | Watchlist names and aliases must be between 3 and 64 characters. First and last characters must be alphanumeric; spaces, hyphens, and underscores allowed between. |
| **Intended use** | Use watchlists only for reference data. Watchlists aren't designed for large data volumes. |
| **Maximum active watchlist items** | You can have a maximum of 10 million active watchlist items across all watchlists in a workspace. Deleted items don't count. For larger volumes, use [custom logs](/azure/azure-monitor/agents/data-sources-custom-logs). |
| **Refresh interval** | Watchlists refresh every 12 days, updating the `TimeGenerated` field. |
| **Cross-workspace management** | Managing watchlists across workspaces using Azure Lighthouse isn't supported. |
| **Local file upload size** | Local file uploads are limited to files of up to 3.8 MB. |
| **Azure Storage file upload size (preview)** | Azure Storage uploads are limited to files of up to 500 MB. |
| **Column and table restrictions** | Watchlists must follow [KQL entity naming restrictions](/kusto/query/schema-entities/entity-names?view=microsoft-sentinel&preserve-view=true) for columns and names. |

## Microsoft Sentinel watchlist creation methods

Use one of the following methods to create watchlists in Microsoft Sentinel:

- Uploading a file from a local folder or from your Azure Storage account.

- Download a watchlist template from Microsoft Sentinel, add your data, and then upload the file when you create the watchlist.

To create a watchlist from a large file (up to 500 MB), upload the file to your Azure Storage account. Create a shared access signature (SAS) URL so Microsoft Sentinel can retrieve the watchlist data. A SAS URL includes both the resource URI and the SAS token for a resource, like a CSV file in your storage account. Add the watchlist to your workspace in Microsoft Sentinel.

For more information, see:

- [Create watchlists in Microsoft Sentinel](watchlists-create.md)
- [Built-in watchlist schemas](watchlist-schemas.md)
- [Azure Storage SAS token](../storage/common/storage-sas-overview.md#sas-token)

## Watchlists in queries for searches and detection rules

To correlate your watchlist data with other Microsoft Sentinel data, use Kusto tabular operators such as `join` and `lookup` with the `Watchlist` table. Microsoft Sentinel creates the following functions in the workspace to help reference and query your watchlists:

- `_GetWatchlistAlias` - returns the aliases of all your watchlists
- `_GetWatchlist` - queries the name-value pairs of the specified watchlist

When you create a watchlist, you define the *SearchKey*. The search key is the name of a column in your watchlist that you expect to use as a join with other data or as a frequent object of searches. For example, suppose you have a server watchlist that contains country/region names and their respective two-letter country codes. You expect to use the country codes often for searches or joins. So you use the country code column as the search key.

  ```kusto
  Heartbeat
  | lookup kind=leftouter _GetWatchlist('mywatchlist') 
    on $left.RemoteIPCountry == $right.SearchKey
  ```

Let's look at some other example queries.

Suppose you want to use a watchlist in an analytics rule. You create a watchlist called `ipwatchlist` with columns for `IPAddress` and `Location`. You set `IPAddress` as the **SearchKey**.

   |`IPAddress,Location`   |
   |---------|
   |`10.0.100.11,Home`     |
   |`172.16.107.23,Work`   |
   |`10.0.150.39,Home`     |
   |`172.20.32.117,Work`   |

To include only events from IP addresses in the watchlist, you might use a query where `watchlist` is used as a variable or inline.

This example query uses the watchlist as a variable:

  ```kusto
    //Watchlist as a variable
    let watchlist = (_GetWatchlist('ipwatchlist') | project IPAddress);
    Heartbeat
    | where ComputerIP in (watchlist)
  ```

This example query uses the watchlist inline with the query and the search key defined for the watchlist.

  ```kusto
    //Watchlist inline with the query
    //Use SearchKey for the best performance
    Heartbeat
    | where ComputerIP in ( 
        (_GetWatchlist('ipwatchlist')
        | project SearchKey)
    )
  ```

For more information, see [Build queries and detection rules with watchlists in Microsoft Sentinel](watchlists-queries.md) and the following articles in the Kusto documentation:

- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***lookup*** operator](/kusto/query/lookup-operator?view=microsoft-sentinel&preserve-view=true)
- [***in*** operator](/kusto/query/in-cs-operator?view=microsoft-sentinel&preserve-view=true)
- [***let*** statement](/kusto/query/let-statement?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

## Related content

For more information, see:

- [Create watchlists](watchlists-create.md)
- [Build queries and detection rules with watchlists](watchlists-queries.md)
- [Manage watchlists](watchlists-manage.md)
