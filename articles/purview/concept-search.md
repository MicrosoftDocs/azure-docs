---
title: Understand search features in Azure Purview (preview)
description: This article explains how Azure Purview enables data discovery through search features.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/06/2020
---

# Understand search features in Azure Purview

This article provides an overview of the search experience in Azure Purview. Search is a core platform capability of Purview, that powers the data discovery and data use governance experiences in an organization.

## Search

The Purview search experience is powered by a managed search index. After a data source is registered with Purview, its metadata is indexed by the search service to allow easy discovery. The index provides search relevance capabilities and completes search requests by querying millions of metadata assets. Search helps you to discover, understand, and use the data to get the most value out of it.

The search experience in Purview is a three stage process:

1. The search box shows the history containing recently used keywords and assets.
1. When you begin typing the keystrokes, the search suggests the matching keywords and assets. 
1. The search result page is shown with assets matching the keyword entered.

## Reduce the time to discover data

Data discovery is the first step for a data analytics or data governance workload for data consumers. Data discovery can be time consuming, because you may not know where to find the data that you want. Even after finding the data, you may have doubts about whether or not you can trust the data and take a dependencies on it. 

The goal of search in Azure Purview is to speed up the process of data discovery by providing gestures, to quickly find the data that matters.

## Recent search and suggestions

Many times, you may be working on multiple projects at the same time. To make it easier to resume previous projects, Purview search provides the ability to see recent search keywords and suggestions. Also, you can manage the recent search history by selecting **View all** from the search box drop-down.

## Filters

Filters (also known as *facets*) are designed to complement searching. Filters are shown in the search result page. The filters in the search result page include classification, sensitivity label, data source, and owners. Users can select specific values in a filter to see only matching data assets, and restrict the search result to the matching assets.

## Hit highlighting

Matching keywords in the search result page are highlighted to make it easier to identify why a data asset was returned by search. The keyword match can occur in multiple fields such as data asset name, description, and owner.

It may not be obvious why a data asset is included in search, even with hit highlighting enabled. All properties are searched by default. Therefore, a data asset might be returned because of a match on a column-level property. And because multiple users can annotate the data assets with their own classifications and descriptions, not all metadata is displayed in the list of search results.

## Sort

Users have two options to sort the search results. They can sort by the name of the asset or by default search relevance.

## Search relevance

Relevance is the default sort order in the search result page. The search relevance finds documents that include the search keyword (some or all). Assets that contain many instances of the search keyword are ranked higher. Also, custom scoring mechanisms are constantly tuned to improve search relevance.

## Next steps

* [Quickstart: Create an Azure Purview account in the Azure portal](create-catalog-portal.md)
* [Quickstart: Create an Azure Purview account using Azure PowerShell/Azure CLI](create-catalog-powershell.md)
* [Quickstart: Use Purview Studio](use-purview-studio.md)
