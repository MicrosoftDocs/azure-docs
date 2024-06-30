---
title: Upgrade REST API versions
titleSuffix: Azure AI Search
description: Review differences in API versions and learn the steps for migrating code to the newer versions.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 06/03/2024
---

# Upgrade to the latest REST API in Azure AI Search

Use this article to migrate data plane calls to newer versions of the [**Search REST APIs**](/rest/api/searchservice/).

+ [`2023-11-01`](/rest/api/searchservice/search-service-api-versions#2023-11-01) is the most recent stable version.

+ [`2024-05-01-preview`](/rest/api/searchservice/search-service-api-versions#2023-10-01-preview) is the most recent preview API version. 

Upgrade instructions focus on code changes that get you through breaking changes from previous versions so that existing code runs the same as before, but on the newer API version. Once your code is in working order, you can decide whether to adopt newer features. To learn more about preview features, see [vector code samples](https://github.com/Azure/azure-search-vector-samples) and [What's New](whats-new.md).

We recommend upgrading API versions in succession, working through each version until you get to the newest one.

`2023-07-01-preview` was the first REST API for vector support. It's now deprecated and you should migrate to either stable or newer preview REST APIs immediately.

> [!NOTE]
> REST API reference docs are now versioned. For version-specific content, open a reference page and then use the selector located to the right, above the table of contents, to pick your version.

## When to upgrade

Azure AI Search breaks backward compatibility as a last resort. Upgrade is necessary when:

+ Your code references a retired or deprecated API version and is subject to one or more breaking changes. You must address breaking changes if your code targets [`2023-07-10-preview`](#code-upgrade-for-vector-indexes-and-queries) for vectors, [`2020-06-01-preview`](#breaking-change-for-semantic-ranking) for semantic ranking, and [`2019-05-06`](#upgrade-to-2019-05-06) for obsolete skills and workarounds. 

+ Your code fails when unrecognized properties are returned in an API response. As a best practice, your application should ignore properties that it doesn't understand.

+ Your code persists API requests and tries to resend them to the new API version. For example, this might happen if your application persists continuation tokens returned from the Search API (for more information, look for `@search.nextPageParameters` in the [Search API Reference](/rest/api/searchservice/Search-Documents)).

## Breaking change for client code that reads connection information

Effective March 29, 2024 and applicable to all [supported REST APIs](/rest/api/searchservice/search-service-api-versions): 

+ [GET Skillset](/rest/api/searchservice/skillsets/get), [GET Index](/rest/api/searchservice/indexes/get), and [GET Indexer](/rest/api/searchservice/indexers/get) no longer return keys or connection properties in a response. This is a breaking change if you have downstream code that reads keys or connections (sensitive data) from a GET response.

+ If you need to retrieve admin or query API keys for your search service, use the [Management REST APIs](search-security-api-keys.md?tabs=rest-find#find-existing-keys).

+ If you need to retrieve connection strings of another Azure resource such as Azure Storage or Azure Cosmos DB, use the APIs of that resource and published guidance to obtain the information.

## Breaking change for semantic ranking

[Semantic ranking](semantic-search-overview.md) is generally available in `2023-11-01`. Here are the breaking changes for semantic ranking from earlier releases:

+ In all versions after `2020-06-01-preview`: `semanticConfiguration` replaces `searchFields` as the mechanism for specifying which fields to use for L2 ranking.

+ For all API versions, updates on July 14, 2023 to the Microsoft-hosted semantic models made semantic ranking language-agnostic, effectively decommissioning the `queryLanguage` property. There's no "breaking change" in code, but the property is ignored.

See [Migrate from preview version](semantic-how-to-configure.md#migrate-from-preview-versions) to transition your code to use `semanticConfiguration`.

## Upgrade to 2024-05-01-preview

[`2024-05-01-preview`](/rest/api/searchservice/search-service-api-versions#2024-05-01-preview) adds OneLake index, support for binary vectors, and support for more embedding models. 

If you're upgrading from `2024-03-01-preview`, the AzureOpenAIEmbedding skill now requires a model name and dimensions property.

1. Search your codebase for [AzureOpenAIEmbedding](cognitive-search-skill-azure-openai-embedding.md) references.

1. Set `modelName` to "text-embedding-ada-002" and set `dimensions` to "1536".

## Upgrade to 2024-03-01-preview

[`2024-03-01-preview`](/rest/api/searchservice/search-service-api-versions#2024-03-01-preview) adds narrow data types, scalar quantization, and vector storage options. 

If you're upgrading from `2023-10-01-preview`, there are no breaking changes. However, there's one behavior difference: for `2023-11-01` and newer previews, the `vectorFilterMode` default changed from postfilter to prefilter for [filter expressions](vector-search-filters.md).

1. Search your codebase for `vectorFilterMode` references.

1. If the property is explicitly set, no action is required. If you used the default, be aware that the new default behavior is to filter before query execution. If you want post-query filtering, explicitly set `vectorFilterMode` to postfilter to retain the old behavior. 

## Upgrade to 2023-10-01-preview

[`2023-10-01-preview`](/rest/api/searchservice/search-service-api-versions#2023-10-01-preview) was the first preview version to add [built-in data chunking and vectorization during indexing](vector-search-integrated-vectorization.md) and [built-in query vectorization](vector-search-how-to-configure-vectorizer.md). It also supports vector indexing and queries from the previous version.

If you're upgrading from the previous version, the next section has the steps. 

## Upgrade from 2023-07-01-preview

`2023-07-01-preview` is now deprecated, so you shouldn't upgrade *to* this version under any circumstances. This section explains the migration path from `2023-07-01-preview` to any newer API version. There are multiple breaking changes from `2023-07-01-preview` to any newer version.

### Portal upgrade for vector indexes

Azure portal supports a one-click upgrade path for `2023-07-01-preview` indexes. It detects vector fields and provides a **Migrate** button. 

+ Migration path is from `2023-07-01-preview` to `2024-05-01-preview`.
+ Updates are limited to vector field definitions and vector search algorithm configurations.
+ Updates are one-way. You can't reverse the upgrade. Once the index is upgraded, you must use `2024-05-01-preview` or later to query the index.

There's no portal migration for upgrading vector query syntax. See [code upgrades](#code-upgrade-for-vector-indexes-and-queries) for query syntax changes.

Before selecting **Migrate**, select **Edit JSON** to review the updated schema first. You should find a schema that conforms to the changes described in the [code upgrade](#code-upgrade-for-vector-indexes-and-queries) section. Portal migration only handles indexes with one vector search algorithm configuration. It creates a default profile that maps to the `2023-07-01-preview` vector search algorithm. Indexes with multiple vector search configurations require manual migration.

### Code upgrade for vector indexes and queries

[Vector search](vector-search-overview.md) support was introduced in [Create or Update Index (2023-07-01-preview)](/rest/api/searchservice/preview-api/create-or-update-index). 

Upgrading from `2023-07-01-preview` to any newer stable or preview version requires:

+ Renaming and restructuring the vector configuration in the index
+ Rewriting your vector queries

Use the instructions in this section to migrate vector fields, configuration, and queries from `2023-07-01-preview`.

1. Call [Get Index](/rest/api/searchservice/indexes/get?view=rest-searchservice-2023-11-01&tabs=HTTP&preserve-view=true) to retrieve the existing definition.

1. Modify the vector search configuration. `2023-11-01` and later versions introduce the concept of *vector profiles* that bundle vector-related configurations under one name. Newer versions also rename `algorithmConfigurations` to `algorithms`.

   + Rename `algorithmConfigurations` to `algorithms`. This is only a renaming of the array. The contents are backwards compatible. This means your existing HNSW configuration parameters can be used.

   + Add `profiles`, giving a name and an algorithm configuration for each one.

    **Before migration (2023-07-01-preview)**:

    ```http
      "vectorSearch": {
        "algorithmConfigurations": [
            {
                "name": "myHnswConfig",
                "kind": "hnsw",
                "hnswParameters": {
                    "m": 4,
                    "efConstruction": 400,
                    "efSearch": 500,
                    "metric": "cosine"
                }
            }
        ]}
    ```

    **After migration (2023-11-01)**:

    ```http
      "vectorSearch": {
        "algorithms": [
          {
            "name": "myHnswConfig",
            "kind": "hnsw",
            "hnswParameters": {
              "m": 4,
              "efConstruction": 400,
              "efSearch": 500,
              "metric": "cosine"
            }
          }
        ],
        "profiles": [
          {
            "name": "myHnswProfile",
            "algorithm": "myHnswConfig"
          }
        ]
      }
    ```

1. Modify vector field definitions, replacing `vectorSearchConfiguration` with `vectorSearchProfile`. Make sure the profile name resolves to a new vector profile definition, and not the algorithm configuration name. Other vector field properties remain unchanged. For example, they can't be filterable, sortable, or facetable, nor use analyzers or normalizers or synonym maps.

    **Before (2023-07-01-preview)**:

    ```http
      {
          "name": "contentVector",
          "type": "Collection(Edm.Single)",
          "key": false,
          "searchable": true,
          "retrievable": true,
          "filterable": false,  
          "sortable": false,  
          "facetable": false,
          "analyzer": "",
          "searchAnalyzer": "",
          "indexAnalyzer": "",
          "normalizer": "",
          "synonymMaps": "", 
          "dimensions": 1536,
          "vectorSearchConfiguration": "myHnswConfig"
      }
    ```

    **After (2023-11-01)**:

    ```http
      {
        "name": "contentVector",
        "type": "Collection(Edm.Single)",
        "searchable": true,
        "retrievable": true,
        "filterable": false,  
        "sortable": false,  
        "facetable": false,
        "analyzer": "",
        "searchAnalyzer": "",
        "indexAnalyzer": "",
        "normalizer": "",
        "synonymMaps": "", 
        "dimensions": 1536,
        "vectorSearchProfile": "myHnswProfile"
      }
    ```

1. Call [Create or Update Index](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-11-01&tabs=HTTP&preserve-view=true) to post the changes. 

1. Modify [Search POST](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-11-01&tabs=HTTP&preserve-view=true) to change the query syntax. This API change enables support for polymorphic vector query types.

   + Rename `vectors` to `vectorQueries`.
   + For each vector query, add `kind`, setting it to `vector`.
   + For each vector query, rename `value` to `vector`.
   + Optionally, add `vectorFilterMode` if you're using [filter expressions](vector-search-filters.md). The default is  prefilter for indexes created after `2023-10-01`. Indexes created before that date only support postfilter, regardless of how you set the filter mode. 

    **Before (2023-07-01-preview)**:

    ```http
    {
        "search": (this parameter is ignored in vector search),
        "vectors": [
          {
            "value": [
                0.103,
                0.0712,
                0.0852,
                0.1547,
                0.1183
            ],
            "fields": "contentVector",
            "k": 5
          }
        ],
        "select": "title, content, category"
    }
    ```

    **After (2023-11-01)**:

    ```http
    {
      "search": "(this parameter is ignored in vector search)",
      "vectorQueries": [
        {
          "kind": "vector",
          "vector": [
            0.103,
            0.0712,
            0.0852,
            0.1547,
            0.1183
          ],
          "fields": "contentVector",
          "k": 5
        }
      ],
      "vectorFilterMode": "preFilter",
      "select": "title, content, category"
    }
    ```

These steps complete the migration to `2023-11-01` stable API version or newer preview API versions.

## Upgrade to 2020-06-30

In this version, there's one breaking change and several behavioral differences. Generally available features include:

+ [Knowledge store](knowledge-store-concept-intro.md), persistent storage of enriched content created through skillsets, created for downstream analysis and processing through other applications. A knowledge store is created through Azure AI Search REST APIs but it resides in Azure Storage. 

### Breaking change

Code written against earlier API versions breaks on `2020-06-30` and later if code contains the following functionality:

+ Any `Edm.Date` literals (a date composed of year-month-day, such as `2020-12-12`) in filter expressions must follow the `Edm.DateTimeOffset` format: `2020-12-12T00:00:00Z`. This change was necessary to handle erroneous or unexpected query results due to timezone differences.

### Behavior changes

+ [BM25 ranking algorithm](index-ranking-similarity.md) replaces the previous ranking algorithm with newer technology. Services created after 2019 use this algorithm automatically. For older services, you must set parameters to use the new algorithm.  

+ Ordered results for null values have changed in this version, with null values appearing first if the sort is `asc` and last if the sort is `desc`. If you wrote code to handle how null values are sorted, be aware of this change.

## Upgrade to 2019-05-06

Features that became generally available in this API version include:

+ [Autocomplete](index-add-suggesters.md) is a typeahead feature that completes a partially specified term input.
+ [Complex types](search-howto-complex-data-types.md) provides native support for structured object data in search index.
+ [JsonLines parsing modes](search-howto-index-json-blobs.md), part of Azure Blob indexing, creates one search document per JSON entity that is separated by a newline.
+ [AI enrichment](cognitive-search-concept-intro.md) provides indexing that uses the AI enrichment engines of Azure AI services.

### Breaking changes

Code written against an earlier API version breaks on `2019-05-06` and later if it contains the following functionality:

1. Type property for Azure Cosmos DB. For indexers targeting an [Azure Cosmos DB for NoSQL API](search-howto-index-cosmosdb.md) data source, change `"type": "documentdb"` to `"type": "cosmosdb"`.

1. If your indexer error handling includes references to the `status` property, you should remove it. We removed status from the error response because it wasn't providing useful information.

1. Data source connection strings are no longer returned in the response. From API versions `2019-05-06` and `2019-05-06-Preview` onwards, the data source API no longer returns connection strings in the response of any REST operation. In previous API versions, for data sources created using POST, Azure AI Search returned **201** followed by the OData response, which contained the connection string in plain text.

1. Named Entity Recognition cognitive skill is retired. If you called the [Name Entity Recognition](cognitive-search-skill-named-entity-recognition.md) skill in your code, the call fails. Replacement functionality is [Entity Recognition Skill (V3)](cognitive-search-skill-entity-recognition-v3.md). Follow the recommendations in [Deprecated skills](cognitive-search-skill-deprecated.md) to migrate to a supported skill.

### Upgrading complex types

API version `2019-05-06` added formal support for complex types. If your code implemented previous recommendations for complex type equivalency in 2017-11-11-Preview or 2016-09-01-Preview, there are some new and changed limits starting in version `2019-05-06` of which you need to be aware:

+ The limits on the depth of subfields and the number of complex collections per index have been lowered. If you created indexes that exceed these limits using the preview api-versions, any attempt to update or recreate them using API version `2019-05-06` will fail. If you find yourself in this situation, you need to redesign your schema to fit within the new limits and then rebuild your index.

+ There's a new limit starting in api-version `2019-05-06` on the number of elements of complex collections per document. If you created indexes with documents that exceed these limits using the preview api-versions, any attempt to reindex that data using api-version `2019-05-06` fails. If you find yourself in this situation, you need to reduce the number of complex collection elements per document before reindexing your data.

For more information, see [Service limits for Azure AI Search](search-limits-quotas-capacity.md).

#### How to upgrade an old complex type structure

If your code is using complex types with one of the older preview API versions, you might be using an index definition format that looks like this:

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

A newer tree-like format for defining index fields was introduced in API version `2017-11-11-Preview`. In the new format, each complex field has a fields collection where its subfields are defined. In API version 2019-05-06, this new format is used exclusively and attempting to create or update an index using the old format will fail. If you have indexes created using the old format, you'll need to use API version `2017-11-11-Preview` to update them to the new format before they can be managed using API version 2019-05-06.

You can update flat indexes to the new format with the following steps using API version `2017-11-11-Preview`:

1. Perform a GET request to retrieve your index. If it’s already in the new format, you’re done.

1. Translate the index from the flat format to the new format. You have to write code for this task since there's no sample code available at the time of this writing.

1. Perform a PUT request to update the index to the new format. Avoid changing any other details of the index, such as the searchability/filterability of fields, because changes that affect the physical expression of existing index isn't allowed by the Update Index API.

> [!NOTE]
> It is not possible to manage indexes created with the old "flat" format from the Azure portal. Please upgrade your indexes from the “flat” representation to the “tree” representation at your earliest convenience.

## Next steps

Review the Search REST API reference documentation. If you encounter problems, ask us for help on [Stack Overflow](https://stackoverflow.com/) or [contact support](https://azure.microsoft.com/support/community/?product=search).

> [!div class="nextstepaction"]
> [Search service REST API Reference](/rest/api/searchservice/)
