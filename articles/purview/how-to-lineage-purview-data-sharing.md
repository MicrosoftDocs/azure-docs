---
title: Microsoft Purview Data Sharing Lineage
description: This article describes how to view lineage of shared datasets, shared using Microsoft Purview Data Sharing.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.topic: how-to
ms.date: 02/16/2023
---
# How to view Microsoft Purview Data Sharing lineage

This article discusses how to view the lineage of datasets shared using [Microsoft Purview Data Sharing](concept-data-share.md). With these tools, users can discover and track lineage of data across boundaries like organizations, departments, and even data centers.

>[!IMPORTANT]
> This article is about lineage for [Microsoft Purview Data Sharing](concept-data-share.md). If you are using Azure Data Share, use this article for lineage: [Azure Data Share lineage](how-to-link-azure-data-share.md).

## Common scenarios

Data Sharing lineage aims to provide detailed information for root cause analysis and impact analysis.

Some common scenarios include:

- [Full view of datasets shared in and out of your organization](#full-view-of-datasets-shared-in-and-out-of-your-organization)
- [Root cause analysis for upstream dataset dependencies](#root-cause-analysis-for-upstream-dataset-dependencies)
- [Impact analysis for shared datasets](#impact-analysis-for-shared-datasets)

### Full view of datasets shared in and out of your organization

Data officers can see a list of all bi-directionally shared datasets with their partner organizations. They can search and discover the datasets by organization name and see a complete view of all outgoing and incoming shares.

See the [Azure Active Directory share lineage](#azure-active-directory-share-lineage) section to see a full view of outgoing and incoming shares.

### Root cause analysis for upstream dataset dependencies

A report has incorrect information because of upstream data issues from an external Microsoft Purview Data Sharing activity. The data engineers can understand upstream failures, understand possible cause, and further contact the owner of the share to fix the issues causing their data discrepancy.

See the [lineage of a share](#lineage-of-a-share) or [Azure Active Directory share lineage](#azure-active-directory-share-lineage) sections to see the upstream dependencies for your assets.

### Impact analysis for shared datasets

Data producers want to know who will be impacted when they make a change to their datasets. With a lineage map, a data producer can easily understand the impact of the downstream internal or external partners who are consuming data using Microsoft Purview Data Sharing.

See the [lineage of a share](#lineage-of-a-share) or [Azure Active Directory share lineage](#azure-active-directory-share-lineage) sections to see downstream dependencies of your shared assets.

## Lineage of a share

To see the data sharing lineage for your sent share or received share asset, you only need to have [data reader permissions](catalog-permissions.md) on the collection where the asset is housed.

1. Discover your sent share or received share asset in the Catalog [search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md) for the share in the data catalog, and narrow results to only data shares.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/search-for-share.png" alt-text="Screenshot of the data catalog search, showing the data share filter selected and a share highlighted." border="true":::

1. Select your data share asset.

1. Select the lineage tab to see a graph with upstream and downstream dependencies.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/select-lineage-tab.png" alt-text="Screenshot of the data share asset lineage page, showing the lineage tab highlighted and a lineage graph." border="true":::

1. You can select the files or folders, or the Azure Active Directory asset in the lineage canvas and see the data sharing lineage for those assets.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/select-lineage-asset.png" alt-text="Screenshot of the data share asset lineage page, showing the data asset selected and the switch to asset button highlighted." border="true":::

## Azure Active Directory share lineage

1. You can search for your Azure Active Directory tenant asset in the Catalog using the search bar, or filtering by **Source type** and selecting **Azure Active Directory**.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/search-active-directory.png" alt-text="Screenshot of the data catalog search, with the filter set to Azure Active Directory." border="true":::

1. Select your Azure Active Directory, then select the **Lineage** tab to see a lineage graph with either upstream or downstream dependencies.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/active-directory-lineage.png" alt-text="Screenshot of the Azure Active Directory asset with the lineage tab selected, showing the lineage map." border="true":::

1. If you're seeing all sent shares, or all received shares, you can select the button to switch the view to see the other.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/switch-shares.png" alt-text="Screenshot of the Azure Active Directory shares lineage map, showing the Switch to received shares button highlighted." border="true":::

    >[!NOTE]
    >If you do not see this button it may be because your Azure Active Directory does not have any sent/received shares, or that you do not have permission on the collection where the sent/received shares are housed.

1. You can also select any file or folder in the lineage canvas and see the data sharing lineage for those assets.

    :::image type="content" source="./media/how-to-lineage-purview-data-sharing/switch-to-asset.png" alt-text="Screenshot of the Azure Active Directory shares lineage map, showing an asset selected and the Switch to asset button highlighted." border="true":::

>[!Important]
>For Data Share assets to show in Microsoft Purview, the ADLS Gen2 or Blob Storage account that the shares (sent share or received share) belong to should be registered with Microsoft Purview and the user needs Reader permission on the collection where they are housed.

## Troubleshoot

Here are some common issues when viewing data sharing lineage and their possible resolutions.

### Can't see the recipient Azure Active Directory tenant on the sent share lineage

If you're unable to see the recipient Azure Active Directory tenant on the sent share lineage, it means the recipient hasn't attached the share yet.

### Can't find a sent share or received share asset in the Catalog

Sent or received share assets are housed in the same collection as their registered storage account assets.

* If the storage accounts the share assets belong to aren't registered, the share assets won't be discoverable.
* If you don't have a minimum of Data Reader permission to the collection where the share asset is housed, the share assets aren't discoverable.

## Next steps

* [Data sharing quickstart](quickstart-data-share.md)
* [How to Share data](how-to-share-data.md)
* [How to receive a share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
* [Data Sharing FAQ](how-to-data-share-faq.md)
