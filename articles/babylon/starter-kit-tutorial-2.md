---
title: 'Tutorial: Navigate the home page and search for an asset'
titleSuffix: Azure Purview
description: This tutorial describes how to use features on the Azure Purview home page and search in the catalog. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 09/28/2020
---

# Tutorial: Navigate the home page and search for an asset

Become familiar with Azure Purview by navigating the features of the home page and searching for an asset in the catalog.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Navigate the Azure Purview home page.
> * Search for an asset.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* Complete [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Navigate the Azure Purview home page

Follow these steps to explore the home page:

1. Go to your Azure Purview portal at `https://web.babylon.azure.com/resource/<your babylon account name>`, and then select **Home**.

   The top of the home page displays the name of your catalog and a set of catalog analytics. Included are the number of users, data assets, and glossary terms. In the summary, you can see that there are over 16,000 assets in total and 189 glossary terms. This number updates as your organization scans and adds more terms to Azure Purview.

   :::image type="content" source="./media/starter-kit-tutorial-2/babylon-home-page.png" alt-text="Screenshot showing the Azure Purview home page.":::

1. To navigate to other areas, select: **Browse by asset type**, **View insights**, or **Manage your data**.

1. Select **Manage your data** > **Data sources**. Two of the data sources are the Azure Blob storage and Azure Data Lake Storage Gen2 accounts that you configured in [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).

1. Select **Browse by asset type**. The assets include all of your files in the data sources you configured previously.

## Search for an asset

Before you begin, here's a quick refresher on some fundamental terminology:

* **Asset**: A single object in the catalog that's concise and contains the definition of any entity in the data estate. Examples of entities include a SQL table, a Power BI report, and your data factory activity.
  
* **Schema**: Also known as a column or attribute, a schema represents the structure of an asset or a resource set.

* **Resource set**: A single object in the catalog that represents many physical objects in storage. These objects usually share a common schema, and in most cases, a naming convention or folder structure. For example, the date format is *yyyy/mm/dd*. For more information, see [Understand resource sets](concept-resource-sets.md).

* **Asset type**: A grouping of assets and resource sets under a logical name, which usually maps to the name of the data platform.

Follow these steps to search for an asset, pin it, and mark yourself as owner:

1. In the **Search catalog** box on your home page, start typing *Contoso_*.

   If you don't have any assets beginning with *Contoso_*, replace with an asset name that you've scanned before.

   The list of options is displayed based on autocomplete suggestions. As shown by the icons next to the assets, these suggestions come in various asset types, such as Azure Blob storage or Azure SQL storage.

    :::image type="content" source="./media/starter-kit-tutorial-2/search-suggestions.png" alt-text="Screenshot showing the list of catalog search suggestions.":::

1. In the left pane, in the **Asset type** drop-down list, select **Azure Blob Resource Set**.

    All the search suggestions are now of the same type as the Azure Blob resource set.

1. Continue typing to change the search term to *Contoso_s*, and note how the suggestions change.

1. Type *Contoso_CashFlow** to find a single resource set of interest to you. If this particular asset doesn't exist in your catalog, choose another one.

1. Select **Contoso_CashFlow_{N}.json**, or some other resource set.

1. From the top menu, select **Pin**.

    :::image type="content" source="./media/starter-kit-tutorial-2/select-pin.png" alt-text="Screenshot showing how to select the Pin button.":::

1. Select **Edit**, and then enter a **Description** in the **Overview** tab.

    :::image type="content" source="./media/starter-kit-tutorial-2/overview-tab.png" alt-text="Screenshot showing the Description field on the Overview tab.":::

1. Select the **Contacts** tab. Next to **Owners**, in **Select user or group**, start typing your corporate email address.

    :::image type="content" source="./media/starter-kit-tutorial-2/contacts-tab.png" alt-text="Screenshot showing populated fields.":::

    A name suggestion is automatically displayed.

1. Next to **Experts**, in **Select user or group**,  enter a name (for example, your manager's name), and then select **Save**.

    The description, owner name, and expert name fields are now populated.

1. To return to the Azure Purview home page, select  **Home** at the top left. Azure displays the asset you created in both the **Recently accessed** and **Pinned assets** lists.

   :::image type="content" source="./media/starter-kit-tutorial-2/pinned-assets-list.png" alt-text="Screenshot showing classifications on the home page.":::

1. To learn about the supported stores and classifications in Azure Purview, under **FAQ/Documentation** at the lower right, select **Supported Stores and Classifications**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Navigate the Azure Purview home page.
> * Search for an asset.

Advance to the next tutorial to learn how to browse for assets in Azure Purview and discover asset lineage.

> [!div class="nextstepaction"]
> [Browse assets and view their lineage](starter-kit-tutorial-3.md)
