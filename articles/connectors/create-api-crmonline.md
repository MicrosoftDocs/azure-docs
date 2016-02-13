<properties
pageTitle="Add the CRM API in PowerApps Enterprise or to your Logic Apps | Microsoft Azure"
description="Overview of CRM API with REST API reference"
services=""	
documentationCenter="" 	
authors="msftman"	
manager="erikre"	
editor="" tags="connectors" />

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="02/22/2016"
ms.author="deonhe"/>

# Get started with the CRM API

This API provides an interface to work with Dynamics CRM Instances.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [CRM Connector](../app-service-logic/app-service-logic-connector-Crm Connector.md).

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the CRM connector, you can:

* Use it to build logic apps
* Use it in power apps

This topic focuses on the CRM connector triggers and actions available, creating a connection to the connector, and also lists the REST API parameters.

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](..powerapps-register-from-available-apis.md).

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The CRM API can be used as an action; there are no triggers. All connectors support data in JSON and XML formats. 

 The CRM API has the following action(s) and/or trigger(s) available:

### CRM API actions
You can take these action(s):

|Action|Description|
|--- | ---|
|GetDataSets|Return the data sets|
|GetItems|Get records for an entity|
|PostItem|Create a new record in an entity|
|GetItem|Used for getting a particular record present for a CRM entity|
|DeleteItem|Delete an Item froma a List|
|PatchItem|Used for partially updating an existing record for a CRM entity|
|GetTables|Used for getting the list of entities present in a CRM instance|
## Create a connection to CRM Connector
To use the CRM API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Dynamics CRM Online Credentials|


>[AZURE.TIP] You can use this connection in other logic apps.

## CRM connector REST API reference
#### This documentation is for version: 1.0


### Return the data sets 


 Return the data sets
```GET: /datasets``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Gets records 


 Get records for an entity
```GET: /datasets/{dataset}/tables/{table}/items``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|
|table|string|yes|path|none|Name of the entity|
|$skip|integer|no|query|none|Number of entries to skip. Default is 0.|
|$top|integer|no|query|none|Maximum number of entries to fetch. Default is 100.|
|$filter|string|no|query|none|ODATA filter query to restrict the number of entries.|
|$orderby|string|no|query|none|ODATA orderBy query for specifying the order of entries.|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Create a new record 


 Create a new record in an entity
```POST: /datasets/{dataset}/tables/{table}/items``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|
|table|string|yes|path|none|Name of the entity|
|item| |yes|body|none|Record to Create|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Gets a table item 


 Used for getting a particular record present for a CRM entity
```GET: /datasets/{dataset}/tables/{table}/items/{id}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|
|table|string|yes|path|none|Name of the entity|
|id|string|yes|path|none|Identifier for the record|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Delete an Item from a List 


 Delete an Item froma a List
```DELETE: /datasets/{dataset}/tables/{table}/items/{id}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|
|table|string|yes|path|none|Name of the entity|
|id|string|yes|path|none|Identifier for the record|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Patches an existing table item 


 Used for partially updating an existing record for a CRM entity
```PATCH: /datasets/{dataset}/tables/{table}/items/{id}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|
|table|string|yes|path|none|Name of the entity|
|id|string|yes|path|none|Identifier for the record|
|item| |yes|body|none|Record to Update|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Gets entities 


 Used for getting the list of entities present in a CRM instance
```GET: /datasets/{dataset}/tables``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|


#### Response

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