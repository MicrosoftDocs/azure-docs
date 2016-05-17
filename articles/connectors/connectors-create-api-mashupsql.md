<properties
pageTitle="Sql Connector | Microsoft Azure"
description="Create Logic apps with Azure App service. The Sql connector provides an API to work with Sql Databases."
services="app-servicelogic"	
documentationCenter=".net,nodejs,java" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors" />

<tags
ms.service="app-service-logic"
ms.devlang="multiple"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="04/29/2016"
ms.author="deonhe"/>

# Get started with the Sql Connector connector



The Sql Connector connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flows](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The Sql Connector connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The Sql Connector connector has the following action(s) and/or trigger(s) available:

### Sql Connector actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[GetTables](connectors-create-api-sqlconnector.md#gettables)|Retrieves tables from a SQL database|
|[PostItem](connectors-create-api-sqlconnector.md#postitem)|Inserts a new row into a SQL table|
|[GetItem](connectors-create-api-sqlconnector.md#getitem)|Retrieves a single row from a SQL table|
|[DeleteItem](connectors-create-api-sqlconnector.md#deleteitem)|Deletes a row from a SQL table|
|[PatchItem](connectors-create-api-sqlconnector.md#patchitem)|Updates an existing row in a SQL table|
### Sql Connector triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|


## Create a connection to Sql Connector
To create Logic apps with Sql Connector, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|SqlConnectionString|Yes|Provide Your SQL Connection String|
After you create the connection, you can use it to execute the actions and listen for the triggers described in this article. 

>[AZURE.INCLUDE [Steps to create a connection to Mashup SQL](../../includes/connectors-create-api-mashupsql.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for Sql Connector
Applies to version: 1.0

## GetTables
Get tables: Retrieves tables from a SQL database 

```GET: /datasets/default/tables``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## PostItem
Insert row: Inserts a new row into a SQL table 

```POST: /datasets/default/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|item| |yes|body|none|Row to insert into the specified table in SQL|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## GetItem
Get row: Retrieves a single row from a SQL table 

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


## DeleteItem
Delete row: Deletes a row from a SQL table 

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


## PatchItem
Update row: Updates an existing row in a SQL table 

```PATCH: /datasets/default/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Name of SQL table|
|id|string|yes|path|none|Unique identifier of the row to update|
|item| |yes|body|none|Row with updated values|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## Object definitions 

### DataSetsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|tabular|not defined|No |
|blob|not defined|No |



### TabularDataSetsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|source|string|No |
|displayName|string|No |
|urlEncoding|string|No |
|tableDisplayName|string|No |
|tablePluralName|string|No |



### BlobDataSetsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|source|string|No |
|displayName|string|No |
|urlEncoding|string|No |



### TableMetadata


| Property Name | Data Type | Required |
|---|---|---|
|name|string|No |
|title|string|No |
|x-ms-permission|string|No |
|x-ms-capabilities|not defined|No |
|schema|not defined|No |



### TableCapabilitiesMetadata


| Property Name | Data Type | Required |
|---|---|---|
|sortRestrictions|not defined|No |
|filterRestrictions|not defined|No |
|filterFunctions|array|No |



### Object


| Property Name | Data Type | Required |
|---|---|---|



### TableSortRestrictionsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|sortable|boolean|No |
|unsortableProperties|array|No |
|ascendingOnlyProperties|array|No |



### TableFilterRestrictionsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|filterable|boolean|No |
|nonFilterableProperties|array|No |
|requiredProperties|array|No |



### DataSetsList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### DataSet


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|No |
|DisplayName|string|No |



### Table


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|No |
|DisplayName|string|No |



### Item


| Property Name | Data Type | Required |
|---|---|---|
|ItemInternalId|string|No |



### TablesList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### ItemsList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)