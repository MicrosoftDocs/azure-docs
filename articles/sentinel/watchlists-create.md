---
title: Create watchlists - Microsoft Sentinel
description: Create watchlist in  Microsoft Sentinel for allowlists or blocklists,  to enrich event data, and help investigate threats.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 1/04/2022
---

# Create watchlists in Microsoft Sentinel

Watchlists in Microsoft Sentinel allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. For example, you might create a watchlist with a list of high value assets, terminated employees, or service accounts in your environment.

Create a watchlist from a local file or by using a template.

File uploads are currently limited to files of up to 3.8 MB in size. Before you create a watchlist, review the [limitations of watchlists](watchlists.md).

## Create a watchlist from a local file

You can upload a CSV file from your local machine to create a watchlist.

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **Configuration**, select **Watchlist**.
1. Select **+ Add new**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-new.png" alt-text="new watchlist" lightbox="./media/watchlists/sentinel-watchlist-new.png":::

1. On the **General** page, provide the name, description, and alias for the watchlist.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-general.png" alt-text="watchlist general page":::

1. Select **Next: Source**.
1. Use the information in the following table to upload your watchlist data.


    |Field  |Description |
    |---------|---------|
    |Select a type for the dataset     |   CSV file with a header (.csv)     |
    |Number of lines before row with headings     |  Enter the number of lines before the header row that's in your data file.       |
    |Upload file   |  Either drag and drop your data file, or select **Browse for files** and select the file to upload.      |
    |SearchKey  |  Enter the name of a column in your watchlist that you expect to use as a join with other data or a frequent object of searches. For example, if your server watchlist contains country names and their respective two-letter country codes, and you expect to use the country codes often for search or joins, use the **Code** column as the SearchKey.    |

1. Select **Next: Review and Create**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-source.png" alt-text="watchlist source page" lightbox="./media/watchlists/sentinel-watchlist-source.png":::


1. Review the information, verify that it's correct, wait for the **Validation passed** message, and then select **Create**.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-review.png" alt-text="watchlist review page":::

    A notification appears once the watchlist is created.

    :::image type="content" source="./media/watchlists/sentinel-watchlist-complete.png" alt-text="watchlist successful creation notification" lightbox="./media/watchlists/sentinel-watchlist-complete.png":::

## Create a watchlist by using a template (public preview)

Download one of the watchlist templates from Microsoft Sentinel to populate with your data. Then upload that file when you create the watchlist in Microsoft Sentinel.

Each built-in watchlist template has its own set of data listed in the CSV file attached to the template. For more information, see [Built-in watchlist schemas](watchlist-schemas.md).

The ability to create a watchlist by using a template is currently in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To download one of the watchlist templates,

1. In the Azure portal, go to **Microsoft Sentinel** and select the appropriate workspace.
1. Under **Configuration**, select **Watchlist**.
1. Select the tab **Templates (Preview)**.
1. Select a template from the list to view details of the template in the right pane.
1. Select the ellipses **...** at the end of the row.
1. Select **Download Schema**.

    :::image type="content" source="./media/watchlists/create-watchlist-download-schema.png" alt-text="Screenshot of templates tab with download schema selected.":::

1. Populate your local version of the file and save it locally as a CSV file.

To create the watchlist from the template you populated,

1. From appropriate workspace in Microsoft Sentinel, select **Watchlist**.
1. Select the tab **Templates (Preview)**.
1. Select the appropriate template from the list to view details of the template in the right pane.
1. Select **Create from template**,

    :::image type="content" source="./media/watchlists/create-watchlist-from-template.png" alt-text="Create a watchlist from a built-in template." lightbox="./media/watchlists/create-watchlist-from-template.png":::

1. On the **General** tab, notice that the **Name**, **Description**, and **Watchlist Alias** fields are all read-only.
1. On the **Source** tab, select **Browse for files** and select the file you created from the template.
1. Select **Next: Review and Create** > **Create**.

## Deleted and recreated watchlists in Log Analytics view

If you delete and recreate a watchlist, you might see both the deleted and recreated entries in Log Analytics within the five-minute SLA for data ingestion. If you see these entries together in Log Analytics for a longer period of time, submit a support ticket.

## Next steps

To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
- [Manage watchlists](watchlists-manage.md)
- [Build queries and detection rules with watchlists](watchlists-queries.md)
