<properties
pageTitle="Add the Excel API in PowerApps Enterprise and Logic Apps | Microsoft Azure"
description="Overview of the Excel API with REST API parameters"
services=""	
documentationCenter="" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors"/>

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="na"
ms.date="02/18/2016"
ms.author="deonhe"/>

# Get started with the Excel API

Excel Connector

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Excel](../app-service-logic/app-service-logic-connector-Excel.md).

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Excel connector, you can:

* Use it to build logic apps
* Use it to build power apps


For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
Excel includes the following action. There are no triggers. 

|Trigger|Actions|
|--- | ---|
|None | <ul><li>Get rows</li><li>Insert row</li><li>Delete row</li><li>Get row</li><li>Get tables</li><li>Update row</li></ul>

All APIs support data in JSON and XML formats. 


## Create a connection to Excel
To use the Excel API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|fileSource|Yes|Provide a Connection to file source|  

>[AZURE.TIP] You can use this connection in other logic apps.

## Swagger REST API reference
#### This documentation is for version: 1.0


### Inserts a new row into an Excel table
**```POST: /datasets/{dataset}/tables/{table}/items```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Excel file name|
|table|string|yes|path|none|Excel table name|
|item| |yes|body|none|Row to insert into the specified Excel table|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Retrieves a single row from an Excel table
**```GET: /datasets/{dataset}/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Excel file name|
|table|string|yes|path|none|Excel table name|
|id|string|yes|path|none|Unique identifier of row to retrieve|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Deletes a row from an Excel table
**```DELETE: /datasets/{dataset}/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Excel file name|
|table|string|yes|path|none|Excel table name|
|id|string|yes|path|none|Unique identifier of the row to delete|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Updates an existing row in an Excel table
**```PATCH: /datasets/{dataset}/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Excel file name|
|table|string|yes|path|none|Excel table name|
|id|string|yes|path|none|Unique identifier of the row to update|
|item| |yes|body|none|Row with updated values|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



## Object definition

#### DataSetsMetadata

| Name | Data Type | Required|
|---|---|---|
|tabular|not defined|no|
|blob|not defined|no|

#### TabularDataSetsMetadata

| Name | Data Type |Required|
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|
|tableDisplayName|string|no|
|tablePluralName|string|no|

#### BlobDataSetsMetadata

| Name | Data Type |Required|
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|

#### TableMetadata

| Name | Data Type |Required|
|---|---|---|
|name|string|no|
|title|string|no|
|x-ms-permission|string|no|
|schema|not defined|no|

#### DataSetsList

| Name | Data Type |Required|
|---|---|---|
|value|array|no|

#### DataSet

| Name | Data Type |Required|
|---|---|---|
|Name|string|no|
|DisplayName|string|no|

#### Table

| Name | Data Type |Required|
|---|---|---|
|Name|string|no|
|DisplayName|string|no|

#### Item

| Name | Data Type |Required|
|---|---|---|
|ItemInternalId|string|no|

#### TablesList

| Name | Data Type |Required|
|---|---|---|
|value|array|no|

#### ItemsList

| Name | Data Type |Required|
|---|---|---|
|value|array|no|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)  
[Create a power app](../power-apps/powerapps-get-started-azure-portal.md)