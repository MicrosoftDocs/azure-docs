<properties
pageTitle="Add the Dynamic CRM Online connector in PowerApps Enterprise or to your Logic Apps | Microsoft Azure"
description="Overview of the CRM Online connector with REST API parameters"
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
ms.date="05/18/2016"
ms.author="deonhe"/>

# Get started with the CRM connector
Connect to Dynamics CRM Online to create a new record, update an item, and more. The CRM Online connector can be used from:

- Logic apps
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-crmonline.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-crmonline.md)

With CRM Online, you can:

- Build your business flow based on the data you get from CRM Online. 
- Use actions that delete a record, get entities, and more. These actions get a response, and then make the output available for other actions. For example, when an item is updated in CRM, you can send an email using Office 365.


For information on how to add a connector in PowerApps Enterprise, go to [Register a connector in PowerApps](../power-apps/powerapps-register-from-available-apis.md).

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
The CRM connector includes the following actions. There are no triggers. 

| Triggers | Actions|
| --- | --- |
|None| <ul><li>Create a new record</li><li>Gets records</li><li>Delete a record</li><li>Gets a record</li><li>Gets entities</li><li>Update an item</li></ul>

All connectors support data in JSON and XML formats.

## Create a connection to CRM Online

When you add this connector to your logic apps, you must sign in to Dynamics CRM Online. Follow these steps to sign into CRM online and complete the configuration of the **connection** in your logic app:

1. In your logic app, select **Add an action**:  
![Configure CRM Online][13]
4. Enter CRM in the search box and wait for the search to return all entries with CRM in the name.
5. Select **Dynamics CRM Online - Create a new record**.
6. Select **Sign in to Dynamics CRM Online**:  
![Configure CRM Online][14]
7. Provide your CRM Online credentials to sign in to authorize the application:  
![Configure CRM Online][15]  
8. After signing in, return to your logic app to complete it by adding other triggers and actions that you need.
9. Save your work by selecting **Save** on the menu bar above.

After you create the connection, you enter the CRM Online properties, like the table or dataset. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

### Create a new record 
Create a new record in an entity.  
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


### Gets records 
 Get records for an entity.  
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




### Return the data sets 
 Return the data sets.  
```GET: /datasets``` 

There are no parameters for this call. 

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Gets a table item 
Used for getting a particular record present for a CRM entity.  
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

### Delete an Item from a List 
Delete an Item from a a List.  
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



### Patches an existing table item 
Used for partially updating an existing record for a CRM entity.  
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

### Gets entities 
Used for getting the list of entities present in a CRM instance.  
```GET: /datasets/{dataset}/tables``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|Unique name for CRM Organization contoso.crm|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## Object definitions

#### DataSetsMetadata

|Property Name | Data Type | Required|
|---|---|---|
|tabular|not defined|no|
|blob|not defined|no|

#### TabularDataSetsMetadata

|Property Name | Data Type |Required|
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|
|tableDisplayName|string|no|
|tablePluralName|string|no|

#### BlobDataSetsMetadata

|Property Name | Data Type |Required|
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|


#### TableMetadata

|Property Name | Data Type |Required|
|---|---|---|
|name|string|no|
|title|string|no|
|x-ms-permission|string|no|
|schema|not defined|no|

#### DataSetsList

|Property Name | Data Type |Required|
|---|---|---|
|value|array|no|

#### DataSet

|Property Name | Data Type |Required|
|---|---|---|
|Name|string|no|
|DisplayName|string|no|


#### Table

|Property Name | Data Type |Required|
|---|---|---|
|Name|string|no|
|DisplayName|string|no|

#### Item

|Property Name | Data Type |Required|
|---|---|---|
|ItemInternalId|string|no|

#### ItemsList

|Property Name | Data Type |Required|
|---|---|---|
|value|array|no|


#### TablesList

|Property Name | Data Type |Required|
|---|---|---|
|value|array|no|


## Next Steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).


[9]: ./media/connectors-create-api-crmonline/aad-tenant-applications-add-appinfo.png
[10]: ./media/connectors-create-api-crmonline/aad-tenant-applications-add-app-properties.png
[12]: ./media/connectors-create-api-crmonline/contoso-aad-app-configure.png
[13]: ./media/connectors-create-api-crmonline/crmconfig1.png
[14]: ./media/connectors-create-api-crmonline/crmconfig2.png
[15]: ./media/connectors-create-api-crmonline/crmconfig3.png
