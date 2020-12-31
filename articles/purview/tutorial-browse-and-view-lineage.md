---
title: 'Tutorial: Browse assets in Azure Purview and view their lineage'
description: This tutorial describes how to browse for assets in the catalog and view data lineage. 
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 12/01/2020
---

# Tutorial: Browse assets in Azure Purview (preview) and view their lineage

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This tutorial shows you how to browse assets in Azure Purview and view their important details, such as lineage.

This tutorial is *part 3 of a five-part tutorial series* in which you learn the fundamentals of how to manage data governance across a data estate using Azure Purview. This tutorial builds on the work you completed in [Part 2: Navigate the Azure Purview (preview) home page and search for an asset](tutorial-asset-search.md).

In this tutorial, you will:

> [!div class="checklist"]
>
> * Browse for assets in the catalog.
> * View the lineage of assets.

## Prerequisites

* Complete [Tutorial: Navigate the Azure Purview (preview) home page and search for an asset](tutorial-asset-search.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Browse for assets in the catalog

In the previous tutorial, you learned how search can help you discover assets in Azure Purview catalog. Another way to discover assets in the catalog is by using the catalog's browsing experience.

This section shows you how to browse your Azure Purview catalog.

1. Navigate to your Azure Purview resource in the Azure portal and select **Open Purview Studio**. You're automatically taken to your Purview Studio's home page.

1. On the **Home** page, select **Browse assets**.

   The **Browse assets** page appears, which displays a summary of all the asset types in your catalog.

1. To explore the various Azure Data Lake Gen2-type assets available in your catalog, select the **Azure Data Lake Gen2** tile.

   :::image type="content" source="./media/tutorial-browse-and-view-lineage/browse-by-asset-type.png" alt-text="Screenshot showing the Browse by asset type page with Azure Data Lake Gen2 selected.":::

1. If there are multiple assets, you can select the **Name** column header to sort the assets alphabetically. In this tutorial, there is only one Azure Data Lake Storage Gen2 asset.

1. Select the name of the asset.

1. Select the **Contoso_GrossProfit_{N}.ssv** resource set. If this asset doesn't exist in your catalog, choose another one.

   :::image type="content" source="media/tutorial-browse-and-view-lineage/view-adls-assets.png" alt-text="List of Azure Data Lake Storage Gen2 resources":::

## View the lineage of assets

On the asset details page, explore the source of the data.

1. Select the **Lineage** tab of the **Contoso_GrossProfit_{N}.ssv** resource set.

   The asset you selected is displayed. The lineage information that you see shows that this resource set was copied from your Azure Blob storage account to Azure Data Lake Storage Gen2.

   :::image type="content" source="./media/tutorial-browse-and-view-lineage/view-lineage.png" alt-text="Screenshot showing the Lineage view for the asset.":::

1. Select the blob asset on this page, and select the **Switch to asset** link.

   Observe that the window has switched to the Azure Blob resource set, which was the source of the original Azure Data Lake Storage Gen2.

1. Select the **Overview** tab to investigate the asset and confirm its details.

For information about how to create an Azure Data Factory data flow activity between an Azure Blob and Azure Data Lake Storage Gen2 resource set and observe the lineage, see [Azure Data Factory data flow activity](../data-factory/concepts-data-flow-overview.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Browse for assets in the catalog.
> * View the lineage of assets.

Advance to the next tutorial to learn about resource sets, asset details, schemas, and classifications.

> [!div class="nextstepaction"]
> [Resource sets, asset details, schemas, and classifications](tutorial-schemas-and-classifications.md)
