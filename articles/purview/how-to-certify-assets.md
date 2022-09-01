---
title: Asset certification in the Microsoft Purview data catalog
description: How to certify assets in the Microsoft Purview data catalog
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 02/24/2022
---
# Asset certification in the Microsoft Purview data catalog

As a Microsoft Purview data catalog grows in size, it becomes important for data consumers to understand what assets they can trust. Data consumers must know if an asset meet their organization's quality standards and can be regarded as reliable. Microsoft Purview allows data stewards to manually endorse assets to indicate that they're ready to use across an organization or business unit. This article describes how data stewards can certify assets and data consumers can view certification labels.

## How to certify an asset

To certify an asset, you must be a **data curator** for the collection containing the asset.

1. Navigate to the [asset details](catalog-asset-details.md) of the desired asset. Select **Edit**.

    :::image type="content" source="media/how-to-certify-assets/edit-asset.png" alt-text="Edit an asset from the asset details page" border="true":::

1. Toggle the **Certified** field to **Yes**.

    :::image type="content" source="media/how-to-certify-assets/toggle-certification-on.png" alt-text="Toggle an asset to be certified" border="true":::

1. Save your changes. The asset will now have a "Certified" label next to the asset name.
    
    :::image type="content" source="media/how-to-certify-assets/view-certified-asset.png" alt-text="An asset with a certified label" border="true":::

> [!NOTE]
> PowerBI assets can only be [certified in a PowerBI workspace](/power-bi/collaborate-share/service-endorse-content). PowerBI endorsement labels are displayed in Microsoft Purview's search and browse experiences.

### Certify assets in bulk

You can use the Microsoft Purview [bulk edit experience](how-to-bulk-edit-assets.md) to certify multiple assets at once.

1. After searching or browsing the data catalog, select checkbox next to the assets you wish to certify.

    :::image type="content" source="media/how-to-certify-assets/bulk-edit-select.png" alt-text="Select assets to bulk certify" border="true":::

1. Select **View selected**.
1. Select **Bulk edit**

    :::image type="content" source="media/how-to-certify-assets/bulk-edit-open.png" alt-text="Open the bulk edit experience" border="true":::

1. Choose attribute **Certified**, operation **Replace with**, and new value **Yes**.

    :::image type="content" source="media/how-to-certify-assets/bulk-edit-certify.png" alt-text="Apply certification labels to all selected assets" border="true":::

1. Select **Apply**

All assets selected will have the "Certified" label. 

## Viewing certification labels in Search

When search or browsing the data catalog, you'll see a certification label on any asset that is certified. Certified assets will also be boosted in search results to help data consumers discover them easily.

:::image type="content" source="media/how-to-certify-assets/search-certified-assets.png" alt-text="Search results with certified assets" border="true":::


## Next steps

Discover your assets in the Microsoft Purview data catalog by either:
- [Browsing the data catalog](how-to-browse-catalog.md)
- [Searching the data catalog](how-to-search-catalog.md)
