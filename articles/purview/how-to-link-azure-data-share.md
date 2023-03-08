---
title: Connect to Azure Data Share
description: This article describes how to connect an Azure Data Share account with Microsoft Purview to search assets and track data lineage.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/07/2023
---
# How to connect Azure Data Share and Microsoft Purview

This article discusses how to connect your [Azure Data Share](../data-share/overview.md) account with Microsoft Purview and govern the shared datasets (both outgoing and incoming) in your data estate. Various data governance personas can discover and track lineage of data across boundaries like organizations, departments and even data centers.

>[!IMPORTANT]
> This article is about lineage for the [Azure Data Share service](../data-share/overview.md). If you are using data sharing in Microsoft Purview, use this article for lineage: [Microsoft Purview Data Sharing lineage](how-to-lineage-purview-data-sharing.md).

## Common scenarios

Data Share Lineage is aimed to provide detailed information for root cause analysis and impact analysis.

### Scenario 1: 360 view of datasets shared in/out for a partner organization or internal department

Data officers can see a list of all datasets that are bi-directionally shared with their partner organizations. They can search and discover the datasets by organization name and see a complete view of all outgoing and incoming shares.

### Scenario 2: Root cause analysis - upstream dependency on datasets coming into organization (consumer view of incoming shares)

A report has incorrect information because of upstream data issues from an external Data Share account. The data engineers can understand upstream failures, be informed about the reasons, and further contact the owner of the share to fix the issues causing their data discrepancy.

### Scenario 3: Impact analysis on datasets going outside organization (provider view of outgoing shares)

Data producers want to know who will be impacted upon making a change to their dataset. Using lineage, a data producer can easily understand the impact of the downstream internal or external partners who are consuming data using Azure Data Share.

## Azure Data Share and Microsoft Purview connected experience

To connect your Azure Data Share and Microsoft Purview account, do the following:

1. Create a Microsoft Purview account. All the Data Share lineage information will be collected by a Microsoft Purview account. You can use an existing one or create a new Microsoft Purview account.

1. Connect your Azure Data Share to your Microsoft Purview account.

    1. In the Microsoft Purview governance portal, you can go to **Management Center** and connect your Azure Data Share under the **External connections** section.
    1. Select **+ New** on the top bar, find your Azure Data Share in the pop-up side bar and add the Data Share account. Run a snapshot job after connecting your Data Share to Microsoft Purview account, so that the Data Share assets and lineage information is visible in Microsoft Purview.

       :::image type="content" source="media/how-to-link-azure-data-share/connect-to-data-share.png" alt-text="Screenshot of the management center to link Azure Data Share.":::

1. Execute your snapshot in Azure Data Share.

    - Once the Azure Data share connection is established with Microsoft Purview, you can execute a snapshot for your existing shares. 
    - If you don’t have any existing shares, go to the Azure Data Share portal to [share your data](../data-share/share-your-data.md) [and subscribe to a data share](../data-share/subscribe-to-data-share.md).
    - Once the share snapshot is complete, you can view associated Data Share assets and lineage in Microsoft Purview.

1. Discover Data Share accounts and share information in your Microsoft Purview account.

    - In the home page of Microsoft Purview account, select **Browse by asset type** and select the **Azure Data Share** tile. You can search for an account name, share name, share snapshot, or partner organization. Otherwise apply filters on the Search result page for account name, share type (sent vs received shares).

       :::image type="content" source="media/how-to-link-azure-data-share/azure-data-share-search-result-page.png" alt-text="Screenshot of Azure Data share in the search result page.":::

    >[!Important]
    >For Data Share assets to show in Microsoft Purview, a snapshot job must be run after you connect your Data Share to Microsoft Purview.

1. Track lineage of datasets shared with Azure Data Share.

    - From the Microsoft Purview search result page, choose the Data share snapshot (received/sent) and select the **Lineage** tab, to see a lineage graph with upstream and downstream dependencies.

    :::image type="content" source="media/how-to-link-azure-data-share/azure-data-share-lineage.png" alt-text="Screenshot of the lineage of datasets shared using Azure Data Share.":::

## Next steps

- [Catalog lineage user guide](catalog-lineage-user-guide.md)
- [Link to Azure Data Factory for lineage](how-to-link-azure-data-factory.md)