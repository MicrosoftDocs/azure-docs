---
title: Use Azure Sentinel watchlists
description: This article describes how to use Azure Sentinel watchlists to create allowlists/blocklists, enrich event data, and assist in investigating threats.
services: sentinel
author: yelevin
ms.author: yelevin
ms.assetid: 1721d0da-c91e-4c96-82de-5c7458df566b
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.custom: mvc
ms.date: 07/11/2021
---

# Use Azure Sentinel watchlists

Azure Sentinel watchlists enable the collection of data from external data sources for correlation with the events in your Azure Sentinel environment. Once created, you can use watchlists in your search, detection rules, threat hunting, and response playbooks. Watchlists are stored in your Azure Sentinel workspace as name-value pairs and are cached for optimal query performance and low latency.

> [!IMPORTANT]
> Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Common scenarios for using watchlists include:

- **Investigating threats** and responding to incidents quickly with the rapid import of IP addresses, file hashes, and other data from CSV files. Once imported, you can use watchlist name-value pairs for joins and filters in alert rules, threat hunting, workbooks, notebooks, and general queries.

- **Importing business data** as a watchlist. For example, import user lists with privileged system access, or terminated employees, and then use the watchlist to create allowlists and blocklists used to detect or prevent those users from logging in to the network.

- **Reducing alert fatigue**. Create allowlists to suppress alerts from a group of users, such as users from authorized IP addresses that perform tasks that would normally trigger the alert, and prevent benign events from becoming alerts.

- **Enriching event data**. Use watchlists to enrich your event data with name-value combinations derived from external data sources.

> [!NOTE]
> - The use of watchlists should be limited to reference data, as they are not designed for large data volumes.
>
> - The **total number of active watchlist items** across all watchlists in a single workspace is currently limited to **10 million**. Deleted watchlist items do not count against this total. If you require the ability to reference large data volumes, consider ingesting them using [custom logs](../azure-monitor/agents/data-sources-custom-logs.md) instead.
>
> - Watchlists can only be referenced from within the same workspace. Cross-workspace and/or Lighthouse scenarios are currently not supported.

## Create a new watchlist

1. From the Azure portal, navigate to **Azure Sentinel** > **Configuration** > **Watchlist** and then select **+ Add new**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-new.png" alt-text="new watchlist" lightbox="./media/watchlists/sentinel-watchlist-new.png":::

1. On the **General** page, provide the name, description, and alias for the watchlist, and then select **Next: Source**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-general.png" alt-text="watchlist general page":::

1. On the **Source** page, select the dataset type (currently only CSV is available), enter the number of lines **before the header row** in your data file, and then choose a file to upload in one of two ways:
    1. Click the **Browse for files** link in the **Upload file** box and select your data file to upload.
    1. Drag and drop your data file onto the **Upload file** box.

    You will see a preview of the first 50 rows of results in the wizard screen.

1. In the **SearchKey** field, enter the name of a column in your watchlist that you expect to use as a join with other data or a frequent object of searches. For example, if your server watchlist contains country names and their respective two-letter country codes, and you expect to use the country codes often for search or joins, use the **Code** column as the SearchKey.

1. <a name="review-and-create"></a>Select **Next: Review and Create**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-source.png" alt-text="watchlist source page" lightbox="./media/watchlists/sentinel-watchlist-source.png":::

    > [!NOTE]
    >
    > File uploads are currently limited to files of up to 3.8 MB in size.

1. Review the information, verify that it is correct, wait for the *Validation passed* message, and then select **Create**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-review.png" alt-text="watchlist review page":::

    A notification appears once the watchlist is created.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-complete.png" alt-text="watchlist successful creation notification" lightbox="./media/watchlists/sentinel-watchlist-complete.png":::


## Create a new watchlist using a template (Public preview)

1. From the Azure portal, navigate to **Azure Sentinel** > **Configuration** > **Watchlist** > **Templates (Preview)**.

1. Select a template from the list to view details on the right, and then select **Create from template** to create your watchlist.

    :::image type="content" source="./media/watchlists/create-watchlist-from-template.png" alt-text="Create a watchlist from a built-in template." lightbox="./media/watchlists/create-watchlist-from-template.png":::

1. Continue in the **Watchlist wizard**:

    - When using a watchlist template, the the watchlist's **Name**, **Description**, and **Watchlist Alias** values are all read-only.

    - Select **Download Schema** to download a CSV file that contains the relevant schema expected for the selected watchlist template.

    Each built-in watchlist template has it's own set of data listed in the CSV file attached to the template. For more information, see [Built-in watchlist schemas](watchlist-schemas.md)

1.  Populate your local version of the CSV file, and then upload it back into the wizard.

1. Continue as you would when [creating a new watchlist from scratch](#review-and-create), and then use your watchlist with [queries](#use-watchlists-in-queries) and [analytics rules](#use-watchlists-in-analytics-rules).

## Use watchlists in queries

> [!TIP]
> For optimal query performance, use **SearchKey** (representing the field you defined in creating the watchlist) as the key for joins in your queries. See the example below.

1. From the Azure portal, navigate to **Azure Sentinel** > **Configuration** > **Watchlist**, select the watchlist you want to use, and then select **View in Log Analytics**.

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

To use watchlists in analytics rules, from the Azure portal, navigate to **Azure Sentinel** > **Configuration** > **Analytics**, and create a rule using the `_GetWatchlist('<watchlist>')` function in the query.

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

To get a list of watchlist aliases, from the Azure portal, navigate to **Azure Sentinel** > **General** > **Logs**, and run the following query: `_GetWatchlistAlias`. You can see the list of aliases in the **Results** tab.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-alias.png" alt-text="list watchlists" lightbox="./media/watchlists/sentinel-watchlist-alias.png":::

## Manage your watchlist in the Azure Sentinel portal

You can also view, edit, and create new watchlist items directly from the Watchlist blade in the Azure Sentinel portal.

1. To edit your watchlist, navigate to **Azure Sentinel > Configuration > Watchlist**, select the watchlist you want to edit, and select **Edit watchlist items** on the details pane.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit.png" alt-text="Screen shot showing how to edit a watchlist" lightbox="./media/watchlists/sentinel-watchlist-edit.png":::

1. To edit an existing watchlist item, mark the checkbox of that watchlist item, edit the item, and select **Save**. Select **Yes** at the confirmation prompt.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-change.png" alt-text="Screen shot showing how to mark and edit a watchlist item.":::

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-confirm.png" alt-text="Screen shot confirm your changes.":::

1. To add a new item to your watchlist, select **Add new** on the **Edit watchlist items** screen, fill in the fields in the **Add watchlist item** panel, and select **Add** at the bottom of that panel.

   :::image type="content" source="./media/watchlists/sentinel-watchlist-edit-add.png" alt-text="Screen shot showing how to add a new item to your watchlist.":::

## Next steps
In this document, you learned how to use watchlists in Azure Sentinel to enrich data and improve investigations. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
