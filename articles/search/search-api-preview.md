---
title: REST API version 2019-05-06-Preview
titleSuffix: Azure Cognitive Search
description: Azure Cognitive Search service REST API Version 2019-05-06-Preview includes experimental features such as knowledge store and indexer caching for incremental enrichment..

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/15/2020
---
# Azure Cognitive Search service REST api-version 2019-05-06-Preview

This article describes the `api-version=2019-05-06-Preview` version of Search service REST API, offering experimental features not yet generally available.

> [!NOTE]
> Preview features are available for testing and experimentation with the goal of gathering feedback and are subject to change. We strongly advise against using preview APIs in production applications.

## Features in 2019-05-06-Preview

This section lists features having preview status. Most were added in the current 2019-05-06-Preview API, but some like `moreLikeThis` are from earlier preview versions that rolled into the latest preview API. 

Once a preview feature becomes generally available, it is removed from this list. You can check [Service Updates](https://azure.microsoft.com/updates/?product=search) or [What's New](whats-new.md) for announcements regarding general availability.

+ [Incremental enrichment(preview)](cognitive-search-incremental-indexing-conceptual.md) adds caching to an enrichment pipeline, allowing you to reuse existing output if a targeted modification, such as an update to a skillset or another object, does not change the content. Caching applies only to enriched documents produced by a skillset.

+ [Cosmos DB indexer](search-howto-index-cosmosdb.md) supports MongoDB API (preview), Gremlin API (preview), and Cassandra API (preview).

+ [Azure Data Lake Storage Gen2 indexer (preview)](search-howto-index-azure-data-lake-storage.md) can index content and metadata from Data Lake Storage Gen2.

+ [Knowledge store](knowledge-store-concept-intro.md) is a new destination of an AI-based enrichment pipeline. The physical data structure exists in Azure Blob storage and Azure Table storage, and it is created and populated when you run an indexer that has an attached cognitive skillset. The definition of a knowledge store itself is specified within a skillset definition. Within the knowledge store definition, you control the physical structures of your data through *projection* elements that determine how data is shaped, whether data is stored in Table storage or Blob storage, and whether there are multiple views.

+ [moreLikeThis query parameter](search-more-like-this.md) finds documents that are relevant to a specific document. This feature has been in earlier previews. 

## Earlier preview features

Features announced in earlier previews, if they have not transitioned to general availability, are still in public preview. If you're calling an API with an earlier preview api-version, you can continue to use that version or switch to `2019-05-06-Preview` with no changes to expected behavior.

## How to call a preview API

Older previews are still operational but become stale over time. If your code calls `api-version=2016-09-01-Preview` or `api-version=2017-11-11-Preview`, those calls are still valid. However, only the newest preview version is refreshed with improvements. 

The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2019-05-06-Preview

Azure Cognitive Search service is available in multiple versions. For more information, see [API versions](search-api-versions.md).

## Next steps

Review the Search REST API reference documentation. If you encounter problems, ask us for help on [StackOverflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)