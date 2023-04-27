---
title: 'How to: search the Data Catalog'
description: This article gives an overview of how to search the Microsoft Purview Data Catalog.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 04/11/2022
---

# Search the Microsoft Purview Data Catalog

After data is scanned and ingested into the Microsoft Purview Data Map, data consumers need to easily find the data needed for their analytics or governance workloads. Data discovery can be time consuming because you may not know where to find the data that you want. Even after finding the data, you may have doubts about whether you can trust the data and take a dependency on it.

The goal of search in Microsoft Purview is to speed up the process of quickly finding the data that matters. This article outlines how to search the Microsoft Purview Data Catalog to quickly find the data you're looking for.

## Searching the catalog

The search bar can be quickly accessed from the top bar of the Microsoft Purview governance portal UX. In the data catalog home page, the search bar is in the center of the screen.

:::image type="content" source="./media/how-to-search-catalog/purview-search-bar.png" alt-text="Screenshot showing the location of the Microsoft Purview search bar" border="true":::

Once you select the search bar, you'll be presented with your search history and the items recently accessed in the data catalog. This allows you to quickly pick up from previous data exploration that was already done.

:::image type="content" source="./media/how-to-search-catalog/search-no-keywords.png" alt-text="Screenshot showing the search bar before any keywords have been entered" border="true":::

Enter in keywords that help narrow down your search such as name, data type, classifications, and glossary terms. As you enter in search keywords, Microsoft Purview dynamically suggests results and searches that may fit your needs. To complete your search, select "View search results" or press "Enter".

:::image type="content" source="./media/how-to-search-catalog/search-keywords.png" alt-text="Screenshot showing the search bar as a user enters in keywords." border="true":::

Once you enter in your search, Microsoft Purview returns a list of data assets and glossary terms a user is a data reader for to that matched to the keywords entered in.

Your keyword will be highlighted in the return results, so you can see where the term was found in the asset. In the example below, the search term was 'Sales'.

:::image type="content" source="./media/how-to-search-catalog/highlighted-results.png" alt-text="Screenshot showing a search return for Sales, with all the instances of the term highlighted in the returned results." border="true":::

> [!NOTE]
> Search will only return items in collections you're a data reader or curator for. For more information, see [create and manage Collections](how-to-create-and-manage-collections.md).

The Microsoft Purview relevance engine sorts through all the matches and ranks them based on what it believes their usefulness is to a user. For example, a data consumer is likely more interested in a table curated by a data steward that matches on multiple keywords than an unannotated folder. Many factors determine an asset’s relevance score and the Microsoft Purview search team is constantly tuning the relevance engine to ensure the top search results have value to you.

## Refine results

If the top results don’t include the assets you're looking for, there are two ways you can filter results:

- [Use the facets](#use-the-facets) on the left hand side to narrow results by business metadata like glossary terms or classifications.
- [Use the filters](#use-the-filters) at the top to narrow results by source type, [managed attributes](how-to-managed-attributes.md), or activity.

### Use the facets

To narrow your results by your business metadata, use the facet pane on the left side of the search results. If it's not visible, you can select the arrow button to open it.

Then select any facet you would like to narrow your results by.

:::image type="content" source="./media/how-to-search-catalog/facet-menu.png" alt-text="Screenshot showing the search menu on the left side with Folder and Report selected." border="true":::

For certain annotations, you can select the ellipses to choose between an AND condition or an OR condition.

:::image type="content" source="./media/how-to-search-catalog/search-and-or-choice.png" alt-text="Screenshot showing how to choose between and AND or OR condition." border="true":::

>[!NOTE]
>The *Filter by keyword* option at the top of the facet menu is to filter facets by keyword, not the search results.
>
> :::image type="content" source="./media/how-to-search-catalog/filter-facets.png" alt-text="Screenshot showing the facet filter at the top of the menu, with a search parameter entered, and the facets filtered below." border="true":::

#### Available facets

- **Assigned term** - refines your search to assets with the selected terms applied.
- **Classification** - refines your search to assets with certain classifications.
- **Collection** - refines your search by assets in a specific collection.
- **Contact** - refines your search to assets that have selected users listed as a contact.
- **Data** - refines your search to specific data types. For example: pipelines, data shares, tables, or reports.
- **Endorsement** - refines your search to assets with specified endorsements, like **Certified** or **Promoted**.
- **Label** - refines your search to assets with specific security labels.
- **Metamodel facets** - if you've created a [metamodel](concept-metamodel.md) in your Microsoft Purview Data Map, you can also refine your search to metamodel assets like Business or Organization.
- **Rating** - refines your search to only data assets with a specified rating.

### Use the filters

To narrow results by asset type, [managed attributes](how-to-managed-attributes.md), or activity you'll use the filters at the top of the page of search results.

To filter by source type, select the **Source type:** button, and select all the source types you want to see results from.

:::image type="content" source="./media/how-to-search-catalog/select-by-source-type.png" alt-text="Screenshot showing the source type filter at the top of the search results page." border="true":::

To add another filter for a different attribute, select **Add filter**.

:::image type="content" source="./media/how-to-search-catalog/add-filter.png" alt-text="Screenshot showing the add filter button at the top of the search results page." border="true":::

Then, select your attribute, enter your operator and value, and your search results will be filtered after you select outside the filter.

To remove any filters, select the **x** in the filter button, or clear all filters by selecting **Clear all filters**.

:::image type="content" source="./media/how-to-search-catalog/remove-filters.png" alt-text="Screenshot showing the remove filter buttons in the top menu." border="true":::

#### Available filters

- **Activity** - allows you refine your search to attributes created or updated within a certain timeframe.
- **Managed attributes** - refines your search to assets with specified [managed attributes](how-to-managed-attributes.md). Attributes will be listed under their attribute group, and use operators to help search for specific values. For example: Contains any, or Doesn't contain.
- **Source type** - refines your search to assets from specified source types. For example: Azure Blob Storage or Power BI.
- **Tags** - refines your search to assets with selected tags.

## View assets

From the search results page, you can select an asset to view details such as schema, lineage, and classifications. To learn more about the asset details page, see [Manage catalog assets](catalog-asset-details.md).

:::image type="content" source="./media/how-to-search-catalog/search-view-asset.png" alt-text="Screenshot showing the asset details page" border="true":::

## Searching Microsoft Purview in connected services

Once you register your Microsoft Purview instance to an Azure Data Factory or an Azure Synapse Analytics workspace, you can search the Microsoft Purview Data Catalog directly from those services. To learn more, see [Discover data in ADF using Microsoft Purview](../data-factory/how-to-discover-explore-purview-data.md) and [Discover data in Synapse using Microsoft Purview](../synapse-analytics/catalog-and-governance/how-to-discover-connect-analyze-azure-purview.md).

:::image type="content" source="./media/how-to-search-catalog/search-azure-data-factory.png" alt-text="Screenshot showing how to use Microsoft Purview search in Azure Data Factory" border="true":::

## Bulk edit search results

If you're looking to make changes to multiple assets returned by search, Microsoft Purview lets you modify glossary terms, classifications, and contacts in bulk. To learn more, see the [bulk edit assets](how-to-bulk-edit-assets.md) guide.

## Browse the data catalog

While searching is great if you know what you're looking for, there are times where data consumers wish to explore the data available to them. The Microsoft Purview Data Catalog offers a browse experience that enables users to explore what data is available to them either by collection or through traversing the hierarchy of each data source in the catalog. For more information, see [browse the data catalog](how-to-browse-catalog.md).

## Search query syntax

All search queries consist of keywords and operators. A keyword is a something that would be part of an asset's properties. Potential keywords can be a classification, glossary term, asset description, or an asset name. A keyword can be just a part of the property you're looking to match to. Use keywords and the operators to ensure Microsoft Purview returns the assets you're looking for.

Certain characters including spaces, dashes, and commas are interpreted as delimiters. Searching a string like `hive-database` is the same as searching two keywords `hive database`. 

The following table contains the operators that can be used to compose a search query. Operators can be combined as many times as need in a single query.

| Operator | Definition | Example |
| -------- | ---------- | ------- |
| OR | Specifies that an asset must have at least one of the two keywords. Must be in all caps. A white space is also an OR operator.  | The query `hive OR database` returns assets that contain 'hive' or 'database' or both. |
| AND | Specifies that an asset must have both keywords. Must be in all caps | The query `hive AND database` returns assets that contain both 'hive' and 'database'. |
| NOT | Specifies that an asset can't contain the keyword to the right of the NOT clause. Must be in all caps  | The query `hive NOT database` returns assets that contain 'hive', but not 'database'. |
| () | Groups a set of keywords and operators together. If you combine multiple operators, parentheses specify the order of operations. | The query `hive AND (database OR warehouse)` returns assets that contain 'hive' and either 'database' or 'warehouse', or both. |
| "" | Specifies exact content in a phrase that the query must match to. | The query `"hive database"` returns assets that contain the phrase "hive database" in their properties |
| field:keyword | Searches the keyword in a specific attribute of an asset. Field search is case insensitive and is limited to the following fields at this time: <ul><li>name</li><li>description</li><li>entityType</li><li>assetType</li><li>classification</li><li>term</li><li>contact</li></ul> | The query `description: German` returns all assets that contain the word "German" in the description.<br><br>The query `term:Customer` will return all assets with glossary terms that include "Customer" and all glossary terms that match to "Customer". |

> [!TIP]
> Searching "*" will return all the assets and glossary terms in the catalog.

### Known limitations

* Grouping isn't supported within a field search. Customers should use operators to connect field searches. For example,`name:(alice AND bob)` is invalid search syntax, but `name:alice AND name:bob` is supported.

## Next steps

- [How to create and manage glossary terms](how-to-create-manage-glossary-term.md)
- [How to import and export glossary terms](how-to-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
