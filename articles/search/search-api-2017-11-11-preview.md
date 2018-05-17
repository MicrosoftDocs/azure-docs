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
ms.date: 05/17/2018
ms.author: HeidiSteen

---
# Azure Search Service REST API: Version 2017-11-11-Preview
This article describes the `api-version=2017-11-11-Preview` version of Azure Search service REST API, offering experimental features not yet generally available.

> [!NOTE]
> Preview features are available for testing and experimentation with the goal of gathering feedback and are subject to change. We strongly advise against using preview APIs in production applications.


## New in this preview

+ [Cognitive search](cognitive-search-concept-intro.md), a new enrichment capability in Azure Search finds latent information in non-text sources and undifferentiated text, transforming it into full text searchable content in Azure Search.

The following two operations are introduced or modified in the preview REST API. All other REST APIs are the same whether you call the generally available or preview version (for example, .

+ [Create Skillset (api-version=2017-11-11-Preview)](ref-create-skillset.md)

+ [Create Indexer (api-version=2017-11-11-Preview)](ref-create-indexer.md)

All other REST APIs are the same whether you call the generally available or preview version. For example, `GET https://[service name].search.windows.net/indexes/hotels?api-version=2017-11-11-Preview` and `GET https://[service name].search.windows.net/indexes/hotels?api-version=2017-11-11` (without `Preview`) are functionally equivalent.

## Other preview features

Features from earlier previews are still in public preview.

+ [CSV files in Azure Blob indexing](search-howto-index-csv-blobs.md), where each line in a CSV file is indexed as a separate document.

+ [JSON arrays in Azure Blob indexing](search-howto-index-json-blobs.md), where each element in the array is indexed as a separate document.

+ [`moreLikeThis` query parameter](search-more-like-this.md) to find documents that are relevant to a specific document. This feature has been in earlier previews. If you're calling this API with an earlier api-version, you can continue to use that version.


## How to call a preview API

Older previews are still operational but become stale over time. If your code calls `api-version=2016-09-01-Preview` or `api-version=2015-02-25-Preview`, those calls are still valid. However, only the newest preview version is refreshed with improvements. 

The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2017-11-11-Preview

Azure Search service is available in multiple versions. For more information, see [API versions](search-api-versions.md).
