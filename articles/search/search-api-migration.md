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

* [Autocomplete](index-add-suggesters.md) is a typeahead feature that completes a partially specified term input.

* [Complex types](search-howto-complex-data-types.md) provides native support for structured object data in an Azure Search index.

* [JsonLines parsing modes](search-howto-index-json-blobs.md), part of Azure Blob indexing, creates one search document per JSON entity that is separated by a newline.

* [Cognitive search](cognitive-search-concept-intro.md) provides indexing that leverages the AI enrichment engines of Cognitive Services.

Several preview feature releases coincide with this generally available update. To review the list of new preview features, see [Search REST api-version 2019-05-06-Preview](search-api-preview.md).

## Breaking changes

Existing code containing the following functionality will break on api-version=2019-05-06.

### Indexer for Azure Cosmos DB - datasource is now "type": "cosmosdb"

If you are using a [Cosmos DB indexer](search-howto-index-cosmosdb.md ), you must change `"type": "documentdb"` to `"type": "cosmosdb"`.

### Indexer execution result errors no longer have status

The error structure for indexer execution previously had a `status` element. This element was removed because it was not providing useful information.

### Indexer data source API no longer returns connection strings

From API versions 2019-05-06 and 2019-05-06-Preview onwards, the data source API no longer returns connection strings in the response of any REST operation. In previous API versions, for data sources created using POST, Azure Search returned **201** followed by the OData response, which contained the connection string in plain text.

### Named Entity Recognition cognitive skill is now discontinued

If you call [Name Entity Recognition](cognitive-search-skill-named-entity-recognition.md) skill in your code, the call will fail. Replacement functionality is [Entity Recognition](cognitive-search-skill-entity-recognition.md). You should be able to replace the skill reference with no other changes. The API signature is the same for both versions. 

<a name="UpgradeSteps"></a>

## Steps to upgrade
If you are upgrading from a previous GA version, 2017-11-11 or 2016-09-01, you probably won't have to make any changes to your code, other than to change the version number. The only situations in which you may need to change code are when:

* Your code fails when unrecognized properties are returned in an API response. By default your application should ignore properties that it does not understand.

* Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)).

If either of these situations apply to you, then you may need to change your code accordingly. Otherwise, no changes should be necessary unless you want to start using the [new features](#WhatsNew) of version 2019-05-06.

If you are upgrading from a preview API version, the above also applies, but you must also be aware that some preview features are not available in version 2019-05-06:

* ["More like this" queries](search-more-like-this.md)
* [CSV blob indexing](search-howto-index-csv-blobs.md)
* [MongoDB API support for Cosmos DB indexers](search-howto-index-cosmosdb.md)

If your code uses these features, you will not be able to upgrade to API version 2019-05-06 without removing your usage of them.

> [!IMPORTANT]
> Preview APIs are intended for testing and evaluation, and should not be used in production environments.
> 

### Upgrading complex types

If your code uses complex types with the older preview API versions 2017-11-11-Preview or 2016-09-01-Preview, there are some new and changed limits in version 2019-05-06 of which you need to be aware:

+ The limits on the depth of sub-fields and the number of complex collections per index have been lowered. If you created indexes that exceed these limits using the preview api-versions, any attempt to update or recreate them using API version 2019-05-06 will fail. If this applies to you, you will need to redesign your schema to fit within the new limits and then rebuild your index.

+ There is a new limit in api-version 2019-05-06 on the number of elements of complex collections per document. If you created indexes with documents that exceed these limits using the preview api-versions, any attempt to reindex that data using api-version 2019-05-06 will fail. If this applies to you, you will need to reduce the number of complex collection elements per document before reindexing your data.

For more information, see [Service limits for Azure Search](search-limits-quotas-capacity.md).

### How to upgrade an old complex type structure

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

A newer tree-like format for defining index fields was introduced in API version 2017-11-11-Preview. In the new format, each complex field has a fields collection where its sub-fields are defined. In API version 2019-05-06, this new format is used exclusively and attempting to create or update an index using the old format will fail. If you have indexes created using the old format, you'll need to use API version 2017-11-11-Preview to update them to the new format before they can be managed using API version 2019-05-06.

You can update "flat" indexes to the new format with the following steps using API version 2017-11-11-Preview:

1. Perform a GET request to retrieve your index. If it’s already in the new format, you’re done.

2. Translate the index from the “flat” format to the new format. You’ll have to write code for this since there is no sample code available at the time of this writing.

3. Perform a PUT request to update the index to the new format. Make sure not to change any other details of the index such as the searchability/filterability of fields, since this is not allowed by the Update Index API.

> [!NOTE]
> It is not possible to manage indexes created with the old "flat" format from the Azure portal. Please upgrade your indexes from the “flat” representation to the “tree” representation at your earliest convenience.

## Next steps

Review the Azure Search Service REST API reference documentation. If you encounter problems, ask us for help on [StackOverflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)

