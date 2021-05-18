---
title: How to index data available through MySQL using an indexer in Azure Cognitive Search (preview)
titleSuffix: Azure Cognitive Search
description: Import data from Azure MySQL into a searchable index in Azure Cognitive Search. Indexers automate data ingestion for selected data sources like MySQL.

author: markheff
manager: luisca
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/17/2021
---

# How to index data available through MySQL using an indexer in Azure Cognitive Search (preview)

> [!IMPORTANT] 
> MySQL support is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> You can request access to the previews by filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview). 
> The [REST API version 2020-06-30-Preview](search-api-preview.md) provides this feature. There is currently no .NET SDK support and no portal.

> ![!NOTE]
> The preview does not support geometry types and blobs.

The Azure Cognitive Search indexer for MySQL will crawl your MySQL database on Azure, extract searchable data, and index it in Azure Cognitive Search. The indexer will take all changes, uploads, and deletes for your MySQL database and reflect these changes in Azure Cognitive Search.

## Create an Azure MySQL indexer

To index MySQL on Azure follow the below steps.

### Step 1: Create a data source

To create the data source, send the following request:

```http

    POST https://[search service name].search.windows.net/datasources?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [Admin Key]
    
    {   
        "description" : "Description of MySQL data source",
        "type" : "MySQL",
        "credentials" : { 
            "connectionString" : 
                "Server=[MySQLServerName].MySQL.database.azure.com; Port=3306; Database=[DatabaseName]; Uid=[UserName]; Pwd=[Password]; SslMode=Preferred;" 
        },
        "container" : { 
            "name" : "[TableName]" 
        },
        "dataChangeDetectionPolicy" : { 
            "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy", "highWaterMarkColumnName": "[HighWaterMarkColumn]" 
        }
    }

```

### Step 2: Create an index

Create the target Azure Cognitive Search index if you don’t have one already.

```http

    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
    Content-Type: application/json
    api-key: [Search service admin key]

	{
       "name": "mysearchindex",
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
         "facetable": false,
         "suggestions": true
       }]
    }

```

### Step 3: Create the indexer

Once the index and data source have been created, you're ready to create the indexer.

```http

    POST https://[search service name].search.windows.net/indexers?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [Admin Key]
    
    {
        "description" : "Description of MySQL indexer",
        "dataSourceName" : "[DataSourceName]",
        "targetIndexName" : "[IndexName]"
    }

```

## Run indexers on a schedule
You can also arrange the indexer to run periodically on a schedule. To do this, add the **schedule** property when creating or updating the indexer. The example below shows a PUT request to update the indexer:

```
    PUT https://myservice.search.windows.net/indexers/myindexer?api-version=2020-06-30
    Content-Type: application/json
    api-key: admin-key

    {
        "dataSourceName" : "myazureMySQLdatasource",
        "targetIndexName" : "target index name",
        "schedule" : { "interval" : "PT10M", "startTime" : "2015-01-01T00:00:00Z" }
    }
```

The **interval** parameter is required. The interval refers to the time between the start of two consecutive indexer executions. The smallest allowed interval is 5 minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours.

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

## Capture new, changed, and deleted rows

Azure Cognitive Search uses **incremental indexing** to avoid having to reindex the entire table or view every time an indexer runs. Azure Cognitive Search provides two change detection policies to support incremental indexing. 

### MySQL Integrated Change Tracking Policy
If your MySQL database supports [change tracking](/MySQL/relational-databases/track-changes/about-change-tracking-MySQL-server), we recommend using **MySQL Integrated Change Tracking Policy**. This is the most efficient policy. In addition, it allows Azure Cognitive Search to identify deleted rows without you having to add an explicit "soft delete" column to your table.

#### Requirements 

+ Database version requirements:
  * MySQL Server 2012 SP3 and later, if you're using MySQL Server on Azure VMs.
  * Azure MySQL Database or MySQL Managed Instance.
+ Tables only (no views). 
+ On the database, [enable change tracking](/MySQL/relational-databases/track-changes/enable-and-disable-change-tracking-MySQL-server) for the table. 
+ No composite primary key (a primary key containing more than one column) on the table.  

#### Usage

To use this policy, create or update your data source like this:

```
    {
        "name" : "myazureMySQLdatasource",
        "type" : "azureMySQL",
        "credentials" : { "connectionString" : "connection string" },
        "container" : { "name" : "table or view name" },
        "dataChangeDetectionPolicy" : {
           "@odata.type" : "#Microsoft.Azure.Search.MySQLIntegratedChangeTrackingPolicy"
      }
    }
```

When using MySQL integrated change tracking policy, do not specify a separate data deletion detection policy - this policy has built-in support for identifying deleted rows. However, for the deletes to be detected "automagically", the document key in your search index must be the same as the primary key in the MySQL table. 

> [!NOTE]  
> When using [TRUNCATE TABLE](/MySQL/t-MySQL/statements/truncate-table-transact-MySQL) to remove a large number of rows from a MySQL table, the indexer needs to be [reset](/rest/api/searchservice/reset-indexer) to reset the change tracking state to pick up row deletions.

<a name="HighWaterMarkPolicy"></a>

### High Water Mark Change Detection policy

This change detection policy relies on a "high water mark" column capturing the version or time when a row was last updated. If you're using a view, you must use a high water mark policy. The high water mark column must meet the following requirements.

#### Requirements 

* All inserts specify a value for the column.
* All updates to an item also change the value of the column.
* The value of this column increases with each insert or update.
* Queries with the following WHERE and ORDER BY clauses can be executed efficiently: `WHERE [High Water Mark Column] > [Current High Water Mark Value] ORDER BY [High Water Mark Column]`

> [!IMPORTANT] 
> We strongly recommend using the [rowversion](/MySQL/t-MySQL/data-types/rowversion-transact-MySQL) data type for the high water mark column. If any other data type is used, change tracking is not guaranteed to capture all changes in the presence of transactions executing concurrently with an indexer query. When using **rowversion** in a configuration with read-only replicas, you must point the indexer at the primary replica. Only a primary replica can be used for data sync scenarios.

#### Usage

To use a high water mark policy, create or update your data source like this:

```
    {
        "name" : "myazureMySQLdatasource",
        "type" : "azureMySQL",
        "credentials" : { "connectionString" : "connection string" },
        "container" : { "name" : "table or view name" },
        "dataChangeDetectionPolicy" : {
           "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
           "highWaterMarkColumnName" : "[a rowversion or last_updated column name]"
      }
    }
```

> [!WARNING]
> If the source table does not have an index on the high water mark column, queries used by the MySQL indexer may time out. In particular, the `ORDER BY [High Water Mark Column]` clause requires an index to run efficiently when the table contains many rows.
>
>

<a name="convertHighWaterMarkToRowVersion"></a>

##### convertHighWaterMarkToRowVersion

If you're using a [rowversion](/MySQL/t-MySQL/data-types/rowversion-transact-MySQL) data type for the high water mark column, consider using the `convertHighWaterMarkToRowVersion` indexer configuration setting. `convertHighWaterMarkToRowVersion` does two things:

* Use the rowversion data type for the high water mark column in the indexer MySQL query. Using the correct data type improves indexer query performance.
* Subtract 1 from the rowversion value before the indexer query runs. Views with 1 to many joins may have rows with duplicate rowversion values. Subtracting 1 ensures the indexer query doesn't miss these rows.

To enable this feature, create or update the indexer with the following configuration:

```
    {
      ... other indexer definition properties
     "parameters" : {
            "configuration" : { "convertHighWaterMarkToRowVersion" : true } }
    }
```

<a name="queryTimeout"></a>

##### queryTimeout

If you encounter timeout errors, you can use the `queryTimeout` indexer configuration setting to set the query timeout to a value higher than the default 5-minute timeout. For example, to set the timeout to 10 minutes, create or update the indexer with the following configuration:

```
    {
      ... other indexer definition properties
     "parameters" : {
            "configuration" : { "queryTimeout" : "00:10:00" } }
    }
```

<a name="disableOrderByHighWaterMarkColumn"></a>

##### disableOrderByHighWaterMarkColumn

You can also disable the `ORDER BY [High Water Mark Column]` clause. However, this is not recommended because if the indexer execution is interrupted by an error, the indexer has to re-process all rows if it runs later - even if the indexer has already processed almost all the rows by the time it was interrupted. To disable the `ORDER BY` clause, use the `disableOrderByHighWaterMarkColumn` setting in the indexer definition:  

```
    {
     ... other indexer definition properties
     "parameters" : {
            "configuration" : { "disableOrderByHighWaterMarkColumn" : true } }
    }
```

### Soft Delete Column Deletion Detection policy
When rows are deleted from the source table, you probably want to delete those rows from the search index as well. If you use the MySQL integrated change tracking policy, this is taken care of for you. However, the high water mark change tracking policy doesn’t help you with deleted rows. What to do?

If the rows are physically removed from the table, Azure Cognitive Search has no way to infer the presence of records that no longer exist.  However, you can use the “soft-delete” technique to logically delete rows without removing them from the table. Add a column to your table or view and mark rows as deleted using that column.

When using the soft-delete technique, you can specify the soft delete policy as follows when creating or updating the data source:

```
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
| MySQL data type | Allowed target index field types | Notes |
| --- | --- | --- |
| bit |Edm.Boolean, Edm.String | |
| int, smallint, tinyint |Edm.Int32, Edm.Int64, Edm.String | |
| bigint |Edm.Int64, Edm.String | |
| real, float |Edm.Double, Edm.String | |
| smallmoney, money decimal numeric |Edm.String |Azure Cognitive Search does not support converting decimal types into Edm.Double because this would lose precision |
| char, nchar, varchar, nvarchar |Edm.String<br/>Collection(Edm.String) |A MySQL string can be used to populate a Collection(Edm.String) field if the string represents a JSON array of strings: `["red", "white", "blue"]` |
| smalldatetime, datetime, datetime2, date, datetimeoffset |Edm.DateTimeOffset, Edm.String | |
| uniqueidentifer |Edm.String | |
| geography |Edm.GeographyPoint |Only geography instances of type POINT with SRID 4326 (which is the default) are supported |
| rowversion |N/A |Row-version columns cannot be stored in the search index, but they can be used for change tracking |
| time, timespan, binary, varbinary, image, xml, geometry, CLR types |N/A |Not supported |

## Configuration Settings
MySQL indexer exposes several configuration settings:

| Setting | Data type | Purpose | Default value |
| --- | --- | --- | --- |
| queryTimeout |string |Sets the timeout for MySQL query execution |5 minutes ("00:05:00") |
| disableOrderByHighWaterMarkColumn |bool |Causes the MySQL query used by the high water mark policy to omit the ORDER BY clause. See [High Water Mark policy](#HighWaterMarkPolicy) |false |

These settings are used in the `parameters.configuration` object in the indexer definition. For example, to set the query timeout to 10 minutes, create or update the indexer with the following configuration:

```
    {
      ... other indexer definition properties
     "parameters" : {
            "configuration" : { "queryTimeout" : "00:10:00" } }
    }
```

## Next steps

Congratulations! You have learned how to integrate MySQL with Azure Cognitive Search using an indexer.

+ To learn more about indexers, see [Creating Indexers in Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-howto-create-indexers)
