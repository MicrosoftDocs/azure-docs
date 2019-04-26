---
title: Upgrade to the latest Azure Search Service REST API version - Azure Search
description: Review differences in API versions and learn which actions are required to migrate existing code to the newest Azure Search Service REST API version.
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: brjohnst

---
# Upgrade to the latest Azure Search Service REST API version
If you're using a previous version of the [Azure Search Service REST API](https://docs.microsoft.com/rest/api/searchservice/), this article will help you upgrade your application to use the newest generally available API version, 2019-05-06.

Version 2019-05-06 of the REST API contains some changes from earlier versions. These are mostly backward compatible, so changing your code should require only minimal effort, depending on which version you were using before. [Steps to upgrade](#UpgradeSteps) outlines the code changes required for using new features.

> [!NOTE]
> An Azure Search service instance supports a range of REST API versions, including earlier ones. You can continue to use those API versions, but we recommend migrating your code to the newest version so that you can access new capabilities.

<a name="WhatsNew"></a>

## What's new in version 2019-05-06
Version 2019-05-06 is the newest generally available release of the Azure Search Service REST API. Features that have transitioned to generally available status in this API version include:

* [Autocomplete](index-add-suggesters.md) is a typeahead feature that completes a partially-specified term input.

* [Complex types](search-howto-complex-data-types.md) provides native support for structured object data in an Azure Search index.

* [JsonLines parsing modes](search-howto-index-json-blobs.md), part of Azure Blob indexing, creates one search document per JSON entity that is separated by a newline.

* [Cognitive Search with AI-enriched indexing](cognitive-search-concept-intro.md) provides indexing that leverages the AI enrichment engines of Cognitive Services.

Several preview feature releases coincide with this generally available update. To review the list of new preview features, see [Search REST api-version 2019-05-06-Preview](search-api-preview.md).

## Breaking changes

Existing code containing the following functionality will break on api-version=2019-05-06.

### Indexer for Azure Cosmos DB - datasource is now "type": "cosmosdb"

If you are using a [Cosmos DB indexer](search-howto-index-cosmosdb.md ), you must change "type": "documentdb" to "type": "cosmosdb".

### Indexer execution result errors no longer have status

The error structure for indexer execution previously had a `status` element. This element is now removed. In practice, it was always false for errors, thus providing no informational value.

### Indexer data source API no longer returns connection strings

From API versions 2019-05-06 and 2019-05-06-Preview onwards, the data source API no longer returns  connection strings in the response of any REST operation. In previous API versions, for data sources created using POST, Azure Search returned **201** followed by the OData response, which contained the connection string in plain text.

### Named Entity Recognition cognitive skill is now discontinued

If you call [Name Entity Recognition](cognitive-search-skill-named-entity-recognition.md) skill in your code, the call will fail. Replacement functionality is [Entity Recognition](cognitive-search-skill-entity-recognition.md). You should be able to replace the skill reference with no other changes. The API signature is the same for both versions. 

<a name="UpgradeSteps"></a>

## Steps to upgrade
If you are upgrading from a previous GA version, 2017-11-11 or 2016-09-01, you probably won't have to make any changes to your code, other than to change the version number. The only situations in which you may need to change code are when:

* Your code fails when unrecognized properties are returned in an API response. By default your application should ignore properties that it does not understand.

* Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)).

If either of these situations apply to you, then you may need to change your code accordingly. Otherwise, no changes should be necessary unless you want to start using the [new features](#WhatsNew) of version 2019-05-06.

If you are upgrading from a preview API version, the above also applies, but you must also be aware that some preview features are not available in version 2019-05-06:

* Azure Blob Storage indexer [support for CSV files](search-howto-index-csv-blobs.md) is still in preview.

* ["More like this" queries](search-more-like-this.md) continue to be a preview-only feature.

If your code uses these features, you will not be able to upgrade to API version 2019-05-06 without removing your usage of them.

> [!IMPORTANT]
> Preview APIs are intended for testing and evaluation, and should not be used in production environments.
> 

## Next steps

Review the Azure Search Service REST API reference documentation. If you encounter problems, ask us for help on [StackOverflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)

