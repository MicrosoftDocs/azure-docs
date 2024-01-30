---
title: Indexing with Azure Cosmos DB for MongoDB
titleSuffix: Azure AI Search
description: Set up a search indexer to index data stored in Azure Cosmos DB for full text search in Azure AI Search. This article explains how index data in Azure Cosmos DB for MongoDB.
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/18/2023
---

# Import data from Azure Cosmos DB for MongoDB for queries in Azure AI Search

> [!IMPORTANT] 
> MongoDB API support is currently in public preview under [supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Currently, there is no SDK support.

In this article, learn how to configure an [**indexer**](search-indexer-overview.md) that imports content from [Azure Cosmos DB for MongoDB](../cosmos-db/mongodb/introduction.md) and makes it searchable in Azure AI Search.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information that's specific to Cosmos DB. It uses the REST APIs to demonstrate a three-part workflow common to all indexers: create a data source, create an index, create an indexer. Data extraction occurs when you submit the Create Indexer request.

Because terminology can be confusing, it's worth noting that [Azure Cosmos DB indexing](../cosmos-db/index-overview.md) and [Azure AI Search indexing](search-what-is-an-index.md) are different operations. Indexing in Azure AI Search creates and loads a search index on your search service.

## Prerequisites

+ [Register for the preview](https://aka.ms/azure-cognitive-search/indexer-preview) to provide feedback and get help with any issues you encounter.

+ An [Azure Cosmos DB account, database, collection, and documents](../cosmos-db/sql/create-cosmosdb-resources-portal.md). Use the same region for both Azure AI Search and Azure Cosmos DB for lower latency and to avoid bandwidth charges.

+ An [automatic indexing policy](../cosmos-db/index-policy.md) on the Azure Cosmos DB collection, set to [Consistent](../cosmos-db/index-policy.md#indexing-mode). This is the default configuration. Lazy indexing isn't recommended and may result in missing data.

+ Read permissions. A "full access" connection string includes a key that grants access to the content, but if you're using Azure roles, make sure the [search service managed identity](search-howto-managed-identities-data-sources.md) has **Cosmos DB Account Reader Role** permissions.

+ A REST client, such as [Postman](search-get-started-rest.md), to send REST calls that create the data source, index, and indexer. 

## Limitations

These are the limitations of this feature:

+ Custom queries aren't supported for specifying the data set.

+ The column name `_ts` is a reserved word. If you need this field, consider alternative solutions for populating an index. 

+ The MongoDB attribute `$ref` is a reserved word. If you need this in your MongoDB collection, consider alternative solutions for populating an index. 


As an alternative to this connector, if your scenario has any of those requirements, you could use the [Push API/SDK](search-what-is-data-import.md) or consider [Azure Data Factory](../data-factory/connector-azure-cosmos-db.md) with an [Azure AI Search index](../data-factory/connector-azure-search.md) as the sink.

## Define the data source

The data source definition specifies the data to index, credentials, and policies for identifying changes in the data. A data source is defined as an independent resource so that it can be used by multiple indexers.

For this call, specify a [preview REST API version](search-api-preview.md) (2020-06-30-Preview or 2021-04-30-Preview) to create a data source that connects via the MongoDB API.

1. [Create or update a data source](/rest/api/searchservice/preview-api/create-or-update-data-source) to set its definition: 

    ```http
    POST https://[service name].search.windows.net/datasources?api-version=2021-04-30-Preview
    Content-Type: application/json
    api-key: [Search service admin key]
    {
      "name": "[my-cosmosdb-mongodb-ds]",
      "type": "cosmosdb",
      "credentials": {
        "connectionString": "AccountEndpoint=https://[cosmos-account-name].documents.azure.com;AccountKey=[cosmos-account-key];Database=[cosmos-database-name];ApiKind=MongoDb;"
      },
      "container": {
        "name": "[cosmos-db-collection]",
        "query": null
      },
      "dataChangeDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName": "_ts"
      },
      "dataDeletionDetectionPolicy": null,
      "encryptionKey": null,
      "identity": null
    }
    ```

1. Set "type" to `"cosmosdb"` (required).

1. Set "credentials" to a connection string. The next section describes the supported formats.

1. Set "container" to the collection. The "name" property is required and it specifies the ID of the database collection to be indexed. For Azure Cosmos DB for MongoDB, "query" isn't supported. 

1. [Set "dataChangeDetectionPolicy"](#DataChangeDetectionPolicy) if data is volatile and you want the indexer to pick up just the new and updated items on subsequent runs.

1. [Set "dataDeletionDetectionPolicy"](#DataDeletionDetectionPolicy) if you want to remove search documents from a search index when the source item is deleted.

<a name="credentials"></a>

### Supported credentials and connection strings

Indexers can connect to a collection using the following connections. For connections that target the [MongoDB API](../cosmos-db/mongodb/mongodb-introduction.md), be sure to include "ApiKind" in the connection string.

Avoid port numbers in the endpoint URL. If you include the port number, the connection will fail.  

| Full access connection string |
|-----------------------------------------------|
|`{ "connectionString" : "AccountEndpoint=https://<Cosmos DB account name>.documents.azure.com;AccountKey=<Cosmos DB auth key>;Database=<Cosmos DB database id>;ApiKind=MongoDb" }` |
| You can get the *Cosmos DB auth key* from the Azure Cosmos DB account page in the Azure portal by selecting **Connection String** in the left navigation pane. Make sure to copy **Primary Password** and replace *Cosmos DB auth key* value with it. |

| Managed identity connection string |
|------------------------------------|
|`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.DocumentDB/databaseAccounts/<your cosmos db account name>/;(ApiKind=[api-kind];)" }`|
|This connection string doesn't require an account key, but you must have previously configured a search service to [connect using a managed identity](search-howto-managed-identities-data-sources.md) and created a role assignment that grants **Cosmos DB Account Reader Role** permissions. See [Setting up an indexer connection to an Azure Cosmos DB database using a managed identity](search-howto-managed-identities-cosmos-db.md) for more information. |

## Add search fields to an index

In a [search index](search-what-is-an-index.md), add fields to accept the source JSON documents or the output of your custom query projection. Ensure that the search index schema is compatible with source data. For content in Azure Cosmos DB, your search index schema should correspond to the [Azure Cosmos DB items](../cosmos-db/resource-model.md#azure-cosmos-db-items) in your data source.

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store data:

    ```http
    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
    Content-Type: application/json
    api-key: [Search service admin key]
    
    {
        "name": "mysearchindex",
        "fields": [{
            "name": "doc_id",
            "type": "Edm.String",
            "key": true,
            "retrievable": true,
            "searchable": false
        }, {
            "name": "description",
            "type": "Edm.String",
            "filterable": false,
            "searchable": true,
            "sortable": false,
            "facetable": false,
            "suggestions": true
        }]
    }
    ```

1. Create a document key field ("key": true). For a search index based on a MongoDB collection, the document key can be "doc_id", "rid", or some other string field that contains unique values. As long as field names and data types are the same on both sides, no field mappings are required.

   + "doc_id" represents "_id" for the object identifier. If you specify a field of "doc_id" in the index, the indexer populates it with the values of the object identifier.

   + "rid" is a system property in Azure Cosmos DB. If you specify a field of "rid" in the index, the indexer populates it with the base64-encoded value of the "rid" property. 

   + For any other field, your search field should have the same name as defined in the collection. 

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
        "dataSourceName" : "[my-cosmosdb-mongodb-ds]",
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

When rows are deleted from the collection, you normally want to delete those rows from the search index as well. The purpose of a data deletion detection policy is to efficiently identify deleted data items. Currently, the only supported policy is the `Soft Delete` policy (deletion is marked with a flag of some sort), which is specified in the data source definition as follows:

```http
"dataDeletionDetectionPolicy"": {
    "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
    "softDeleteColumnName" : "the property that specifies whether a document was deleted",
    "softDeleteMarkerValue" : "the value that identifies a document as deleted"
}
```

If you're using a custom query, make sure that the property referenced by `softDeleteColumnName` is projected by the query.

The following example creates a data source with a soft-deletion policy:

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30
Content-Type: application/json
api-key: [Search service admin key]

{
    "name": ["my-cosmosdb-mongodb-ds]",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "AccountEndpoint=https://[cosmos-account-name].documents.azure.com;AccountKey=[cosmos-account-key];Database=[cosmos-database-name];ApiKind=MongoDB"
    },
    "container": { "name": "[my-cosmos-collection]" },
    "dataChangeDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName": "_ts"
    },
    "dataDeletionDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
        "softDeleteColumnName": "isDeleted",
        "softDeleteMarkerValue": "true"
    }
}
```

## Next steps

You can now control how you [run the indexer](search-howto-run-reset-indexers.md), [monitor status](search-howto-monitor-indexers.md), or [schedule indexer execution](search-howto-schedule-indexers.md). The following articles apply to indexers that pull content from Azure Cosmos DB:

+ [Set up an indexer connection to an Azure Cosmos DB database using a managed identity](search-howto-managed-identities-cosmos-db.md)
+ [Index large data sets](search-howto-large-index.md)
+ [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md)
