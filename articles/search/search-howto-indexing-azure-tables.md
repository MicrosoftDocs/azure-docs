---
title: Search over Azure Table storage content
titleSuffix: Azure Cognitive Search
description: Learn how to index data stored in Azure Table storage with an Azure Cognitive Search indexer.

manager: nitinme
author: mgottein 
ms.author: magottei
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# How to index tables from Azure Table storage with Azure Cognitive Search

This article shows how to use Azure Cognitive Search to index data stored in Azure Table storage.

## Set up Azure Table storage indexing

You can set up an Azure Table storage indexer by using these resources:

* [Azure portal](https://ms.portal.azure.com)
* Azure Cognitive Search [REST API](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations)
* Azure Cognitive Search [.NET SDK](https://aka.ms/search-sdk)

Here we demonstrate the flow by using the REST API. 

### Step 1: Create a datasource

A datasource specifies which data to index, the credentials needed to access the data, and the policies that enable Azure Cognitive Search to efficiently identify changes in the data.

For table indexing, the datasource must have the following properties:

- **name** is the unique name of the datasource within your search service.
- **type** must be `azuretable`.
- **credentials** parameter contains the storage account connection string. See the [Specify credentials](#Credentials) section for details.
- **container** sets the table name and an optional query.
	- Specify the table name by using the `name` parameter.
	- Optionally, specify a query by using the `query` parameter. 

> [!IMPORTANT] 
> Whenever possible, use a filter on PartitionKey for better performance. Any other query does a full table scan, resulting in poor performance for large tables. See the [Performance considerations](#Performance) section.


To create a datasource:

    POST https://[service name].search.windows.net/datasources?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "table-datasource",
        "type" : "azuretable",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-table", "query" : "PartitionKey eq '123'" }
    }   

For more information on the Create Datasource API, see [Create Datasource](https://docs.microsoft.com/rest/api/searchservice/create-data-source).

<a name="Credentials"></a>
#### Ways to specify credentials ####

You can provide the credentials for the table in one of these ways: 

- **Full access storage account connection string**: `DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>` You can get the connection string from the Azure portal by going to the **Storage account blade** > **Settings** > **Keys** (for classic storage accounts) or **Settings** > **Access keys** (for Azure Resource Manager storage accounts).
- **Storage account shared access signature connection string**: `TableEndpoint=https://<your account>.table.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=t&sp=rl` The shared access signature should have the list and read permissions on containers (tables in this case) and objects (table rows).
-  **Table shared access signature**: `ContainerSharedAccessUri=https://<your storage account>.table.core.windows.net/<table name>?tn=<table name>&sv=2016-05-31&sig=<the signature>&se=<the validity end time>&sp=r` The shared access signature should have query (read) permissions on the table.

For more information on storage shared access signatures, see [Using shared access signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

> [!NOTE]
> If you use shared access signature credentials, you will need to update the datasource credentials periodically with renewed signatures to prevent their expiration. If shared access signature credentials expire, the indexer fails with an error message similar to "Credentials provided in the connection string are invalid or have expired."  

### Step 2: Create an index
The index specifies the fields in a document, the attributes, and other constructs that shape the search experience.

To create an index:

    POST https://[service name].search.windows.net/indexes?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
          "name" : "my-target-index",
          "fields": [
            { "name": "key", "type": "Edm.String", "key": true, "searchable": false },
            { "name": "SomeColumnInMyTable", "type": "Edm.String", "searchable": true }
          ]
    }

For more information on creating indexes, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index).

### Step 3: Create an indexer
An indexer connects a datasource with a target search index and provides a schedule to automate the data refresh. 

After the index and datasource are created, you're ready to create the indexer:

    POST https://[service name].search.windows.net/indexers?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "table-indexer",
      "dataSourceName" : "table-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" }
    }

This indexer runs every two hours. (The schedule interval is set to "PT2H".) To run an indexer every 30 minutes, set the interval to "PT30M". The shortest supported interval is five minutes. The schedule is optional; if omitted, an indexer runs only once when it's created. However, you can run an indexer on demand at any time.   

For more information on the Create Indexer API, see [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

## Deal with different field names
Sometimes, the field names in your existing index are different from the property names in your table. You can use field mappings to map the property names from the table to the field names in your search index. To learn more about field mappings, see [Azure Cognitive Search indexer field mappings bridge the differences between datasources and search indexes](search-indexer-field-mappings.md).

## Handle document keys
In Azure Cognitive Search, the document key uniquely identifies a document. Every search index must have exactly one key field of type `Edm.String`. The key field is required for each document that is being added to the index. (In fact, it's the only required field.)

Because table rows have a compound key, Azure Cognitive Search generates a synthetic field called `Key` that is a concatenation of partition key and row key values. For example, if a row’s PartitionKey is `PK1` and RowKey is `RK1`, then the `Key` field's value is `PK1RK1`.

> [!NOTE]
> The `Key` value may contain characters that are invalid in document keys, such as dashes. You can deal with invalid characters by using the `base64Encode` [field mapping function](search-indexer-field-mappings.md#base64EncodeFunction). If you do this, remember to also use URL-safe Base64 encoding when passing document keys in API calls such as Lookup.
>
>

## Incremental indexing and deletion detection
When you set up a table indexer to run on a schedule, it reindexes only new or updated rows, as determined by a row’s `Timestamp` value. You don’t have to specify a change detection policy. Incremental indexing is enabled for you automatically.

To indicate that certain documents must be removed from the index, you can use a soft delete strategy. Instead of deleting a row, add a property to indicate that it's deleted, and set up a soft deletion detection policy on the datasource. For example, the following policy considers that a row is deleted if the row has a property `IsDeleted` with the value `"true"`:

    PUT https://[service name].search.windows.net/datasources?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "my-table-datasource",
        "type" : "azuretable",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "table name", "query" : "<query>" },
        "dataDeletionDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy", "softDeleteColumnName" : "IsDeleted", "softDeleteMarkerValue" : "true" }
    }   

<a name="Performance"></a>
## Performance considerations

By default, Azure Cognitive Search uses the following query filter: `Timestamp >= HighWaterMarkValue`. Because Azure tables don’t have a secondary index on the `Timestamp` field, this type of query requires a full table scan and is therefore slow for large tables.


Here are two possible approaches for improving table indexing performance. Both of these approaches rely on using table partitions: 

- If your data can naturally be partitioned into several partition ranges, create a datasource and a corresponding indexer for each partition range. Each indexer now has to process only a specific partition range, resulting in better query performance. If the data that needs to be indexed has a small number of fixed partitions, even better: each indexer only does a partition scan. For example, to create a datasource for processing a partition range with keys from `000` to `100`, use a query like this: 
	```
	"container" : { "name" : "my-table", "query" : "PartitionKey ge '000' and PartitionKey lt '100' " }
	```

- If your data is partitioned by time (for example, you create a new partition every day or week), consider the following approach: 
	- Use a query of the form: `(PartitionKey ge <TimeStamp>) and (other filters)`. 
	- Monitor indexer progress by using [Get Indexer Status API](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status), and periodically update the `<TimeStamp>` condition of the query based on the latest successful high-water-mark value. 
	- With this approach, if you need to trigger a complete reindexing, you need to reset the datasource query in addition to resetting the indexer. 


## Help us make Azure Cognitive Search better
If you have feature requests or ideas for improvements, submit them on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).
