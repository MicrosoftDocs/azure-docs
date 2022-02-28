---
title: Azure DB for MySQL (preview)
titleSuffix: Azure Cognitive Search
description: Set up a search indexer to index data stored in Azure Database for MySQL for full text search in Azure Cognitive Search.

author: gmndrg
ms.author: gimondra
manager: nitinme

ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/27/2022
---

# Index data from Azure Database for MySQL

> [!IMPORTANT] 
> MySQL support is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use a [preview REST API](search-api-preview.md) (2020-06-30-preview or later) to index your content. There is currently no portal support.

In this article, learn how to configure an [**indexer**](search-indexer-overview.md) that imports content from Azure Database for MySQL and makes it searchable in Azure Cognitive Search.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information that's specific to indexing files in Azure DB for MySQL. It uses the REST APIs to demonstrate a three-part workflow common to all indexers: create a data source, create an index, create an indexer. When configured to include a high water mark and soft deletion, the indexer will take all changes, uploads, and deletes for your MySQL database and reflect these changes in your search index. Data extraction occurs when you submit the Create Indexer request.

## Prerequisites

+ [Register for the preview](https://aka.ms/azure-cognitive-search/indexer-preview) to provide feedback and get help with any issues you encounter.

+ [Azure Database for MySQL](../mysql/overview.md) ([single server](../mysql/single-server-overview.md)).

+ A table or view that provides the content. A primary key is required. If you're using a view, it must have a [high water mark column](#DataChangeDetectionPolicy).

+ Read permissions. A "full access" connection string includes a key that grants access to the content, but if you're using Azure roles, make sure the [search service managed identity](search-howto-managed-identities-data-sources.md) has **Reader** permissions on MySQL.

+ A REST client, such as [Postman](search-get-started-rest.md) or [Visual Studio Code with the extension for Azure Cognitive Search](search-get-started-vs-code.md) to send REST calls that create the data source, index, and indexer. 

  You can also use the [Azure SDK for .NET](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype.mysql). You can't use the portal for indexer creation, but you can manage indexers and data sources once they're created. 

## Preview limitations

Currently, change tracking and deletion detection aren't working if the date or timestamp is uniform for all rows. This is a known issue that will be addressed in an update to the preview. Until this issue is addressed, don’t add a skillset to the MySQL indexer.

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
        "name" : "hotel-mysql-ds"
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

1. Set "type" to `"mysql"` (required).

1. Set "credentials" to an ADO.NET connection string. You can find connection strings in Azure portal, on the **Connection strings** page for MySQL. 

1. Set "container" to the name of the table.

1. [Set "dataChangeDetectionPolicy"](#DataChangeDetectionPolicy) if data is volatile and you want the indexer to pick up just the new and updated items on subsequent runs.

1. [Set "dataDeletionDetectionPolicy"](#DataDeletionDetectionPolicy) if you want to remove search documents from a search index when the source item is deleted.

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

If the primary key in the source table matches the document key (in this case, "ID"), the indexer will import the primary key as the document key.

## Configure the MySQL indexer

Once the index and data source have been created, you're ready to create the indexer.

[Create or Update Indexer](/rest/api/searchservice/create-indexer) specifies the predefined data source and search index.

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

By default, the indexer runs when it's created on the search service. You can set "disabled" to true if you want to run the indexer manually.

You can now [run the indexer](search-howto-run-reset-indexers.md), [monitor status](search-howto-monitor-indexers.md), or [schedule indexer execution](search-howto-schedule-indexers.md). 

To put the indexer on a schedule, set the "schedule" property when creating or updating the indexer. Here is an example of a schedule that runs every 15 minutes.

```http
PUT https://[search service name].search.windows.net/indexers/hotels-mysql-idxr?api-version=2020-06-30
Content-Type: application/json
api-key: [admin-key]

{
    "dataSourceName" : "hotels-mysql-ds",
    "targetIndexName" : "hotels-mysql-ix",
    "schedule" : { 
        "interval" : "PT15M", 
        "startTime" : "2022-01-01T00:00:00Z"
    }
}
```

## Capture new, changed, and deleted rows

If your data source meets the requirements for change and deletion detection, the indexer can incrementally index the changes in your data source since the last indexer job, which means you can avoid having to re-index the entire table or view every time an indexer runs.

<a name="DataChangeDetectionPolicy"></a>

### High Water Mark Change Detection policy

An indexer's change detection policy relies on having a "high water mark" column that captures the row version, or the date and time when a row was last updated. It's often a DATE, DATETIME, or TIMESTAMP column at a granularity sufficient for meeting the requirements of a high water mark column. 

In your MySQL database, the high water mark column must meet the following requirements:

+ All data inserts must specify a value for the column.
+ All updates to an item also change the value of the column.
+ The value of this column increases with each insert or update.
+ Queries with the following WHERE and ORDER BY clauses can be executed efficiently: `WHERE [High Water Mark Column] > [Current High Water Mark Value] ORDER BY [High Water Mark Column]`

To set a high water mark policy in your indexer data source, create or update your data source like this:

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
> If the source table does not have an index on the high water mark column, queries used by the MySQL indexer may time out. In particular, the `ORDER BY [High Water Mark Column]` clause requires an index to run efficiently when the table contains many rows.

<a name="DataDeletionDetectionPolicy"></a>

### Soft Delete Column Deletion Detection policy

When rows are deleted from the source table, you probably want to delete those rows from the search index as well. If the rows are physically removed from the table, Azure Cognitive Search has no way to infer the presence of records that no longer exist.  However, you can use the “soft-delete” technique to logically delete rows without removing them from the table. Add a column to your table or view and mark rows as deleted using that column.

When using the soft-delete technique, you can specify the soft delete policy as follows when creating or updating the data source:

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

The "softDeleteMarkerValue" must be a string – use the string representation of your actual value. For example, if you have an integer column where deleted rows are marked with the value 1, use `"1"`. If you have a BIT column where deleted rows are marked with the Boolean true value, use the string literal `True` or `true`, the case doesn't matter.

<a name="TypeMapping"></a>

## Mapping data types

The following table maps the MySQL database to Cognitive Search equivalents. See [Supported data types (Azure Cognitive Search)](/rest/api/searchservice/supported-data-types) for more information.

> [!NOTE]
> The preview does not support geometry types and blobs. 

| MySQL data type |  Cognitive Search field type |
| --------------- | -------------------------------- |
| `bool`, `boolean` | Edm.Boolean, Edm.String |
| `tinyint`, `smallint`, `mediumint`, `int`, `integer`, `year` | Edm.Int32, Edm.Int64, Edm.String |
| `bigint` | Edm.Int64, Edm.String |
| `float`, `double`, `real` | Edm.Double, Edm.String |
| `date`, `datetime`, `timestamp` | Edm.DateTimeOffset, Edm.String |
| `char`, `varchar`, `tinytext`, `mediumtext`, `text`, `longtext`, `enum`, `set`, `time` | Edm.String |
| unsigned numerical data, serial, decimal, dec, bit, blob, binary, geometry | N/A |

## Next steps

This article explained how to integrate Azure Database for MySQL with Azure Cognitive Search using an indexer. Now that you have a search index that contains your searchable content, run some full text queries using Search explorer in the Azure portal.

> [!div class="nextstepaction"]
> [Search explorer](search-explorer.md)
