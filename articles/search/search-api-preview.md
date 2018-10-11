---
title: Azure Search Service REST API Version 2017-11-11-Preview | Microsoft Docs
description: Azure Search Service REST API Version 2017-11-11-Preview includes experimental features such as Synonyms and moreLikeThis searches.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: search
ms.date: 06/28/2018
ms.author: HeidiSteen

---
# Azure Search Service REST api-version 2017-11-11-Preview
This article describes the `api-version=2017-11-11-Preview` version of Azure Search service REST API, offering experimental features not yet generally available.

> [!NOTE]
> Preview features are available for testing and experimentation with the goal of gathering feedback and are subject to change. We strongly advise against using preview APIs in production applications.


## New in 2017-11-11-Preview

[**Auto-complete**](search-autocomplete-tutorial.md) joins the existing [Suggestions API](https://docs.microsoft.com/rest/api/searchservice/suggestions) to add complementary type-ahead experiences to the search bar. Auto-complete returns candidate query terms a user can choose as the query string for a subsequent search. Suggestions returns actual documents in response to partial inputs: search results are immediate and change dynamically as the search term input grows in length and specificity.

[**Cognitive search**](cognitive-search-concept-intro.md), a new enrichment capability in Azure Search finds latent information in non-text sources and undifferentiated text, transforming it into full text searchable content in Azure Search. The following resources are introduced or modified in the preview REST API. All other REST APIs are the same whether you call the generally available or preview version.

+ [Skillset operations(api-version=2017-11-11-Preview)](https://docs.microsoft.com/rest/api/searchservice/skillset-operations)

+ [Create Indexer (api-version=2017-11-11-Preview)](https://docs.microsoft.com/rest/api/searchservice/create-indexer)

+ [Predefined skills](cognitive-search-predefined-skills.md)

All other REST APIs are the same regardless of how you set the api-version. For example, `GET https://[service name].search.windows.net/indexes/hotels?api-version=2017-11-11-Preview` and `GET https://[service name].search.windows.net/indexes/hotels?api-version=2017-11-11` (without `Preview`) are functionally equivalent.

## Other preview features

Features announced in earlier previews are still in public preview. If you're calling an API with an earlier preview api-version, you can continue to use that version or switch to `2017-11-11-Preview` with no changes to expected behavior.

+ [CSV files in Azure Blob indexing](search-howto-index-csv-blobs.md), introduced in `api-version=2015-02-28-Preview`, remains a preview feature. This feature is part of Azure Blob indexing and is invoked through a parameter setting. Each line in a CSV file is indexed as a separate document.

+ [JSON arrays in Azure Blob indexing](search-howto-index-json-blobs.md), introduced in `api-version=2015-02-28-Preview`, remains a preview feature. This feature is part of Azure Blob indexing and is invoked through a parameter setting. where each element in the array is indexed as a separate document.

+ [moreLikeThis query parameter](search-more-like-this.md) finds documents that are relevant to a specific document. This feature has been in earlier previews. 


## How to call a preview API

Older previews are still operational but become stale over time. If your code calls `api-version=2016-09-01-Preview` or `api-version=2015-02-28-Preview`, those calls are still valid. However, only the newest preview version is refreshed with improvements. 

The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2017-11-11-Preview

Azure Search service is available in multiple versions. For more information, see [API versions](search-api-versions.md).
