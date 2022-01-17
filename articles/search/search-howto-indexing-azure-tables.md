---
title: Azure Table indexer
titleSuffix: Azure Cognitive Search
description: Set up a search indexer to index data stored in Azure Table Storage for full text search in Azure Cognitive Search.

manager: nitinme
author: mgottein 
ms.author: magottei

ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/17/2022
---

# Index data from Azure Table Storage

Configure a table [indexer](search-indexer-overview.md) in Azure Cognitive Search to retrieve, serialize, and index entity content from a single table in Azure Table Storage.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information specific to indexing from Azure Table Storage.

## Prerequisites

+ [Azure Table Storage](../storage/tables/table-storage-overview.md)

+ Tables with entities containing non-binary textual content for text-based indexing. This indexer also supports [AI enrichment](cognitive-search-concept-intro.md) if you have binary files.

## Define the data source

A primary difference between a table indexer and other indexers is the data source assignment. The data source definition specifies "type": `"azuretable"` and how to connect.

1. [Create or update a data source](/rest/api/searchservice/create-data-source) to set its definition: 

    ```json
    {
        "name" : "hotel-tables",
        "type" : "azuretable",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "tblHotels", "query" : "PartitionKey eq '123'" }
    }
    ```

1. Set "type" to `"azuretable"` (required).

1. Set "credentials" to an Azure Storage connection string. The next section describes the supported formats.

1. Set "container" to the name of the table.

1. Optionally, set "query" to a filter on PartitionKey. This is a best practice that improves performance. If "query" is specified any other way, the indexer will execute a full table scan, resulting in poor performance if the tables are large.

> [!TIP]
> The Import data wizard will build a data source for you, including a valid connection string for system-assigned and shared key credentials. If you have trouble setting up the connection programmatically, [use the wizard](search-get-started-portal.md) as a syntax check. 

<a name="Credentials"></a>

### Supported credentials and connection strings

Indexers can connect to a table using the following connections.

**Full access storage account connection string**:
`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }`

You can get the connection string from the Storage account page in Azure portal by selecting **Access keys** in the left navigation pane. Make sure to select a full connection string and not just a key.

+ **Managed identity connection string**: `ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;` 
This connection string does not require an account key, but you must follow the instructions for [Setting up a connection to an Azure Storage account using a managed identity](search-howto-managed-identities-storage.md).

+ **Storage account shared access signature connection string**: `TableEndpoint=https://<your account>.table.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=t&sp=rl` The shared access signature should have the list and read permissions on containers (tables in this case) and objects (table rows).

+ **Table shared access signature**: `ContainerSharedAccessUri=https://<your storage account>.table.core.windows.net/<table name>?tn=<table name>&sv=2016-05-31&sig=<the signature>&se=<the validity end time>&sp=r` The shared access signature should have query (read) permissions on the table.

For more information on storage shared access signatures, see [Using shared access signatures](../storage/common/storage-sas-overview.md).

> [!NOTE]
> If you use shared access signature credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration or the indexer will fail with a "Credentials provided in the connection string are invalid or have expired" message.

## Add search fields to an index

In a [search index](search-what-is-an-index.md), add fields to accept the content and metadata of your table entities.

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store content from entities:

    ```http
    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30 
    {
        "name" : "my-search-index",
        "fields": [
            { "name": "key", "type": "Edm.String", "key": true, "searchable": false },
            { "name": "SomeColumnInMyTable", "type": "Edm.String", "searchable": true }
        ]
    }
    ```

1. Create a key field, but do not define field mappings to alternative unique strings in the table. 

   A table indexer will populate the key field with concatenated partition and row keys from the table. For example, if a row’s PartitionKey is `PK1` and RowKey is `RK1`, then the `Key` field's value is `PK1RK1`. If the partition key is null, just the row key is used.

1. Check for field correspondence between entity fields and search fields. If names and types don't match, [add field mappings](search-indexer-field-mappings.md) to the indexer definition to ensure the source-to-destination path is clear.

## Configure the table indexer

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) to use the predefined data source and search index.

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    {
        "name" : "table-indexer",
        "dataSourceName" : "my-table-datasource",
        "targetIndexName" : "my-target-index",
        "schedule" : { "interval" : "PT2H" }
    }
    ```

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties.

## Change and deletion detection

When you set up a table indexer to run on a schedule, it reindexes only new or updated rows, as determined by a row's `Timestamp` value. When indexing out of Azure Table Storage, you don’t have to specify a change detection policy. Incremental indexing is enabled for you automatically.

To indicate that certain documents must be removed from the index, you can use a soft delete strategy. Instead of deleting a row, add a property to indicate that it's deleted, and set up a soft deletion detection policy on the data source. For example, the following policy considers that a row is deleted if the row has a property `IsDeleted` with the value `"true"`:

```http
PUT https://[service name].search.windows.net/datasources?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-table-datasource",
    "type" : "azuretable",
    "credentials" : { "connectionString" : "<your storage connection string>" },
    "container" : { "name" : "table name", "query" : "<query>" },
    "dataDeletionDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy", "softDeleteColumnName" : "IsDeleted", "softDeleteMarkerValue" : "true" }
}   
```

<a name="Performance"></a>

## Performance considerations

By default, Azure Cognitive Search uses the following internal query filter to keep track of which source entities have been updated since the last run: `Timestamp >= HighWaterMarkValue`. 

Because Azure tables don’t have a secondary index on the `Timestamp` field, this type of query requires a full table scan and is therefore slow for large tables.

Here are two possible approaches for improving table indexing performance. Both rely on using table partitions: 

+ If your data can naturally be partitioned into several partition ranges, create a data source and a corresponding indexer for each partition range. Each indexer now has to process only a specific partition range, resulting in better query performance. If the data that needs to be indexed has a small number of fixed partitions, even better: each indexer only does a partition scan. For example, to create a data source for processing a partition range with keys from `000` to `100`, use a query like this: 

	```json
	"container" : { "name" : "my-table", "query" : "PartitionKey ge '000' and PartitionKey lt '100' " }
	```

+ If your data is partitioned by time (for example, you create a new partition every day or week), consider the following approach: 

  + Use a query of the form: `(PartitionKey ge <TimeStamp>) and (other filters)`. 

  + Monitor indexer progress by using [Get Indexer Status API](/rest/api/searchservice/get-indexer-status), and periodically update the `<TimeStamp>` condition of the query based on the latest successful high-water-mark value. 

  + With this approach, if you need to trigger a complete reindexing, you need to reset the datasource query in addition to resetting the indexer. 

## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Create an indexer](search-howto-create-indexers.md)