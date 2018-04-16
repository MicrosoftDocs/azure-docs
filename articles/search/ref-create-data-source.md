---
title: "Create Data Source (Azure Search Service REST API)"
ms.custom: ""
ms.date: 05/01/2018
ms.prod: "azure"
ms.reviewer: ""
ms.service: search
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: rest-api
applies_to:
  - "Azure"
author: "Brjohnstmsft"
ms.author: "brjohnst"
manager: "jhubbard"
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Create Data Source (Azure Search Service REST API)
  In Azure Search, a data source is used with indexers, providing the connection information for ad hoc or scheduled data refresh of a target index. You can create a new data source within an Azure Search service using an HTTP POST request.  

```  
POST https://[service name].search.windows.net/datasources?api-version=[api-version]  
Content-Type: application/json  
api-key: [admin key]  
```  

 Alternatively, you can use PUT and specify the data source name on the URI. If the data source does not exist, it will be created.  

```  
PUT https://[service name].search.windows.net/datasources/[datasource name]?api-version=[api-version]  
```  

> [!NOTE]  
>  The maximum number of data sources allowed varies by pricing tier. The free service allows up to 3 data sources. Standard service allows 50 data sources. See [Service Limits](https://azure.microsoft.com/documentation/articles/search-limits-quotas-capacity/) for details.  

## Request  
 HTTPS is required for all service requests. The **Create Data Source** request can be constructed using either a POST or PUT method. When using POST, you must provide a data source name in the request body along with the data source definition. With PUT, the name is part of the URL. If the data source doesn't exist, it is created. If it already exists, it is updated to the new definition  

 The data source name must be lower case, start with a letter or number, have no slashes or dots, and be less than 128 characters. After starting the data source name with a letter or number, the rest of the name can include any letter, number and dashes, as long as the dashes are not consecutive. See [Naming rules &#40;Azure Search&#41;](naming-rules.md) for details.  

 The **api-version** is required. The current version is `2016-09-01`. See [API versions in Azure Search](https://go.microsoft.com/fwlink/?linkid=834796) for details.  

### Request Header  
 The following list describes the required and optional request headers.  

|Request Header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set this to `application/json`|  
|*api-key:*|Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Create Data Source** request must include an `api-key` header set to your admin key (as opposed to a query key).|  

 You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the [Azure portal](https://portal.azure.com). See [Create an Azure Search service in the portal](https://azure.microsoft.com/documentation/articles/search-create-service-portal/) for page navigation help.  

### Request Body Syntax  
 The body of the request contains a data source definition, which includes type of the data source, credentials to read the data, as well as an optional data change detection and data deletion detection policies that are used to efficiently identify changed or deleted data in the data source when used with a periodically scheduled indexer  

 The syntax for structuring the request payload is as follows. A sample request is provided further on in this topic.  

```  
{   
    "name" : "Required for POST, optional for PUT. The name of the data source",  
    "description" : "Optional. Anything you want, or nothing at all",  
    "type" : "Required. Must be one of 'azuresql', 'documentdb', 'azureblob', or 'azuretable'",
    "credentials" : { "connectionString" : "Required. Connection string for your data source" },  
    "container" : { "name" : "Required. Name of the table, collection, or blob container you wish to index" },  
    "dataChangeDetectionPolicy" : { Optional. See below for details },   
    "dataDeletionDetectionPolicy" : { Optional. See below for details }  
}  

```  

 Request contains the following properties:  

|Property|Description|  
|--------------|-----------------|  
|`name`|Required. The name of the data source. A data source name must only contain lowercase letters, digits or dashes, cannot start or end with dashes and is limited to 128 characters.|  
|`description`|An optional description.|  
|`type`|Required. Must be one of the supported data source types:<br /><br /> 1. `azuresql` for Azure SQL Database<br />2. `documentdb` for the Azure Cosmos DB SQL API<br />3. `azureblob` - Azure Blob Storage <br />4. `azuretable` - Azure Table Storage|
|`credentials`|The required **connectionString** property specifies the connection string for the data source. The format of the connection string depends on the data source type:<br /><br /> -   For Azure SQL Database, this is the usual SQL Server connection string. If you're using Azure portal to retrieve the connection string, use the `ADO.NET connection string` option.<br />-   For Azure Cosmos DB, the connection string must be in the following format: `"AccountEndpoint=https://[your account name].documents.azure.com;AccountKey=[your account key];Database=[your database id]"`. All of the values are required. You can find them in the [Azure portal](https://portal.azure.com).|  
|`container`|Required. Specifies the data to index using the `name` and `query` properties: <br /><br />`name`, required:<br />- Azure SQL: specifies the table or view. You can use schema-qualified names, such as `[dbo].[mytable]`.<br />- Azure Cosmos DB: specifies the SQL API collection. <br />- Azure Blob Storage: specifies the storage container.<br />- Azure Table Storage: specifies the name of the table. <br /><br />`query`, optional:<br />- Azure Cosmos DB: allows you to specify a query that flattens an arbitrary JSON document layout into a flat schema that Azure Search can index.<br />- Azure Blob Storage: allows you to specify a virtual folder within the blob container. For example, for blob path `mycontainer/documents/blob.pdf`, `documents` can be used as the virtual folder.<br />- Azure Table Storage: allows you to specify a query that filters the set of rows to be imported.<br />- Azure SQL: query is not supported. If you need this functionality, please vote for [this suggestion](https://feedback.azure.com/forums/263029-azure-search/suggestions/9893490-support-user-provided-query-in-sql-indexer) |  

 The optional **dataChangeDetectionPolicy** and **dataDeletionDetectionPolicy** are described below.  

### Data Change Detection Policies  
 The purpose of a data change detection policy is to efficiently identify changed data items. Supported policies vary based on the data source type. Sections below describe each policy  

> [!NOTE]  
>  You can switch data detection policies after the indexer is already created, using [Reset Indexer &#40;Azure Search Service REST API&#41;](reset-indexer.md).  

 **High Watermark Change Detection Policy**  

 Use this policy when your data source contains a column or property that meets the following criteria:  

-   All inserts specify a value for the column.  

-   All updates to an item also change the value of the column.  

-   The value of this column increases with each change.  

-   Queries that use a filter clause similar to the following `WHERE [High Water Mark Column] > [Current High Water Mark Value]` can be executed efficiently.  

 For example, when using Azure SQL data sources, an indexed `rowversion` column is the ideal candidate for use with the high water mark policy.  

 This policy can be specified as follows:  

```  
{   
    "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",  
    "highWaterMarkColumnName" : "[a row version or last_updated column name]"   
}  

```  
When using Azure Cosmos DB data sources, you must use the `_ts` property provided by Azure Cosmos DB.

When using Azure Blob data sources, Azure Search automatically uses a high watermark change detection policy based on a blob's last-modified timestamp; you don't need to specify such a policy yourself.   

 **SQL Integrated Change Detection Policy**  

 If your SQL Server relational database supports [change tracking](https://msdn.microsoft.com/library/bb933875.aspx), we recommend using SQL Integrated Change Tracking Policy. This policy enables the most efficient change tracking, and allows Azure Search to identify deleted rows without you having to have an explicit "soft delete" column in your schema.  

 Integrated change tracking is supported starting with the following SQL Server database versions:  

-   SQL Server 2008 R2, if you're using SQL Server on Azure VMs.  

-   Azure SQL Database V12, if you're using Azure SQL Database.  

 When using SQL Integrated Change Tracking policy, do not specify a separate data deletion detection policy - this policy has built-in support for identifying deleted rows.  

 This policy can only be used with tables; it cannot be used with views. You need to enable change tracking for the table you're using before you can use this policy. See [Enable and disable change tracking](https://msdn.microsoft.com/library/bb964713.aspx) for instructions.  

 When structuring the **Create Data Source** request, SQL integrated change tracking policy can be specified as follows:  

```  
{   
    "@odata.type" : "#Microsoft.Azure.Search.SqlIntegratedChangeTrackingPolicy"   
}  
```  

### Data Deletion Detection Policies  
 The purpose of a data deletion detection policy is to efficiently identify deleted data items. Currently, the only supported policy is the **Soft Delete** policy, which allows identifying deleted items based on the value of a 'soft delete' column or property in the data source. This policy can be specified as follows:  

```  
{   
    "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",  
    "softDeleteColumnName" : "the column that specifies whether a row was deleted",   
    "softDeleteMarkerValue" : "the value that identifies a row as deleted"   
}  

```  

> [!NOTE]  
>  Only columns with string, integer, or boolean values are supported. The value used as **softDeleteMarkerValue** must be a string, even if the corresponding column holds integers or booleans. For example, if the value that appears in your data source is 1, use **"1"** as the **softDeleteMarkerValue**.  

### Request Body Examples  
 If you intend to use the data source with an indexer that runs on a schedule, this example shows how to specify change and deletion detection policies:  

```  
{   
    "name" : "asqldatasource",  
    "description" : "a description",  
    "type" : "azuresql",  
    "credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },  
    "container" : { "name" : "sometable" },  
    "dataChangeDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy", "highWaterMarkColumnName" : "RowVersion" },   
    "dataDeletionDetectionPolicy" : { "@odata.type" : "#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy", "softDeleteColumnName" : "IsDeleted", "softDeleteMarkerValue" : "true" }  
}  

```  

 If you only intend to use the data source for one-time copy of the data, the policies can be omitted:  

```  
{   
    "name" : "asqldatasource",  
    "description" : "anything you want, or nothing at all",  
    "type" : "azuresql",  
    "credentials" : { "connectionString" : "Server=tcp:....database.windows.net,1433;Database=...;User ID=...;Password=...;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;" },  
    "container" : { "name" : "sometable" }  
}   
```  

## Response  
 For a successful request: 201 Created.  


