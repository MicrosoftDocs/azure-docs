---
title: Upgrade REST API versions
titleSuffix: Azure Cognitive Search
description: Review differences in API versions and learn which actions are required to migrate existing code to the newest Azure Cognitive Search service REST API version.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.custom: 
ms.topic: conceptual
ms.date: 10/03/2022
---

# Upgrade to the latest REST API in Azure Cognitive Search

If you're using an earlier version of the [**Search REST API**](/rest/api/searchservice/), this article will help you upgrade your application to the newest generally available API version, **2020-06-30**.

Version 2020-06-30 includes an important new feature ([knowledge store](knowledge-store-concept-intro.md)), and introduces several minor behavior changes. As such, this version is mostly backward compatible so code changes should be minimal if you're upgrading from the previous version (2019-05-06).

> [!NOTE]
> A search service supports a range of REST API versions, including earlier ones. You can continue to use those API versions, but we recommend migrating your code to the newest version so that you can access new capabilities. Over time, the most outdated versions of the REST API will be deprecated and [no longer supported](search-api-versions.md#unsupported-versions).

<a name="UpgradeSteps"></a>

## How to upgrade

When upgrading to a new version, you probably won't have to make many changes to your code, other than to change the version number. The only situations in which you may need to change code are when:

* Your code fails when unrecognized properties are returned in an API response. By default your application should ignore properties that it doesn't understand.

* Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](/rest/api/searchservice/Search-Documents)).

* Your code references an API version that predates 2019-05-06 and is subject to one or more of the breaking changes in that release. The section [Upgrade to 2019-05-06](#upgrade-to-2019-05-06) provides more detail. 

If any of these situations apply to you, then you may need to change your code accordingly. Otherwise, no changes should be necessary, although you might want to start using features added in the new version.

## Upgrade to 2020-06-30

Version 2020-06-30 is the new generally available release of the REST API. There's one breaking change and several behavioral differences. 

Features are now generally available in this API version include:

* [Knowledge store](knowledge-store-concept-intro.md), persistent storage of enriched content created through skillsets, created for downstream analysis and processing through other applications. With this capability, an indexer-driven AI enrichment pipeline can populate a knowledge store in addition to a search index. If you used the preview version of this feature, it's equivalent to the generally available version. The only code change required is modifying the api-version.

### Breaking change

Existing code written against earlier API versions will break on api-version=2020-06-30 and later if code contains the following functionality:

* Any Edm.Date literals (a date composed of year-month-day, such as `2020-12-12`) in filter expressions must follow the Edm.DateTimeOffset format: `2020-12-12T00:00:00Z`. This change was necessary to handle erroneous or unexpected query results due to timezone differences.

### Behavior changes

* [BM25 ranking algorithm](index-ranking-similarity.md) replaces the previous ranking algorithm with newer technology. New services will use this algorithm automatically. For existing services, you must set parameters to use the new algorithm.

* Ordered results for null values have changed in this version, with null values appearing first if the sort is `asc` and last if the sort is `desc`. If you wrote code to handle how null values are sorted, be aware of this change.

## Upgrade to 2019-05-06

Version 2019-05-06 is the previous generally available release of the REST API. Features that became generally available in this API version include:

* [Autocomplete](index-add-suggesters.md) is a typeahead feature that completes a partially specified term input.
* [Complex types](search-howto-complex-data-types.md) provides native support for structured object data in search index.
* [JsonLines parsing modes](search-howto-index-json-blobs.md), part of Azure Blob indexing, creates one search document per JSON entity that is separated by a newline.
* [AI enrichment](cognitive-search-concept-intro.md) provides indexing that uses the AI enrichment engines of Azure AI services.

### Breaking changes

Existing code written against earlier API versions will break on api-version=2019-05-06 and later if code contains the following functionality:

#### Indexer for Azure Cosmos DB - datasource is now `"type": "cosmosdb"`

If you're using an [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md), you must change `"type": "documentdb"` to `"type": "cosmosdb"`.

#### Indexer execution result errors no longer have status

The error structure for indexer execution previously had a `status` element. This element was removed because it wasn't providing useful information.

#### Indexer data source API no longer returns connection strings

From API versions 2019-05-06 and 2019-05-06-Preview onwards, the data source API no longer returns connection strings in the response of any REST operation. In previous API versions, for data sources created using POST, Azure Cognitive Search returned **201** followed by the OData response, which contained the connection string in plain text.

#### Named Entity Recognition cognitive skill is now discontinued

If you called the [Name Entity Recognition](cognitive-search-skill-named-entity-recognition.md) skill in your code, the call will fail. Replacement functionality is [Entity Recognition Skill (V3)](cognitive-search-skill-entity-recognition-v3.md). Follow the recommendations in [Deprecated cognitive search skills](cognitive-search-skill-deprecated.md) to migrate to a supported skill.

### Upgrading complex types

API version 2019-05-06 added formal support for complex types. If your code implemented previous recommendations for complex type equivalency in 2017-11-11-Preview or 2016-09-01-Preview, there are some new and changed limits starting in version 2019-05-06 of which you need to be aware:

+ The limits on the depth of subfields and the number of complex collections per index have been lowered. If you created indexes that exceed these limits using the preview api-versions, any attempt to update or recreate them using API version 2019-05-06 will fail. If you find yourself in this situation, you'll need to redesign your schema to fit within the new limits and then rebuild your index.

+ There's a new limit starting in api-version 2019-05-06 on the number of elements of complex collections per document. If you created indexes with documents that exceed these limits using the preview api-versions, any attempt to reindex that data using api-version 2019-05-06 will fail. If you find yourself in this situation, you'll need to reduce the number of complex collection elements per document before reindexing your data.

For more information, see [Service limits for Azure Cognitive Search](search-limits-quotas-capacity.md).

#### How to upgrade an old complex type structure

If your code is using complex types with one of the older preview API versions, you may be using an index definition format that looks like this:

```json
{
  "name": "hotels",  
  "fields": [
    { "name": "HotelId", "type": "Edm.String", "key": true, "filterable": true },
    { "name": "HotelName", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": true, "facetable": false },
    { "name": "Description", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "en.microsoft" },
    { "name": "Description_fr", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.microsoft" },
    { "name": "Category", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true },
    { "name": "Tags", "type": "Collection(Edm.String)", "searchable": true, "filterable": true, "sortable": false, "facetable": true, "analyzer": "tagsAnalyzer" },
    { "name": "ParkingIncluded", "type": "Edm.Boolean", "filterable": true, "sortable": true, "facetable": true },
    { "name": "LastRenovationDate", "type": "Edm.DateTimeOffset", "filterable": true, "sortable": true, "facetable": true },
    { "name": "Rating", "type": "Edm.Double", "filterable": true, "sortable": true, "facetable": true },
    { "name": "Address", "type": "Edm.ComplexType" },
    { "name": "Address/StreetAddress", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "searchable": true },
    { "name": "Address/City", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true },
    { "name": "Address/StateProvince", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true },
    { "name": "Address/PostalCode", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true },
    { "name": "Address/Country", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true },
    { "name": "Location", "type": "Edm.GeographyPoint", "filterable": true, "sortable": true },
    { "name": "Rooms", "type": "Collection(Edm.ComplexType)" }, 
    { "name": "Rooms/Description", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "en.lucene" },
    { "name": "Rooms/Description_fr", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene" },
    { "name": "Rooms/Type", "type": "Edm.String", "searchable": true },
    { "name": "Rooms/BaseRate", "type": "Edm.Double", "filterable": true, "facetable": true },
    { "name": "Rooms/BedOptions", "type": "Edm.String", "searchable": true },
    { "name": "Rooms/SleepsCount", "type": "Edm.Int32", "filterable": true, "facetable": true },
    { "name": "Rooms/SmokingAllowed", "type": "Edm.Boolean", "filterable": true, "facetable": true },
    { "name": "Rooms/Tags", "type": "Collection(Edm.String)", "searchable": true, "filterable": true, "facetable": true, "analyzer": "tagsAnalyzer" }
  ]
}  
```

A newer tree-like format for defining index fields was introduced in API version 2017-11-11-Preview. In the new format, each complex field has a fields collection where its subfields are defined. In API version 2019-05-06, this new format is used exclusively and attempting to create or update an index using the old format will fail. If you have indexes created using the old format, you'll need to use API version 2017-11-11-Preview to update them to the new format before they can be managed using API version 2019-05-06.

You can update "flat" indexes to the new format with the following steps using API version 2017-11-11-Preview:

1. Perform a GET request to retrieve your index. If it’s already in the new format, you’re done.

2. Translate the index from the “flat” format to the new format. You’ll have to write code for this task since there's no sample code available at the time of this writing.

3. Perform a PUT request to update the index to the new format. Avoid changing any other details of the index, such as the searchability/filterability of fields, because changes that affect the physical expression of existing index isn't allowed by the Update Index API.

> [!NOTE]
> It is not possible to manage indexes created with the old "flat" format from the Azure portal. Please upgrade your indexes from the “flat” representation to the “tree” representation at your earliest convenience.

## Next steps

Review the Search REST API reference documentation. If you encounter problems, ask us for help on [Stack Overflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](/rest/api/searchservice/)
