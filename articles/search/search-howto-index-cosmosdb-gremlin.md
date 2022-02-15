---
title: title: Azure Cosmos DB Gremlin indexer
titleSuffix: Azure Cognitive Search
description: Set up an Azure Cosmos DB indexer to automate indexing of Gremlin API content for full text search in Azure Cognitive Search. This article explains how index data using the Gremlin API protocol.

author: gmndrg
ms.author: gimondra
manager: nitinme

ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/14/2022
---

# Index data from Azure Cosmos DB using the Gremlin API

> [!IMPORTANT]
> The Gremlin API indexer is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). [Sign up for the preview](https://aka.ms/azure-cognitive-search/indexer-preview). After access is enabled, use a [preview REST API](search-api-preview.md) (2020-06-30-preview or later) to index your data. There is currently limited portal support, and no .NET SDK support.

This article shows you how to configure an Azure Cosmos DB indexer to extract content and make it searchable in Azure Cognitive Search. This workflow creates a search index on Azure Cognitive Search and loads it with existing content extracted from Azure Cosmos DB using the [Gremlin API](../cosmos-db/choose-api.md#gremlin-api).

Because terminology can be confusing, it's worth noting that [Azure Cosmos DB indexing](../cosmos-db/index-overview.md) and [Azure Cognitive Search indexing](search-what-is-an-index.md) are different operations. Indexing in Cognitive Search creates and loads a search index on your search service.

By default the Azure Cognitive Search Cosmos DB Gremlin API indexer will make every vertex in your graph a document in the index. Edges will be ignored. Alternatively, you could set the query to only index the edges.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information specific to Cosmos DB. It uses the REST APIs to demonstrate a three-part workflow common to all indexers: create a data source, create an index, create an indexer. Data extraction occurs when you submit the Create Indexer request.

## Prerequisites

+ An [Azure Cosmos DB account, database, container and items](../cosmos-db/sql/create-cosmosdb-resources-portal.md). We recommend using the same region or location for both Azure Cognitive Search and Azure Cosmos DB for lower latency and to avoid bandwidth charges.

+ An [indexing policy](../cosmos-db/index-policy.md) on the Cosmos DB collection set to [Consistent](../cosmos-db/index-policy.md#indexing-mode). Indexing collections with a Lazy indexing policy isn't recommended and may result in missing data. Collections with indexing disabled aren't supported.

+ In Azure Cognitive Search, use either the [Import data wizard](search-import-data-portal.md) or the [preview REST API version](search-api-preview.md) 2020-06-30-Preview or 2021-04-30-Preview to index using Gremlin. Currently, there is no SDK support.

## Define the data source

The data source definition specifies the data to index, credentials, and policies for identifying changes in the data. A data source is defined as an independent resource so that it can be used by multiple indexers.

1. [Create or update a data source](/rest/api/searchservice/preview-api/create-or-update-data-source) to set its definition: 

   ```http
    POST https://[service name].search.windows.net/datasources?api-version=2021-04-30-Preview
    Content-Type: application/json
    api-key: [Search service admin key]
    
    {
        "name": "mycosmosdbgremlindatasource",
        "type": "cosmosdb",
        "credentials": {
            "connectionString": "AccountEndpoint=https://myCosmosDbEndpoint.documents.azure.com;AccountKey=myCosmosDbAuthKey;ApiKind=Gremlin;Database=myCosmosDbDatabaseId"
        },
        "container": { "name": "myGraphId", "query": null }
    }
   ```

1. Set "type" to `"cosmosdb"` (required).

1. Set "credentials" must include an AccountEndpoint, AccountKey, ApiKind, and Database. The "ApiKind" is "Gremlin". The AccountEndpoint must use the `*.documents.azure.com` endpoint.

1. Set "container" to the collection. The "name" property is required and it specifies the ID of the graph. The "query" property is optional. The query default is `g.V()`. To index the edges, set the query to `g.E()`.

1. [Set "dataChangeDetectionPolicy"](#DataChangeDetectionPolicy) if data is volatile and you want the indexer to pick up just the new and updated items on subsequent runs. Incremental progress will be enabled by default using `_ts` as the high water mark column.

1. [Set "dataDeletionDetectionPolicy"](#DataDeletionDetectionPolicy) if you want to remove search documents from a search index when the source item is deleted.

## Add search fields to an index

In a [search index](search-what-is-an-index.md), add fields to accept the source JSON documents or the output of your custom query projection. Ensure that the search index schema is compatible with your graph. For content in Cosmos DB, your search index schema should correspond to the [Azure Cosmos DB items](../cosmos-db/account-databases-containers-items.md#azure-cosmos-items) in your data source.

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store data:

   ```http
    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [Search service admin key]
    {
       "name": "mysearchindex",
       "fields": [
        {
            "name": "rid",
            "type": "Edm.String",
            "facetable": false,
            "filterable": false,
            "key": true,
            "retrievable": true,
            "searchable": true,
            "sortable": false,
            "analyzer": "standard.lucene",
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "synonymMaps": [],
            "fields": []
        },{
            "name": "id",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "retrievable": true,
            "sortable": false,
            "facetable": false,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": "standard.lucene",
            "synonymMaps": []
        }, {
            "name": "label",
            "type": "Edm.String",
            "searchable": true,
            "filterable": false,
            "retrievable": true,
            "sortable": false,
            "facetable": false,
            "key": false,
            "indexAnalyzer": null,
            "searchAnalyzer": null,
            "analyzer": "standard.lucene",
            "synonymMaps": []
       }]
     }
   ```

1. Create a document key field ("key": true). For partitioned collections, the default document key is Azure Cosmos DB's `_rid` property, which Azure Cognitive Search automatically renames to `rid` because field names can’t start with an underscore character. Also, Azure Cosmos DB `_rid` values contain characters that are invalid in Azure Cognitive Search keys. For this reason, the `_rid` values are Base64 encoded. 

### Mapping between JSON Data Types and Azure Cognitive Search Data Types

| JSON data type | Compatible target index field types |
| --- | --- |
| Bool |Edm.Boolean, Edm.String |
| Numbers that look like integers |Edm.Int32, Edm.Int64, Edm.String |
| Numbers that look like floating-points |Edm.Double, Edm.String |
| String |Edm.String |
| Arrays of primitive types, such as ["a", "b", "c"] |Collection(Edm.String) |
| Strings that look like dates |Edm.DateTimeOffset, Edm.String |
| GeoJSON objects, such as { "type": "Point", "coordinates": [long, lat] } |Edm.GeographyPoint |
| Other JSON objects |N/A |

## Configure and run the Cosmos DB indexer

Indexer configuration specifies the inputs, parameters, and properties controlling run time behaviors. The "configuration" section determines what content gets indexed.

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) to use the predefined data source and search index.

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]
    
    {
      "name": "mycosmosdbgremlinindexer",
      "description": "My Cosmos DB Gremlin API indexer",
      "dataSourceName": "mycosmosdbgremlindatasource",
      "targetIndexName": "mysearchindex"
    }
    ```

1. [Specify field mappings](search-indexer-field-mappings.md) if there are differences in field name or type, or if you need multiple versions of a source field in the search index.

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties.

<a name="DataDeletionDetectionPolicy"></a>

## Indexing deleted documents

When graph data is deleted, you might want to delete its corresponding document from the search index as well. The purpose of a data deletion detection policy is to efficiently identify deleted data items and delete the full document from the index. The data deletion detection policy isn't meant to delete partial document information. Currently, the only supported policy is the `Soft Delete` policy (deletion is marked with a flag of some sort), which is specified as follows:

```http
  {
      "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
      "softDeleteColumnName" : "the property that specifies whether a document was deleted",
      "softDeleteMarkerValue" : "the value that identifies a document as deleted"
  }
```

The following example creates a data source with a soft-deletion policy:

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [Search service admin key]

{
    "name": "mycosmosdbgremlindatasource",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "AccountEndpoint=https://myCosmosDbEndpoint.documents.azure.com;AccountKey=myCosmosDbAuthKey;ApiKind=Gremlin;Database=myCosmosDbDatabaseId"
    },
    "container": { "name": "myCollection" },
    "dataChangeDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName": "`_ts`"
    },
    "dataDeletionDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
        "softDeleteColumnName": "isDeleted",
        "softDeleteMarkerValue": "true"
    }
}
```

<a name="MappingGraphData"></a>

## Mapping graph data to a search index

The Cosmos DB Gremlin API indexer will automatically map a couple pieces of graph data for you:

1. The indexer will map `_rid` to an `rid` field in the index if it exists, and Base64 encode it.

1. The indexer will map `_id` to an `id` field in the index if it exists.

1. When querying your Cosmos DB database using the Gremlin API you may notice that the JSON output for each property has an `id` and a `value`. Azure Cognitive Search Cosmos DB indexer will automatically map the properties `value` into a field in your search index that has the same name as the property if it exists. In the following example, 450 would be mapped to a `pages` field in the search index.

```http
    {
        "id": "Cookbook",
        "label": "book",
        "type": "vertex",
        "properties": {
          "pages": [
            {
              "id": "48cf6285-a145-42c8-a0aa-d39079277b71",
              "value": "450"
            }
          ]
        }
    }
```

You may find that you need to use [Output Field Mappings](cognitive-search-output-field-mapping.md) in order to map your query output to the fields in your index. You'll likely want to use Output Field Mappings instead of [Field Mappings](search-indexer-field-mappings.md) since the custom query will likely have complex data.

For example, let's say that your query produces this output:

```json
    [
      {
        "vertex": {
          "id": "Cookbook",
          "label": "book",
          "type": "vertex",
          "properties": {
            "pages": [
              {
                "id": "48cf6085-a211-42d8-a8ea-d38642987a71",
                "value": "450"
              }
            ],
          }
        },
        "written_by": [
          {
            "yearStarted": "2017"
          }
        ]
      }
    ]
```

If you would like to map the value of `pages` in the JSON above to a `totalpages` field in your index, you can add the following [Output Field Mapping](cognitive-search-output-field-mapping.md) to your indexer definition:

```json
    ... // rest of indexer definition 
    "outputFieldMappings": [
        {
          "sourceFieldName": "/document/vertex/pages",
          "targetFieldName": "totalpages"
        }
    ]
```

Notice how the Output Field Mapping starts with `/document` and does not include a reference to the properties key in the JSON. This is because the indexer puts each document under the `/document` node when ingesting the graph data and the indexer also automatically allows you to reference the value of `pages` by simple referencing `pages` instead of having to reference the first object in the array of `pages`.

## Next steps

+ To learn more about Azure Cosmos DB Gremlin API, see the [Introduction to Azure Cosmos DB: Gremlin API](../cosmos-db/graph-introduction.md).

+ For more information about Azure Cognitive Search scenarios and pricing, see the [Search service page on azure.microsoft.com](https://azure.microsoft.com/services/search/).