---
title: 'How to: search the Data Catalog'
description: This article gives an overview of how to search the Microsoft Purview data catalog.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 04/11/2022
---

# Search the Microsoft Purview Data Catalog

After data is scanned and ingested into the Microsoft Purview data map, data consumers need to easily find the data needed for their analytics or governance workloads. Data discovery can be time consuming because you may not know where to find the data that you want. Even after finding the data, you may have doubts about whether you can trust the data and take a dependency on it.

The goal of search in Microsoft Purview is to speed up the process of quickly finding the data that matters. This article outlines how to search the Microsoft Purview data catalog to quickly find the data you're looking for.

## Searching the catalog

The search bar can be quickly accessed from the top bar of the Microsoft Purview governance portal UX. In the data catalog home page, the search bar is in the center of the screen.

:::image type="content" source="./media/how-to-search-catalog/purview-search-bar.png" alt-text="Screenshot showing the location of the Microsoft Purview search bar" border="true":::

Once you click on the search bar, you'll be presented with your search history and the items recently accessed in the data catalog. This allows you to quickly pick up from previous data exploration that was already done.

:::image type="content" source="./media/how-to-search-catalog/search-no-keywords.png" alt-text="Screenshot showing the search bar before any keywords have been entered" border="true":::

Enter in keywords that help narrow down your search such as name, data type, classifications, and glossary terms. As you enter in search keywords, Microsoft Purview dynamically suggests results and searches that may fit your needs. To complete your search, click on "View search results" or press "Enter".

:::image type="content" source="./media/how-to-search-catalog/search-keywords.png" alt-text="Screenshot showing the search bar as a user enters in keywords" border="true":::

Once you enter in your search, Microsoft Purview returns a list of data assets and glossary terms a user is a data reader for to that matched to the keywords entered in.

The Microsoft Purview relevance engine sorts through all the matches and ranks them based on what it believes their usefulness is to a user. For example, a data consumer is likely more interested in a table curated by a data steward that matches on multiple keywords than an unannotated folder. Many factors determine an asset’s relevance score and the Microsoft Purview search team is constantly tuning the relevance engine to ensure the top search results have value to you.

If the top results don’t include the assets you're looking for, you can use the facets on the left-hand side to filter down by business metadata such glossary terms, classifications, and the containing collection. If you're interested in a particular data source type such as Azure Data Lake Storage Gen2 or Azure SQL Database, you can use a pill filter to narrow down your search.

> [!NOTE]
> Search will only return items in collections you're a data reader or curator for. For more information, see [create and manage Collections](how-to-create-and-manage-collections.md).

:::image type="content" source="./media/how-to-search-catalog/search-results.png" alt-text="Screenshot showing the results of a search" border="true":::

For certain annotations, you can click on the ellipses to choose between an AND condition or an OR condition. 

:::image type="content" source="./media/how-to-search-catalog/search-and-or-choice.png" alt-text="Screenshot showing how to choose between and AND or OR condition" border="true":::

From the search results page, you can select an asset to view details such as schema, lineage, and classifications. To learn more about the asset details page, see [Manage catalog assets](catalog-asset-details.md).

:::image type="content" source="./media/how-to-search-catalog/search-view-asset.png" alt-text="Screenshot showing the asset details page" border="true":::

## Searching Microsoft Purview in connected services

Once you register your Microsoft Purview instance to an Azure Data Factory or an Azure Synapse Analytics workspace, you can search the Microsoft Purview data catalog directly from those services. To learn more, see [Discover data in ADF using Microsoft Purview](../data-factory/how-to-discover-explore-purview-data.md) and [Discover data in Synapse using Microsoft Purview](../synapse-analytics/catalog-and-governance/how-to-discover-connect-analyze-azure-purview.md).

:::image type="content" source="./media/how-to-search-catalog/search-azure-data-factory.png" alt-text="Screenshot showing how to use Microsoft Purview search in Azure Data Factory" border="true":::
## Bulk edit search results

If you're looking to make changes to multiple assets returned by search, Microsoft Purview lets you modify glossary terms, classifications, and contacts in bulk. To learn more, see the [bulk edit assets](how-to-bulk-edit-assets.md) guide.

## Browse the data catalog

While searching is great if you know what you're looking for, there are times where data consumers wish to explore the data available to them. The Microsoft Purview data catalog offers a browse experience that enables users to explore what data is available to them either by collection or through traversing the hierarchy of each data source in the catalog. For more information, see [browse the data catalog](how-to-browse-catalog.md).

## Search query syntax

All search queries consist of keywords and operators. A keyword is a something that would be part of an asset's properties. Potential keywords can be a classification, glossary term, asset description, or an asset name. A keyword can be just a part of the property you're looking to match to. Use keywords and the operators to ensure Microsoft Purview returns the assets you're looking for.

Certain characters including spaces, dashes, and commas are interpreted as delimiters. Searching a string like `hive-database` is the same as searching two keywords `hive database`. 

The following table contains the operators that can be used to compose a search query. Operators can be combined as many times as need in a single query.

| Operator | Definition | Example |
| -------- | ---------- | ------- |
| OR | Specifies that an asset must have at least one of the two keywords. Must be in all caps. A white space is also an OR operator.  | The query `hive OR database` returns assets that contain 'hive' or 'database' or both. |
| AND | Specifies that an asset must have both keywords. Must be in all caps | The query `hive AND database` returns assets that contain both 'hive' and 'database'. |
| NOT | Specifies that an asset can't contain the keyword to the right of the NOT clause. Must be in all caps  | The query `hive NOT database` returns assets that contain 'hive', but not 'database'. |
| () | Groups a set of keywords and operators together. When combining multiple operators, parentheses specify the order of operations. | The query `hive AND (database OR warehouse)` returns assets that contain 'hive' and either 'database' or 'warehouse', or both. |
| "" | Specifies exact content in a phrase that the query must match to. | The query `"hive database"` returns assets that contain the phrase "hive database" in their properties |
| field:keyword | Searches the keyword in a specific attribute of an asset. Field search is case insensitive and is limited to the following fields at this time: <ul><li>name</li><li>description</li><li>entityType</li><li>assetType</li><li>classification</li><li>term</li><li>contact</li></ul> | The query `description: German` returns all assets that contain the word "German" in the description.<br><br>The query `term:Customer` will return all assets with glossary terms that include "Customer" and all glossary terms that match to "Customer". |

> [!TIP]
> Searching "*" will return all the assets and glossary terms in the catalog.

### Known limitations

* Grouping isn't supported within a field search. Customers should use operators to connect field searches. For example,`name:(alice AND bob)` is invalid search syntax, but `name:alice AND name:bob` is supported.

## Next steps

- [How to create, import, and export glossary terms](how-to-create-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
