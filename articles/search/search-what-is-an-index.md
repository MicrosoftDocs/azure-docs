---
title: Create an index
titleSuffix: Azure Cognitive Search
description: Introduces indexing concepts and tools in Azure Cognitive Search, including schema definitions and the physical data structure.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/05/2021
---
# Creating search indexes in Azure Cognitive Search

Cognitive Search stores searchable content used for full text and filtered queries in a *search index*. An index is defined by a schema and saved to the service, with data import following as a second step. 

Indexes contain *search documents*. Conceptually, a document is a single unit of searchable data in your index. A retailer might have a document for each product, a news organization might have a document for each article, and so forth. Mapping these concepts to more familiar database equivalents: a *search index* equates to a *table*, and *documents* are roughly equivalent to *rows* in a table.

## What's an index schema?

The physical structure of an index is determined by the schema. The 'fields' collection is typically the largest part of an index, where each field is named, assigned a [data type](/rest/api/searchservice/Supported-data-types), and attributed with allowable behaviors that determine how it is used.

```json
{
  "name": "name_of_index, unique across the service",
  "fields": [
    {
      "name": "name_of_field",
      "type": "Edm.String | Collection(Edm.String) | Edm.Int32 | Edm.Int64 | Edm.Double | Edm.Boolean | Edm.DateTimeOffset | Edm.GeographyPoint",
      "searchable": true (default where applicable) | false (only Edm.String and Collection(Edm.String) fields can be searchable),
      "filterable": true (default) | false,
      "sortable": true (default where applicable) | false (Collection(Edm.String) fields cannot be sortable),
      "facetable": true (default where applicable) | false (Edm.GeographyPoint fields cannot be facetable),
      "key": true | false (default, only Edm.String fields can be keys),
      "retrievable": true (default) | false,
      "analyzer": "name_of_analyzer_for_search_and_indexing", (only if 'searchAnalyzer' and 'indexAnalyzer' are not set)
      "searchAnalyzer": "name_of_search_analyzer", (only if 'indexAnalyzer' is set and 'analyzer' is not set)
      "indexAnalyzer": "name_of_indexing_analyzer", (only if 'searchAnalyzer' is set and 'analyzer' is not set)
      "synonymMaps": [ "name_of_synonym_map" ] (optional, only one synonym map per field is currently supported)
    }
  ],
  "suggesters": [ ],
  "scoringProfiles": [ ],
  "analyzers":(optional)[ ... ],
  "charFilters":(optional)[ ... ],
  "tokenizers":(optional)[ ... ],
  "tokenFilters":(optional)[ ... ],
  "defaultScoringProfile": (optional) "...",
  "corsOptions": (optional) { },
  "encryptionKey":(optional){ }
  }
}
```

Other elements are collapsed for brevity, but the following links can provide the detail: [suggesters](index-add-suggesters.md), [scoring profiles](index-add-scoring-profiles.md), [analyzers](search-analyzers.md) used to process strings into tokens according to linguistic rules or other characteristics supported by the analyzer, and [cross-origin remote scripting (CORS)](#corsoptions) settings.

## Choose a client

There are several ways to create a search index. We recommend the Azure portal or SDKs for early development and proof-of-concept testing.

During development, plan on frequent rebuilds. Because physical structures are created in the service, [dropping and recreating indexes](search-howto-reindex.md) is necessary for most modifications to an existing field definition. You might consider working with a subset of your data to make rebuilds go faster.

### Permissions

All operations related to a search index, including GET requests its definition, require an [admin api-key](search-security-api-keys.md) on the request.

### Limits

All [service tiers limit](search-limits-quotas-capacity.md#index-limits) the number of objects that you can create. If you are experimenting on the Free tier, you can only have 3 indexes at any given time.

### Use Azure portal to create a search index

The portal provides two options for creating a search index: [**Import data wizard**](search-import-data-portal.md) and **Add Index** that provides fields for specifying an index schema. The wizard packs in additional operations by also creating an indexer, data source, and loading data. If this is more than what you want, you should just use **Add Index** or another approach.

The following screenshot shows where you can find **Add Index** in the portal. **Import data** is right next door.

  :::image type="content" source="media/search-what-is-an-index/add-index.png" alt-text="Add index command" border="true":::

> [!Tip]
> Index design through the portal enforces requirements and schema rules for specific data types, such as disallowing full text search capabilities on numeric fields. Once you have a workable index, you can copy the JSON from the portal and add it to your solution.

### Use a REST client

Both Postman and Visual Studio Code (with an extension for Azure Cognitive Search) can function as a search index client. Using either tool, you can connect to your search service and send [Create Index (REST)](/rest/api/searchservice/create-index) requests. There are numerous tutorials and examples that demonstrate REST clients for creating objects. 

Start with either of these articles to learn about each client:

+ [Create a search index using REST and Postman](search-get-started-rest.md)
+ [Get started with Visual Studio Code and Azure Cognitive Search](search-get-started-vs-code.md)

Refer to the [Index operations (REST)](/rest/api/searchservice/index-operations) for help with formulating index requests.

### Use an SDK

For Cognitive Search, the Azure SDKs implement generally available features. As such, you can use any of the SDKs to create a search index. All of them provide a **SearchIndexClient** that has methods for creating and updating indexes.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| .NET | [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) | [azure-search-dotnet-samples/quickstart/v11/](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) |
| Java | [SearchIndexClient](/java/api/com.azure.search.documents.indexes.searchindexclient) | [CreateIndexExample.java](https://github.com/Azure/azure-sdk-for-java/blob/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java) |
| JavaScript | [SearchIndexClient](/javascript/api/@azure/search-documents/searchindexclient) | [Indexes](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/search/search-documents/samples/javascript/src/indexes) |
| Python | [SearchIndexClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexclient) | [sample_index_crud_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/7cd31ac01fed9c790cec71de438af9c45cb45821/sdk/search/azure-search-documents/samples/sample_index_crud_operations.py) |

## Define fields

A search document is defined by the `fields` collection. You will need fields for queries and keys. You will probably also need fields to support filters, facets, and sorts. You might also need fields for data that a user never sees, for example you might want fields for profit margins or marketing promotions that you can use to modify search rank.

One field of type Edm.String must be designated as the document key. It's used to uniquely identify each search document and is case-sensitive. You can retrieve a document by its key to populate a details page.

If incoming data is hierarchical in nature, assign the [complex type](search-howto-complex-data-types.md) data type to represent the nested structures. The built-in sample data set, Hotels, illustrates complex types using an Address (contains multiple sub-fields) that has a one-to-one relationship with each hotel, and a Rooms complex collection, where multiple rooms are associated with each hotel. 

Assign any analyzers to string fields before the index is created. Do the same for suggesters if you want to enable autocomplete on specific fields.

<a name="index-attributes"></a>

### Attributes

Field attributes determine how a field is used, such as whether it is used in full text search, faceted navigation, sort operations, and so forth. 

String fields are often marked as "searchable" and "retrievable". Fields used to narrow search results include "sortable", "filterable", and "facetable".

|Attribute|Description|  
|---------------|-----------------|  
|"searchable" |Full-text searchable, subject to lexical analysis such as word-breaking during indexing. If you set a searchable field to a value like "sunny day", internally it will be split into the individual tokens "sunny" and "day". For details, see [How full text search works](search-lucene-query-architecture.md).|  
|"filterable" |Referenced in $filter queries. Filterable fields of type `Edm.String` or `Collection(Edm.String)` do not undergo word-breaking, so comparisons are for exact matches only. For example, if you set such a field f to "sunny day", `$filter=f eq 'sunny'` will find no matches, but `$filter=f eq 'sunny day'` will. |  
|"sortable" |By default the system sorts results by score, but you can configure sort based on fields in the documents. Fields of type `Collection(Edm.String)` cannot be "sortable". |  
|"facetable" |Typically used in a presentation of search results that includes a hit count by category (for example, hotels in a specific city). This option cannot be used with fields of type `Edm.GeographyPoint`. Fields of type `Edm.String` that are filterable, "sortable", or "facetable" can be at most 32 kilobytes in length. For details, see [Create Index (REST API)](/rest/api/searchservice/create-index).|  
|"key" |Unique identifier for documents within the index. Exactly one field must be chosen as the key field and it must be of type `Edm.String`.|  
|"retrievable" |Determines whether the field can be returned in a search result. This is useful when you want to use a field (such as *profit margin*) as a filter, sorting, or scoring mechanism, but do not want the field to be visible to the end user. This attribute must be `true` for `key` fields.|  

Although you can add new fields at any time, existing field definitions are locked in for the lifetime of the index. For this reason, developers typically use the portal for creating simple indexes, testing ideas, or using the portal pages to look up a setting. Frequent iteration over an index design is more efficient if you follow a code-based approach so that you can rebuild the index easily.

> [!NOTE]
> The APIs you use to build an index have varying default behaviors. For the [REST APIs](/rest/api/searchservice/Create-Index), most attributes are enabled by default (for example, "searchable" and "retrievable" are true for string fields) and you often only need to set them if you want to turn them off. For the .NET SDK, the opposite is true. On any property you do not explicitly set, the default is to disable the corresponding search behavior unless you specifically enable it.

<a name="index-size"></a>

## Attributes and index size (storage implications)

The size of an index is determined by the size of the documents you upload, plus index configuration, such as whether you include suggesters, and how you set attributes on individual fields. 

The following screenshot illustrates index storage patterns resulting from various combinations of attributes. The index is based on the **real estate sample index**, which you can create easily using the Import data wizard. Although the index schemas are not shown, you can infer the attributes based on the index name. For example, *realestate-searchable* index has the "searchable" attribute selected and nothing else, *realestate-retrievable* index has the "retrievable" attribute selected and nothing else, and so forth.

![Index size based on attribute selection](./media/search-what-is-an-index/realestate-index-size.png "Index size based on attribute selection")

Although these index variants are artificial, we can refer to them for broad comparisons of how attributes affect storage. Does setting "retrievable" increase index size? No. Does adding fields to a **suggester** increase index size? Yes. 

Making a field filterable or sortable also adds to storage consumption because filtered and sorted fields are not tokenized so that character sequences can be matched verbatim.

Also not reflected in the above table is the impact of [analyzers](search-analyzers.md). If you are using the edgeNgram tokenizer to store verbatim sequences of characters (a, ab, abc, abcd), the size of the index will be larger than if you used a standard analyzer.

> [!Note]
> Storage architecture is considered an implementation detail of Azure Cognitive Search and could change without notice. There is no guarantee that current behavior will persist in the future.

<a name="corsoptions"></a>

## About `corsOptions`

Index schemas include a section for setting `corsOptions`. Client-side JavaScript cannot call any APIs by default since the browser will prevent all cross-origin requests. To allow cross-origin queries to your index, enable CORS (Cross-Origin Resource Sharing) by setting the **corsOptions** attribute. For security reasons, only query APIs support CORS. 

The following options can be set for CORS:

+ **allowedOrigins** (required): This is a list of origins that will be granted access to your index. This means that any JavaScript code served from those origins will be allowed to query your index (assuming it provides the correct api-key). Each origin is typically of the form `protocol://<fully-qualified-domain-name>:<port>` although `<port>` is often omitted. See [Cross-origin resource sharing (Wikipedia)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for more details.

  If you want to allow access to all origins, include `*` as a single item in the **allowedOrigins** array. *This is not recommended practice for production search services* but it is often useful for development and debugging.

+ **maxAgeInSeconds** (optional): Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used.

## Next steps

You can get hands on experience creating an index using almost any sample or walkthrough for Cognitive Search. For starters, you could choose any of the quickstarts from the table of contents.

But you'll also want to become familiar with methodologies for loading an index with data. Index definition and data import strategies are defined in tandem. The following articles provide more information about loading an index.

+ [Data import overview](search-what-is-data-import.md)

+ [Add, Update or Delete Documents (REST)](/rest/api/searchservice/addupdate-or-delete-documents) 