---
title: 'Tutorial: Navigate the Azure Purview home page and search for an asset'
description: This tutorial describes how to use features on the Azure Purview home page and search in the catalog. 
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 02/22/2020
---

# Tutorial: Navigate the Azure Purview (preview) home page and search for an asset

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this tutorial, you become familiar with Azure Purview by navigating the features of the home page and searching for an asset in the catalog.

This article is *part 2 of a five-part tutorial series* in which you learn the fundamentals of how to manage data governance across a data estate using Azure Purview. This tutorial builds on the work you completed in [Part 1: Scan data with Azure Purview](tutorial-scan-data.md)

In this tutorial, you will:

> [!div class="checklist"]
>
> * Navigate the Azure Purview home page.
> * Search for an asset.
> * Add an asset owner.

## Prerequisites

* Complete [Tutorial: Scan data with Azure Purview](tutorial-scan-data.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Navigate the Azure Purview home page

The following steps walk you through the Azure Purview home page.

1. Navigate to your Azure Purview resource in the Azure portal and select **Open Purview Studio**. You're automatically taken to your Purview Studio's home page.

   The top of the home page displays the name of your catalog and a set of catalog analytics. Included are the number of sources, data assets, and glossary terms. In the summary, you can see that there are over 200 assets in total and 113 glossary terms. This number updates as your organization scans and adds more terms to Azure Purview.

   :::image type="content" source="./media/tutorial-asset-search/purview-home-page.png" alt-text="Screenshot showing the Azure Purview home page.":::

1. Select **Browse assets** to see all of your assets.

## Search for an asset

Before you begin, here's a quick refresher on some fundamental terminology:

* **Asset**: A single object in the catalog that's concise and contains the definition of any entity in the data estate. Examples of entities include a SQL table, a Power BI report, and your data factory activity.
  
* **Schema**: Also known as a column or attribute, a schema represents the structure of an asset or a resource set.

* **Resource set**: A single object in the catalog that represents many physical objects in storage. These objects usually share a common schema, and in most cases, a naming convention or folder structure. For example, the date format is *yyyy/mm/dd*. For more information, see [Understand resource sets](concept-resource-sets.md).

* **Asset type**: A grouping of assets and resource sets under a logical name, which usually maps to the name of the data platform.

Follow these steps to search for an asset and mark yourself as the owner:

1. In the **Search catalog** box on your home page, enter the name of the resource group that contains your data estate (the resource group you created in the previous tutorial). A list of suggestions will appear.

1. Select **View search results**. Because all of your assets begin with the name of your resource group, they all appear in the search results. Outside of this tutorial, you would search for specific asset names, not resource groups.

    :::image type="content" source="./media/tutorial-asset-search/search-suggestions.png" alt-text="Screenshot showing the list of catalog search suggestions.":::

1. You can use the filters in the left navigation to filter by asset type, classification, contact, label, and glossary term.

1. To search for a resource set, begin typing the name of the set. A list of search suggestions with the correct keywords will appear. You can also search for absolute names by putting them in quotation marks.

   :::image type="content" source="media/tutorial-asset-search/keyword-search.png" alt-text="Azure Purview keyword asset search":::

## Edit an asset

1. Select one of the assets from your search results. Then select **Edit**

1. On the **Overview** tab, you can add a description.

    :::image type="content" source="./media/tutorial-asset-search/overview-tab.png" alt-text="Screenshot showing the Description field on the Overview tab.":::

1. Select the **Contacts** tab. Next to **Owners**, in **Select user or group**, start typing your corporate email address.

    :::image type="content" source="./media/tutorial-asset-search/contacts-tab.png" alt-text="Screenshot showing populated fields.":::

    A name suggestion is automatically displayed.

1. Next to **Experts**, in **Select user or group**,  enter a name (for example, your manager's name), and then select **Save**.

    The description, owner name, and expert name fields are now populated.

## Next steps

Before you move on to the next tutorial in this series, take some additional time to explore the Azure Purview home page on your own. In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Navigate the Azure Purview home page.
> * Search for an asset.
> * Add an asset owner.

Advance to the next tutorial to learn how to browse for assets in Azure Purview and discover asset lineage.

> [!div class="nextstepaction"]
> [Browse assets and view their lineage](tutorial-browse-and-view-lineage.md)
