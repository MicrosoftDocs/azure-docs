---
title: Create a search index
titleSuffix: Azure Cognitive Search
description: Create a search index using the Azure portal, REST APIs, or an Azure SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/08/2021
---

# Create a search index in Azure Cognitive Search

Query requests in Azure Cognitive Search target searchable text in a search index. In this article, learn the steps for defining and publishing a search index using any of the modalities supported by Azure Cognitive Search. 

Unless you are using an [indexer](search-howto-create-indexers.md), creating an index and populating an index are separate tasks. For non-indexer scenarios, your next step after index creation will be [data import](search-what-is-data-import.md). For more background, see [Search indexes in Azure Cognitive Search](search-what-is-an-index.md).

## Prerequisites

Write permissions on the search service are required for creating and loading indexes. Most operations will require that you provide an [admin API key](search-security-api-keys.md) on the create index request. Alternatively, if you're participating in the Azure Active Directory [role-based access control public preview](search-security-rbac.md), you can issue your request as a member of the Search Contributor role.

Index creation is largely a schema definition exercise. Before creating one, you should have:

+ A clear idea of which fields you want to make searchable, retrievable, filterable, and sortable in your index.

  The attributes you assign to fields will determine its physical storage structure on the search service. During design and development, start with sample data so that you can drop and rebuild the index easily as you finalize field attribution.

+ A source field that uniquely identifies each row, record, or item in the source data. If you're indexing from Blob Storage, the storage path is often used as the document key. 

  Every index requires one field that serves as the *document key* (sometimes referred to as the "document ID"), and this key is mapped to a source field containing a unique identifier. The ability to uniquely identify specific search documents is required for retrieving a specific document in the search index, and for selective data processing by pulling the right one from source data.

+ Index location. Moving an existing index to a different search service is not supported out-of-the-box.

Finally, all service tiers have [index limits](search-limits-quotas-capacity.md#index-limits) on the number of objects that you can create. For example, if you are experimenting on the Free tier, you can only have 3 indexes at any given time. Within the index itself, there are limits on the number of complex fields and collections.

## Allowed updates

A [Create Index](/rest/api/searchservice/create-index) operation creates physical data structures (files and inverted indexes) on your search service. Your ability to update an existing index is contingent upon whether the modification invalidates those physical structures. Most field attributes can't be changed once the field is created in your index.

To minimize churn in the design process, the following table describes which elements are fixed and flexible in the schema. Changing a fixed element requires an index rebuild, whereas flexible elements can be changed at any time without impacting the physical implementation. 

| Element | Mutable |
|---------|---------|
| Name | No |
| Key | No |
| Field names and types | No |
| Field attributes (searchable, filterable, facetable, sortable) | No |
| Field attribute (retrievable) | Yes |
| [Analyzer](search-analyzers.md) | You can add and modify custom analyzers in the index. Regarding analyzer assignments on string fields, you can only modify "searchAnalyzer". All other assignments and modifications require a rebuild. |
| [Scoring profiles](index-add-scoring-profiles.md) | Yes |
| [Suggesters](index-add-suggesters.md) | No |
| [cross-origin remote scripting (CORS)](search-what-is-an-index.md#corsoptions) | Yes |
| [Encryption](search-security-manage-encryption-keys.md) | Yes |

[Synonym maps](search-synonyms.md) are not part of an index definition. Modifications to a synonym map have no impact on the physical search index.

## Schema checklist

+ Review [naming conventions](/rest/api/searchservice/naming-rules) so that index and field names conform to the naming rules.
+ Review [supported data types](/rest/api/searchservice/supported-data-types). Data type will impact how the field is used. For example, numeric content is filterable but not full text searchable.
+ Identify one field in the data source that will be used as the key field in your index.
+ Identify which source fields have searchable content. If the content is text and verbose (phrases or longer), experiment with different analyzers to see how the text is tokenized.
+ Identify which source fields can be used as filters. Numeric content and short text fields, particularly those with repeating values, are good choices. When working with filters, remember:
  + Filterable fields can optionally be used in faceted navigation. 
  + Filterable fields are returned in arbitrary order, so consider making them sortable as well.

## Formulate a request

When you are ready to create the index, there are several ways to move forward. We recommend the Azure portal or REST APIs for early development and proof-of-concept testing.

During development, plan on frequent rebuilds. Because physical structures are created in the service, [dropping and recreating indexes](search-howto-reindex.md) is necessary for most modifications. You might consider working with a subset of your data to make rebuilds go faster.

### [**Azure portal**](#tab/indexer-portal)

Index design through the portal enforces requirements and schema rules for specific data types, such as disallowing full text search capabilities on numeric fields. In the portal, there are two options for creating a search index: 

+ **Add Index** is an embedded editor for specifying an index schema
+ [**Import data**](search-import-data-portal.md) is a wizard

The wizard packs in additional operations by also creating an indexer, data source, and loading data. If this is more than what you want, you should just use **Add Index** or another approach.

The following screenshot shows where you can find **Add Index** and **Import data** on the command bar. After an index is created, you can find it again in the Indexes tab.

  :::image type="content" source="media/search-what-is-an-index/add-index.png" alt-text="Add index command" border="true":::

> [!Tip]
> After creating an index in the portal, you can copy the JSON representation and add it to your application code.

### [**REST**](#tab/kstore-rest)

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

### [**.NET SDK**](#tab/kstore-dotnet)

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

### [**Other SDKs**](#tab/other-sdks)

For Cognitive Search, the Azure SDKs implement generally available features. As such, you can use any of the SDKs to create a search index. All of them provide a **SearchIndexClient** that has methods for creating and updating indexes.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| Java | [SearchIndexClient](/java/api/com.azure.search.documents.indexes.searchindexclient) | [CreateIndexExample.java](https://github.com/Azure/azure-sdk-for-java/blob/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java) |
| JavaScript | [SearchIndexClient](/javascript/api/@azure/search-documents/searchindexclient) | [Indexes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/search/search-documents/samples/v11/javascript) |
| Python | [SearchIndexClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexclient) | [sample_index_crud_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/7cd31ac01fed9c790cec71de438af9c45cb45821/sdk/search/azure-search-documents/samples/sample_index_crud_operations.py) |

---

## Next steps

Use the following links to become familiar with loading an index with data.

+ [Data import overview](search-what-is-data-import.md)

+ [Add, Update or Delete Documents (REST)](/rest/api/searchservice/addupdate-or-delete-documents) 