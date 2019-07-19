---
title: Preview REST API for Azure Search 2019-05-06-Preview - Azure Search
description: Azure Search Service REST API Version 2019-05-06-Preview includes experimental features such as knowledge store and customer-managed encryption keys.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: search
ms.date: 05/02/2019
ms.author: heidist
ms.custom: seodec2018

---
# Azure Search Service REST api-version 2019-05-06-Preview
This article describes the `api-version=2019-05-06-Preview` version of Azure Search service REST API, offering experimental features not yet generally available.

> [!NOTE]
> Preview features are available for testing and experimentation with the goal of gathering feedback and are subject to change. We strongly advise against using preview APIs in production applications.


## New in 2019-05-06-Preview

[**Knowledge store**](knowledge-store-concept-intro.md) is a new destination of an AI-based enrichment pipeline. In addition to an index, you can now persist populated data structures created during indexing in Azure storage. You control the physical structures of your data through elements in a Skillset, including how data is shaped, whether data is stored in Table storage or Blob storage, and whether there are multiple views.

[**Customer-managed encryption keys**](search-security-manage-encryption-keys.md) for service-side encryption-at-rest is also a new preview feature. In addition to the built-in encryption-at-rest managed by Microsoft, you can apply an additional layer of encryption where you are the sole owner of the keys.

## Other preview features

Features announced in earlier previews are still in public preview. If you're calling an API with an earlier preview api-version, you can continue to use that version or switch to `2019-05-06-Preview` with no changes to expected behavior.

+ [moreLikeThis query parameter](search-more-like-this.md) finds documents that are relevant to a specific document. This feature has been in earlier previews. 
* [CSV blob indexing](search-howto-index-csv-blobs.md) creates one document per line, as opposed to one document per text blob.
* [MongoDB API support for Cosmos DB indexers](search-howto-index-cosmosdb.md) is in preview.


## How to call a preview API

Older previews are still operational but become stale over time. If your code calls `api-version=2016-09-01-Preview` or `api-version=2017-11-11-Preview`, those calls are still valid. However, only the newest preview version is refreshed with improvements. 

The following example syntax illustrates a call to the preview API version.

    GET https://[service name].search.windows.net/indexes/[index name]/docs?search=*&api-version=2019-05-06-Preview

Azure Search service is available in multiple versions. For more information, see [API versions](search-api-versions.md).

## Next steps

Review the Azure Search Service REST API reference documentation. If you encounter problems, ask us for help on [StackOverflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)