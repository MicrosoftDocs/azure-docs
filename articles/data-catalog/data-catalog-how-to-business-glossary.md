---
title: Set up the business glossary for governed tagging in Azure Data Catalog
description: How-to article highlighting the business glossary in Azure Data Catalog for defining and using a common business vocabulary to tag registered data assets.
services: data-catalog
author: markingmyname
ms.author: maghan
ms.assetid: b3d63dbe-1ae7-499f-bc46-42124e950cd6
ms.service: data-catalog
ms.topic: conceptual
ms.date: 01/18/2018
---
# Set up the business glossary for governed tagging
## Introduction
Azure Data Catalog enables data-source discovery, so you can easily discover and understand the data sources that you need to perform analysis and make decisions. These capabilities make the biggest impact when you can find and understand the broadest range of available data sources.

One Data Catalog feature that promotes greater understanding of assets data is tagging. By using tagging, you can associate keywords with an asset or a column, which in turn makes it easier to discover the asset via searching or browsing. Tagging also helps you more easily understand the context and intent of the asset.

However, tagging can sometimes cause problems of its own. Some examples of problems that tagging can introduce are:

* The use of abbreviations on some assets and expanded text on others. This inconsistency hinders the discovery of assets, even though the intent was to tag the assets with the same tag.
* Potential variations in meaning, depending on context. For example, a tag called *Revenue* on a customer data set might mean revenue by customer, but the same tag on a quarterly sales dataset might mean quarterly revenue for the company.  

To help address these and other similar challenges, Data Catalog includes a business glossary.

By using the Data Catalog business glossary, an organization can document key business terms and their definitions to create a common business vocabulary. This governance enables consistency in data usage across the organization. After a term is defined in the business glossary, it can be assigned to a data asset in the catalog. This approach, *governed tagging*, is the same approach as tagging.

## Glossary availability and privileges
The business glossary is available only in the Standard Edition of Azure Data Catalog. The Free Edition of Data Catalog does not include a glossary, and it does not provide capabilities for governed tagging.

You can access the business glossary via the **Glossary** option in the Data Catalog portal's navigation menu.  

![Accessing the business glossary](./media/data-catalog-how-to-business-glossary/01-portal-menu.png)

Data Catalog administrators and members of the glossary administrators role can create, edit, and delete glossary terms in the business glossary. All Data Catalog users can view the term definitions and tag assets with glossary terms.

![Adding a new glossary term](./media/data-catalog-how-to-business-glossary/02-new-term.png)

## Creating glossary terms
Data Catalog administrators and glossary administrators can create glossary terms by clicking the **New Term** button. Each glossary term contains the following fields:

* A business definition for the term
* A description that captures the intended use or business rules for the asset or column
* A list of stakeholders who know the most about the term
* The parent term, which defines the hierarchy in which the term is organized

## Glossary term hierarchies
By using the Data Catalog business glossary, an organization can describe its business vocabulary as a hierarchy of terms, and it can create a classification of terms that better represents its business taxonomy.

A term must be unique at a given level of hierarchy. Duplicate names are not allowed. There is no limit to the number of levels in a hierarchy, but a hierarchy is often more easily understood when there are three levels or fewer.

The use of hierarchies in the business glossary is optional. Leaving the parent term field blank for glossary terms creates a flat (non-hierarchical) list of terms in the glossary.  

## Tagging assets with glossary terms
After glossary terms have been defined within the catalog, the experience of tagging assets is optimized to search the glossary as a user types a tag. The Data Catalog portal displays a list of matching glossary terms to choose from. If the user selects a glossary term from the list, the term is added to the asset as a tag (also called a glossary tag). The user can also choose to create a new tag by typing a term that's not in the glossary (also called a user tag).

![Data asset tagged with one user tag and two glossary tags](./media/data-catalog-how-to-business-glossary/03-tagged-asset.png)

> [!NOTE]
> User tags are the only type of tag supported in the Free Edition of Data Catalog.
>
>

### Hover behavior on tags
In the Data Catalog portal, the two types of tags are visually distinct and present different hover behaviors. When you hover over a user tag, you can see the tag text and the user or users who have added the tag. When you hover over a glossary tag, you also see the definition of the glossary term and a link to open the business glossary to view the full definition of the term.

### Search filters for tags
Glossary tags and user tags are both searchable, and you can apply them as filters in a search.

## Summary
By using the business glossary in Azure Data Catalog, and the governed tagging it enables, you can identify, manage, and discover data assets in a consistent manner. The business glossary can promote learning of the business vocabulary by organization members. The glossary also supports capturing meaningful metadata, which simplifies asset discovery and understanding.

## Next steps
* [REST API documentation for business glossary operations](https://msdn.microsoft.com/library/mt708855.aspx)
