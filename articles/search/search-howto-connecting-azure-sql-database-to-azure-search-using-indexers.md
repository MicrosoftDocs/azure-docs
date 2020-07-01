---
title: Search over Azure SQL data
titleSuffix: Azure Cognitive Search
description: Import data from Azure SQL Database or SQL Managed Instance using indexers, for full text search in Azure Cognitive Search. This article covers connections, indexer configuration, and data ingestion.

manager: nitinme
author: mgottein 
ms.author: magottei
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Connect to and index Azure SQL content using an Azure Cognitive Search indexer

Before you can query an [Azure Cognitive Search index](search-what-is-an-index.md), you must populate it with your data. If the data lives in Azure SQL Database or SQL Managed Instance, an **Azure Cognitive Search indexer for Azure SQL Database** (or **Azure SQL indexer** for short) can automate the indexing process, which means less code to write and less infrastructure to care about.

This article covers the mechanics of using [indexers](search-indexer-overview.md), but also describes features only available with Azure SQL Database or SQL Managed Instance (for example, integrated change tracking). 

In addition to Azure SQL Database and SQL Managed Instance, Azure Cognitive Search provides indexers for [Azure Cosmos DB](search-howto-index-cosmosdb.md), [Azure Blob storage](search-howto-indexing-azure-blob-storage.md), and [Azure table storage](search-howto-indexing-azure-tables.md). To request support for other data sources, provide your feedback on the [Azure Cognitive Search feedback forum](https://feedback.azure.com/forums/263029-azure-search/).

## Indexers and data sources

A **data source** specifies which data to index, credentials for data access, and policies that efficiently identify changes in the data (new, modified, or deleted rows). It's defined as an independent resource so that it can be used by multiple indexers.

An **indexer** is a resource that connects a single data source with a targeted search index. An indexer is used in the following ways:

* Perform a one-time copy of the data to populate an index.
* Update an index with changes in the data source on a schedule.
* Run on-demand to update an index as needed.

A single indexer can only consume one table or view, but you can create multiple indexers if you want to populate multiple search indexes. For more information on concepts, see [Indexer Operations: Typical workflow](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations#typical-workflow).

You can set up and configure an Azure SQL indexer using:

* Import Data wizard in the [Azure portal](https://portal.azure.com)
* Azure Cognitive Search [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexer?view=azure-dotnet)
* Azure Cognitive Search [REST API](https://docs.microsoft.com/rest/api/searchservice/indexer-operations)

In this article, we'll use the REST API to create **indexers** and **data sources**.

## When to use Azure SQL Indexer
Depending on several factors relating to your data, the use of Azure SQL indexer may or may not be appropriate. If your data fits the following requirements, you can use Azure SQL indexer.

| Criteria | Details |
|----------|---------|
| Data originates from a single table or view | If the data is scattered across multiple tables, you can create a single view of the data. However, if you use a view, you won’t be able to use SQL Server integrated change detection to refresh an index with incremental changes. For more information, see [Capturing Changed and Deleted Rows](#CaptureChangedRows) below. |
| Data types are compatible | Most but not all the SQL types are supported in an Azure Cognitive Search index. For a list, see [Mapping data types](#TypeMapping). |
| Real-time data synchronization is not required | An indexer can reindex your table at most every five minutes. If your data changes frequently, and the changes need to be reflected in the index within seconds or single minutes, we recommend using the [REST API](https://docs.microsoft.com/rest/api/searchservice/AddUpdate-or-Delete-Documents) or [.NET SDK](search-import-data-dotnet.md) to push updated rows directly. |
| Incremental indexing is possible | If you have a large data set and plan to run the indexer on a schedule, Azure Cognitive Search must be able to efficiently identify new, changed, or deleted rows. Non-incremental indexing is only allowed if you're indexing on demand (not on schedule), or indexing fewer than 100,000 rows. For more information, see [Capturing Changed and Deleted Rows](#CaptureChangedRows) below. |

> [!NOTE] 
> Azure Cognitive Search supports SQL Server authentication only. If you require support for Azure Active Directory Password authentication, please vote for this [UserVoice suggestion](https://feedback.azure.com/forums/263029-azure-search/suggestions/33595465-support-azure-active-directory-password-authentica).

## Create an Azure SQL Indexer

1. Create the data source:

   ```
    POST https://myservice.search.windows.net/datasources?api-version=2020-06-30
    Content-Type: application/json
    api-key: admin-key

    {
        "name" : "myazuresqldatasource",
        "type" : "azuresql",
        "credentials" : { "connectionString" : "Server=tcp:<your server>.database.windows.net,1433;Database=<your database>;User ID=<your user name>;Password=<your password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },
        "container" : { "name" : "name of the table or view that you want to index" }
    }
   ```

   You can get the connection string from the [Azure portal](https://portal.azure.com); use the `ADO.NET connection string` option.

2. Create the target Azure Cognitive Search index if you don’t have one already. You can create an index using the [portal](https://portal.azure.com) or the [Create Index API](https://docs.microsoft.com/rest/api/searchservice/Create-Index). Ensure that the schema of your target index is compatible with the schema of the source table - see [mapping between SQL and Azure Cognitive search data types](#TypeMapping).

3. Create the indexer by giving it a name and referencing the data source and target index:

    ```
    POST https://myservice.search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: admin-key

    {
        "name" : "myindexer",
        "dataSourceName" : "myazuresqldatasource",
        "targetIndexName" : "target index name"
    }
    ```

An indexer created in this way doesn’t have a schedule. It automatically runs once when it’s created. You can run it again at any time using a **run indexer** request:

    POST https://myservice.search.windows.net/indexers/myindexer/run?api-version=2020-06-30
    api-key: admin-key

You can customize several aspects of indexer behavior, such as batch size and how many documents can be skipped before an indexer execution fails. For more information, see [Create Indexer API](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer).

You may need to allow Azure services to connect to your database. See [Connecting From Azure](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure) for instructions on how to do that.

To monitor the indexer status and execution history (number of items indexed, failures, etc.), use an **indexer status** request:

    GET https://myservice.search.windows.net/indexers/myindexer/status?api-version=2020-06-30
    api-key: admin-key

The response should look similar to the following:

    {
        "\@odata.context":"https://myservice.search.windows.net/$metadata#Microsoft.Azure.Search.V2015_02_28.IndexerExecutionInfo",
        "status":"running",
        "lastResult": {
            "status":"success",
            "errorMessage":null,
            "startTime":"2015-02-21T00:23:24.957Z",
            "endTime":"2015-02-21T00:36:47.752Z",
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
                "startTime":"2015-02-21T00:23:24.957Z",
                "endTime":"2015-02-21T00:36:47.752Z",
                "errors":[],
                "itemsProcessed":1599501,
                "itemsFailed":0,
                "initialTrackingState":null,
                "finalTrackingState":null
            },
            ... earlier history items
        ]
    }

Execution history contains up to 50 of the most recently completed executions, which are sorted in the reverse chronological order (so that the latest execution comes first in the response).
Additional information about the response can be found in [Get Indexer Status](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status)

## Run indexers on a schedule
You can also arrange the indexer to run periodically on a schedule. To do this, add the **schedule** property when creating or updating the indexer. The example below shows a PUT request to update the indexer:

    PUT https://myservice.search.windows.net/indexers/myindexer?api-version=2020-06-30
    Content-Type: application/json
    api-key: admin-key

    {
        "dataSourceName" : "myazuresqldatasource",
        "targetIndexName" : "target index name",
        "schedule" : { "interval" : "PT10M", "startTime" : "2015-01-01T00:00:00Z" }
    }

The **interval** parameter is required. The interval refers to the time between the start of two consecutive indexer executions. The smallest allowed interval is 5 minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours.

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

<a name="CaptureChangedRows"></a>

## Capture new, changed, and deleted rows

Azure Cognitive Search uses **incremental indexing** to avoid having to reindex the entire table or view every time an indexer runs. Azure Cognitive Search provides two change detection policies to support incremental indexing. 

### SQL Integrated Change Tracking Policy
If your SQL database supports [change tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server), we recommend using **SQL Integrated Change Tracking Policy**. This is the most efficient policy. In addition, it allows Azure Cognitive Search to identify deleted rows without you having to add an explicit "soft delete" column to your table.

#### Requirements 

+ Database version requirements:
  * SQL Server 2012 SP3 and later, if you're using SQL Server on Azure VMs.
  * Azure SQL Database or SQL Managed Instance.
+ Tables only (no views). 
+ On the database, [enable change tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server) for the table. 
+ No composite primary key (a primary key containing more than one column) on the table.  

#### Usage

To use this policy, create or update your data source like this:

    {
        "name" : "myazuresqldatasource",
        "type" : "azuresql",
        "credentials" : { "connectionString" : "connection string" },
        "container" : { "name" : "table or view name" },
        "dataChangeDetectionPolicy" : {
           "@odata.type" : "#Microsoft.Azure.Search.SqlIntegratedChangeTrackingPolicy"
      }
    }

When using SQL integrated change tracking policy, do not specify a separate data deletion detection policy - this policy has built-in support for identifying deleted rows. However, for the deletes to be detected "automagically", the document key in your search index must be the same as the primary key in the SQL table. 

> [!NOTE]  
> When using [TRUNCATE TABLE](https://docs.microsoft.com/sql/t-sql/statements/truncate-table-transact-sql) to remove a large number of rows from a SQL table, the indexer needs to be [reset](https://docs.microsoft.com/rest/api/searchservice/reset-indexer) to reset the change tracking state to pick up row deletions.

<a name="HighWaterMarkPolicy"></a>

### High Water Mark Change Detection policy

This change detection policy relies on a "high water mark" column capturing the version or time when a row was last updated. If you're using a view, you must use a high water mark policy. The high water mark column must meet the following requirements.

#### Requirements 

* All inserts specify a value for the column.
* All updates to an item also change the value of the column.
* The value of this column increases with each insert or update.
* Queries with the following WHERE and ORDER BY clauses can be executed efficiently: `WHERE [High Water Mark Column] > [Current High Water Mark Value] ORDER BY [High Water Mark Column]`

> [!IMPORTANT] 
> We strongly recommend using the [rowversion](https://docs.microsoft.com/sql/t-sql/data-types/rowversion-transact-sql) data type for the high water mark column. If any other data type is used, change tracking is not guaranteed to capture all changes in the presence of transactions executing concurrently with an indexer query. When using **rowversion** in a configuration with read-only replicas, you must point the indexer at the primary replica. Only a primary replica can be used for data sync scenarios.

#### Usage

To use a high water mark policy, create or update your data source like this:

    {
        "name" : "myazuresqldatasource",
        "type" : "azuresql",
        "credentials" : { "connectionString" : "connection string" },
        "container" : { "name" : "table or view name" },
        "dataChangeDetectionPolicy" : {
           "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
           "highWaterMarkColumnName" : "[a rowversion or last_updated column name]"
      }
    }

> [!WARNING]
> If the source table does not have an index on the high water mark column, queries used by the SQL indexer may time out. In particular, the `ORDER BY [High Water Mark Column]` clause requires an index to run efficiently when the table contains many rows.
>
>

<a name="convertHighWaterMarkToRowVersion"></a>

##### convertHighWaterMarkToRowVersion

If you're using a [rowversion](https://docs.microsoft.com/sql/t-sql/data-types/rowversion-transact-sql) data type for the high water mark column, consider using the `convertHighWaterMarkToRowVersion` indexer configuration setting. `convertHighWaterMarkToRowVersion` does two things:

* Use the rowversion data type for the high water mark column in the indexer sql query. Using the correct data type improves indexer query performance.
* Subtract 1 from the rowversion value before the indexer query runs. Views with 1 to many joins may have rows with duplicate rowversion values. Subtracting 1 ensures the indexer query doesn't miss these rows.

To enable this feature, create or update the indexer with the following configuration:

    {
      ... other indexer definition properties
     "parameters" : {
            "configuration" : { "convertHighWaterMarkToRowVersion" : true } }
    }

<a name="queryTimeout"></a>

##### queryTimeout

If you encounter timeout errors, you can use the `queryTimeout` indexer configuration setting to set the query timeout to a value higher than the default 5-minute timeout. For example, to set the timeout to 10 minutes, create or update the indexer with the following configuration:

    {
      ... other indexer definition properties
     "parameters" : {
            "configuration" : { "queryTimeout" : "00:10:00" } }
    }

<a name="disableOrderByHighWaterMarkColumn"></a>

##### disableOrderByHighWaterMarkColumn

You can also disable the `ORDER BY [High Water Mark Column]` clause. However, this is not recommended because if the indexer execution is interrupted by an error, the indexer has to re-process all rows if it runs later - even if the indexer has already processed almost all the rows by the time it was interrupted. To disable the `ORDER BY` clause, use the `disableOrderByHighWaterMarkColumn` setting in the indexer definition:  

    {
     ... other indexer definition properties
     "parameters" : {
            "configuration" : { "disableOrderByHighWaterMarkColumn" : true } }
    }

### Soft Delete Column Deletion Detection policy
When rows are deleted from the source table, you probably want to delete those rows from the search index as well. If you use the SQL integrated change tracking policy, this is taken care of for you. However, the high water mark change tracking policy doesn’t help you with deleted rows. What to do?

If the rows are physically removed from the table, Azure Cognitive Search has no way to infer the presence of records that no longer exist.  However, you can use the “soft-delete” technique to logically delete rows without removing them from the table. Add a column to your table or view and mark rows as deleted using that column.

When using the soft-delete technique, you can specify the soft delete policy as follows when creating or updating the data source:

    {
        …,
        "dataDeletionDetectionPolicy" : {
           "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
           "softDeleteColumnName" : "[a column name]",
           "softDeleteMarkerValue" : "[the value that indicates that a row is deleted]"
        }
    }

The **softDeleteMarkerValue** must be a string – use the string representation of your actual value. For example, if you have an integer column where deleted rows are marked with the value 1, use `"1"`. If you have a BIT column where deleted rows are marked with the Boolean true value, use the string literal `True` or `true`, the case doesn't matter.

<a name="TypeMapping"></a>

## Mapping between SQL and Azure Cognitive Search data types
| SQL data type | Allowed target index field types | Notes |
| --- | --- | --- |
| bit |Edm.Boolean, Edm.String | |
| int, smallint, tinyint |Edm.Int32, Edm.Int64, Edm.String | |
| bigint |Edm.Int64, Edm.String | |
| real, float |Edm.Double, Edm.String | |
| smallmoney, money decimal numeric |Edm.String |Azure Cognitive Search does not support converting decimal types into Edm.Double because this would lose precision |
| char, nchar, varchar, nvarchar |Edm.String<br/>Collection(Edm.String) |A SQL string can be used to populate a Collection(Edm.String) field if the string represents a JSON array of strings: `["red", "white", "blue"]` |
| smalldatetime, datetime, datetime2, date, datetimeoffset |Edm.DateTimeOffset, Edm.String | |
| uniqueidentifer |Edm.String | |
| geography |Edm.GeographyPoint |Only geography instances of type POINT with SRID 4326 (which is the default) are supported |
| rowversion |N/A |Row-version columns cannot be stored in the search index, but they can be used for change tracking |
| time, timespan, binary, varbinary, image, xml, geometry, CLR types |N/A |Not supported |

## Configuration Settings
SQL indexer exposes several configuration settings:

| Setting | Data type | Purpose | Default value |
| --- | --- | --- | --- |
| queryTimeout |string |Sets the timeout for SQL query execution |5 minutes ("00:05:00") |
| disableOrderByHighWaterMarkColumn |bool |Causes the SQL query used by the high water mark policy to omit the ORDER BY clause. See [High Water Mark policy](#HighWaterMarkPolicy) |false |

These settings are used in the `parameters.configuration` object in the indexer definition. For example, to set the query timeout to 10 minutes, create or update the indexer with the following configuration:

    {
      ... other indexer definition properties
     "parameters" : {
            "configuration" : { "queryTimeout" : "00:10:00" } }
    }

## FAQ

**Q: Can I use Azure SQL indexer with SQL databases running on IaaS VMs in Azure?**

Yes. However, you need to allow your search service to connect to your database. For more information, see [Configure a connection from an Azure Cognitive Search indexer to SQL Server on an Azure VM](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md).

**Q: Can I use Azure SQL indexer with SQL databases running on-premises?**

Not directly. We do not recommend or support a direct connection, as doing so would require you to open your databases to Internet traffic. Customers have succeeded with this scenario using bridge technologies like Azure Data Factory. For more information, see [Push data to an Azure Cognitive Search index using Azure Data Factory](https://docs.microsoft.com/azure/data-factory/data-factory-azure-search-connector).

**Q: Can I use Azure SQL indexer with databases other than SQL Server running in IaaS on Azure?**

No. We don’t support this scenario, because we haven’t tested the indexer with any databases other than SQL Server.  

**Q: Can I create multiple indexers running on a schedule?**

Yes. However, only one indexer can be running on one node at one time. If you need multiple indexers running concurrently, consider scaling up your search service to more than one search unit.

**Q: Does running an indexer affect my query workload?**

Yes. Indexer runs on one of the nodes in your search service, and that node’s resources are shared between indexing and serving query traffic and other API requests. If you run intensive indexing and query workloads and encounter a high rate of 503 errors or increasing response times, consider [scaling up your search service](search-capacity-planning.md).

**Q: Can I use a secondary replica in a [failover cluster](https://docs.microsoft.com/azure/sql-database/sql-database-geo-replication-overview) as a data source?**

It depends. For full indexing of a table or view, you can use a secondary replica. 

For incremental indexing, Azure Cognitive Search supports two change detection policies: SQL integrated change tracking and High Water Mark.

On read-only replicas, SQL database does not support integrated change tracking. Therefore, you must use High Water Mark policy. 

Our standard recommendation is to use the rowversion data type for the high water mark column. However, using rowversion relies on the `MIN_ACTIVE_ROWVERSION` function, which is not supported on read-only replicas. Therefore, you must point the indexer to a primary replica if you are using rowversion.

If you attempt to use rowversion on a read-only replica, you will see the following error: 

    "Using a rowversion column for change tracking is not supported on secondary (read-only) availability replicas. Please update the datasource and specify a connection to the primary availability replica.Current database 'Updateability' property is 'READ_ONLY'".

**Q: Can I use an alternative, non-rowversion column for high water mark change tracking?**

It's not recommended. Only **rowversion** allows for reliable data synchronization. However, depending on your application logic, it may be safe if:

+ You can ensure that when the indexer runs, there are no outstanding transactions on the table that’s being indexed (for example, all table updates happen as a batch on a schedule, and the Azure Cognitive Search indexer schedule is set to avoid overlapping with the table update schedule).  

+ You periodically do a full reindex to pick up any missed rows. 