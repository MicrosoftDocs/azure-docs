<properties
pageTitle="Add the Salesforce API in PowerApps Enterprise and your Logic Apps | Microsoft Azure"
description="Overview of the Salesforce API with REST API parameters"
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
ms.date="03/16/2016"
ms.author="deonhe"/>

# Get started with the Salesforce API
Connect to Salesforce and create objects, get objects, and more. The Salesforce API can be be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-salesforce.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-salesforce.md)

&nbsp; 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With Salesforce, you can:

- Build your business flow based on the data you get from SalesForce. 
- Use triggers for when an object is created or updated.
- Use actions to create an object, delete an object, and more. These actions get a response, and then make the output available for other actions. For example, when a new object is created in Salesforce, you can send an email using Office 365.
- Add the Salesforce API to PowerApps Enterprise. Then, your users can use this API within their apps. 

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
The Salesforce API includes the following trigger and actions. 

| Triggers | Actions|
| --- | --- |
|<ul><li>When an object is created</li><li>When an object is modified</li></ul> | <ul><li>Create object</li><li>Get objects</li><li>When an object is created</li><li>When an object is modified</li><li>Delete object</li><li>Get object</li><li>Get object types (SObjects)</li><li>Update object</li></ul>

All APIs support data in JSON and XML formats. 

## Create a connection to Salesforce 

When you add this API to your logic apps, you must authorize logic apps to connect to your Salesforce.

1. Sign in to your Salesforce account.
2. Allow your logic apps to connect and use your Salesforce account. 

After you create the connection, you enter the Salesforce properties, like the table name. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same connection in other logic apps.

## Swaggers REST API reference
Applies to version: 1.0.


### Create object
Creates a Salesforce object.  
```POST: /datasets/default/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|item| |yes|body|none|Salesforce object to create|

### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Get object
Retrieves a Salesforce object.  
```GET: /datasets/default/tables/{table}/items/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|id|string|yes|path|none|Unique identifier of Salesforce object to retrieve|

### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Delete object
Deletes a Salesforce object.  
```DELETE: /datasets/default/tables/{table}/items/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|id|string|yes|path|none|Unique identifier of Salesforce object to delete|

### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Update object
Updates a Salesforce object.  
```PATCH: /datasets/default/tables/{table}/items/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|id|string|yes|path|none|Unique identifier of the Salesforce object to update|
|item| |yes|body|none|Salesforce object with changed properties|

### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### When an object is created
Triggers a flow when an object is created in Salesforce.  
```GET: /datasets/default/tables/{table}/onnewitems```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|

### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### When an object is modified 
Triggers a flow when an object is modified in Salesforce.  
```GET: /datasets/default/tables/{table}/onupdateditems```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Salesforce SObject type (example: 'Lead')|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|

### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



## Object definitions 

#### DataSetsMetadata

| Name | Data Type | Required|
|---|---|---|
|tabular|not defined|no|
|blob|not defined|no|


#### TabularDataSetsMetadata

| Name | Data Type | Required|
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|
|tableDisplayName|string|no|
|tablePluralName|string|no|


#### BlobDataSetsMetadata

| Name | Data Type | Required|
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|


#### TableMetadata

| Name | Data Type | Required|
|---|---|---|
|name|string|no|
|title|string|no|
|x-ms-permission|string|no|
|schema|not defined|no|


#### DataSetsList

| Name | Data Type | Required|
|---|---|---|
|value|array|no|


#### DataSet

| Name | Data Type | Required|
|---|---|---|
|Name|string|
|DisplayName|string|no|


#### Table

| Name | Data Type | Required|
|---|---|---|
|Name|string|no|
|DisplayName|string|no|


#### Item

| Name | Data Type | Required|
|---|---|---|
|ItemInternalId|string|no|


#### ItemsList

| Name | Data Type | Required|
|---|---|---|
|value|array|no|


#### TablesList

| Name | Data Type | Required|
|---|---|---|
|value|array|no|


## Next Steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).


[5]: https://developer.salesforce.com
[6]: ./media/connectors-create-api-salesforce/salesforce-developer-homepage.png
[7]: ./media/connectors-create-api-salesforce/salesforce-create-app.png
[8]: ./media/connectors-create-api-salesforce/salesforce-new-app.png
