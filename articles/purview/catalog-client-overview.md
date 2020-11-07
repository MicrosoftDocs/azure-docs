---
title: Azure Babylon catalog client overview (preview)
description: Learn about the main features of the Azure Babylon catalog client.
author: darrenparker
ms.author: dpark
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/28/2020
---

# Azure Babylon catalog client overview (preview)

This article provides an overview of the Azure Babylon catalog client.

## Home page

**Home** is the starting page for the Azure Babylon client. To get to **Home**, select it in the left navigation pane.

The highlighted numbers in the following screenshot mark features of **Home** that are described in this article.

:::image type="content" source="./media/catalog-client-overview/home.png" alt-text="Screenshot showing the Home page of Azure Babylon":::

The following list summarizes the features of **Home**. Each number in the list corresponds to a highlighted number in the preceding screenshot.

1. **Search catalog** provides an asset search. For more information, see [Search the catalog for assets](#search-the-catalog-for-assets).
1. Catalog analytics shows the number of:
    - Users, groups, and applications
    - Data sources
    - Assets
    - Glossary terms
1. Three [Quick access](#quick-access) buttons take you to other pages.

    - [Browse by asset type](#browse-by-asset-type).
    - [Asset insights](#asset-insights).
    - [Manage your data](#manage-your-data).

1. The **Recently accessed** tab shows a list of recently accessed data assets. For information about accessing assets, see [Search the catalog for assets](#search-the-catalog-for-assets) and [Browse by asset type](#browse-by-asset-type).
1. The **My items** tab is a list of data assets owned by the logged-on user.
1. **Glossary terms** is a searchable dictionary of the organization's key business terms. For more information, see [Glossary terms](#glossary-terms).
1. **FAQ/Documentation** is a list of frequently asked questions (FAQs), and documents.
1. **Managed data sources by asset count** is an array of tiles, each of which is a count of assets whose asset type is one of a system-defined set of related types. For more information, see [Managed data sources by asset count](#managed-data-sources-by-asset-count).
1. **Top classifications** is a bar graph of asset counts by classification for the most-used classifications. For more information about classifications, see [Classifications](#classifications).
1. **Pinned assets** is a list of buttons, each of which links to the details page for an asset. The user controls which assets appear in this list. For more information, see [Pin and unpin data assets](#pin-and-unpin-data-assets).

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

:::image type="content" source="./media/catalog-client-overview/search-catalog.png" alt-text="Below 'Search catalog' there's a left pane with search filters, and a right pane with recent searches." border="true":::

The search dialog shows quick filters, search history, and a list of recently accessed assets.

:::image type="content" source="./media/catalog-client-overview/asset-search-dialog.png" alt-text="The search list is in the right pane, below 'Search catalog'." border="true":::

### Enter search terms

Enter one or more search terms in **Search catalog**. As you type, matching search terms from recent searches are listed in **Your recent searches**, suggested matching search terms are listed in **Search suggestions**, and matching data assets are listed in **Asset suggestions**.

:::image type="content" source="./media/catalog-client-overview/enter-search-terms.png" alt-text="Screenshot showing the results of a search being entered in the Search catalog box":::

Search results include only assets with one or more characteristics that match the search terms. These characteristics include asset name, asset type, classifications, and contacts.

#### Types of search criteria

Azure Babylon supports the following types of search criteria.

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

:::image type="content" source="./media/catalog-client-overview/asset-type-quick-filter.png" alt-text="The asset type quick filters is highlighted. It shows asset types, and a count for each." border="true":::

You can enter text in the text box to restrict the values in the drop-down list to values that match or partially match the text. For examples of using the text box, see [Search quick filter: filter by asset type](#search-quick-filter-filter-by-asset-type), and [Search quick filter: filter by classification](#search-quick-filter-filter-by-classification).

#### Search quick filter: filter by asset type

To filter by asset type, use the **Asset type** quick filter. The drop-down list shows the asset types found in the current search results, as determined by the search terms and the quick filters. For each type, the number of assets of that type is shown.

:::image type="content" source="./media/catalog-client-overview/asset-type-quick-filter.png" alt-text="The asset type quick filters is highlighted. It shows asset types, and a count for each." border="true":::

Select an asset type to restrict the search results to assets of that type. You can only select one type.

To show only asset types whose names match a string, enter the string in the text box. For example, to show only asset types with **sql** in their names, enter **sql**.

:::image type="content" source="./media/catalog-client-overview/filter-asset-types.png" alt-text="The Quick Filters pane has sql for 'Asset type'. The list of assets that contain sql shows three entries." border="true":::

Select an asset type to restrict the search results to assets of that type. You can select only one type.

#### Search quick filter: filter by classification

To filter by asset classification, use the **Classification** quick filter. The drop-down list shows the classifications that have been assigned to one or more assets in the current search results, as determined by the search terms and the quick filters. For each classification, the number of assets assigned that classification is shown.

:::image type="content" source="./media/catalog-client-overview/classification-quick-filter.png" alt-text="The asset type quick filters is highlighted. It shows asset types, and a count for each." border="true":::

Select a classification to restrict the search results to assets assigned that classification. You can only select one classification.

To show only classifications whose names match a string, enter the string in the text box. For example, to show only classifications with **number** in their names, enter **number**.

:::image type="content" source="./media/catalog-client-overview/filter-classifications.png" alt-text="In the Quick Filters pane, Classification is 'bank', and the classifications listed all contain that value." border="true":::

Select a classification to restrict the search results to assets that have been assigned that classification. You can't select more than one classification.

#### Search quick Filter: filter by contacts

A *contact* is a person that's assigned to an asset as an owner or expert. When you view asset details, contacts are shown on the **Contacts** tab.

There are two ways to search for assets that have a particular contact assigned to them.

1. Enter all or part of the contact name in **Search catalog** and do a search. The search results will include assets that have contacts whose names match your search terms.
1. Select the contact of interest in the **Contact** quick filter and do a search.

:::image type="content" source="./media/catalog-client-overview/contact-quick-filter.png" alt-text="The value of Person in the Quick Filters pane is 'darren'. There are three suggestions in the Suggestions pane." border="true":::

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

- To search based on the terms you entered, select the search icon (:::image type="icon" source="./media/catalog-client-overview/search-icon.png":::), press **Enter**, or select **View search results**.
- To search using terms from a previous search, select them from **Your recent searches**.
- To search using suggested terms, select them from **Search suggestions**.

Select an asset from **Asset suggestions** to go directly to the details page for the asset. No search is done.

The results list for suggestions and user searches can differ slightly. Results in the suggestions list are based on fuzzy matches, while user-initiated search results are based on exact matches.

When you search, the **Search results** page appears and lists the assets found by the search.

:::image type="content" source="./media/catalog-client-overview/search-results.png" alt-text="Screenshot showing the search results for a search value of contoso.":::

To see asset details, select an asset name.

Use the controls at the bottom a search results page to navigate to other search results pages.

:::image type="content" source="./media/catalog-client-overview/page-navigation.png" alt-text="Screenshot showing how to navigate through thru the search results pages.":::

### Sort search results

Use **Sort by** to sort the search results by **Relevance** or **Name**.

:::image type="content" source="./media/catalog-client-overview/sort-by.png" alt-text="Screenshot showing how to sort the search results. For this example, the Sort by dropdown list is set to Relevance.":::

### Search results dynamic filters

The **Filter** pane on the **Search results** page has filters that provide dynamic filtering of the assets on the search results list. The filtering is dynamic in that additional filters can appear based on filter selections.

The dynamic filters have a check box for each value on the drop-down list. Use these check boxes to filter on as many values as you like.

#### Search results dynamic filter: filter by asset type

If you select an asset type on the **Asset type** drop-down list, dynamic filters appear that give you additional ways to narrow your search results. The filters vary depending on the asset type selected. For example, if you select **Azure SQL Database**, dynamic filters appear for server, database, and schema. The values in these filters are from the assets in the search results of the selected type.

:::image type="content" source="./media/catalog-client-overview/asset-type-dynamic-filter.png" alt-text="The Azure SQL Database filter item is the only 'Asset type' item that's selected. A search result of that asset type is highlighted also." border="true":::

#### Search results dynamic filter: filter by classification

Each classification in the **Classification** list applies to at least one item in the search results list. Select one or more classifications to narrow your search results to assets of the selected classifications.

:::image type="content" source="./media/catalog-client-overview/classification-dynamic-filter.png" alt-text="The Classification filter of 'Search results' is highlighted." border="true":::

#### Edit and delete search results filters

To remove a filter, clear the check box next to the filter name.

### Recently accessed assets

The **Recently accessed** section of the expanded search box displays your most recently accessed assets, if any.

- Select **View all** in the **Recently accessed** section to see the full list of recently accessed assets.

   :::image type="content" source="./media/catalog-client-overview/get-to-recent-view.png" alt-text="Screen shot showing the Recently accessed section of the expanded search box.":::

   A list of recently accessed assets appears.

   :::image type="content" source="./media/catalog-client-overview/recent.png" alt-text="Screenshot showing a list of recently accessed assets.":::

- To filter by name, enter a search string in **Filter by name**.

- To remove items from the list, select them with their check boxes, and then select **Remove**.

   :::image type="content" source="./media/catalog-client-overview/remove-from-recent-view.png" alt-text="Screenshot showing how to remove items from a recently accessed assets list.":::

- To clear the entire list, select **Clear**.

   :::image type="content" source="./media/catalog-client-overview/clear-recent-view-selections.png" alt-text="Screenshot showing how to clear a recently accessed assets list":::

### Search assets

Many pages other than **Home** have a **Search assets** box at the top. For instance, here's an assets details page, with **Search assets** highlighted.

:::image type="content" source="./media/catalog-client-overview/search-assets.png" alt-text="Screenshot showing an asset details page with Search assets highlighted":::

Select **Search assets** to launch a search box like the one that you get from **Search catalog** on **Home**, with the same capabilities.

:::image type="content" source="./media/catalog-client-overview/search-assets-dialog.png" alt-text="Screenshot showing an expanded Search assets box.":::

## Pin and unpin data assets

You can pin an asset to the **Home** page to access it later.

To pin an asset:

- From the **Overview** tab of the asset details page, select **Pin**.

    :::image type="content" source="./media/catalog-client-overview/pin-an-asset.png" alt-text="Screenshot of the accounts_parquet asset details page with the Pin button highlighted.":::

    The asset is added to the **Pinned assets** section on the **Home** page.

    :::image type="content" source="./media/catalog-client-overview/select-in-pinned-assets.png" alt-text="The 'Pinned assets' section of **Home** is highlighted. Two assets are listed, including accounts_parquet." border="true":::

- To unpin an asset, select **Unpin** from the **Overview** tab of its asset details page.

    :::image type="content" source="./media/catalog-client-overview/unpin-an-asset.png" alt-text="Screenshot showing the Supplier_Contact asset details page with the Unpin button highlighted.":::

## Managed data sources by asset count

The **Managed data sources by asset count** section of **Home** is an array of tiles, each one representing a set of related asset types.

:::image type="content" source="./media/catalog-client-overview/managed-data-sources-by-asset-count.png" alt-text="Screenshot showing the Managed data sources by asset count section of the Home page.":::

The size of each tile reflects the count of assets of all the types in the set. Hover over a tile to see the count. In this example, the count for **Azure Data Lake Storage Gen2** is 274.

Selecting a tile produces another array of tiles, which is a breakdown of the selected set.

:::image type="content" source="./media/catalog-client-overview/managed-data-sources-by-asset-count-breakdown.png" alt-text="Screenshot showing the tiles array when a tile in Managed data sources by asset count is selected.":::

## Quick access

### Browse by asset type

To browse to assets by type, select **Browse by asset type** on **Home**.

:::image type="content" source="./media/catalog-client-overview/get-to-browse-by-asset-type.png" alt-text="Screenshot" border="true":::

The **Browse asset types** page appears, which shows icons of the asset types and, for each type, the count of assets of the type.

:::image type="content" source="./media/catalog-client-overview/browse-by-asset-type.png" alt-text="Screenshot" border="true":::

To see a search results list with assets of a particular type, select the asset type icon.

> [!Note]
> The search results list generated in this way is the same as is generated from **Search** if there are no key terms and the asset type is selected in the **Asset type** quick filter.

:::image type="content" source="./media/catalog-client-overview/search-results-browse-by-asset-type.png" alt-text="Screenshot showing the search results when an asset type icon is selected.":::

### Asset insights

To see counts and graphs of the data in your catalog, select **View Insights** on **Home**.

:::image type="content" source="./media/catalog-client-overview/get-to-view-insights.png" alt-text="Screenshot" border="true":::

The **Asset insights** screen appears. The **Insights** navigation pane on the left lets (highlighted) give you the choice of four categories of insights.

:::image type="content" source="./media/catalog-client-overview/asset-insights.png" alt-text="Screenshot" border="true":::

### Manage Your data

To manage your data sources, select **Manage Your Data** on **Home**.

:::image type="content" source="./media/catalog-client-overview/get-to-manage-your-data.png" alt-text="Screenshot" border="true":::

Use the left navigation pane to select any of the many options for managing your data:

:::image type="content" source="./media/catalog-client-overview/manage-your-data.png" alt-text="Screenshot" border="true":::

>[!Note]
> Selecting **Manage your data** gets you to the same display as selecting **Management Center** from the left navigation pane of **Home**.

## Asset details

To see asset details, select the asset name on a search results list. The **Overview** tab shows the main details of the asset.

:::image type="content" source="./media/catalog-client-overview/asset-details.png" alt-text="Screenshot showing the Overview tab of the asset details.":::

The numbers in the asset detail screenshot correspond to the numbers in the following list that describes the areas:

1. The asset name (**Customer**).
1. The asset type (**Azure SQL Table**).
1. **Edit** and **Refresh** are buttons that act on the asset details page.
1. You select the page to view with page tabs:
    - **Overview** shows metadata.
    - **Schema** shows schema information for some asset types (structured files and tables).
    - **Lineage** shows lineage information.
    - **Contacts** shows the contacts (owners and experts).
    - **Related** shows related assets.
1. **Description** is a description written by the user, or applied by the API.
1. **Classifications** show the classifications assigned to the asset.
1. **Properties** shows technical metadata for the asset as reported by the scanner. One property that's always shown is **qualifiedName**, which is the URI for the asset in the data source.
1. **Last updated** shows the date and time of the most recent update, and the user that did the update.
1. **Hierarchy** shows the asset in the context of its ancestor hierarchy. Select an ancestor asset hyperlink for more information.
1. **Glossary terms** show glossary terms that are pertinent to the asset. Each term is a hyperlink to additional information.

## Schema tab

Select the **Schema** tab on the asset details to display schema information of an asset that's a structured file or table.

This tab is present only on asset types for which the schema is relevant or could be determined by the system. Azure Babylon sorts the column names by ascending alphabetical order.

:::image type="content" source="./media/catalog-client-overview/schema-tab.png" alt-text="Screenshot showing the Schema tab of the asset details.":::

Select any item under the **Column name** column to jump to the asset details view for that column asset. For example, select **CompanyName**.

:::image type="content" source="./media/catalog-client-overview/column-asset-details.png" alt-text="Screenshot showing the asset details of the selected CompanyName asset.":::

## Lineage tab

Select the **Lineage** tab to display the lineage, if available, for the asset. Azure Babylon provides lineage results for only Azure Data Factory Copy and Data Flow activities.

:::image type="content" source="./media/catalog-client-overview/lineage-for-customer-table.png" alt-text="Screenshot showing the lineage for an asset.":::

- Use your mouse wheel to change the zoom level, or use the zoom slider located on the right side.

    :::image type="content" source="./media/catalog-client-overview/zoom-level.png" alt-text="Screenshot showing the zoom slider on the Lineage page.":::

- To fit the graph within the canvas, select **Zoom to fit**.

    :::image type="content" source="./media/catalog-client-overview/zoom-to-fit.png" alt-text="Screenshot showing the Zoom to fit icon on the Lineage page.":::

- To expand the graph to fill the screen, select **Full screen**. Press **Esc** (escape) to return to the default view.

    :::image type="content" source="./media/catalog-client-overview/full-screen.png" alt-text="Screenshot showing the Full screen icon on the Lineage page.":::

- To display a portion of the graph to pan, select **Zoom preview**.

    :::image type="content" source="./media/catalog-client-overview/zoom-preview.png" alt-text="Screenshot showing the Zoom preview icon on the Lineage page.":::

- To pan, drag on the graph.

- For additional options, select **More options**, located beneath **Zoom preview**.

   These options include **Center the current asset**, **Auto align**, and **Reset to default view**.

- To view detail about a node, hover over it.

    The following information appears:

    :::image type="content" source="./media/catalog-client-overview/hover-lineage-node-information.png" alt-text="Screenshot showing node details when you hover over a node on the Lineage page.":::

- To view the lineage of another asset, select the asset node, and then select **Switch to asset**.

    :::image type="content" source="./media/catalog-client-overview/switch-to-other-asset.png" alt-text="Screenshot showing the Switch to asset link on a node on the Lineage page.":::

    For example, here's the lineage graph for the **customerWithSales** asset:

    :::image type="content" source="./media/catalog-client-overview/hover-lineage-node-information-2.png" alt-text="Screenshot showing the lineage for the customerWithSales asset.":::

### Dependency graph

The nodes of the lineage represent related assets, which you can explore.

- To show information about a node, select the node to expand it.

- If you select a different node or a blank area of the canvas, the node you expanded will contract.

- After you expand a node, select **Switch to asset** to see a dependency graph for the asset.

    :::image type="content" source="./media/catalog-client-overview/lineage-graph-switch-asset.png" alt-text="Screenshot showing the dependency lineage graph for an asset.":::

- Drag a node to uncover any nodes that it might be hiding.

- Select **Expand to view the columns** on the left pane to view columns and column-level lineage for non-binary assets (for example, SQL table).

    :::image type="content" source="./media/catalog-client-overview/expand-to-view-columns.png" alt-text="Screenshot showing how to enable the column pane on the Lineage page.":::

    The column pane opens.

    :::image type="content" source="./media/catalog-client-overview/expanded-column-pane.png" alt-text="Screenshot showing the column pane on the Lineage page.":::

- Select one or columns to see the column-level lineage.

    :::image type="content" source="./media/catalog-client-overview/select-columns-column-pane.png" alt-text="Screenshot showing selected columns on the column pane of the Lineage page.":::

- Hover over the selected columns to highlight them in the lineage graph.

    :::image type="content" source="./media/catalog-client-overview/hover-selected-columns.png" alt-text="Screenshot showing selected columns highlighted on the lineage page.":::

### Filter the lineage view

To filter the lineage by column or data asset, enter a name in the **Search for assets or processes** box. For example, **Company**.

:::image type="content" source="./media/catalog-client-overview/filter-lineage.png" alt-text="Screenshot showing how to filter columns and data assets on the Lineage page.":::

## Related tab

**Related** displays all related assets. This example shows that the SQL Table is related to:

- A schema.
- 15 columns.
- Four Azure Data Factory (ADF) copy processes.

You can do the following tasks when you view related assets:

- Select **columns** to see all 15 columns in a pop-up window.

    :::image type="content" source="./media/catalog-client-overview/columns-pop-up.png" alt-text="Screenshot showing the columns of a related asset.":::

- Select the **inputToProcesses** node to see the ADF copy processes in a pop-up window.

    :::image type="content" source="./media/catalog-client-overview/copy-processes-pop-up.png" alt-text="Screenshot showing the ADF copy processes of the inputToProcesses node.":::

- Drag the graph to pan it.
- Use the mouse wheel to change the zoom level.
- Select a node to display the related assets on the floating panel.
- Select an asset link on the floating panel or double-click a node to navigate to the asset.

## Contacts tab

The **Contacts** tab displays the contacts associated with an asset. Each contact is either an owner or an expert for the asset.

:::image type="content" source="./media/catalog-client-overview/asset-contacts.png" alt-text="Screenshot showing the contacts associated with an asset.":::

## Edit asset

You can edit the details of an asset:

- Select an asset, and on its details page, use the tabs to select the area you want to edit. For example, **Overview**.

    :::image type="content" source="./media/catalog-client-overview/select-edit-overview.png" alt-text="Screenshot showing how to edit an asset.":::

- Select **Edit**.
- In the **Overview** tab, update **Description**, **Classifications**, or **Glossary terms**.

    :::image type="content" source="./media/catalog-client-overview/edit-overview.png" alt-text="Screenshot showing how to edit the information on an asset's Overview page.":::

- To edit the schema, select **Schema**, and then select **Edit**.

   The columns are listed for the **Customer** SQL table.

    :::image type="content" source="./media/catalog-client-overview/edit-schema.png" alt-text="Screenshot showing how to edit the schema of an SQL table.":::

    You can update the following characteristics of each column:

    - **Column name**
    - **Column level classifications**
    - **Data type**
    - **Description**

   When you change the column name, the system changes only the friendly name that appears in the catalog for that column. It doesn't change the name of the column in the data asset. Future scans won't overwrite a user-provided column name.

- To edit contacts, select **Contacts** and then select **Edit**. Update the associated experts and owners for the contact, and then select **Save**.

    :::image type="content" source="./media/catalog-client-overview/edit-contacts.png" alt-text="Screenshot showing how to edit the contacts of an asset.":::

## Glossary terms

With the glossary feature, you can create and manage your terms.

Use the glossary feature to:

- Create terms one at a time or in bulk from a .csv file.
- Delete terms one at a time or in bulk.
- Edit terms one at a time.
- Add a definition to a term.
- Add synonyms and acronyms to a term.

### View glossary terms

To see your existing glossary terms:

- Select **Glossary** from the left navigation pane.

- View the **Glossary terms** page to see information about your list of terms.

   From this page, you can add, import, edit, and delete terms. You can also manage your term templates, and refresh the list of terms.

   :::image type="content" source="./media/catalog-client-overview/glossary-terms.png" alt-text="Screenshot showing how to view the Glossary terms page.":::

### New term

To add a glossary term:

- From the **Glossary terms** page, select **New term**.

- Select the **System default** template, or an existing custom term template. You can also create a new term template.

   :::image type="content" source="./media/catalog-client-overview/select-term-template.png" alt-text="Screenshot showing how select a term template for a new glossary term.":::

- If you select **New term template** to create a new term template, enter the **Template name**, a **Description**, and select **New attribute** to add attributes. Select **Create** to save the template and return to the **Import terms** page.

- When you're finished selecting or creating a template, select **Continue**.

- On the **Overview** tab of the **New term** page, give your new glossary term a unique **Name**. This name is case-sensitive and is the only mandatory item for a new term.

    :::image type="content" source="./media/catalog-client-overview/new-glossary-term.png" alt-text="Screenshot showing how to edit the overview information in a new glossary term.":::

- Add a **Definition** and add one or more comma-separated acronyms to the **Acronym** list.

- Set the **Status**. Choose one of the following status values from the drop-down list:

    - **Draft**: Default. The term isn't yet official.
    - **Approved**: The term is official.
    - **Expired**: Don't use the term.
    - **Alert**: The term needs attention.

    The **Status** value is metadata associated with the term to help you manage your glossary. It's not affected by workflow.

- Select the **Related** tab, and then choose one or more **Synonyms** and **Related terms** from the drop-down lists. You choose from your existing terms in these lists.

    :::image type="content" source="./media/catalog-client-overview/edit-glossary-related-terms.png" alt-text="Screenshot showing how to add synonyms and related terms to your term.":::

- From the **Contacts** tab, select **Experts** and **Stewards** to add them to your term.

    :::image type="content" source="./media/catalog-client-overview/edit-glossary-contacts.png" alt-text="Screenshot showing how to add experts and stewards to your term.":::

- Select **Create** to create your term.

### View a term details page

To view glossary term details:

- On the **Glossary terms** page, select a term's name to view its term details page. The heading for the page is the name of the term. For example, select the name **Balance Sheet** to show the term details for that term.

    :::image type="content" source="./media/catalog-client-overview/glossary-terms-names-highlighted.png" alt-text="Screenshot showing how to view glossary term details.":::

- From the **Overview** tab on the term details page, select:

    - **Edit** to edit the term details.
    - **Delete** to delete the term.

- From the **Related** tab on the term details page, select any term listed under **Synonyms** or **Related terms** to go to its term details page.

    :::image type="content" source="./media/catalog-client-overview/term-details.png" alt-text="Screenshot showing how to view the synonyms and related terms of a glossary term.":::

### Import terms into the glossary

To import glossary terms:

- On the **Glossary terms** page, select **Import terms** from the top menu.

    The **Import terms** page appears, showing a list of templates to choose.

- To create a template to match your data, select **New term template**. Enter the **Template name**, a **Description**. and select **New attribute** to add attributes. Select **Create** to save the template and return to the **Import terms** page.

- Select the template that matches your data, or select the **System default** template. Select **Continue**.

   A column must be in the template for you to import it.

- Choose **Browse** to select your .csv file, and then select **OK**.

    :::image type="content" source="./media/catalog-client-overview/import-terms.png" alt-text="Screenshot showing how to import terms.":::

   The system adds the terms in the file to your catalog. If the system finds issues during import, it notifies you, and you can then review them.

   > [!NOTE]
   >
   > An imported term overwrites an existing term of the same name.
   >

### Edit term

To edit a glossary term:

- On the **Glossary terms** page, use a term's check box to select it, and then select **Edit**.

    :::image type="content" source="./media/catalog-client-overview/select-term-to-edit.png" alt-text="Screenshot showing how to select a glossary term to edit.":::

- On the **Overview** tab of the **Edit term** page, you can update the **Status**, **Definition**, and **Acronym** list.

    :::image type="content" source="./media/catalog-client-overview/edit-term.png" alt-text="Screenshot showing how to edit a glossary term.":::

- Select the **Related** tab to edit **Synonyms** and **Related terms**.

- After you complete your updates, select **Save** to confirm the changes or **Cancel** to discard them.

### Delete term

On the **Glossary terms** page, delete one or more terms in these ways:

- Use the check boxes next to the terms to select one or more terms or, use the check box at the top to select all terms. Then select **Delete** to delete the selected terms.

- Select **...** under **Action** for a term, and then select **Delete** from the context menu to delete the selected terms.

    :::image type="content" source="./media/catalog-client-overview/glossary-terms-delete.png" alt-text="Screenshot showing how to delete a term by using the context menu.":::

- On a term details page, select **Delete** to delete the term.

    :::image type="content" source="./media/catalog-client-overview/term-details-delete.png" alt-text="Screenshot showing how to delete a term by using the top menu.":::

## Access permissions

Azure Data Catalog access permissions provide a basic access permissions infrastructure. The infrastructure has two sections. One handles creations and deletions of catalogs and scans. The other handles access to all other API endpoints.

### Azure portal-managed permissions

To create a catalog, you must have resource creation permissions in the resource group where the catalog is created. These permissions are managed via the **Access control (IAM)** section of the resource group. You need to be in the contributor or owner roles to create a new catalog instance.

After a catalog has been created, it can be deleted by anyone who is in the Owner or Contributor role on the catalog itself.

For information about how to add someone to an Owner Contributor role on a resource group, see [Add or remove Azure role assignments using the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).

To create, update, and delete a scan, a user must be in two roles:

- The Owner or Contributor role in the Azure portal.
- The Catalog Admin or Data Source Admin role in the Azure Babylon portal.

## Classifications

The catalog provides a classification feature to indicate the data type in a file, such as email address or phone number. Any classification can be applied to assets at the file level or at the column level.

The catalog scanner, which uses classification rules to detect when data matches a pattern, can automatically apply classifications.

To manage your classifications, select **Management Center** in the left navigation pane, and then select **Classifications**.

:::image type="content" source="./media/catalog-client-overview/classifications.png" alt-text="Screenshot showing how to view the system classifications in a catalog.":::

There are two tabs, **System** and **Custom**:

- The **System** tab shows built-in default system classifications. These system classifications are read-only and can't be edited or deleted from your catalog.

- The **Custom** tab shows custom classifications that you or other users have defined for their own use.

### Create a custom classification

To create a custom classification in a catalog:

- Select the **Classifications** page, and then select **New**.

   The **Add new classification** page appears.

- Enter a **Name** for your classification. You can use your company name as a top-level namespace to maintain uniqueness. For example, **CONTOSO.CUSTOMER_ID**.

   :::image type="content" source="./media/catalog-client-overview/add-new-classification.png" alt-text="Screenshot showing how to add a custom classification.":::

   The name must start with a letter followed by a sequence of letters, numbers, period (**.**) or underscore (**_**) characters. It can be uppercase or lowercase, and must be unique in your catalog.

   The friendly name is created as you type. This name appears as the **Display name** in the classification list to improve readability. It's trimmed to its last two segments of the namespace. All underscores become spaces.

### Filter a classification list

Use the **Filter by name** field on **Classifications** to filter either the **System** or **Custom** classifications list.

:::image type="content" source="./media/catalog-client-overview/classifications-filter-by-name.png" alt-text="Screenshot showing how to filter the classifications list.":::

### Delete a custom classification

To delete a custom classification:

- Select the check box of the custom classification to delete, and then select **Delete**.

   :::image type="content" source="./media/catalog-client-overview/delete-custom-classification.png" alt-text="Screenshot showing how to delete a custom classification.":::

   The system prompts you to confirm the deletion.

- Select **Delete** to delete the classification.

   System classifications are read-only, and cannot be modified or deleted.

   > [!WARNING]
   > You can't delete a custom classification if it's being used to describe assets. Remove it from the assets first, and then delete it.

## Connect to Azure Data Factory

This section explains how to connect Azure Data Factory (ADF) to import data lineage into the catalog. The lineage is generated by ADF Copy and Data Flow activities. ADF must authenticate itself to the catalog by using an identity that the catalog recognizes.

### View connections

More than one ADF at a time can connect to a catalog and push lineage information.

To show the list of ADFs connected to your catalog:

- Select **Management Center** on the left navigation pane

- From the left pane, select **Data factory connection**.

    The data factory connection list appears.

    :::image type="content" source="./media/catalog-client-overview/data-factory-connection.png" alt-text="Screen shot showing a data factory connection list.":::

    The **Status** values are:

    - **Connected**: The data factory is connected to the data catalog.
    - **Disconnected**: The data factory has access to the catalog, but it's connected to another catalog. As a result, data lineage won't be reported to the catalog automatically.
    - **Cannot access**: The user doesn't have access to the data factory, so the connection status is unknown.

### New data factory connection

To create a data factory connection:

- From the **Data factory connection** page, select **New**.

- Select one or more data factories from the list, which you can filter by subscription name.

   :::image type="content" source="./media/catalog-client-overview/data-factories.png" alt-text="Screenshot showing how to select data factories to connect to.":::

    Some options might be disabled if:

    - The data factory is already connected to the current catalog.
    - The data factory doesn't have managed identity.

    By default, you can't view more than 49 data factories.

- If you want to show all the data factories, append this feature flag after the catalog URL: `?feature.dataFactoryLimit=unlimited`.

    For example:
    `https://adc.azure.com/catalog/<mycatalog>/management/dataFactoryConnection/connectionsList?feature.dataFactoryLimit=unlimited`

- Select **OK**.

- If any of the selected data factories are already connected to other catalogs, you're asked to confirm to disconnect from them.

    :::image type="content" source="./media/catalog-client-overview/continue-connection-confirm.png" alt-text="Screenshot showing the confirmation screen when a data factory is already connected.":::

- Make one of the following choices:
    - Select **Cancel** to stay connected to the other catalog.
    - Select **Continue** to disconnect from the other catalog and connect to the current catalog.

    If you select **Continue**, the system notifies you after the connections have been established.

### Remove data factory connections

To remove a data factory connection:

- Select the check box next to one or more data factory connections.

    :::image type="content" source="./media/catalog-client-overview/data-factory-connection.png" alt-text="Screenshot showing how to select data factories to delete.":::

- Select **Remove** to remove the selected data factory connections, and then select **Remove** to confirm.
