---
title: 'How to: search the Data Catalog'
description: This article gives an overview of how to search a data catalog.
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 03/16/2021
---

# Search the Azure Purview Data Catalog

Data discovery is the first step for a data analytics or data governance workload for data consumers. Data discovery can be time consuming because you may not know where to find the data that you want. Even after finding the data, you may have doubts about whether or not you can trust the data and take a dependency on it.

The goal of search in Azure Purview is to speed up the process of data discovery to quickly find the data that matters. This article outlines how to search the Azure Purview data catalog to quickly find the data you are looking for.

## Search the catalog for assets

In Azure Purview, the search bar is located at the top of the Purview studio UX.

:::image type="content" source="./media/how-to-search-catalog/purview-search-bar.png" alt-text="Screenshot showing the location of the Azure Purview search bar" border="true":::

When you click on the search bar, you can see your recent search history and recently accessed assets. Select "View all" to see all of the recently viewed assets.

:::image type="content" source="./media/how-to-search-catalog/search-no-keywords.png" alt-text="Screenshot showing the search bar before any keywords have been entered" border="true":::

Enter in keywords that help identify your asset such as its name, data type, classifications, and glossary terms. As you enter in keywords relating to your desired asset, Azure Purview displays suggestions on what to search and potential asset matches. To complete your search, click on "View search results" or press "Enter".

:::image type="content" source="./media/how-to-search-catalog/search-keywords.png" alt-text="Screenshot showing the search bar as a user enters in keywords" border="true":::

The search results page shows a list of assets that match the keywords provided in order of relevance. There are various factors that can affect the relevance score of an asset. You can filter down the list more by selecting specific data stores, classifications, contacts, labels, and glossary terms that apply to the asset you are looking for.

:::image type="content" source="./media/how-to-search-catalog/search-results.png" alt-text="Screenshot showing the results of a search" border="true":::

 Click on your desired asset to view the asset details page where you can view properties including schema, lineage, and asset owners.

:::image type="content" source="./media/how-to-search-catalog/search-view-asset.png" alt-text="Screenshot showing the asset details page" border="true":::

## Search query syntax

All search queries consist of keywords and operators. A keyword is a something that would be part of an asset's properties. Potential keywords can be a classification, glossary term, asset description, or an asset name. A keyword can be just a part of the property you are looking to match to. Use keywords and the operators listed below to ensure Azure Purview returns the assets you are looking for. 

Below are the operators that can be used to compose a search query. Operators can be combined as many times as need in a single query.

| Operator | Definition | Example |
| -------- | ---------- | ------- |
| OR | Specifies that an asset must have at least one of the two keywords. Must be in all caps. A white space is also an OR operator.  | The query `hive OR database` returns assets that contain 'hive' or 'database' or both. |
| AND | Specifies that an asset must have both keywords. Must be in all caps | The query `hive AND database` returns assets that contain both 'hive' and 'database'. |
| NOT | Specifies that an asset can't contain the keyword to the right of the NOT clause | The query `hive NOT database` returns assets that contain 'hive', but not 'database'. |
| () | Groups a set of keywords and operators together. When combining multiple operators, parenthesis specify the order of operations. | The query `hive AND (database OR warehouse)` returns assets that contain 'hive' and either 'database' or 'warehouse', or both. |
| "" | Specifies exact content in a phrase that the query must match to. | The query `"hive database"` returns assets that contain the phrase "hive database" in their properties |
| * | A wildcard that matches on one to many characters. Can't be the first character in a keyword. | The query `dat*` returns assets that have properties that starts with 'dat' such as 'data' or 'database'. |
| ? | A wildcard that matches on a single character. Can't be the first character in a keyword | The query `dat?` returns assets that have properties that start with 'dat' and are four letters such as 'date' or 'data'. |

> [!Note]
> Always specify Boolean operators (**AND**, **OR**, **NOT**) in all caps. Otherwise, case doesn't matter, nor do extra spaces.

## Next steps

- [How to create, import, and export glossary terms](how-to-create-import-export-glossary.md)
- [How to manage term templates for business glossary](how-to-manage-term-templates.md)
