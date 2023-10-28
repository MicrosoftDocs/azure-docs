---
title: Azure DB for MySQL (preview)
titleSuffix: Azure AI Search
description: Learn how to set up a search indexer to index data stored in Azure Database for MySQL for full text search in Azure AI Search.
author: gmndrg
ms.author: gimondra
manager: nitinme

ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: how-to
ms.custom: kr2b-contr-experiment
ms.date: 06/10/2022
---

# Index data from Azure Database for MySQL

> [!IMPORTANT] 
> MySQL support is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use a [preview REST API](search-api-preview.md) (2020-06-30-preview or later) to index your content. There is currently no portal support.

In this article, learn how to configure an [**indexer**](search-indexer-overview.md) that imports content from Azure Database for MySQL and makes it searchable in Azure AI Search.

This article supplements [Creating indexers in Azure AI Search](search-howto-create-indexers.md) with information that's specific to indexing files in Azure Database for MySQL. It uses the REST APIs to demonstrate a three-part workflow common to all indexers:

- Create a data source
- Create an index
- Create an indexer

When configured to include a high water mark and soft deletion, the indexer takes all changes, uploads, and deletes for your MySQL database. It reflects these changes in your search index. Data extraction occurs when you submit the Create Indexer request.

## Prerequisites

- [Register for the preview](https://aka.ms/azure-cognitive-search/indexer-preview) to provide feedback and get help with any issues you encounter.

- [Azure Database for MySQL flexible server](../mysql/flexible-server/overview.md).

- A table or view that provides the content. A primary key is required. If you're using a view, it must have a [high water mark column](#DataChangeDetectionPolicy).

- Read permissions. A *full access* connection string includes a key that grants access to the content, but if you're using Azure roles, make sure the [search service managed identity](search-howto-managed-identities-data-sources.md) has **Reader** permissions on MySQL.

- A REST client, such as [Postman](search-get-started-rest.md), to send REST calls that create the data source, index, and indexer.

  You can also use the [Azure SDK for .NET](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql). You can't use the portal for indexer creation, but you can manage indexers and data sources once they're created.

For more information, see [Azure Database for MySQL](../mysql/flexible-server/overview.md).

## Preview limitations

Currently, change tracking and deletion detection aren't working if the date or timestamp is uniform for all rows. This limitation is a known issue to be addressed in an update to the preview. Until this issue is addressed, don’t add a skillset to the MySQL indexer.

The preview doesn’t support geometry types and blobs.

As noted, there’s no portal support for indexer creation, but a MySQL indexer and data source can be managed in the portal once they exist. For example, you can edit the definitions, and reset, run, or schedule the indexer.

## Define the data source

The data source definition specifies the data to index, credentials, and policies for identifying changes in the data. The data source is defined as an independent resource so that it can be used by multiple indexers.

1. [Create or Update Data Source](/rest/api/searchservice/create-data-source) specifies the definition. Be sure to use a preview REST API version (2020-06-30-Preview or later) when creating the data source.

    ```http
    POST https://[search service name].search.windows.net/datasources?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    
    {   
        "name" : "hotel-mysql-ds",
        "description" : "[Description of MySQL data source]",
        "type" : "mysql",
        "credentials" : { 
            "connectionString" : 
                "Server=[MySQLServerName].MySQL.database.azure.com; Port=3306; Database=[DatabaseName]; Uid=[UserName]; Pwd=[Password]; SslMode=Preferred;" 
        },
        "container" : { 
            "name" : "[TableName]" 
        },
        "dataChangeDetectionPolicy" : { 
            "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
            "highWaterMarkColumnName": "[HighWaterMarkColumn]"
        }
    }
    ```

1. Set `type` to `"mysql"` (required).

1. Set `credentials` to an ADO.NET connection string. You can find connection strings in Azure portal, on the **Connection strings** page for MySQL.

1. Set `container` to the name of the table.

1. Set [`dataChangeDetectionPolicy`](#DataChangeDetectionPolicy) if data is volatile and you want the indexer to pick up just the new and updated items on subsequent runs.

1. Set [`dataDeletionDetectionPolicy`](#DataDeletionDetectionPolicy) if you want to remove search documents from a search index when the source item is deleted.

## Add search fields to an index

In a [search index](search-what-is-an-index.md), add search index fields that correspond to the fields in your table.

[Create or Update Index](/rest/api/searchservice/create-index) specifies the fields:

```http
{
    "name" : "hotels-mysql-ix",
    "fields": [
        { "name": "ID", "type": "Edm.String", "key": true, "searchable": false },
        { "name": "HotelName", "type": "Edm.String", "searchable": true, "filterable": false },
        { "name": "Category", "type": "Edm.String", "searchable": false, "filterable": true, "sortable": true  },
        { "name": "City", "type": "Edm.String", "searchable": false, "filterable": true, "sortable": true },
        { "name": "Description", "type": "Edm.String", "searchable": false, "filterable": false, "sortable": false  }     
    ]
```

If the primary key in the source table matches the document key (in this case, "ID"), the indexer imports the primary key as the document key.

<a name="TypeMapping"></a>

### Mapping data types

The following table maps the MySQL database to Azure AI Search equivalents. For more information, see [Supported data types (Azure AI Search)](/rest/api/searchservice/supported-data-types).

> [!NOTE]
> The preview does not support geometry types and blobs. 

| MySQL data types |  Azure AI Search field types |
| --------------- | -------------------------------- |
| `bool`, `boolean` | Edm.Boolean, Edm.String |
| `tinyint`, `smallint`, `mediumint`, `int`, `integer`, `year` | Edm.Int32, Edm.Int64, Edm.String |
| `bigint` | Edm.Int64, Edm.String |
| `float`, `double`, `real` | Edm.Double, Edm.String |
| `date`, `datetime`, `timestamp` | Edm.DateTimeOffset, Edm.String |
| `char`, `varchar`, `tinytext`, `mediumtext`, `text`, `longtext`, `enum`, `set`, `time` | Edm.String |
| unsigned numerical data, serial, decimal, dec, bit, blob, binary, geometry | N/A |

## Configure and run the MySQL indexer

Once the index and data source have been created, you're ready to create the indexer. Indexer configuration specifies the inputs, parameters, and properties controlling run time behaviors.

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) by giving it a name and referencing the data source and target index:

    ```http
    POST https://[search service name].search.windows.net/indexers?api-version=2020-06-30
    
    {
        "name" : "hotels-mysql-idxr",
        "dataSourceName" : "hotels-mysql-ds",
        "targetIndexName" : "hotels-mysql-ix",
        "disabled": null,
        "schedule": null,
        "parameters": {
            "batchSize": null,
            "maxFailedItems": null,
            "maxFailedItemsPerBatch": null,
            "base64EncodeKeys": null,
            "configuration": { }
            },
        "fieldMappings" : [ ],
        "encryptionKey": null
    }
    ```

1. [Specify field mappings](search-indexer-field-mappings.md) if there are differences in field name or type, or if you need multiple versions of a source field in the search index.

An indexer runs automatically when it's created. You can prevent it from running by setting `disabled` to `true`. To control indexer execution, [run an indexer on demand](search-howto-run-reset-indexers.md) or [put it on a schedule](search-howto-schedule-indexers.md).

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

## Indexing new and changed rows

Once an indexer has fully populated a search index, you might want subsequent indexer runs to incrementally index just the new and changed rows in your database.

To enable incremental indexing, set the `dataChangeDetectionPolicy` property in your data source definition. This property tells the indexer which change tracking mechanism is used on your data.

For Azure Database for MySQL indexers, the only supported policy is the [`HighWaterMarkChangeDetectionPolicy`](/dotnet/api/azure.search.documents.indexes.models.highwatermarkchangedetectionpolicy). 

An indexer's change detection policy relies on having a *high water mark* column that captures the row version, or the date and time when a row was last updated. It's often a `DATE`, `DATETIME`, or `TIMESTAMP` column at a granularity sufficient for meeting the requirements of a high water mark column.

In your MySQL database, the high water mark column must meet the following requirements:

- All data inserts must specify a value for the column.
- All updates to an item also change the value of the column.
- The value of this column increases with each insert or update.
- Queries with the following `WHERE` and `ORDER BY` clauses can be executed efficiently: `WHERE [High Water Mark Column] > [Current High Water Mark Value] ORDER BY [High Water Mark Column]`

The following example shows a [data source definition](#define-the-data-source) with a change detection policy:

```http
POST https://[search service name].search.windows.net/datasources?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [admin key]
    {
        "name" : "[Data source name]",
        "type" : "mysql",
        "credentials" : { "connectionString" : "[connection string]" },
        "container" : { "name" : "[table or view name]" },
        "dataChangeDetectionPolicy" : {
            "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
            "highWaterMarkColumnName" : "[last_updated column name]"
        }
    }
```

> [!IMPORTANT]
> If you're using a view, you must set a high water mark policy in your indexer data source. 
>
> If the source table does not have an index on the high water mark column, queries used by the MySQL indexer might time out. In particular, the `ORDER BY [High Water Mark Column]` clause requires an index to run efficiently when the table contains many rows.

<a name="DataDeletionDetectionPolicy"></a>

## Indexing deleted rows

When rows are deleted from the table or view, you normally want to delete those rows from the search index as well. However, if the rows are physically removed from the table, an indexer has no way to infer the presence of records that no longer exist. The solution is to use a *soft-delete* technique to logically delete rows without removing them from the table. Add a column to your table or view and mark rows as deleted using that column.

Given a column that provides deletion state, an indexer can be configured to remove any search documents for which deletion state is set to `true`. The configuration property that supports this behavior is a data deletion detection policy, which is specified in the [data source definition](#define-the-data-source) as follows:

```http
{
    …,
    "dataDeletionDetectionPolicy" : {
        "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
        "softDeleteColumnName" : "[a column name]",
        "softDeleteMarkerValue" : "[the value that indicates that a row is deleted]"
    }
}
```

The `softDeleteMarkerValue` must be a string. For example, if you have an integer column where deleted rows are marked with the value 1, use `"1"`. If you have a `BIT` column where deleted rows are marked with the Boolean true value, use the string literal `True` or `true` (the case doesn't matter).

## Next steps

You can now [run the indexer](search-howto-run-reset-indexers.md), [monitor status](search-howto-monitor-indexers.md), or [schedule indexer execution](search-howto-schedule-indexers.md). The following articles apply to indexers that pull content from Azure MySQL:

- [Index large data sets](search-howto-large-index.md)
- [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md)
