---
title: 'Tutorial: Browse assets and view their lineage'
description: This tutorial describes how to browse for assets in the catalog and view data lineage. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 09/29/2020
---

# Tutorial: Browse assets and view their lineage

Browsing Azure Babylon is a powerful way to discover assets and view their important details, such as lineage.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Browse for assets in the catalog.
> * View the lineage of assets.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* Complete [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).
* Complete [Tutorial: Navigate the home page and search for an asset](starter-kit-tutorial-2.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Browse for assets in the catalog

In the preceding tutorial, you learned how search can help you discover assets in Azure Babylon catalog. Another way to discover assets in the catalog is by using the catalog's browsing experience.

To browse your Azure Babylon catalog, follow these steps:

1. Go to your Azure Babylon portal at `https://web.babylon.azure.com/resource/<your Azure Babylon account name>`.

1. On the **Home** page, select **Browse by asset type**.

   The **Browse by asset type** page appears, which displays a summary of all the asset types in your catalog.

1. To explore the various Azure Data Lake Gen2-type assets available in your catalog, select the **Azure Data Lake Gen2** tile.

   :::image type="content" source="./media/starter-kit-tutorial-3/browse-by-asset-type.png" alt-text="Screenshot showing the Browse by asset type page with Azure Data Lake Gen2 selected.":::

1. Sort the assets alphabetically. From the **Sort by** drop-down list at the top right, select **Name**.

   :::image type="content" source="./media/starter-kit-tutorial-3/browse-by-name.png" alt-text="Screenshot showing how to use the Sort by list to sort assets by name":::

1. Browse by using filters in the **Filters** pane. There are many filters you can set, such as **Asset type**, **Classification**, **Label**, **Contact**, and **Glossary term**.

   :::image type="content" source="./media/starter-kit-tutorial-3/browse-by-filter.png" alt-text="Screenshot showing the Filters pane.":::

1. Select the **Contoso_AccountsPayable_{N}** resource set. If this asset doesn't exist in your catalog, choose another one.

## View the lineage of assets

On the asset details page, explore the source of the data:

1. Select the **Lineage** tab of the **Contoso_AccountsPayable_{N}.ssv** resource set.

   The asset you selected is displayed. The lineage information that you're viewing shows that this resource set was copied from your Azure Blob storage account to Azure Data Lake Storage Gen2.

   :::image type="content" source="./media/starter-kit-tutorial-3/view-lineage.png" alt-text="Screenshot showing the Lineage view for the asset.":::

1. Select the other asset on this page, and select the **switch to asset** link.

   Observe that the window has switched to the Azure Blob resource set, which was the source of the Azure Data Lake Storage Gen2 resource set that you originally browsed for.

1. Select the **Overview** tab to investigate the asset and confirm its details.

For information about how to create an Azure Data Factory data flow activity between an Azure Blob and Azure Data Lake Storage Gen2 resource set and observe the lineage, see: [Azure Data Factory data flow activity](https://docs.microsoft.com/azure/data-factory/concepts-data-flow-overview).


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Browse for assets in the catalog.
> * View the lineage of assets.

Advance to the next tutorial to learn about resource sets, asset details, schemas, and classifications.

> [!div class="nextstepaction"]
> [Resource sets, asset details, schemas, and classifications](starter-kit-tutorial-4.md)
