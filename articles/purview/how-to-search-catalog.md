---
title: 'How to: search the Data Catalog'
description: This article gives an overview of how to search a data catalog.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/15/2020
---

# Search the Azure Purview Data Catalog

This article describes how to use the various search features in the Azure Purview Data Catalog.

## Search the catalog for assets

The steps to conduct an asset search are:

1. [Open the asset search dialog](#open-the-asset-search-dialog) by selecting **Search catalog**.
1. [Enter search terms](#enter-search-terms) to find assets with characteristics that match the terms.
1. [Set quick filters](#set-quick-filters) to narrow the search.
1. [Start the search](#start-the-search) and go to the search results.

It doesn't matter whether you set quick filters before or after you enter search terms.

If there are no search terms and no filters, the search results include all assets.

### Open the asset search dialog

Open the asset search dialog by selecting **Search catalog**.

:::image type="content" source="./media/how-to-search-catalog/search-catalog.png" alt-text="Below 'Search catalog' there's a left pane with search filters, and a right pane with recent searches." border="true":::

The search dialog shows quick filters, search history, and a list of recently accessed assets.

:::image type="content" source="./media/how-to-search-catalog/asset-search-dialog.png" alt-text="The search list is in the right pane, below 'Search catalog'." border="true":::

### Enter search terms

Enter one or more search terms in **Search catalog**. As you type, matching search terms from recent searches are listed in **Your recent searches**, suggested matching search terms are listed in **Search suggestions**, and matching data assets are listed in **Asset suggestions**.

:::image type="content" source="./media/how-to-search-catalog/enter-search-terms.png" alt-text="Screenshot showing the results of a search being entered in the Search catalog box":::

Search results include only assets with one or more characteristics that match the search terms. These characteristics include asset name, asset type, classifications, and contacts.

#### Types of search criteria

Azure Purview supports the following types of search criteria.

> [!Note]
> Always specify Boolean operators (**AND**, **OR**, **NOT**) in all caps. Otherwise, case doesn't matter, nor do extra spaces.

- **hive**: Find documents that contain **hive**.
- **hive database**: Find documents that contain exactly **hive database**.
- **hive OR database**: Find documents that contain **hive** or **database**, or both.
- **hive AND database**, **hive && database**: Find documents that contain both **hive** and **database**.
- **hive AND (database OR warehouse)**: Find documents that contain **hive** and either **database** or **warehouse**, or both.
- **hive NOT database**: Find documents that contain **hive**, but not **database**.
- **hiv**: Find documents that contain a word that begins with **hiv**. For example, **hiv**, **hive**, **hivbar** (* is a wild card that matches any number of characters).

### Set quick filters

The search results list is based on the search terms you enter into **Search catalog**, and on the values you select for the quick filters.

A quick filter limits the search results list to assets that have a selected value of a characteristic. The filter has a drop-down list and a text box. The drop-down list shows values of the characteristic that are in the *current* search results. Next to each value in the list is a count of the number of assets in the current search results that have that value. If you select a value from the list, the search results will be restricted to assets that have that value. You can only select one value.

The current search results used in forming the drop-down list are determined by:

- The search terms that are entered in **Search catalog**. 
- The values that are selected in the quick filters.

Here is an example of the "Asset type" quick filter.

:::image type="content" source="./media/how-to-search-catalog/asset-type-quick-filter.png" alt-text="The asset type quick filter example." border="true":::

You can enter text in the text box to restrict the values in the drop-down list to values that match or partially match the text. For examples of using the text box, see [Search quick filter: filter by asset type](#search-quick-filter-filter-by-asset-type), and [Search quick filter: filter by classification](#search-quick-filter-filter-by-classification).

#### Search quick filter: filter by asset type

To filter by asset type, use the **Asset type** quick filter. The drop-down list shows the asset types found in the current search results, as determined by the search terms and the quick filters. For each type, the number of assets of that type is shown.

:::image type="content" source="./media/how-to-search-catalog/asset-type-quick-filter.png" alt-text="The asset type quick filters is highlighted. It shows asset types, and a count for each." border="true":::

Select an asset type to restrict the search results to assets of that type. You can only select one type.

To show only asset types whose names match a string, enter the string in the text box. For example, to show only asset types with **sql** in their names, enter **sql**.

:::image type="content" source="./media/how-to-search-catalog/filter-asset-types.png" alt-text="The Quick Filters pane has sql for 'Asset type'. The list of assets that contain sql shows three entries." border="true":::

Select an asset type to restrict the search results to assets of that type. You can select only one type.

#### Search quick filter: filter by classification

To filter by asset classification, use the **Classification** quick filter. The drop-down list shows the classifications that have been assigned to one or more assets in the current search results, as determined by the search terms and the quick filters. For each classification, the number of assets assigned that classification is shown.

:::image type="content" source="./media/how-to-search-catalog/classification-quick-filter.png" alt-text="The classification quick filters is highlighted." border="true":::

Select a classification to restrict the search results to assets assigned that classification. You can only select one classification.

To show only classifications whose names match a string, enter the string in the text box. For example, to show only classifications with **number** in their names, enter **number**.

:::image type="content" source="./media/how-to-search-catalog/filter-classifications.png" alt-text="In the Quick Filters pane, Classification is 'bank', and the classifications listed all contain that value." border="true":::

Select a classification to restrict the search results to assets that have been assigned that classification. You can't select more than one classification.

#### Search quick filter: filter by contacts

A *contact* is a person that's assigned to an asset as an owner or expert. When you view asset details, contacts are shown on the **Contacts** tab.

There are two ways to search for assets that have a particular contact assigned to them.

- Enter all or part of the contact name in **Search catalog** and do a search. The search results will include assets that have contacts whose names match your search terms.
- Select the contact of interest in the **Contact** quick filter and do a search.

:::image type="content" source="./media/how-to-search-catalog/contact-quick-filter.png" alt-text="The value of Person in the Quick Filters pane is 'darren'. There are three suggestions in the Suggestions pane." border="true":::

## Search example

Let's consider a hypothetical example to see how the search terms and quick filters interact to determine the search results. In particular, we'll monitor the count of asset type **Azure Blob Storage**.

- We do the first search with no search terms entered and no values selected in the quick filters. The search finds all assets in the catalog. The search results list and the **Asset type** quick filter reveal:

    - The search results list has 164,230 assets, which is all the assets in the catalog.
    - The **Asset type** drop-down list has 43 entries. These are all the asset types in the catalog. Since every asset is of one and only one type, the sum of counts of the 43 asset types is 164,230.
    - The **Azure Blob Storage** asset type is the first entry in the drop-down list of the **Asset type** quick filter. The values are ordered by count, largest first, so **Azure Blob Storage** is the most common asset type. Its count is 118,174.

- We now enter **parquet** into **Search catalog** and do another search. The search results include only assets with characteristics that match **parquet**. This reduces all the counts, as follows:

    - The search results list has 493 assets. Only 493 of the 164,230 assets in the catalog have characteristics that match "parquet".
    - The **Asset type** drop-down list has 15 entries. Every one of the 493 assets is of one of these 15 types, and the sum of the counts of the 15 types is 493.
    - There are 456 assets of type **Azure Blob Storage**. The other 37 (493 minus 456) assets are of one of the other 14 types.

- We now look at the drop-down list of a different quick filter, **Classification**:

    - There are 12 classifications for the 493 assets in the search results list. The counts for the 493 assets don't sum to 493, since any number of classifications can be assigned to an asset.
    - The **Person's Name** classification is assigned to 36 assets, more than any other classification.

- We select the **Person's Name** classification. The search results list drops to 36 assets, as expected since the count for **Person's Name** was 36. None of these results are of type **Azure Blob Storage**.

We can conclude that there's no asset whose type is **Azure Blob Storage** that matches **parquet**, and that has a classification of **Person's Name**.

## Start the search

When you search, the search terms you enter in **Search catalog** are matched against the asset characteristics. These characteristics include name, type, classification, and contacts. The assets with matching characteristics appear in the search results list unless excluded by a quick filter.

After you've entered the search terms and set the quick filters, start the search in one of these ways:

- To search based on the terms you entered, select the search icon (:::image type="icon" source="./media/how-to-search-catalog/search-icon.png":::), press **Enter**, or select **View search results**.
- To search using terms from a previous search, select them from **Your recent searches**.
- To search using suggested terms, select them from **Search suggestions**.

Select an asset from **Asset suggestions** to go directly to the details page for the asset. No search is done.

The results list for suggestions and user searches can differ slightly. Results in the suggestions list are based on fuzzy matches, while user-initiated search results are based on exact matches.

When you search, the **Search results** page appears and lists the assets found by the search.

:::image type="content" source="./media/how-to-search-catalog/search-results.png" alt-text="Screenshot showing the search results for a search value of contoso.":::

To see asset details, select an asset name.

Use the controls at the bottom a search results page to navigate to other search results pages.

:::image type="content" source="./media/how-to-search-catalog/page-navigation.png" alt-text="Screenshot showing how to navigate through thru the search results pages.":::

### Sort search results

Use **Sort by** to sort the search results by **Relevance** or **Name**.

:::image type="content" source="./media/how-to-search-catalog/sort-by.png" alt-text="Screenshot showing how to sort the search results. For this example, the Sort by dropdown list is set to Relevance.":::

### Search results dynamic filters

The **Filter** pane on the **Search results** page has filters that provide dynamic filtering of the assets on the search results list. The filtering is dynamic in that additional filters can appear based on filter selections.

The dynamic filters have a check box for each value on the drop-down list. Use these check boxes to filter on as many values as you like.

#### Search results dynamic filter: filter by asset type

If you select an asset type on the **Asset type** drop-down list, dynamic filters appear that give you additional ways to narrow your search results. The filters vary depending on the asset type selected. For example, if you select **Azure SQL Database**, dynamic filters appear for server, database, and schema. The values in these filters are from the assets in the search results of the selected type.

:::image type="content" source="./media/how-to-search-catalog/asset-type-dynamic-filter.png" alt-text="The Azure SQL Database filter item is the only 'Asset type' item that's selected. A search result of that asset type is highlighted also." border="true":::

#### Search results dynamic filter: filter by classification

Each classification in the **Classification** list applies to at least one item in the search results list. Select one or more classifications to narrow your search results to assets of the selected classifications.

:::image type="content" source="./media/how-to-search-catalog/classification-dynamic-filter.png" alt-text="The Classification filter of 'Search results' is highlighted." border="true":::

#### Edit and delete search results filters

To remove a filter, clear the check box next to the filter name.

### Recently accessed assets

The **Recently accessed** section of the expanded search box displays your most recently accessed assets, if any.

- Select **View all** in the **Recently accessed** section to see the full list of recently accessed assets.

   :::image type="content" source="./media/how-to-search-catalog/get-to-recent-view.png" alt-text="Screen shot showing the Recently accessed section of the expanded search box.":::

   A list of recently accessed assets appears.

   :::image type="content" source="./media/how-to-search-catalog/recent.png" alt-text="Screenshot showing a list of recently accessed assets.":::

- To filter by name, enter a search string in **Filter by name**.

- To remove items from the list, select them with their check boxes, and then select **Remove**.

   :::image type="content" source="./media/how-to-search-catalog/remove-from-recent-view.png" alt-text="Screenshot showing how to remove items from a recently accessed assets list.":::

- To clear the entire list, select **Clear**.

   :::image type="content" source="./media/how-to-search-catalog/clear-recent-view-selections.png" alt-text="Screenshot showing how to clear a recently accessed assets list":::

### Search assets

Many pages other than **Home** have a **Search assets** box at the top. For instance, here's an assets details page, with **Search assets** highlighted.

:::image type="content" source="./media/how-to-search-catalog/search-assets.png" alt-text="Screenshot showing an asset details page with Search assets highlighted":::

Select **Search assets** to launch a search box like the one that you get from **Search catalog** on **Home**, with the same capabilities.

:::image type="content" source="./media/how-to-search-catalog/search-assets-dialog.png" alt-text="Screenshot showing an expanded Search assets box.":::

## Next steps

- [How to create, import, and export glossary terms](how-to-create-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
