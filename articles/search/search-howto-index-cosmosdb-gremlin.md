---
title: Index data from Gremlin API (preview)
titleSuffix: Azure Cognitive Search
description: Set up an Azure Cosmos DB indexer to automate indexing of Gremlin API content for full text search in Azure Cognitive Search.

author: MarkHeff
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/11/2021
---

# Index data using Azure Cosmos DB Gremlin API

> [!IMPORTANT]
> The Cosmos DB Gremlin API indexer is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). [Request access](https://aka.ms/azure-cognitive-search/indexer-preview) to this feature, and after access is enabled, use a [preview REST API (2020-06-30-preview or later)](search-api-preview.md) to index your content. There is currently limited portal support and no .NET SDK support.

This article shows you how to configure an Azure Cosmos DB indexer to extract content and make it searchable in Azure Cognitive Search. This workflow creates a search index on Azure Cognitive Search and loads it with existing content extracted from Azure Cosmos DB using the Gremlin API.

Because terminology can be confusing, it's worth noting that [Azure Cosmos DB indexing](../cosmos-db/index-overview.md) and [Azure Cognitive Search indexing](search-what-is-an-index.md) are distinct operations, unique to each service. Before you start Azure Cognitive Search indexing, your Azure Cosmos DB database must already exist and contain data.

## Prerequisites

In order for Azure Cognitive Search to index data in Cosmos DB through the Gremlin API, [Cosmos DB's own indexing](../cosmos-db/index-overview.md) must also be enabled and set to [Consistent](../cosmos-db/index-policy.md#indexing-mode). This is the default configuration for Cosmos DB. Azure Cognitive Search indexing will not work without Cosmos DB indexing already enabled.

## Get started

You can use the [preview REST API](/rest/api/searchservice/index-preview) to index Azure Cosmos DB data that's available through the Gremlin API by following a three-part workflow common to all indexers in Azure Cognitive Search: create a data source, create an index, create an indexer. In the process below, data extraction from Cosmos DB starts when you submit the Create Indexer request.

By default the Azure Cognitive Search Cosmos DB Gremlin API indexer will make every vertex in your graph a document in the index. Edges will be ignored. Alternatively, you could set the query to only index the edges.

### Step 1 - Assemble inputs for the request

For each request, you must provide the service name and admin key for Azure Cognitive Search (in the POST header). You can use [Postman](./search-get-started-rest.md) or any REST API client to send HTTPS requests to Azure Cognitive Search.

Copy and save the following values for use in your request:

+ Azure Cognitive Search service name
+ Azure Cognitive Search admin key
+ Cosmos DB Gremlin API connection string

You can find these values in the Azure portal:

1. In the portal pages for Azure Cognitive Search, copy the search service URL from the Overview page.

2. In the left navigation pane, click **Keys** and then copy either the primary or secondary key.

3. Switch to the portal pages for your Cosmos DB account. In the left navigation pane, under **Settings**, click **Keys**. This page provides a URI, two sets of connection strings, and two sets of keys. Copy one of the connection strings to Notepad.

### Step 2 - Create a data source

A **data source** specifies the data to index, credentials, and policies for identifying changes in the data (such as modified or deleted documents inside your collection). The data source is defined as an independent resource so that it can be used by multiple indexers.

To create a data source, formulate a POST request:

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
        "container": { "name": "myGraphId", "query": null }
    }
```

The body of the request contains the data source definition, which should include the following fields:

| Field   | Description |
|---------|-------------|
| **name** | Required. Choose any name to represent your data source object. |
|**type**| Required. Must be `cosmosdb`. |
|**credentials** | Required. The **connectionString** must include an AccountEndpoint, AccountKey, ApiKind, and Database. The ApiKind is **Gremlin**.</br></br>For example:<br/>`AccountEndpoint=https://<Cosmos DB account name>.documents.azure.com;AccountKey=<Cosmos DB auth key>;Database=<Cosmos DB database id>;ApiKind=Gremlin`<br/><br/>The AccountEndpoint must use the `*.documents.azure.com` endpoint.
| **container** | Contains the following elements: <br/>**name**: Required. Specify the ID of the graph.<br/>**query**: Optional. The default is `g.V()`. To index the edges, set the query to `g.E()`. |
| **dataChangeDetectionPolicy** | Incremental progress will be enabled by default using `_ts` as the high water mark column. |
|**dataDeletionDetectionPolicy** | Optional. See [Indexing Deleted Documents](#DataDeletionDetectionPolicy) section.|

### Step 3 - Create a target search index

[Create a target Azure Cognitive Search index](/rest/api/searchservice/create-index) if you don't have one already. The following example creates an index with id, label, and description fields:

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

Ensure that the schema of your target index is compatible with your graph.

For partitioned collections, the default document key is Azure Cosmos DB's `_rid` property, which Azure Cognitive Search automatically renames to `rid` because field names cannot start with an underscore character. Also, Azure Cosmos DB `_rid` values contain characters that are invalid in Azure Cognitive Search keys. For this reason, the `_rid` values should be Base64 encoded if you would like to make it your document key.

### Mapping between JSON Data Types and Azure Cognitive Search Data Types

| JSON data type | Compatible target index field types |
| --- | --- |
| Bool |Edm.Boolean, Edm.String |
| Numbers that look like integers |Edm.Int32, Edm.Int64, Edm.String |
| Numbers that look like floating-points |Edm.Double, Edm.String |
| String |Edm.String |
| Arrays of primitive types, for example ["a", "b", "c"] |Collection(Edm.String) |
| Strings that look like dates |Edm.DateTimeOffset, Edm.String |
| GeoJSON objects, for example { "type": "Point", "coordinates": [long, lat] } |Edm.GeographyPoint |
| Other JSON objects |N/A |

### Step 4 - Configure and run the indexer

Once the index and data source have been created, you're ready to create the indexer:

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

This indexer will start running after it's created and only run once. You can add the optional schedule parameter to the request to set your indexer to run on a schedule. For more information about defining indexer schedules, see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

For more details on the Create Indexer API, check out [Create Indexer](/rest/api/searchservice/create-indexer).

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

1. The indexer will map `_rid` to an `rid` field in the index if it exists. Note that if you would like to use the `rid` value as a key in your index you should Base64 encode the key since `_rid` can contain characters that are invalid in Azure Cognitive Search document keys.

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

+ To learn more about Azure Cosmos DB Gremlin API, see the [Introduction to Azure Cosmos DB: Gremlin API]()../cosmos-db/graph-introduction.md).

+ For more information about Azure Cognitive Search scenarios and pricing, see the [Search service page on azure.microsoft.com](https://azure.microsoft.com/services/search/).