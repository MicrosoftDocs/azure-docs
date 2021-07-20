---
title: Index data from Azure MySQL (preview)
titleSuffix: Azure Cognitive Search
description: Set up a search indexer to index data stored in Azure MySQL for full text search in Azure Cognitive Search.

author: markheff
manager: luisca
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/17/2021
---

# Index data from Azure MySQL

> [!IMPORTANT] 
> MySQL support is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). [Request access](https://aka.ms/azure-cognitive-search/indexer-preview) to this feature, and after access is enabled, use a [preview REST API (2020-06-30-preview or later)](search-api-preview.md) to index your content. There is currently no SDK support and no portal support.

The Azure Cognitive Search indexer for MySQL will crawl your MySQL database on Azure, extract searchable data, and index it in Azure Cognitive Search. The indexer will take all changes, uploads, and deletes for your MySQL database and reflect these changes in your search index.

You can set up an Azure MySQL indexer by using any of these clients:

* [Azure portal](https://ms.portal.azure.com)
* Azure Cognitive Search [REST API](/rest/api/searchservice/Indexer-operations)
* Azure Cognitive Search [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexer)

This article uses the REST APIs. 

## Create an Azure MySQL indexer

To index MySQL on Azure follow the below steps.

### Step 1: Create a data source

To create the data source, send the following request:

```http

    POST https://[search service name].search.windows.net/datasources?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    
    {   
        "name" : "[Data source name]"
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

### Step 2: Create an index

Create the target Azure Cognitive Search index if you don’t have one already.

```http

    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

	{
       "name": "[Index name]",
       "fields": [{
         "name": "id",
         "type": "Edm.String",
         "key": true,
         "searchable": false
       }, {
         "name": "description",
         "type": "Edm.String",
         "filterable": false,
         "searchable": true,
         "sortable": false,
         "facetable": false
       }]
    }

```

### Step 3: Create the indexer

Once the index and data source have been created, you're ready to create the indexer.

```http

    POST https://[search service name].search.windows.net/indexers?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    
    {
        "name" : "[Indexer name]"
        "description" : "[Description of MySQL indexer]",
        "dataSourceName" : "[Data source name]",
        "targetIndexName" : "[Index name]"
    }

```

## Run indexers on a schedule
You can also arrange the indexer to run periodically on a schedule. To do this, add the **schedule** property when creating or updating the indexer. The example below shows a PUT request to update the indexer:

```http
    PUT https://[search service name].search.windows.net/indexers/[Indexer name]?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin-key]

    {
        "dataSourceName" : "[Data source name]",
        "targetIndexName" : "[Index name]",
        "schedule" : { 
            "interval" : "PT10M", 
            "startTime" : "2021-01-01T00:00:00Z"
        }
    }
```

The **interval** parameter is required. The interval refers to the time between the start of two consecutive indexer executions. The smallest allowed interval is 5 minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours.

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

## Capture new, changed, and deleted rows

Azure Cognitive Search uses **incremental indexing** to avoid having to reindex the entire table or view every time an indexer runs.

<a name="HighWaterMarkPolicy"></a>

### High Water Mark Change Detection policy

This change detection policy relies on a "high water mark" column capturing the version or time when a row was last updated. If you're using a view, you must use a high water mark policy. The high water mark column must meet the following requirements.

#### Requirements 

* All inserts specify a value for the column.
* All updates to an item also change the value of the column.
* The value of this column increases with each insert or update.
* Queries with the following WHERE and ORDER BY clauses can be executed efficiently: `WHERE [High Water Mark Column] > [Current High Water Mark Value] ORDER BY [High Water Mark Column]`

#### Usage

To use a high water mark policy, create or update your data source like this:

```http
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

> [!WARNING]
> If the source table does not have an index on the high water mark column, queries used by the MySQL indexer may time out. In particular, the `ORDER BY [High Water Mark Column]` clause requires an index to run efficiently when the table contains many rows.

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

The **softDeleteMarkerValue** must be a string – use the string representation of your actual value. For example, if you have an integer column where deleted rows are marked with the value 1, use `"1"`. If you have a BIT column where deleted rows are marked with the Boolean true value, use the string literal `True` or `true`, the case doesn't matter.

<a name="TypeMapping"></a>

## Mapping between MySQL and Azure Cognitive Search data types

> [!NOTE]
> The preview does not support geometry types and blobs.

| MySQL data type | Allowed target index field types |
| --- | --- |
| bool, boolean | Edm.Boolean, Edm.String |
| tinyint, smallint, mediumint, int, integer, year | Edm.Int32, Edm.Int64, Edm.String |
| bigint | Edm.Int64, Edm.String |
| float, double, real | Edm.Double, Edm.String |
| date, datetime, timestamp | Edm.DateTimeOffset, Edm.String |
| char, varchar, tinytext, mediumtext, text, longtext, enum, set, time | Edm.String |
| unsigned numerical data, serial, decimal, dec, bit, blob, binary, geometry | N/A |


## Next steps

Congratulations! You have learned how to integrate MySQL with Azure Cognitive Search using an indexer.

+ To learn more about indexers, see [Creating Indexers in Azure Cognitive Search](search-howto-create-indexers.md)
