<properties title="" pageTitle="Indexer Operations (Azure Search Service REST API: 2014-10-20-Preview)" description="Indexer Operations (Azure Search Service REST API: 2014-10-20-Preview)" metaKeywords="" services="search" solutions="" documentationCenter="" authors="HeidiSteen" manager="mblythe" videoId="" scriptId="" />

<tags ms.service="search" ms.devlang="rest-api" ms.workload="search" ms.topic="article"  ms.tgt_pltfrm="na" ms.date="07/08/2015" ms.author="heidist" />

#Indexer Operations (Azure Search Service REST API: 2014-10-20-Preview)

> [AZURE.NOTE] This article describes a prototype of new functionality that is not in the released version of the API. Read more about versions and supportability at [Search Service Versioning](http://msdn.microsoft.com/library/azure/dn864560.aspx) on MSDN. For more information about other features in this preview API, see [Azure Search Service REST API Version: 2014-10-20-Preview](search-api-2014-10-20-preview.md).

## Overview

Azure Search can integrate directly with some common data sources, removing the need to write code to index your data. To set up this up, you can call the Azure Search API to create and manage **indexers** and **data sources**. 

A **data source** specifies what data needs to be indexed, credentials to access the data, and hints to enable Azure Search to efficiently identify changes in the data (such as modified or deleted rows in a database table).

An **indexer** describes how the data flows from your data source into a search index. An indexer can: 

- Perform a one-time copy of the data
- Sync Azure Search index with changes in the data source on a schedule
- Be invoked on-demand at any time to perform the copy

The following data sources are currently supported:

- Azure SQL Database
- DocumentDB 

We're considering adding support for additional data sources in the future. To help us prioritize these decisions, please provide your feedback on the [Azure Search feedback forum](http://feedback.azure.com/forums/263029-azure-search).

**NOTE** The features described here are supported beginning with Azure Search API version `2014-10-20-Preview`.

## Typical Usage Flow

Typical steps to set up automatic indexing are as follows:

1. Identify the data source that contains the data that needs to be indexed. Keep in mind that Azure Search may not support all of the data types present in your data source

2. Create an Azure Search index whose schema is compatible with your data source
  
3. Create an Azure Search data source as described in the Data Source Operations section below
  
4. Create an Azure Search indexer and monitor its execution as described in the Indexer Operations section below

## Naming Rules

- A data source name must only contain lowercase letters, digits or dashes, cannot start or end with dashes and is limited to 128 characters.
- An indexer name must only contain lowercase letters, digits or dashes, cannot start or end with dashes and is limited to 128 characters.

## Limits and Constraints

See [Limits and Constraints page](http://msdn.microsoft.com/library/azure/dn798934.aspx) for details. 

## Data Source Operations
You can create and manage data sources in Azure Search service via simple HTTP requests (POST, GET, PUT, DELETE) against a given data source resource. 

### Create Data Source

You can create a new data source within an Azure Search service using an HTTP POST request.
	
    POST https://[service name].search.windows.net/datasources?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

Alternatively, you can use PUT and specify the data source name on the URI. If the data source does not exist, it will be created.

    PUT https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]

**Note**: The maximum number of data sources allowed varies by pricing tier. The free service allows up to 3 data sources. Standard service allows 50 data sources.

**Request**

HTTPS is required for all service requests. The **Create Data Source** request can be constructed using either a POST or PUT method. When using POST, you must provide a data source name in the request body along with the data source definition. With PUT, the name is part of the URL. If the data source doesn't exist, it is created. If it already exists, it is updated to the new definition. 

The data source name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the data source name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive.

The `api-version` is required. Valid values include `2014-10-20-Preview` or a later version.

**Request Headers**

The following list describes the required and optional request headers. 

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Create Data Source** request must include an `api-key` header set to your admin key (as opposed to a query key). 
 
You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure Preview Portal. See [Create an Azure Search service in the portal](search-create-service-portal.md) for page navigation help.

<a name="CreateDataSourceRequestSyntax"></a>
**Request Body Syntax**

The body of the request contains a data source definition, which includes type of the data source, credentials to read the data, as well as an optional data change detection and data deletion detection policies that are used to efficiently identify changed or deleted data in the data source when used with a periodically scheduled indexer. 


The syntax for structuring the request payload is as follows. A sample request is provided further on in this topic.

    { 
		"name" : "Required for POST, optional for PUT. The name of the data source",
    	"description" : "Optional. Anything you want, or nothing at all",
    	"type" : "Required. Must be 'azuresql' or 'docdb'",
    	"credentials" : { "connectionString" : "Required. Connection string for your Azure SQL database" },
    	"container" : { "name" : "Required. The name of the table or collection you wish to index" },
    	"dataChangeDetectionPolicy" : { Optional. See below for details }, 
    	"dataDeletionDetectionPolicy" : { Optional. See below for details }
	}

Request can contain the following properties: 

- `name`: Required. The name of the data source. A data source name must only contain lowercase letters, digits or dashes, cannot start or end with dashes and is limited to 128 characters.
- `description`: An optional description. 
- `type`: Required. Use `azuresql` for an Azure SQL data source, `docdb` for a  DocumentDB data source.
- `container`: 
	- The required `name` property specifies the table or view (for Azure SQL data source) or collection (for DocumentDB data source) that will be indexed. 
	- DocumentDB data sources also support an optional `query` property that allows you to specify a query that flattens an arbitrary JSON document layout into a flat schema that Azure Search can index.   
- The optional `dataChangeDetectionPolicy` and `dataDeletionDetectionPolicy` are described below.

<a name="DataChangeDetectionPolicies"></a>
**Data Change Detection Policies**

The purpose of a data change detection policy is to efficiently identify changed data items. Supported policies vary based on the data source type. Sections below describe each policy. 

***High Watermark Change Detection Policy*** 

Use this policy when your data source contains a column or property that meets the following criteria:
 
- All inserts specify a value for the column. 
- All updates to an item also change the value of the column. 
- The value of this column increases with each change.
- Queries that use a filter clause similar to the following `WHERE [High Water Mark Column] > [Current High Water Mark Value]` can be executed efficiently.

For example, when using Azure SQL data sources, an indexed `rowversion` column is the ideal candidate for use with with the high water mark policy. 

When using DocumentDB data sources, you must use the `_ts` property provided by DocumentDB.
 
This policy can be specified as follows:

	{ 
		"@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
		"highWaterMarkColumnName" : "[a row version or last_updated column name]" 
	} 

***SQL Integrated Change Detection Policy***

If your SQL database supports [SQL Integrated Change Tracking](http://technet.microsoft.com/library/cc280462.aspx), we recommend using SQL Integrated Change Tracking Policy. This policy enables the most efficient change tracking, and allows Azure Search to identify deleted rows without you having to have an explicit "soft delete" column in your schema.

SQL integrated change tracking is supported starting with the following SQL database versions: 
- SQL Server 2008 R2, if you're using SQL IaaS VMs.
- Azure SQL Database V12, if you're using Azure SQL.  

**NOTE:** When using SQL Integrated Change Tracking policy, do not specify a separate data deletion detection policy - this policy has built-in support for identifying deleted rows. 

**NOTE:** This policy can only be used with tables; it cannot be used with views. You need to enable change tracking for the table you're using before you can use this policy.     
 
SQL integrated change tracking policy can be specified as follows:

	{ 
		"@odata.type" : "#Microsoft.Azure.Search.SqlIntegratedChangeTrackingPolicy" 
	}

<a name="DataDeletionDetectionPolicies"></a>
**Data Deletion Detection Policies**

The purpose of a data deletion detection policy is to efficiently identify deleted data items. Currently, the only supported policy is the `Soft Delete` policy, which is specified as follows:

	{ 
		"@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
		"softDeleteColumnName" : "the column that specifies whether a row was deleted", 
		"softDeleteMarkerValue" : "the value that identifies a row as deleted" 
	}

<a name="CreateDataSourceRequestExamples"></a>
**Request Body Examples**

If you intend to use the data source with an indexer that runs on a schedule, this example shows how to specify policy hints: 

    { 
		"name" : "asqldatasource",
		"description" : "a description",
    	"type" : "azuresql",
    	"credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },
    	"container" : { "name" : "sometable" },
    	"dataChangeDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy", "highWaterMarkColumnName" : "RowVersion" }, 
    	"dataDeletionDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy", "softDeleteColumnName" : "IsDeleted", "softDeleteMarkerValue" : true }
	}

If you only intend to use the data source for one-time copy of the data, policy hints can be omitted:

    { 
		"name" : "asqldatasource",
    	"description" : "anything you want, or nothing at all",
    	"type" : "azuresql",
    	"credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },
    	"container" : { "name" : "sometable" }
	} 

**Response**

For a successful request: 201 Created. 

### Update Data Source

You can update an existing data source using an HTTP PUT request. You specify the name of the data source to update on the request URI:

    PUT https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Request**
The request body syntax is the same as for [Create Data Source requests](#CreateDataSourceRequestSyntax).

**Response**
For a successful request: 201 Created if a new data source was created, and 204 No Content if an existing data source was updated.

**NOTE:**
Some properties cannot be updated on an existing data source. For example, you cannot change the type of an existing data source.  

### List Data Sources

The **List Data Sources** operation returns a list of the data sources in your Azure Search service. 

    GET https://[service name].search.windows.net/datasources?api-version=[api-version]
    api-key: [admin key]

**Response**

For a successful request: 200 OK.

Here is an example response body:

    {
      "value" : [
        {
          "name": "datasource1",
          "type": "azuresql",
		  ... other data source properties
        }]
    }

Note that you can filter the response down to just the properties you're interested in. For example, if you want only a list of data source names, use the OData `$select` query option:

    GET /datasources?api-version=2014-10-20-Preview&$select=name

In this case, the response from the above example would appear as follows: 

    {
      "value" : [ { "name": "datasource1" }, ... ]
    }

This is a useful technique to save bandwidth if you have a lot of data sources in your Search service.

### Get Data Source

The **Get Data Source** operation gets the data source definition from Azure Search.

    GET https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]
    api-key: [admin key]

**Response**

Status Code: 200 OK is returned for a successful response.

The response is similar to examples in [Create Data Source example requests](#CreateDataSourceRequestExamples): 

	{ 
		"name" : "asqldatasource",
		"description" : "a description",
    	"type" : "azuresql",
    	"credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },
    	"container" : { "name" : "sometable" },
    	"dataChangeDetectionPolicy" : { 
            "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
			"highWaterMarkColumnName" : "RowVersion" }, 
    	"dataDeletionDetectionPolicy" : { 
            "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
			"softDeleteColumnName" : "IsDeleted", 
			"softDeleteMarkerValue" : true }
	}

**NOTE** Do not set the `Accept` request header to `application/json;odata.metadata=none` when calling this API as doing so will cause `@odata.type` attribute to be omitted from the response and you won't be able to differentiate between data change and data deletion detection policies of different types. 

### Delete Data Source

The **Delete Data Source** operation removes a data source from your Azure Search service.

    DELETE https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]
    api-key: [admin key]

**NOTE** If any indexers reference the data source that you're deleting, the delete operation will still proceed. However, those indexers will transition into an error state upon their next run.  

**Response**

Status Code: 204 No Content is returned for a successful response.

## Indexer Operations

An indexer is the resource that connects data sources with target search indexes. You should plan on creating one indexer for every target index and data source combination. You can have multiple indexers writing into the same index. However, an indexer can only write into a single index. 

You can create and manage indexers via simple HTTP requests (POST, GET, PUT, DELETE) against a given indexer resource. 

After creating an indexer, you can retrieve its execution status using the [Get Indexer Status](#GetIndexerStatus) operation. You can also run an indexer at any time (instead of or in addition to running it periodically on a schedule) using the [Run Indexer](#RunIndexer) operation.

### Create Indexer

You can create a new indexer within an Azure Search service using an HTTP POST request.
	
    POST https://[service name].search.windows.net/indexers?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

Alternatively, you can use PUT and specify the data source name on the URI. If the data source does not exist, it will be created.

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]

**Note**: The maximum number of indexers allowed varies by pricing tier. The free service allows up to 3 indexers. Standard service allows 50 indexers.

<a name="CreateIndexerRequestSyntax"></a>
**Request Body Syntax**

The body of the request contains an indexer definition, which specifies the data source and the target index for indexing, as well as optional indexing schedule and parameters. 


The syntax for structuring the request payload is as follows. A sample request is provided further on in this topic.

    { 
		"name" : "Required for POST, optional for PUT. The name of the indexer",
    	"description" : "Optional. Anything you want, or null",
    	"dataSourceName" : "Required. The name of an existing data source",
        "targetIndexName" : "Required. The name of an existing index",
        "schedule" : { Optional. See Indexing Schedule below. },
        "parameters" : { Optional. See Indexing Parameters below. }
	}

**Indexing Schedule**

An indexer can optionally specify a schedule. If a schedule is present, the indexer will run periodically as per schedule. Schedule has the following attributes:

- `interval`: Required. A duration value that specifies an interval or period for indexer runs. The smallest allowed interval is 5 minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours. 

- `startTime`: Required. An UTC datetime when the indexer should start running. 

**Indexing Parameters**

An indexer can optionally specify several parameters that affect its behavior. All of the parameters are optional.  

- `maxFailedItems` : The number of items that can fail to be indexed before an indexer run is considered as failure. Default is `0`. Information about failed items is returned by the [Get Indexer Status](#GetIndexerStatus) operation. 

- `maxFailedItemsPerBatch` : The number of items that can fail to be indexed in each batch before an indexer run is considered as failure. Default is `0`.

- `base64EncodeKeys`: Specifies whether or not document keys will be base-64 encoded. Azure Search imposes restrictions on characters that can be present in a document key. However, the values in your source data may contain characters that are invalid. If it is necessary to index such values as document keys, this flag can be set to true. Default is `false`.

<a name="CreateIndexerRequestExamples"></a>
**Request Body Examples**

The following example creates an indexer that copies data from the table referenced by the `ordersds` data source to the `orders` index on a schedule that starts on Jan 1, 2015 UTC and runs hourly. Each indexer invocation will be successful if no more than 5 items fail to be indexed in each batch, and no more than 10 items fail to be indexed in total. 

	{
        "name" : "myindexer",
        "description" : "a cool indexer",
        "dataSourceName" : "ordersds",
        "targetIndexName" : "orders",
        "schedule" : { "interval" : "PT1H", "startTime" : "2015-01-01T00:00:00Z" },
        "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 5, "base64EncodeKeys": false }
	}

**Response**

201 Created for a successful request.

### Update Indexer

You can update an existing indexer using an HTTP PUT request. You specify the name of the indexer to update on the request URI:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

**Request**

The request body syntax is the same as for [Create Indexer requests](#CreateIndexerRequestSyntax).

**Response**

For a successful request: 201 Created if a new indexer was created, and 204 No Content if an existing indexer was updated.

### List Indexers

The **List Indexers** operation returns the list of indexers in your Azure Search service. 

    GET https://[service name].search.windows.net/indexers?api-version=[api-version]
    api-key: [admin key]

**Response**

For a successful request: 200 OK.

Here is an example response body:

    {
      "value" : [
      {
        "name" : "myindexer",
        "description" : "a cool indexer",
        "dataSourceName" : "ordersds",
        "targetIndexName" : "orders",
        ... other indexer properties
	  }]
    }

Note that you can filter the response down to just the properties you're interested in. For example, if you want only a list of indexer names, use the OData `$select` query option:

    GET /indexers?api-version=2014-10-20-Preview&$select=name

In this case, the response from the above example would appear as follows: 

    {
      "value" : [ { "name": "myindexer" } ]
    }

This is a useful technique to save bandwidth if you have a lot of indexers in your Search service.

### Get Indexer

The **Get Indexer** operation gets the indexer definition from Azure Search.

    GET https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    api-key: [admin key]

**Response**

Status Code: 200 OK is returned for a successful response.

The response is similar to examples in [Create Indexer example requests](#CreateIndexerRequestExamples): 

	{
        "name" : "myindexer",
        "description" : "a cool indexer",
        "dataSourceName" : "ordersds",
        "targetIndexName" : "orders",
        "schedule" : { "interval" : "PT1H", "startTime" : "2015-01-01T00:00:00Z" },
        "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 5, "base64EncodeKeys": false }
	}

### Delete Indexer

The **Delete Indexer** operation removes an indexer from your Azure Search service.

    DELETE https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    api-key: [admin key]

When an indexer is deleted, the indexer executions in progress at that time will run to completion, but no further executions will be scheduled. Attempts to use a non-existent indexer will result in HTTP status code 404 Not Found. 
 
**Response**

Status Code: 204 No Content is returned for a successful response.

<a name="RunIndexer"></a>
### Run Indexer

In addition to running periodically on a schedule, an indexer can also be invoked on demand via the **Run Indexer** operation: 

	POST https://[service name].search.windows.net/indexers/[indexer name]/run?api-version=[api-version]
    api-key: [admin key]

**Response**

Status Code: 202 Accepted is returned for a successful response.

<a name="GetIndexerStatus"></a>
### Get Indexer Status

The **Get Indexer Status** operation retrieves the current status and execution history of an indexer: 

	GET https://[service name].search.windows.net/indexers/[indexer name]/status?api-version=[api-version]
    api-key: [admin key]

**Response**

Status Code: 200 OK for a successful response.

The response body contains information about overall indexer health status, the last indexer invocation, as well as the history of recent indexer invocations (if present). 

A sample response body looks like this: 

	{
		"status":"running",
		"lastResult": {
			"status":"success",
			"errorMessage":null,
			"startTime":"2014-11-26T03:37:18.853Z",
			"endTime":"2014-11-26T03:37:19.012Z",
			"errors":[],
			"itemsProcessed":11,
			"itemsFailed":0,
			"initialTrackingState":null,
			"finalTrackingState":null
         },
		"executionHistory":[ {
			"status":"success",
         	"errorMessage":null,
			"startTime":"2014-11-26T03:37:18.853Z",
			"endTime":"2014-11-26T03:37:19.012Z",
			"errors":[],
			"itemsProcessed":11,
			"itemsFailed":0,
			"initialTrackingState":null,
			"finalTrackingState":null
		}]
	}

**Indexer Status**

Indexer status can be one of the following  values:

- `running` indicates that the indexer is running normally. Note that some of the indexer executions may still be failing, so it's a good idea to check the `lastResult` property as well. 

- `error` indicates that the indexer experienced an error that cannot be corrected without human intervention. For example, the data source credentials may have expired, or the schema of the data source or of the target index has changed in a breaking way. 

**Indexer Execution Result**

An indexer execution result contains information about a single indexer execution. The latest result is surfaced as the `lastResult` property of the indexer status. Other recent results, if present, are returned as the `executionHistory` property of the indexer status. 

Indexer execution result contains the following properties: 

- `status`: the status of this execution. See [Indexer Execution Status](#IndexerExecutionStatus) below for details. 

- `errorMessage`: error message for a failed execution. 

- `startTime`: the time in UTC when this execution has started.

- `endTime`: the time in UTC when this execution has ended. This value is not set if the execution is still in progress.

- `errors`: a list of item-level errors, if any. 

- `itemsProcessed`: the number of data source items (for example, table rows) that the indexer attempted to index during this execution. 

- `itemsFailed`: the number of items that failed during this execution.  
 
- `initialTrackingState`: always `null` for the first indexer execution, or if the data change tracking policy is not enabled on the data source used. If such a policy is enabled, in subsequent executions this value indicates the first (lowest) change tracking value processed by this execution. 

- `finalTrackingState`: always `null` if the data change tracking policy is not enabled on the data source used. Otherwise, indicates the latest (highest) change tracking value successfully processed by this execution. 

<a name="IndexerExecutionStatus"></a>
**Indexer Execution Status**

Indexer execution status captures the status of a single indexer execution. It can have the following values:

- `success` indicates that the indexer execution has completed successfully.

- `inProgress` indicates that the indexer execution is in progress. 

- `transientFailure` indicates that the indexer invocation has failed, but the failure may be transient. Indexer invocations will continue per schedule, if one is present. 

- `persistentFailure` indicates that the indexer has failed in a way that likely requires human intervention (for example, because of a schema incompatibility between the data source and the target index). Scheduled indexer executions stop; user action is required to address the issue (described in the `errorMessage` property) and restart indexer execution. 

- `reset` indicates that the indexer has been reset by a call to Reset Indexer API (see below). 

<a name="ResetIndexer"></a>
### Reset Indexer

The **Reset Indexer** operation resets the change tracking state associated with the indexer. This allows you to trigger from-scratch re-indexing (for example, if your data source schema has changed), or to change the data change detection policy for a data source associated with the indexer.   

	POST https://[service name].search.windows.net/indexers/[indexer name]/reset?api-version=[api-version]
    api-key: [admin key]

**Response**

Status Code: 204 No Content for a successful response.

## Mapping between SQL Data Types and Azure Search Data Types

<table style="font-size:12">
<tr>
<td>SQL data type</td>	
<td>Allowed target index field types</td>
<td>Notes</td>
</tr>
<tr>
<td>bit</td>
<td>Edm.Boolean, Edm.String</td>
<td></td>
</tr>
<tr>
<td>int, smallint, tinyint</td>
<td>Edm.Int32, Edm.Int64, Edm.String</td>
<td></td>
</tr>
<tr>
<td>bigint</td>
<td>Edm.Int64, Edm.String</td>
<td></td>
</tr>
<tr>
<td>real, float</td>
<td>Edm.Double, Edm.String</td>
<td></td>
</tr>
<tr>
<td>smallmoney, money<br>decimal<br>numeric
</td>
<td>Edm.String</td>
<td>Azure Search does not support converting decimal types into Edm.Double because this would lose precision
</td>
</tr>
<tr>
<td>char, nchar, varchar, nvarchar</td>
<td>Edm.String</td>
<td></td>
</tr>
<tr>
<td>smalldatetime, datetime, datetime2, date, datetimeoffset</td>
<td>Edm.DateTimeOffset, Edm.String</td>
<td></td>
</tr>
<tr>
<td>uniqueidentifer</td>
<td>Edm.String</td>
<td></td>
</tr>
<tr>
<td>rowversion</td>
<td>N/A</td>
<td>Row-version columns cannot be stored in the search index, but they can be used for change tracking</td>
</tr>
<tr>
<td>time, timespan<br>binary, varbinary, image<br>xml<br>geometry<br> geography<br>CLR types</td>
<td>N/A</td>
<td>Not supported</td>
</tr>
</table>

## Mapping between JSON Data Types and Azure Search Data Types

<table style="font-size:12">
<tr>
<td>JSON data type</td>	
<td>Allowed target index field types</td>
<td>Notes</td>
</tr>
<tr>
<td>bool</td>
<td>Edm.Boolean, Edm.String</td>
<td></td>
</tr>
<tr>
<td>Integral numbers</td>
<td>Edm.Int32, Edm.Int64, Edm.String</td>
<td>JSON doesn’t have typed integers, so we have to assume the widest – 64-bit ints</td>
</tr>
<tr>
<td>Floating-point numbers</td>
<td>Edm.Double, Edm.String</td>
<td></td>
</tr>
<tr>
<td>string</td>
<td>Edm.String</td>
<td></td>
</tr>
<tr>
<td>arrays of primitive types, e.g. [ "a", "b", "c" ]</td>
<td>Collection(Edm.String)</td>
<td></td>
</tr>
<tr>
<td>Strings that look like dates</td>
<td>Edm.DateTimeOffset, Edm.String</td>
<td></td>
</tr>
<tr>
<td>JSON objects</td>
<td>N/A</td>
<td>Not supported; Azure Search currently supports only primitive types and string collections</td>
</tr>
</table> 