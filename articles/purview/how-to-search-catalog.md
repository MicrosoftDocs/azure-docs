---
title: 'How to: search the Data Catalog'
description: This article gives an overview of how to search the Azure Purview data catalog.
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 10/01/2021
---

# Search the Azure Purview Data Catalog

After data is scanned and ingested into the Azure Purview data map, data consumers need to easily find the data needed for their analytics or governance workloads. Data discovery can be time consuming because you may not know where to find the data that you want. Even after finding the data, you may have doubts about whether you can trust the data and take a dependency on it.

The goal of search in Azure Purview is to speed up the process of data discovery to quickly find the data that matters. This article outlines how to search the Azure Purview data catalog to quickly find the data you are looking for.

## Search the catalog for assets

The search bar can be quickly accessed from the top bar of the Azure Purview Studio UX. In the data catalog home page, the search bar is in the center of the screen.

:::image type="content" source="./media/how-to-search-catalog/purview-search-bar.png" alt-text="Screenshot showing the location of the Azure Purview search bar" border="true":::

Once you click on the search bar, you will be presented with your search history and the assets recently accessed in the data catalog. This allows you to quickly pick up from previous data exploration that was already done.

:::image type="content" source="./media/how-to-search-catalog/search-no-keywords.png" alt-text="Screenshot showing the search bar before any keywords have been entered" border="true":::

Enter in keywords that help identify your asset such as its name, data type, classifications, and glossary terms. As you enter in search keywords, Azure Purview dynamically suggests assets and searches that may fit your needs. To complete your search, click on "View search results" or press "Enter".

:::image type="content" source="./media/how-to-search-catalog/search-keywords.png" alt-text="Screenshot showing the search bar as a user enters in keywords" border="true":::

Once you enter in your search, Azure Purview returns a list of data assets a user is a data reader for to that matched to the keywords entered in.

The Azure Purview relevance engine sorts through all the matches and ranks them based on what it believes their usefulness is to a user. For example, a table that matches on multiple keywords that a data steward has assigned glossary terms and given a description is likely going to be more interesting to a data consumer than a folder which has been unannotated. A large set of factors determine an asset’s relevance score and the Azure Purview search team is constantly tuning the relevance engine to ensure the top search results have value to you.

If the top results don’t include the assets you are looking for, you can use the facets on the left-hand side to filter down by business metadata such glossary terms, classifications and the containing collection. If you are interested in a particular data source type such as Azure Data Lake Storage Gen2 or Azure SQL Database, you can use the source type pill filter to narrow down your search.

> [!NOTE]
> Search will only return assets in collections you are a data reader or curator for. For more information, see [create and manage Collections](how-to-create-and-manage-collections.md).

:::image type="content" source="./media/how-to-search-catalog/search-results.png" alt-text="Screenshot showing the results of a search" border="true":::

For certain annotations, you can click on the ellipses to choose between an AND condition or an OR condition. 

:::image type="content" source="./media/how-to-search-catalog/search-and-or-choice.png" alt-text="Screenshot showing how to choose between and AND or OR condition" border="true":::

Once you find the asset you are looking for, you can select it to view details such as schema, lineage, and a detailed classification list. To learn more about the asset details page, see [Manage catalog assets](catalog-asset-details.md).

:::image type="content" source="./media/how-to-search-catalog/search-view-asset.png" alt-text="Screenshot showing the asset details page" border="true":::

## Bulk edit search results

If you are looking to make changes to multiple assets returned by search, Azure Purview lets you modify glossary terms, classifications, and contacts in bulk. To learn more, see the [bulk edit assets](how-to-bulk-edit-assets.md) guide.

## Browse the data catalog

While searching is great if you know what you are looking for, there are times where data consumers wish to explore the data available to them. The Azure Purview data catalog offers a browse experience that enables users to explore what data is available to them either by collection or through traversing the hierarchy of each data source in the catalog. For more information, see [browse the data catalog](how-to-browse-catalog.md).

## Search query syntax

All search queries consist of keywords and operators. A keyword is a something that would be part of an asset's properties. Potential keywords can be a classification, glossary term, asset description, or an asset name. A keyword can be just a part of the property you are looking to match to. Use keywords and the operators listed below to ensure Azure Purview returns the assets you are looking for.

Certain characters including spaces, dashes, and commas are interpreted as delimiters. Searching a string like `hive-database` is the same as searching two keywords `hive database`. 

Below are the operators that can be used to compose a search query. Operators can be combined as many times as need in a single query.

| Operator | Definition | Example |
| -------- | ---------- | ------- |
| OR | Specifies that an asset must have at least one of the two keywords. Must be in all caps. A white space is also an OR operator.  | The query `hive OR database` returns assets that contain 'hive' or 'database' or both. |
| AND | Specifies that an asset must have both keywords. Must be in all caps | The query `hive AND database` returns assets that contain both 'hive' and 'database'. |
| NOT | Specifies that an asset can't contain the keyword to the right of the NOT clause | The query `hive NOT database` returns assets that contain 'hive', but not 'database'. |
| () | Groups a set of keywords and operators together. When combining multiple operators, parentheses specify the order of operations. | The query `hive AND (database OR warehouse)` returns assets that contain 'hive' and either 'database' or 'warehouse', or both. |
| "" | Specifies exact content in a phrase that the query must match to. | The query `"hive database"` returns assets that contain the phrase "hive database" in their properties |
| * | A wildcard that matches on one to many characters. Can't be the first character in a keyword. | The query `dat*` returns assets that have properties that start with 'dat' such as 'data' or 'database'. |
| ? | A wildcard that matches on a single character. Can't be the first character in a keyword | The query `dat?` returns assets that have properties that start with 'dat' and are four letters such as 'date' or 'data'. |

> [!Note]
> Always specify Boolean operators (**AND**, **OR**, **NOT**) in all caps. Otherwise, case doesn't matter, nor do extra spaces.

## Next steps

- [How to create, import, and export glossary terms](how-to-create-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
