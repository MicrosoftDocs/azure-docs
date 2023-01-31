---
title: Microsoft Purview Data Sharing Lineage
description: This article describes how to view lineage of shared datasets, shared using Microsoft Purview Data Sharing.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.topic: how-to
ms.date: 01/22/2023
---
# How to view Microsoft Purview Data Sharing lineage

This article discusses how to view the lineage of datasets shared using Microsoft Purview Data Sharing. With these tools, users can discover and track lineage of data across boundaries like organizations, departments, and even data centers.

## Common scenarios

Data Sharing lineage is aimed to provide detailed information for root cause analysis and impact analysis.

Some common scenarios include:

- [Full view of datasets shared in and out of your Azure Active Directory tenant or organization](#full-view-of-datasets-shared-in-and-out-of-your-azure-active-directory-tenant-or-organization)
- [Root cause analysis for upstream dataset dependencies](#root-cause-analysis-for-upstream-dataset-dependencies)
- [Impact analysis for shared datasets](#impact-analysis-for-shared-datasets)

### Full view of datasets shared in and out of your Azure Active Directory tenant or organization

Data officers can see a list of all datasets that are bi-directionally shared with their partner organizations. They can search and discover the datasets by organization name and see a complete view of all outgoing and incoming shares.

### Root cause analysis for upstream dataset dependencies

A report has incorrect information because of upstream data issues from an external Microsoft Purview Data Sharing activity. The data engineers can understand upstream failures, be informed about the reasons, and further contact the owner of the share to fix the issues causing their data discrepancy.

### Impact analysis for shared datasets

Data producers want to know who will be impacted upon making a change to their dataset. Using lineage, a data producer can easily understand the impact of the downstream internal or external partners who are consuming data using Microsoft Purview Data Sharing.

## Microsoft Purview Data Sharing lineage

To see the data sharing lineage for your sent share or received share asset, you only need to have [data reader permissions](catalog-permissions.md) on the collection where the asset is housed.

1. Discover your sent share or received share asset in the Catalog.

    - In the home page of Microsoft Purview account, filter by Object type and select Data share.  
    - You can search for sent share or received share asset name in the Search bar as well.

1. Track lineage of datasets shared within Microsoft Purview Data Sharing.

    - From the Microsoft Purview search result page, choose the Data share asset (sent share or received share) and select the Lineage tab, to see a lineage graph with upstream and downstream dependencies.
    - You can select the files or folders in the lineage canvas and see the data sharing lineage for those assets.
    - Similarly, you can navigate to the Azure Active Directory asset in the lineage canvas and see the corresponding data sharing lineage view.

To see the data sharing lineage for your sent share or received share asset, do the following:

1. Discover your Azure Active Directory tenant asset in the Catalog.

    - In the home page of Microsoft Purview account, filter by Source type and select Azure Active Directory.
    - You can search Azure Active Directory tenant name in the Search bar as well.

1. Track lineage of datasets shared within Microsoft Purview Data Sharing.

    - From the Microsoft Purview search result page, choose the Azure Active Directory asset and select the Lineage tab, to see a lineage graph with either upstream or downstream dependencies.
    - If you're seeing all the sent shares in your Azure Active Directory tenant, you can select the button to switch the view to see all the received shares and vice versa.
    - You can navigate to the sent share or received share assets in the lineage canvas and see the corresponding data sharing lineage view.
    - Similarly, you can select the files or folders in the lineage canvas and see the data sharing lineage for those assets.

>[!Important]
>For Data Share assets to show in Microsoft Purview, the ADLS Gen2 or Blob Storage account that the shares (sent share or received share) belong to should be registered with Microsoft Purview. A user can see such assets in a collection that they have a minimum of Data Reader permissions.

## Next steps

* [Data sharing quickstart](quickstart-data-share.md)
* [How to Share data](how-to-share-data.md)
* [How to receive a share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
* [Data Sharing FAQ](how-to-data-share-faq.md)
