---
title: Azure Cosmos DB Gremlin indexer
titleSuffix: Azure AI Search
description: Set up an Azure Cosmos DB indexer to automate indexing of Azure Cosmos DB for Apache Gremlin content for full text search in Azure AI Search. This article explains how index data using the Azure Cosmos DB for Apache Gremlin protocol.

author: mgottein
ms.author: magottei
manager: nitinme

ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/18/2023
---

# Import data from Azure Cosmos DB for Apache Gremlin for queries in Azure AI Search

> [!IMPORTANT]
> The Azure Cosmos DB for Apache Gremlin indexer is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Currently, there is no SDK support.

In this article, learn how to configure an [**indexer**](search-indexer-overview.md) that imports content from [Azure Cosmos DB for Apache Gremlin](../cosmos-db/gremlin/introduction.md) and makes it searchable in Azure AI Search.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information that's specific to Cosmos DB. It uses the REST APIs to demonstrate a three-part workflow common to all indexers: create a data source, create an index, create an indexer. Data extraction occurs when you submit the Create Indexer request.

Because terminology can be confusing, it's worth noting that [Azure Cosmos DB indexing](../cosmos-db/index-overview.md) and [Azure AI Search indexing](search-what-is-an-index.md) are different operations. Indexing in Azure AI Search creates and loads a search index on your search service.

## Prerequisites

+ [Register for the preview](https://aka.ms/azure-cognitive-search/indexer-preview) to provide feedback and get help with any issues you encounter.

+ An [Azure Cosmos DB account, database, container, and items](../cosmos-db/sql/create-cosmosdb-resources-portal.md). Use the same region for both Azure AI Search and Azure Cosmos DB for lower latency and to avoid bandwidth charges.

+ An [automatic indexing policy](../cosmos-db/index-policy.md) on the Azure Cosmos DB collection, set to [Consistent](../cosmos-db/index-policy.md#indexing-mode). This is the default configuration. Lazy indexing isn't recommended and may result in missing data.

+ Read permissions. A "full access" connection string includes a key that grants access to the content, but if you're using Azure roles, make sure the [search service managed identity](search-howto-managed-identities-data-sources.md) has **Cosmos DB Account Reader Role** permissions.

+ A REST client, such as [Postman](search-get-started-rest.md), to send REST calls that create the data source, index, and indexer. 

## Define the data source

The data source definition specifies the data to index, credentials, and policies for identifying changes in the data. A data source is defined as an independent resource so that it can be used by multiple indexers.

For this call, specify a [preview REST API version](search-api-preview.md) (2020-06-30-Preview or 2021-04-30-Preview) to create a data source that connects via an Azure Cosmos DB for Apache Gremlin.

1. [Create or update a data source](/rest/api/searchservice/preview-api/create-or-update-data-source) to set its definition: 

   ```http
    POST https://[service name].search.windows.net/datasources?api-version=2021-04-30-Preview
    Content-Type: application/json
    api-key: [Search service admin key]
    {
      "name": "[my-cosmosdb-gremlin-ds]",
      "type": "cosmosdb",
      "credentials": {
        "connectionString": "AccountEndpoint=https://[cosmos-account-name].documents.azure.com;AccountKey=[cosmos-account-key];Database=[cosmos-database-name];ApiKind=Gremlin;"
      },
      "container": {
        "name": "[cosmos-db-collection]",
        "query": "g.V()"
      },
      "dataChangeDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName": "_ts"
      },
      "dataDeletionDetectionPolicy": null,
      "encryptionKey": null,
      "identity": null
    }
    }
   ```

1. Set "type" to `"cosmosdb"` (required).

1. Set "credentials" to a connection string.  The next section describes the supported formats.

1. Set "container" to the collection. The "name" property is required and it specifies the ID of the graph. 

   The "query" property is optional. By default the Azure AI Search indexer for Azure Cosmos DB for Apache Gremlin makes every vertex in your graph a document in the index. Edges will be ignored. The query default is `g.V()`. Alternatively, you could set the query to only index the edges. To index the edges, set the query to `g.E()`.

1. [Set "dataChangeDetectionPolicy"](#DataChangeDetectionPolicy) if data is volatile and you want the indexer to pick up just the new and updated items on subsequent runs. Incremental progress will be enabled by default using `_ts` as the high water mark column.

1. [Set "dataDeletionDetectionPolicy"](#DataDeletionDetectionPolicy) if you want to remove search documents from a search index when the source item is deleted.

### Supported credentials and connection strings

Indexers can connect to a collection using the following connections. For connections that target [Azure Cosmos DB for Apache Gremlin](../cosmos-db/graph/graph-introduction.md), be sure to include "ApiKind" in the connection string.

Avoid port numbers in the endpoint URL. If you include the port number, the connection will fail.  

| Full access connection string |
|-----------------------------------------------|
|`{ "connectionString" : "AccountEndpoint=https://<Cosmos DB account name>.documents.azure.com;AccountKey=<Cosmos DB auth key>;Database=<Cosmos DB database id>;ApiKind=MongoDb" }` |
| You can get the connection string from the Azure Cosmos DB account page in Azure portal by selecting **Keys** in the left navigation pane. Make sure to select a full connection string and not just a key.  |

| Managed identity connection string |
|------------------------------------|
|`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.DocumentDB/databaseAccounts/<your cosmos db account name>/;(ApiKind=[api-kind];)" }`|
|This connection string doesn't require an account key, but you must have previously configured a search service to [connect using a managed identity](search-howto-managed-identities-data-sources.md) and created a role assignment that grants **Cosmos DB Account Reader Role** permissions. See [Setting up an indexer connection to an Azure Cosmos DB database using a managed identity](search-howto-managed-identities-cosmos-db.md) for more information. |

## Add search fields to an index

In a [search index](search-what-is-an-index.md), add fields to accept the source JSON documents or the output of your custom query projection. Ensure that the search index schema is compatible with your graph. For content in Azure Cosmos DB, your search index schema should correspond to the [Azure Cosmos DB items](../cosmos-db/resource-model.md#azure-cosmos-db-items) in your data source.

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

1. Create a document key field ("key": true). For partitioned collections, the default document key is the Azure Cosmos DB `_rid` property, which Azure AI Search automatically renames to `rid` because field names can’t start with an underscore character. Also, Azure Cosmos DB `_rid` values contain characters that are invalid in Azure AI Search keys. For this reason, the `_rid` values are Base64 encoded. 

1. Create additional fields for more searchable content. See [Create an index](search-how-to-create-search-index.md) for details.

### Mapping data types

| JSON data type | Azure AI Search field types |
| --- | --- |
| Bool |Edm.Boolean, Edm.String |
| Numbers that look like integers |Edm.Int32, Edm.Int64, Edm.String |
| Numbers that look like floating-points |Edm.Double, Edm.String |
| String |Edm.String |
| Arrays of primitive types such as ["a", "b", "c"] |Collection(Edm.String) |
| Strings that look like dates |Edm.DateTimeOffset, Edm.String |
| GeoJSON objects such as { "type": "Point", "coordinates": [long, lat] } |Edm.GeographyPoint |
| Other JSON objects |N/A |

## Configure and run the Azure Cosmos DB indexer

Once the index and data source have been created, you're ready to create the indexer. Indexer configuration specifies the inputs, parameters, and properties controlling run time behaviors.

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) by giving it a name and referencing the data source and target index:

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [search service admin key]
    {
        "name" : "[my-cosmosdb-indexer]",
        "dataSourceName" : "[my-cosmosdb-gremlin-ds]",
        "targetIndexName" : "[my-search-index]",
        "disabled": null,
        "schedule": null,
        "parameters": {
            "batchSize": null,
            "maxFailedItems": 0,
            "maxFailedItemsPerBatch": 0,
            "base64EncodeKeys": false,
            "configuration": {}
            },
        "fieldMappings": [],
        "encryptionKey": null
    }
    ```

1. [Specify field mappings](search-indexer-field-mappings.md) if there are differences in field name or type, or if you need multiple versions of a source field in the search index.

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties.

An indexer runs automatically when it's created. You can prevent this by setting "disabled" to true. To control indexer execution, [run an indexer on demand](search-howto-run-reset-indexers.md) or [put it on a schedule](search-howto-schedule-indexers.md).

## Check indexer status

To monitor the indexer status and execution history, send a [Get Indexer Status](/rest/api/searchservice/get-indexer-status) request:

```http
GET https://myservice.search.windows.net/indexers/myindexer/status?api-version=2020-06-30
  Content-Type: application/json  
  api-key: [admin key]
```

The response includes status and the number of items processed. It should look similar to the following example:

```json
    {
        "status":"running",
        "lastResult": {
            "status":"success",
            "errorMessage":null,
            "startTime":"2022-02-21T00:23:24.957Z",
            "endTime":"2022-02-21T00:36:47.752Z",
            "errors":[],
            "itemsProcessed":1599501,
            "itemsFailed":0,
            "initialTrackingState":null,
            "finalTrackingState":null
        },
        "executionHistory":
        [
            {
                "status":"success",
                "errorMessage":null,
                "startTime":"2022-02-21T00:23:24.957Z",
                "endTime":"2022-02-21T00:36:47.752Z",
                "errors":[],
                "itemsProcessed":1599501,
                "itemsFailed":0,
                "initialTrackingState":null,
                "finalTrackingState":null
            },
            ... earlier history items
        ]
    }
```

Execution history contains up to 50 of the most recently completed executions, which are sorted in the reverse chronological order so that the latest execution comes first.

<a name="DataChangeDetectionPolicy"></a>

## Indexing new and changed documents

Once an indexer has fully populated a search index, you might want subsequent indexer runs to incrementally index just the new and changed documents in your database.

To enable incremental indexing, set the "dataChangeDetectionPolicy" property in your data source definition. This property tells the indexer which change tracking mechanism is used on your data.

For Azure Cosmos DB indexers, the only supported policy is the [`HighWaterMarkChangeDetectionPolicy`](/dotnet/api/azure.search.documents.indexes.models.highwatermarkchangedetectionpolicy) using the `_ts` (timestamp) property provided by Azure Cosmos DB. 

The following example shows a [data source definition](#define-the-data-source) with a change detection policy:

```http
"dataChangeDetectionPolicy": {
    "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
"  highWaterMarkColumnName": "_ts"
},
```

<a name="DataDeletionDetectionPolicy"></a>

## Indexing deleted documents

When graph data is deleted, you might want to delete its corresponding document from the search index as well. The purpose of a data deletion detection policy is to efficiently identify deleted data items and delete the full document from the index. The data deletion detection policy isn't meant to delete partial document information. Currently, the only supported policy is the `Soft Delete` policy (deletion is marked with a flag of some sort), which is specified in the data source definition as follows:

```http
"dataDeletionDetectionPolicy"": {
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
    "name": "[my-cosmosdb-gremlin-ds]",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "AccountEndpoint=https://[cosmos-account-name].documents.azure.com;AccountKey=[cosmos-account-key];Database=[cosmos-database-name];ApiKind=Gremlin"
    },
    "container": { "name": "[my-cosmos-collection]" },
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

Even if you enable deletion detection policy, deleting complex (`Edm.ComplexType`) fields from the index is not supported. This policy requires that the 'active' column in the Gremlin database to be of type integer, string or boolean.


<a name="MappingGraphData"></a>

## Mapping graph data to fields in a search index

The Azure Cosmos DB for Apache Gremlin indexer will automatically map a couple pieces of graph data:

1. The indexer will map `_rid` to an `rid` field in the index if it exists, and Base64 encode it.

1. The indexer will map `_id` to an `id` field in the index if it exists.

1. When querying your Azure Cosmos DB database using the Azure Cosmos DB for Apache Gremlin you may notice that the JSON output for each property has an `id` and a `value`. Azure AI Search Azure Cosmos DB indexer will automatically map the properties `value` into a field in your search index that has the same name as the property if it exists. In the following example, 450 would be mapped to a `pages` field in the search index.

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

+ To learn more about Azure Cosmos DB for Apache Gremlin, see the [Introduction to Azure Cosmos DB: Azure Cosmos DB for Apache Gremlin](../cosmos-db/graph-introduction.md).

+ For more information about Azure AI Search scenarios and pricing, see the [Search service page on azure.microsoft.com](https://azure.microsoft.com/services/search/).

+ To learn about network configuration for indexers, see the [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md).
