<properties
pageTitle="Use the Salesforce API in your Logic Apps | Microsoft Azure"
description="Get started using the Azure App Service Salesforce API in your Logic apps and your Power apps."
services=""	
documentationCenter="" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors"/>

<tags
ms.service=""
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="na"
ms.date="02/18/2016"
ms.author="deonhe"/>

# Get started with the Salesforce Connector API

The Salesforce Connector provides an API to work with Salesforce objects.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Salesforce Connector](../app-service-logic/app-service-logic-connector-Salesforce Connector.md).

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Salesforce Connector connector, you can:

* Use it to build logic apps
* Use it to build power apps  

This topic focuses on the Salesforce Connector triggers and actions available, creating a connection to the connector, and also lists the REST API parameters.

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Salesforce Connector connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The Salesforce Connector connector has the following action(s) and/or trigger(s) available:

### Salesforce Connector actions
You can take these action(s):

|Action|Description|
|--- | ---|
|PostItem|Creates a Salesforce object|
|GetItem|Retrieves a Salesforce object|
|DeleteItem|Deletes a Salesforce object|
|PatchItem|Updates a Salesforce object|
### Salesforce Connector triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|GetOnNewItems|Triggers a flow when an object is created in Salesforce|
|GetOnUpdatedItems|Triggers a flow when an object is modified in Salesforce|


## Create a connection to Salesforce Connector
To use the Salesforce Connector API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Salesforce Credentials|  

>[AZURE.TIP] You can use this connection in other logic apps or power apps, or both.

## Salesforce Connector REST API reference
#### This documentation is for version: 1.0


### Creates a Salesforce object
**```POST: /datasets/default/tables/{table}/items```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|item| |yes|body|none|Salesforce object to create|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Retrieves a Salesforce object
**```GET: /datasets/default/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|id|string|yes|path|none|Unique identifier of Salesforce object to retrieve|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Deletes a Salesforce object
**```DELETE: /datasets/default/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|id|string|yes|path|none|Unique identifier of Salesforce object to delete|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Updates a Salesforce object
**```PATCH: /datasets/default/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|id|string|yes|path|none|Unique identifier of the Salesforce object to update|
|item| |yes|body|none|Salesforce object with changed properties|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Triggers a flow when an object is created in Salesforce
**```GET: /datasets/default/tables/{table}/onnewitems```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Triggers a flow when an object is modified in Salesforce
**```GET: /datasets/default/tables/{table}/onupdateditems```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



## Object definition(s): 

 **DataSetsMetadata**:

Required properties for DataSetsMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|tabular|not defined|
|blob|not defined|



 **TabularDataSetsMetadata**:

Required properties for TabularDataSetsMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|source|string|
|displayName|string|
|urlEncoding|string|
|tableDisplayName|string|
|tablePluralName|string|



 **BlobDataSetsMetadata**:

Required properties for BlobDataSetsMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|source|string|
|displayName|string|
|urlEncoding|string|



 **TableMetadata**:

Required properties for TableMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|name|string|
|title|string|
|x-ms-permission|string|
|schema|not defined|



 **Object**:

Required properties for Object:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|



 **DataSetsList**:

Required properties for DataSetsList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **DataSet**:

Required properties for DataSet:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Name|string|
|DisplayName|string|



 **Table**:

Required properties for Table:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Name|string|
|DisplayName|string|



 **Item**:

Required properties for Item:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|ItemInternalId|string|



 **ItemsList**:

Required properties for ItemsList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **TablesList**:

Required properties for TablesList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)  
[Create a power app](../power-apps/powerapps-get-started-azure-portal.md)  
