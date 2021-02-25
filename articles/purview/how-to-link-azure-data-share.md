---
title: Connect to Azure Data Share
description: This article describes how to connect an Azure Data Share account with Azure Purview to search assets and track data lineage.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/25/2020
---
# How to connect Azure Data Share and Azure Purview

This article discusses how to connect your [Azure Data Share](../data-share/overview.md) account with Azure Purview and govern the shared datasets (both outgoing and incoming) in your data estate. Various data governance personas can discover and track lineage of data across boundaries like organizations, departments and even data centers.

## Common Scenarios

Data Share Lineage is aimed to provide detailed information for root cause analysis and impact analysis.

### Scenario 1: 360 view of datasets shared in/out for a partner organization or internal department

Data officers can see a list of all datasets that are bi-directionally shared with their partner organizations. They can search and discover the datasets by organization name and see a complete view of all outgoing and incoming shares.

### Scenario 2: Root cause analysis - upstream dependency on datasets coming into organization (consumer view of incoming shares)

A report has incorrect information because of upstream data issues from an external Data Share account. The data engineers can understand upstream failures, be informed about the reasons, and further contact the owner of the share to fix the issues causing their data discrepancy.

### Scenario 3: Impact analysis on datasets going outside organization (provider view of outgoing shares)

Data producers want to know who will be impacted upon making a change to their dataset. Using lineage, a data producer can easily understand the impact of the downstream internal or external partners who are consuming data using Azure Data Share.

## Azure Data Share and Purview connected experience

To connect your Azure Data Share and Azure Purview account, do the following:

1. Create a Purview account. All the Data Share lineage information will be collected by a Purview account. You can use an existing one or create a new Purview account.

1. Connect your Azure Data Share to your Purview account.

    1. In the Purview portal, you can go to **Management Center** and connect your Azure Data Share under the **External connections** section.
    1. Select **+ New** on the top bar, find your Azure Data Share in the pop-up side bar and add the Data Share account. Run a snapshot job after connecting your Data Share to Purview account, so that the Data Share assets and lineage information is visible in Purview.

       :::image type="content" source="media/how-to-link-azure-data-share/connect-to-data-share.png" alt-text="Management center to link Azure Data Share":::

1. Execute your snapshot in Azure Data Share.

    - Once the Azure Data share connection is established with Azure Purview, you can execute a snapshot for your existing shares. 
    - If you don’t have any existing shares, go to the Azure Data Share portal to [share your data](../data-share/share-your-data.md) [and subscribe to a data share](../data-share/subscribe-to-data-share.md).
    - Once the share snapshot is complete, you can view associated Data Share assets and lineage in Purview.

1. Discover Data Share accounts and share information in your Purview account.

    - In the home page of Purview account, select **Browse by asset type** and select the **Azure Data Share** tile. You can search for an account name, share name, share snapshot, or partner organization. Otherwise apply filters on the Search result page for account name, share type (sent vs received shares).

       :::image type="content" source="media/how-to-link-azure-data-share/azure-data-share-search-result-page.png" alt-text="Azure Data share in Search result page":::

    >[!Important]
    >For Data Share assets to show in Purview, a snapshot job must be run after you connect your Data Share to Purview.

1. Track lineage of datasets shared with Azure Data Share.

    - From the Purview search result page, choose the Data share snapshot (received/sent) and select the **Lineage** tab, to see a lineage graph with upstream and downstream dependencies.

    :::image type="content" source="media/how-to-link-azure-data-share/azure-data-share-lineage.png" alt-text="Lineage of Datasets shared using Azure Data Share":::

## Next steps

- [Catalog lineage user guide](catalog-lineage-user-guide.md)
- [Link to Azure Data Factory for lineage](how-to-link-azure-data-factory.md)
