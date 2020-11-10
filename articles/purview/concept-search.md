---
title: Understand search features in Azure Purview
description: This article explains what search is in Azure Purview.
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/06/2020
---

# Understand search features in Azure Purview

This article provides an overview of the search experience in Azure Purview. Search is a core platform capability of Purview, that powers the data discovery and data use governance experiences in an organization.

## Search

Purview search experience is powered by a managed search index. After a data source is registered with Purview, its metadata is indexed by the search service to allow easy discovery. The index provides search relevance capabilities and serve-up search requests by querying millions of metadata assets. Search helps the users to discover, understand, and use the data to get the most value out of it. 

The Search experience in Purview is a three stage process. At stage zero, the search box shows the history containing recently used keywords and assets. At stage one, when the user starts typing the keystrokes, the search suggests the matching keywords and asset. At stage two, the search result page is shown with assets matching the keyword entered.

## Reduce the time to discover data
Data discovery is the first step for a data analytics or data governance workload for data consumers. Much time is spent during data discovery because the data consumers don't know where is it located. Even after finding the data, they don't know if they can trust and take a dependency on the data. 

The goal of search in Azure Purview is to speed up the process of data discovery by providing gestures, to quickly find the data that matters.

### Recent search and suggestions
Many times, the users may work on multiple projects at the same time. They want to find the data that was recently used to continue working from they left earlier. Purview search provides the ability to see recent search keywords and suggestions at their finger tip. Also, users can manage the recent search history by selecting "View all" from the search box drop-down.

### Filters

Filters also known as facets are designed to complement searching. Filters are shown in the search result page. The filters in the search result page include classification, sensitivity label, data source, and owners. Users can select specific values in a filter to see only matching data assets, and restrict the search result to the matching assets.

### Hit highlighting
Matching keywords in search result page is highlighted to make it easier to identify why a data asset was returned by search. The key word match can occur in data asset name, description, owner, and so on.

It may not be obvious why a data asset is included in search, even with hit highlighting enabled. All properties are searched by default. Therefore, a data asset might be returned because of a match on a column-level property. And because multiple users can annotate the data assets with their own classifications and descriptions, not all metadata is displayed in the list of search results.

### Sort
Users have two options to sort the search results. They can sort by the name of the asset or by default search relevance. 

## Search relevance 
Relevance is the default sort order in the search result page. The Search relevance finds documents that include the search keyword (some or all), favoring assets containing many instances of the search keyword. Also, custom scoring mechanisms are constantly tuned to improve search relevance.

## Next steps

[Data lineage](data-lineage.md)

[Browse the data catalog in Azure Purview](how-to-browse-catalog.md)
