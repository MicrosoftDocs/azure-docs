<properties
	pageTitle="Add the SQL Azure API in your Logic Apps | Microsoft Azure"
	description="Overview of SQL Azure API with REST API parameters"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="multiple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/16/2016"
   ms.author="mandia"/>


# Get started with the SQL Azure API
Connect to Azure SQL Database to manage your tables and rows, such as insert rows, get tables, and more.

The Azure SQL Database API can be be used from:

- Logic apps (discussed in this topic)
- PowerApps (see the [PowerApps connections list](https://powerapps.microsoft.com/tutorials/connections-list/) for the complete list)

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With Azure SQL Database, you can:

- Build your business flow based on the data you get from Azure SQL Database. 
- Use actions to get a row, insert a row, and more. These actions get a response, and then make the output available for other actions. For example, you can get a row of data from Azure SQL Database, and then add that data to Excel. 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).


## Triggers and actions
SQL includes the following actions. There are no triggers.

Triggers | Actions
--- | ---
None | <ul><li>Get row</li><li>Get rows</li><li>Insert row</li><li>Delete row</li><li>Get tables</li><li>Update row</li></ul>

All APIs support data in JSON and XML formats.

## Create the connection to SQL
When you add this API to your logic apps, enter the following values:

|Property| Required|Description|
| ---|---|---|
|SQL Connection String|Yes|Enter your Azure SQL Database connection string|

After you create the connection, you enter your the SQL properties, like the table name. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

### Get row 
Retrieves a single row from a SQL table.  
```GET: /datasets/default/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|id|string|yes|path|none|Unique identifier of the row to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get rows 
Retrieves rows from a SQL table.  
```GET: /datasets/default/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Insert row 
Inserts a new row into a SQL table.  
```POST: /datasets/default/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|item|ItemInternalId: string|yes|body|none|Row to insert into the specified table in SQL|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Delete row 
Deletes a row from a SQL table.  
```DELETE: /datasets/default/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|id|string|yes|path|none|Unique identifier of the row to delete|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get tables 
Retrieves tables from a SQL database.  
```GET: /datasets/default/tables``` 

There are no parameters for this call. 

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update row 
Updates an existing row in a SQL table.  
```PATCH: /datasets/default/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|id|string|yes|path|none|Unique identifier of the row to update|
|item|ItemInternalId: string|yes|body|none|Row with updated values|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

## Object definitions

#### DataSetsMetadata

|Property Name | Data Type | Required |
|---|---|---|
|tabular|not defined|no|
|blob|not defined|no|

#### TabularDataSetsMetadata

|Property Name | Data Type | Required |
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|
|tableDisplayName|string|no|
|tablePluralName|string|no|

#### BlobDataSetsMetadata

|Property Name | Data Type |Required |
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|

#### TableMetadata

|Property Name | Data Type |Required |
|---|---|---|
|name|string|no|
|title|string|no|
|x-ms-permission|string|no|
|schema|not defined|no|

#### DataSetsList

|Property Name | Data Type |Required |
|---|---|---|
|value|array|no|

#### DataSet

|Property Name | Data Type |Required |
|---|---|---|
|Name|string|no|
|DisplayName|string|no|

#### Table

|Property Name | Data Type |Required |
|---|---|---|
|Name|string|no|
|DisplayName|string|no|

#### Item

|Property Name | Data Type |Required |
|---|---|---|
|ItemInternalId|string|no|

#### ItemsList

|Property Name | Data Type |Required |
|---|---|---|
|value|array|no|

#### TablesList

|Property Name | Data Type |Required |
|---|---|---|
|value|array|no|


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).
