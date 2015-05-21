<properties 
pageTitle="Indexer Operations (Azure Search Service REST API: 2015-02-28-Preview)" 
description="Indexer Operations (Azure Search Service REST API: 2015-02-28-Preview)" 
services="search" 
documentationCenter="" 
authors="HeidiSteen" 
manager="mblythe" 
editor="" />

<tags 
ms.service="search" 
ms.devlang="rest-api" 
ms.workload="search" ms.topic="article"  
ms.tgt_pltfrm="na" 
ms.date="04/23/2015" 
ms.author="heidist" />

#Indexer Operations (Azure Search Service REST API: 2015-02-28-Preview)

> [AZURE.NOTE] This article describes indexers in the [2015-02-28-Preview](search-api-2015-02-28-preview.md). Currently the only difference between the `2015-02-28` version documented on [MSDN](http://go.mirosoft.com/fwlink/p/?LinkID=528173) and the `2015-02-28-Preview` version described here is that the preview provides *fieldMappings*, as described in [Create Indexer](#CreateIndexer).

## Overview

Azure Search can integrate directly with some common data sources, removing the need to write code to index your data. To set up this up, you can call the Azure Search API to create and manage **indexers** and **data sources**. 

An **indexer** is a resource that connects data sources with target search indexes. An indexer is used in the following ways: 

- Perform a one-time copy of the data to populate an index.
- Sync an index with changes in the data source on a schedule. The schedule is part of the indexer definition.
- Invoke on-demand to update an index as needed. 

An **indexer** is useful when you want regular updates to an index. You can either set up an inline schedule as part of an indexer definition, or run it on demand using [Run Indexer](#RunIndexer). 

A **data source** specifies what data needs to be indexed, credentials to access the data, and policies to enable Azure Search to efficiently identify changes in the data (such as modified or deleted rows in a database table). It's defined as an independent resource so that it can be used by multiple indexers.

The following data sources are currently supported:

- Azure SQL Database and SQL Server on Azure VMs
- Azure DocumentDB 

We're considering adding support for additional data sources in the future. To help us prioritize these decisions, please provide your feedback on the [Azure Search feedback forum](http://feedback.azure.com/forums/263029-azure-search).

See [Limits and constraints](https://msdn.microsoft.com/library/azure/dn798934.aspx) for maximum limits related to indexer and data source resources.

## Typical Usage Flow

You can create and manage indexers and data sources via simple HTTP requests (POST, GET, PUT, DELETE) against a given `data source` or `indexer` resource.

Setting up automatic indexing is typically a four step process:

1. Identify the data source that contains the data that needs to be indexed. Keep in mind that Azure Search may not support all of the data types present in your data source. See [Supported data types](https://msdn.microsoft.com/library/azure/dn798938.aspx) for the list.

2. Create an Azure Search index whose schema is compatible with your data source.
  
3. Create an Azure Search data source as described in [Create Data Source](#CreateDataSource).
  
4. Create an Azure Search indexer as described [Create Indexer](#CreateIndexer).

You should plan on creating one indexer for every target index and data source combination. You can have multiple indexers writing into the same index, and you can reuse the same data source for multiple indexers. However, an indexer can only consume one data source at a time, and can only write to a single index. 

After creating an indexer, you can retrieve its execution status using the [Get Indexer Status](#GetIndexerStatus) operation. You can also run an indexer at any time (instead of or in addition to running it periodically on a schedule) using the [Run Indexer](#RunIndexer) operation.

<!-- MSDN has 2 art files plus a API topic link list -->


## Create Data Source

You can create a new data source within an Azure Search service using an HTTP POST request.
	
    POST https://[service name].search.windows.net/datasources?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

Alternatively, you can use PUT and specify the data source name on the URI. If the data source does not exist, it will be created.

    PUT https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]

**Note**: The maximum number of data sources allowed varies by pricing tier. The free service allows up to 3 data sources. Standard service allows 50 data sources. See [Limits and constraints](https://msdn.microsoft.com/library/azure/dn798934.aspx) for details.

**Request**

HTTPS is required for all service requests. The **Create Data Source** request can be constructed using either a POST or PUT method. When using POST, you must provide a data source name in the request body along with the data source definition. With PUT, the name is part of the URL. If the data source doesn't exist, it is created. If it already exists, it is updated to the new definition. 

The data source name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the data source name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive. See [Naming rules](https://msdn.microsoft.com/library/azure/dn857353.aspx) for details.

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

**Request Headers**

The following list describes the required and optional request headers. 

- `Content-Type`: Required. Set this to `application/json`
- `api-key`: Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Create Data Source** request must include an `api-key` header set to your admin key (as opposed to a query key). 
 
You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the [Azure management portal](https://portal.azure.com/). See [Create a Search service in the portal](search-create-service-portal.md) for page navigation help.

<a name="CreateDataSourceRequestSyntax"></a>
**Request Body Syntax**

The body of the request contains a data source definition, which includes type of the data source, credentials to read the data, as well as an optional data change detection and data deletion detection policies that are used to efficiently identify changed or deleted data in the data source when used with a periodically scheduled indexer. 


The syntax for structuring the request payload is as follows. A sample request is provided further on in this topic.

    { 
		"name" : "Required for POST, optional for PUT. The name of the data source",
    	"description" : "Optional. Anything you want, or nothing at all",
    	"type" : "Required. Must be 'azuresql' or 'documentdb'",
    	"credentials" : { "connectionString" : "Required. Connection string for your data source" },
    	"container" : { "name" : "Required. The name of the table or collection you wish to index" },
    	"dataChangeDetectionPolicy" : { Optional. See below for details }, 
    	"dataDeletionDetectionPolicy" : { Optional. See below for details }
	}

Request contains the following properties: 

- `name`: Required. The name of the data source. A data source name must only contain lowercase letters, digits or dashes, cannot start or end with dashes and is limited to 128 characters.
- `description`: An optional description. 
- `type`: Required. Must be one of the supported data source types:
	- `azuresql` - Azure SQL Database or SQL Server on Azure VMs
	- `documentdb` - Azure DocumentDB
- `credentials`:
	- The required `connectionString` property specifies the connection string for the data source. The format of the connection string depends on the data source type: 
		- For Azure SQL, this is the usual SQL Server connection string. If you're using the Azure management portal to retrieve the connection string, use the `ADO.NET connection string` option.
		- For DocumentDB, the connection string must be in the following format: `"AccountEndpoint=https://[your account name].documents.azure.com;AccountKey=[your account key];Database=[your database id]"`. All of the values are required. You can find them in the [Azure management portal](https://portal.azure.com/).   
		
- `container`: 
	- The required `name` property specifies the table or view (for Azure SQL data source) or collection (for DocumentDB data source) that will be indexed. 
	- DocumentDB data sources also support an optional `query` property that allows you to specify a query that flattens an arbitrary JSON document layout into a flat schema that Azure Search can index.   
- The optional `dataChangeDetectionPolicy` and `dataDeletionDetectionPolicy` are described below.

<a name="DataChangeDetectionPolicies"></a>
**Data Change Detection Policies**

The purpose of a data change detection policy is to efficiently identify changed data items. Supported policies vary based on the data source type. Sections below describe each policy. 

**NOTE:** You can switch data detection policies after the indexer is already created, using the [Reset Indexer](#ResetIndexer) API.

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

If your SQL database supports [change tracking](https://msdn.microsoft.com/library/bb933875.aspx), we recommend using SQL Integrated Change Tracking Policy. This policy enables the most efficient change tracking, and allows Azure Search to identify deleted rows without you having to have an explicit "soft delete" column in your schema.

Integrated change tracking is supported starting with the following SQL Server database versions: 
- SQL Server 2008 R2, if you're using SQL Server on Azure VMs.
- Azure SQL Database V12, if you're using Azure SQL Database.  

When using SQL Integrated Change Tracking policy, do not specify a separate data deletion detection policy - this policy has built-in support for identifying deleted rows. 

This policy can only be used with tables; it cannot be used with views. You need to enable change tracking for the table you're using before you can use this policy. See [Enable and disable change tracking](https://msdn.microsoft.com/library/bb964713.aspx) for instructions.    
 
When structuring the **Create Data Source** request, SQL integrated change tracking policy can be specified as follows:

	{ 
		"@odata.type" : "#Microsoft.Azure.Search.SqlIntegratedChangeTrackingPolicy" 
	}

<a name="DataDeletionDetectionPolicies"></a>
**Data Deletion Detection Policies**

The purpose of a data deletion detection policy is to efficiently identify deleted data items. Currently, the only supported policy is the `Soft Delete` policy, which allows identifying deleted items based on the value of a `soft delete` column or property in the data source. This policy can be specified as follows:

	{ 
		"@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
		"softDeleteColumnName" : "the column that specifies whether a row was deleted", 
		"softDeleteMarkerValue" : "the value that identifies a row as deleted" 
	}

**NOTE:** Only columns with string, integer, or boolean values are supported. The value used as `softDeleteMarkerValue` must be a string, even if the corresponding column holds integers or booleans. For example, if the value that appears in your data source is 1, use `"1"` as the `softDeleteMarkerValue`.    

<a name="CreateDataSourceRequestExamples"></a>
**Request Body Examples**

If you intend to use the data source with an indexer that runs on a schedule, this example shows how to specify change and deletion detection policies: 

    { 
		"name" : "asqldatasource",
		"description" : "a description",
    	"type" : "azuresql",
    	"credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },
    	"container" : { "name" : "sometable" },
    	"dataChangeDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy", "highWaterMarkColumnName" : "RowVersion" }, 
    	"dataDeletionDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy", "softDeleteColumnName" : "IsDeleted", "softDeleteMarkerValue" : "true" }
	}

If you only intend to use the data source for one-time copy of the data, the policies can be omitted:

    { 
		"name" : "asqldatasource",
    	"description" : "anything you want, or nothing at all",
    	"type" : "azuresql",
    	"credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },
    	"container" : { "name" : "sometable" }
	} 

**Response**

For a successful request: 201 Created. 

<a name="UpdateDataSource"></a>
## Update Data Source

You can update an existing data source using an HTTP PUT request. You specify the name of the data source to update on the request URI:

    PUT https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

**Request**
The request body syntax is the same as for [Create Data Source requests](#CreateDataSourceRequestSyntax).

**Response**
For a successful request: 201 Created if a new data source was created, and 204 No Content if an existing data source was updated.

**NOTE:**
Some properties cannot be updated on an existing data source. For example, you cannot change the type of an existing data source.  

<a name="ListDataSource"></a>
## List Data Sources

The **List Data Sources** operation returns a list of the data sources in your Azure Search service. 

    GET https://[service name].search.windows.net/datasources?api-version=[api-version]
    api-key: [admin key]

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

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

    GET /datasources?api-version=205-02-28&$select=name

In this case, the response from the above example would appear as follows: 

    {
      "value" : [ { "name": "datasource1" }, ... ]
    }

This is a useful technique to save bandwidth if you have a lot of data sources in your Search service.

<a name="GetDataSource"></a>
## Get Data Source

The **Get Data Source** operation gets the data source definition from Azure Search.

    GET https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]
    api-key: [admin key]

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

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
			"softDeleteMarkerValue" : "true" }
	}

**NOTE** Do not set the `Accept` request header to `application/json;odata.metadata=none` when calling this API as doing so will cause `@odata.type` attribute to be omitted from the response and you won't be able to differentiate between data change and data deletion detection policies of different types. 

<a name="DeleteDataSource"></a>
## Delete Data Source

The **Delete Data Source** operation removes a data source from your Azure Search service.

    DELETE https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]
    api-key: [admin key]

**NOTE** If any indexers reference the data source that you're deleting, the delete operation will still proceed. However, those indexers will transition into an error state upon their next run.  

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

**Response**

Status Code: 204 No Content is returned for a successful response.

<a name="CreateIndexer"></a>
## Create Indexer

You can create a new indexer within an Azure Search service using an HTTP POST request.
	
    POST https://[service name].search.windows.net/indexers?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

Alternatively, you can use PUT and specify the data source name on the URI. If the data source does not exist, it will be created.

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]

**Note**: The maximum number of indexers allowed varies by pricing tier. The free service allows up to 3 indexers. Standard service allows 50 indexers. See [Limits and constraints](https://msdn.microsoft.com/library/azure/dn798934.aspx) for details.

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.


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
        "parameters" : { Optional. See Indexing Parameters below. },
        "fieldMappings" : { Optional. See Field Mappings below. }
	}

**Indexer Schedule**

An indexer can optionally specify a schedule. If a schedule is present, the indexer will run periodically as per schedule. Schedule has the following attributes:

- `interval`: Required. A duration value that specifies an interval or period for indexer runs. The smallest allowed interval is 5 minutes; the longest is one day. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours. 

- `startTime`: Required. An UTC datetime when the indexer should start running. 

**Indexer Parameters**

An indexer can optionally specify several parameters that affect its behavior. All of the parameters are optional.  

- `maxFailedItems`: The number of items that can fail to be indexed before an indexer run is considered a failure. Default is 0. Information about failed items is returned by the [Get Indexer Status](#GetIndexerStatus) operation. 

- `maxFailedItemsPerBatch`: The number of items that can fail to be indexed in each batch before an indexer run is considered a failure. Default is 0.

- `base64EncodeKeys`: Specifies whether or not document keys will be base-64 encoded. Azure Search imposes restrictions on characters that can be present in a document key. However, the values in your source data may contain characters that are invalid. If it is necessary to index such values as document keys, this flag can be set to true. Default is `false`.

**Field Mappings**

You can use field mappings to map a field name in the data source to a different field name in the target index. For example, consider a source table with a field `_id`. Azure Search doesn't allow a field name starting with an underscore, so the field must be renamed. This can be done using the `fieldMappings` property of indexer as follows: 
	
	"fieldMappings" : [ { "sourceFieldName" : "_id", "targetFieldName" : "id" } ] 

You can specify multiple field mappings: 

	"fieldMappings" : [ 
		{ "sourceFieldName" : "_id", "targetFieldName" : "id" },
        { "sourceFieldName" : "_timestamp", "targetFieldName" : "timestamp" },
	 ]

Both source and target field names are case-insensitive.

<a name="FieldMappingFunctions"></a>
***Field Mapping Functions***

Field mappings can also be used to transform source field values using *mapping functions*.

Only one such function is currently supported: `jsonArrayToStringCollection`. It parses a field that contains a string formatted as a JSON array into a Collection(Edm.String) field in the target index. It is intended for use with Azure SQL indexer in particular, since SQL doesn't have a native collection data type. It can be used as follows: 

	"fieldMappings" : [ { "sourceFieldName" : "tags", "mappingFunction" : { "name" : "jsonArrayToStringCollection" } } ] 

For example, if the source field contains the string `["red", "white", "blue"]`, then the target field of type `Collection(Edm.String)` will be populated with the three values `"red"`, `"white"` and `"blue"`. 

NOTE: `targetFieldName` property is optional; if left out, the `sourceFieldName` value is used). 

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


<a name="UpdateIndexer"></a>
## Update Indexer

You can update an existing indexer using an HTTP PUT request. You specify the name of the indexer to update on the request URI:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    Content-Type: application/json
    api-key: [admin key]

The `api-version` is required. The current version is `2015-02-28`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

**Request**

The request body syntax is the same as for [Create Indexer requests](#CreateIndexerRequestSyntax).

**Response**

For a successful request: 201 Created if a new indexer was created, and 204 No Content if an existing indexer was updated.


<a name="ListIndexers"></a>
## List Indexers

The **List Indexers** operation returns the list of indexers in your Azure Search service. 

    GET https://[service name].search.windows.net/indexers?api-version=[api-version]
    api-key: [admin key]


The `api-version` is required. The preview version is `2015-02-28-Preview`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

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


<a name="GetIndexer"></a>
## Get Indexer

The **Get Indexer** operation gets the indexer definition from Azure Search.

    GET https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    api-key: [admin key]

The `api-version` is required. The preview version is `2015-02-28-Preview`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

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


<a name="DeleteIndexer"></a>
## Delete Indexer

The **Delete Indexer** operation removes an indexer from your Azure Search service.

    DELETE https://[service name].search.windows.net/indexers/[indexer name]?api-version=[api-version]
    api-key: [admin key]

When an indexer is deleted, the indexer executions in progress at that time will run to completion, but no further executions will be scheduled. Attempts to use a non-existent indexer will result in HTTP status code 404 Not Found. 
 
The `api-version` is required. The preview version is `2015-02-28-Preview`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

**Response**

Status Code: 204 No Content is returned for a successful response.

<a name="RunIndexer"></a>
## Run Indexer

In addition to running periodically on a schedule, an indexer can also be invoked on demand via the **Run Indexer** operation: 

	POST https://[service name].search.windows.net/indexers/[indexer name]/run?api-version=[api-version]
    api-key: [admin key]

The `api-version` is required. The preview version is `2015-02-28-Preview`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

**Response**

Status Code: 202 Accepted is returned for a successful response.

<a name="GetIndexerStatus"></a>
## Get Indexer Status

The **Get Indexer Status** operation retrieves the current status and execution history of an indexer: 

	GET https://[service name].search.windows.net/indexers/[indexer name]/status?api-version=[api-version]
    api-key: [admin key]


The `api-version` is required. The preview version is `2015-02-28-Preview`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

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

- `status`: the status of an execution. See [Indexer Execution Status](#IndexerExecutionStatus) below for details. 

- `errorMessage`: error message for a failed execution. 

- `startTime`: the time in UTC when this execution started.

- `endTime`: the time in UTC when this execution ended. This value is not set if the execution is still in progress.

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

- `transientFailure` indicates that an indexer execution has failed. See `errorMessage` property for details. The failure may or may not require human intervention to fix - for example, fixing a schema incom
- patibility between the data source and the target index requires user action, while a temporary data source downtime does not. Indexer invocations will continue per schedule, if one is present. 

- `persistentFailure` indicates that the indexer has failed in a way that requires human intervention. Scheduled indexer executions stop. After addressing the issue, use Reset Indexer API to restart the scheduled executions. 

- `reset` indicates that the indexer has been reset by a call to Reset Indexer API (see below). 

<a name="ResetIndexer"></a>
## Reset Indexer

The **Reset Indexer** operation resets the change tracking state associated with the indexer. This allows you to trigger from-scratch re-indexing (for example, if your data source schema has changed), or to change the data change detection policy for a data source associated with the indexer.   

	POST https://[service name].search.windows.net/indexers/[indexer name]/reset?api-version=[api-version]
    api-key: [admin key]

The `api-version` is required. The preview version is `2015-02-28-Preview`. [Azure Search versioning](https://msdn.microsoft.com/library/azure/dn864560.aspx) has details and more information about alternative versions.

The `api-key` must be an admin key (as opposed to a query key). Refer to the authentication section in [Search Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to learn more about keys. [Create a Search service in the portal](search-create-service-portal.md) explains how to get the service URL and key properties used in the request.

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
<td>Edm.String<br/>Collection(Edm.String)</td>
<td>See [Field Mapping Functions](#FieldMappingFunctions) in this document for details on how to transform a string column into a Collection(Edm.String)</td>
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
<td>geography</td>
<td>Edm.GeographyPoint</td>
<td>Only geography instances of type POINT with SRID 4326 (which is the default) are supported</td>
</tr>
<tr>
<td>rowversion</td>
<td>N/A</td>
<td>Row-version columns cannot be stored in the search index, but they can be used for change tracking</td>
</tr>
<tr>
<td>time, timespan<br>binary, varbinary, image,<br>xml, geometry, CLR types</td>
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
<td></td>
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
<td>GeoJSON point objects</td>
<td>Edm.GeographyPoint</td>
<td>GeoJSON points are JSON objects in the following format: { "type" : "Point", "coordinates" : [long, lat] } </td>
</tr>
<tr>
<td>Other JSON objects</td>
<td>N/A</td>
<td>Not supported; Azure Search currently supports only primitive types and string collections</td>
</tr>
</table>