---
title: How to discover data sources in Azure Data Catalog
description: This article highlights how to discover registered data assets with Azure Data Catalog, including searching and filtering and using the hit highlighting capabilities of the Azure Data Catalog portal.
services: data-catalog
author: markingmyname
ms.author: maghan
ms.assetid: f72ae3a3-6573-4710-89a7-f13555e1968c
ms.service: data-catalog
ms.topic: conceptual
ms.date: 01/18/2018
---
# How to discover data sources in Azure Data Catalog
## Introduction
Azure Data Catalog is a fully managed cloud service that serves as a system of registration and discovery for enterprise data sources. In other words, Data Catalog helps people discover, understand, and use data sources, and it helps organizations get more value from their existing data. After a data source is registered with Data Catalog, its metadata is indexed by the service, so that you can easily search to discover the data you need.

## Searching and filtering
Discovery in Data Catalog uses two primary mechanisms: searching and filtering.

Searching is designed to be both intuitive and powerful. By default, search terms are matched against any property in the catalog, including user-provided annotations.

Filtering is designed to complement searching. You can select specific characteristics such as experts, data source type, object type, and tags. You can view only matching data assets, and constrain search results to matching assets.

By using a combination of searching and filtering, you can quickly navigate the data sources that have been registered with Data Catalog to discover the data sources you need.

## Search syntax
Although the default free text search is simple and intuitive, you can also use Data Catalog search syntax for greater control over the search results. Data Catalog search supports the following techniques:

| Technique | Use | Example |
| --- | --- | --- |
| Basic search |Basic search that uses one or more search terms. Results are any assets that match any property with one or more of the terms specified. |`sales data` |
| Property scoping |Return only data sources where the search term is matched with the specified property. |`name:finance` |
| Boolean operators |Broaden or narrow a search by using Boolean operations. |`finance NOT corporate` |
| Grouping with parenthesis |Use parentheses to group parts of the query to achieve logical isolation, especially in conjunction with Boolean operators. |`name:finance AND (tags:Q1 OR tags:Q2)` |
| Comparison operators |Use comparisons other than equality for properties that have numeric and date data types. |`modifiedTime > "11/05/2014"` |

For more information about Data Catalog search, see the [Azure Data Catalog](https://msdn.microsoft.com/library/azure/mt267594.aspx) article.

## Hit highlighting
When you view search results, any displayed properties that match the specified search terms (such as the data asset name, description, and tags) are highlighted to make it easier to identify why a given data asset was returned by a given search.

> [!NOTE]
> To turn off hit highlighting, use the **Highlight** switch in the Data Catalog portal.
>
>

When you view search results, it might not always be obvious why a data asset is included, even with hit highlighting enabled. Because all properties are searched by default, a data asset might be returned because of a match on a column-level property. And because multiple users can annotate registered data assets with their own tags and descriptions, not all metadata might be displayed in the list of search results.

In the default tile view, each tile displayed in the search results includes a **View search term matches** icon, so that you can quickly view the number of matches and their location, and to jump to them if you want.

 ![Hit highlighting and search matches in the Azure Data Catalog portal](./media/data-catalog-how-to-discover/search-matches.png)

## Summary
Because registering a data source with Data Catalog copies structural and descriptive metadata from the data source to the catalog service, the data source becomes easier to discover and understand. After you've registered a data source, you can discover it by using filtering and search from within the Data Catalog portal.

## Next steps
* For step-by-step details about how to discover data sources, see [Get Started with Azure Data Catalog](data-catalog-get-started.md).
