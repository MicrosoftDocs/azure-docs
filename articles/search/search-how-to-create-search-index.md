---
title: Create a search index
titleSuffix: Azure Cognitive Search
description: Create a search index using the Azure portal, REST APIs, or an Azure SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/12/2021
---

# Create a search index in Azure Cognitive Search

Queries in Azure Cognitive Search target searchable text in a search index. In this article, learn the steps for defining and publishing a search index using any of the modalities supported by Azure Cognitive Search. 

Unless you are using an [indexer](search-howto-create-indexers.md), creating an index and populating an index are two separate tasks. For non-indexer scenarios, your next step after index creation will be [data import](search-what-is-data-import.md). 

To learn more about index-related concepts, see [Search indexes in Azure Cognitive Search](search-what-is-an-index.md).

## Prerequisites

Write permissions are required for creating and loading indexes, granted through an [admin API key](search-security-api-keys.md) on the request. Alternatively, if you're participating in the Azure Active Directory [role-based access control public preview](search-security-rbac.md), you can issue your request as a member of the Search Contributor role.

Index creation is largely a schema definition exercise. Before creating one, you should have:

+ A clear idea of which fields you want to make searchable, retrievable, filterable, facetable, and sortable in your index (more about this is discussed in [schema checklist](#schema-checklist)).

+ A unique identifier in source data that can be used as the document key (or ID) in the index.

+ A stable index location. Moving an existing index to a different search service is not supported out-of-the-box. Revisit application requirements and make sure the existing search service, its capacity and location, are sufficient for your needs.

Finally, all service tiers have [index limits](search-limits-quotas-capacity.md#index-limits) on the number of objects that you can create. For example, if you are experimenting on the Free tier, you can only have 3 indexes at any given time. Within the index itself, there are limits on the number of complex fields and collections.

## Allowed updates

[**Create Index**](/rest/api/searchservice/create-index) is an operation that creates the physical data structures (files and inverted indices) on your search service. Once the index is created, your ability to effect changes using [**Update Index**](/rest/api/searchservice/update-index) is contingent upon whether your modifications invalidate those physical structures. Most field attributes can't be changed once the field is created in your index.

To minimize churn in the design process, the following table describes which elements are fixed and flexible in the schema. Changing a fixed element requires an index rebuild, whereas flexible elements can be changed at any time without impacting the physical implementation. 

| Element | Can be updated? |
|---------|-----------------|
| Name | No |
| Key | No |
| Field names and types | No |
| Field attributes (searchable, filterable, facetable, sortable) | No |
| Field attribute (retrievable) | Yes |
| [Analyzer](search-analyzers.md) | You can add and modify custom analyzers in the index. Regarding analyzer assignments on string fields, you can only modify "searchAnalyzer". All other assignments and modifications require a rebuild. |
| [Scoring profiles](index-add-scoring-profiles.md) | Yes |
| [Suggesters](index-add-suggesters.md) | No |
| [cross-origin remote scripting (CORS)](#corsoptions) | Yes |
| [Encryption](search-security-manage-encryption-keys.md) | Yes |

> [!NOTE]
> [Synonym maps](search-synonyms.md) are not part of an index definition. Modifications to a synonym map have no impact on the physical search index.

## Schema checklist

Use this checklist to help drive the design decisions for your search index.

1. Review [naming conventions](/rest/api/searchservice/naming-rules) so that index and field names conform to the naming rules.

1. Review [supported data types](/rest/api/searchservice/supported-data-types). The data type will impact how the field is used. For example, numeric content is filterable but not full text searchable. The most common data type is `Edm.String` for searchable text, which is tokenized and queried using the full text search engine.

1. Identify one field in the source data that contains unique values, allowing it to function as the key field in your index. For example, if you're indexing from Blob Storage, the storage path is often used as the document key. 

   Every index requires one field that serves as the *document key* (sometimes referred to as the "document ID"). The key will be a string in the search index, but you can map it to any unique identifier in your source data. The ability to uniquely identify specific search documents is required for reconstituting a record or entity in a search result, for retrieving a specific document in the search index, and for selective data processing at the per-document level.

1. Identify the fields in your data source that will contribute searchable content in the index. Searchable content includes short or long strings that are queried using the full text search engine. If the content is verbose (small phrases or bigger chunks), experiment with different analyzers to see how the text is tokenized.

   [Field attribute assignments](search-what-is-an-index.md#index-attributes) will determine both search behaviors and the physical representation of your index on the search service. Determining how fields should be specified is an iterative process for many customers. To speed up iterations, start with sample data so that you can drop and rebuild easily.

1. Identify which source fields can be used as filters. Numeric content and short text fields, particularly those with repeating values, are good choices. When working with filters, remember:

   + Filterable fields can optionally be used in faceted navigation.

   + Filterable fields are returned in arbitrary order, so consider making them sortable as well.

## Formulate a request

When you're ready to create the index, there are several ways to move forward. We recommend the Azure portal or REST APIs for early development and proof-of-concept testing.

During development, plan on frequent rebuilds. Because physical structures are created in the service, [dropping and re-creating indexes](search-howto-reindex.md) is necessary for many modifications. You might consider working with a subset of your data to make rebuilds go faster.

### [**Azure portal**](#tab/index-portal)

Index design through the portal enforces requirements and schema rules for specific data types, such as disallowing full text search capabilities on numeric fields. In the portal, there are two options for creating a search index: 

+ **Add index** is an embedded editor for specifying an index schema
+ [**Import data**](search-import-data-portal.md) is a wizard

The wizard packs in additional operations by also creating an indexer, data source, and loading data. If this is more than what you want, you should just use **Add index** or another approach.

The following screenshot shows where you can find **Add index** and **Import data** on the command bar. After an index is created, you can find it again in the **Indexes** tab.

  :::image type="content" source="media/search-what-is-an-index/add-index.png" alt-text="Add index command" border="true":::

> [!Tip]
> After creating an index in the portal, you can copy the JSON representation and add it to your application code.

### [**REST**](#tab/index-rest)

[**Create Index (REST)**](/rest/api/searchservice/create-index) is used to create an index. Both Postman and Visual Studio Code (with an extension for Azure Cognitive Search) can function as a search index client. Using either tool, you can connect to your search service and send requests:

+ [Create a search index using REST and Postman](search-get-started-rest.md)
+ [Get started with Visual Studio Code and Azure Cognitive Search](search-get-started-vs-code.md)

The REST API provides defaults for field attribution. For example, all Edm.String fields are searchable by default. Attributes are shown in full below for illustrative purposes, but you can omit attribution in cases where the default values apply.

Refer to the [Index operations (REST)](/rest/api/searchservice/index-operations) for help with formulating index requests.

```json
POST https://[servicename].search.windows.net/indexes?api-version=[api-version] 
{
  "name": "hotels",
  "fields": [
    { "name": "HotelId", "type": "Edm.String", "key": true, "retrievable": true, "searchable": true, "filterable": true },
    { "name": "HotelName", "type": "Edm.String", "retrievable": true, "searchable": true, "filterable": false, "sortable": true, "facetable": false },
    { "name": "Description", "type": "Edm.String", "retrievable": true, "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "en.microsoft" },
    { "name": "Description_fr", "type": "Edm.String", "retrievable": true, "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.microsoft" },
    { "name": "Address", "type": "Edm.ComplexType", 
      "fields": [
          { "name": "StreetAddress", "type": "Edm.String", "retrievable": true, "filterable": false, "sortable": false, "facetable": false, "searchable": true },
          { "name": "City", "type": "Edm.String", "retrievable": true, "searchable": true, "filterable": true, "sortable": true, "facetable": true },
          { "name": "StateProvince", "type": "Edm.String", "retrievable": true, "searchable": true, "filterable": true, "sortable": true, "facetable": true }
        ]
    }
  ],
  "suggesters": [ ],
  "scoringProfiles": [ ],
  "analyzers":(optional)[ ... ]
  }
}
```

### [**.NET SDK**](#tab/index-csharp)

The Azure SDK for .NET has [**SearchIndexClient**](/dotnet/api/azure.search.documents.indexes.searchindexclient) with methods for creating and updating indexes.

```csharp
// Create the index
string indexName = "hotels";
SearchIndex index = new SearchIndex(indexName)
{
    Fields =
    {
        new SimpleField("hotelId", SearchFieldDataType.String) { IsKey = true, IsFilterable = true, IsSortable = true },
        new SearchableField("hotelName") { IsFilterable = true, IsSortable = true },
        new SearchableField("description") { AnalyzerName = LexicalAnalyzerName.EnLucene },
        new SearchableField("descriptionFr") { AnalyzerName = LexicalAnalyzerName.FrLucene }
        new ComplexField("address")
        {
            Fields =
            {
                new SearchableField("streetAddress"),
                new SearchableField("city") { IsFilterable = true, IsSortable = true, IsFacetable = true },
                new SearchableField("stateProvince") { IsFilterable = true, IsSortable = true, IsFacetable = true },
                new SearchableField("country") { SynonymMapNames = new[] { synonymMapName }, IsFilterable = true, IsSortable = true, IsFacetable = true },
                new SearchableField("postalCode") { IsFilterable = true, IsSortable = true, IsFacetable = true }
            }
        }
    }
};

await indexClient.CreateIndexAsync(index);
```

For more examples, see[azure-search-dotnet-samples/quickstart/v11/](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11).

### [**Other SDKs**](#tab/index-other-sdks)

For Cognitive Search, the Azure SDKs implement generally available features. As such, you can use any of the SDKs to create a search index. All of them provide a **SearchIndexClient** that has methods for creating and updating indexes.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| Java | [SearchIndexClient](/java/api/com.azure.search.documents.indexes.searchindexclient) | [CreateIndexExample.java](https://github.com/Azure/azure-sdk-for-java/blob/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java) |
| JavaScript | [SearchIndexClient](/javascript/api/@azure/search-documents/searchindexclient) | [Indexes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/search/search-documents/samples/v11/javascript) |
| Python | [SearchIndexClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexclient) | [sample_index_crud_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/7cd31ac01fed9c790cec71de438af9c45cb45821/sdk/search/azure-search-documents/samples/sample_index_crud_operations.py) |

---

<a name="corsoptions"></a>

## Set `corsOptions` for cross-origin queries

Index schemas include a section for setting `corsOptions`. Client-side JavaScript cannot call any APIs by default since the browser will prevent all cross-origin requests. To allow cross-origin queries to your index, enable CORS (Cross-Origin Resource Sharing) by setting the **corsOptions** attribute. For security reasons, only [query APIs](search-query-create.md#choose-query-methods) support CORS.

```json
"corsOptions": {
  "allowedOrigins": [
    "*"
  ],
  "maxAgeInSeconds": 300
```

The following properties can be set for CORS:

+ **allowedOrigins** (required): This is a list of origins that will be granted access to your index. This means that any JavaScript code served from those origins will be allowed to query your index (assuming it provides the correct api-key). Each origin is typically of the form `protocol://<fully-qualified-domain-name>:<port>` although `<port>` is often omitted. See [Cross-origin resource sharing (Wikipedia)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for more details.

  If you want to allow access to all origins, include `*` as a single item in the **allowedOrigins** array. *This is not a recommended practice for production search services* but it is often useful for development and debugging.

+ **maxAgeInSeconds** (optional): Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used.

## Next steps

Use the following links to become familiar with loading an index with data.

+ [Data import overview](search-what-is-data-import.md)

+ [Add, Update or Delete Documents (REST)](/rest/api/searchservice/addupdate-or-delete-documents) 