<properties
pageTitle="Add the Dynamic CRM Online API in PowerApps Enterprise or to your Logic Apps | Microsoft Azure"
description="Overview of the CRM Online API with REST API parameters"
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
ms.date="02/23/2016"
ms.author="deonhe"/>

# Get started with the CRM API
Connect to Dynamics CRM Online to create a new record, update an item, and more. 

The CRM Online API can be be used from PowerApps Enterprise and logic apps. 

With CRM Online, you can:

- Build your business flow based on the data you get from CRM Online. 
- Use actions that delete a record, get entities, and more. These actions get a response, and then make the output available for other actions. For example, when an item is updated in CRM, you can send an email using Office 365.


For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md).

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
The CRM API includes the following actions. There are no triggers. 

| Triggers | Actions|
| --- | --- |
|None.| <ul><li>Create a new record</li><li>Gets records</li><li>Delete a record</li><li>Gets a record</li><li>Gets entities</li><li>Update an item</li></ul>

All APIs support data in JSON and XML formats.

## Create a connection to CRM Online

### Add additional configuration in PowerApps
When you add CRM Online to PowerApps Enterprise, you enter the **Client ID** and **App Key** values of your Dynamics CRM Online Azure Active Directory (AAD) application. The **Redirect URL** value is also used in your CRM Online application. If you don't have an application, you can use the following steps to create the application: 

1. In the [Azure Portal](https://portal.azure.com), open **Active Directory**, and select your organization's tenant name.
2. In the Applications tab, select **Add**. In **Add application**:  

	1. Enter a **Name** for your application.  
	2. Leave the application type as **Web**.  
	3. Select **Next**.

	![Add AAD application - app info][9]

3. In **App Properties**:  

	1. Enter the **SIGN-ON URL** of your application.  Since you are going to authenticate with AAD for PowerApps, set the sign-on url to _https://login.windows.net_.  
	2. Enter a valid **APP ID URI** for your app.  
	3. Select **OK**.  

	![Add AAD application - app properties][10]

4. In the new application, select **Configure**. 
5. Under _OAuth 2_, set the **Reply URL** to the redirect URL value shown when you add the CRM Online API in the Azure Portal:  
![Configure Contoso AAD app][12]

Now copy/paste the **Client ID** and **App Key** values in your CRM Online configuration in the Azure portal. 

### Add additional configuration in logic apps
When you add this API to your logic apps, you must sign in to Dynamic CRM Online.

After you create the connection, you enter the CRM Online properties, like the table or dataset. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this connection in other logic apps.

## Swagger REST API reference
#### This documentation is for version: 1.0

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
After you add the CRM online API to PowerApps Enterprise, [give users permissions](../power-apps/powerapps-manage-api-connection-user-access.md) to use the API in their apps.

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)


[9]: ./media/create-api-crmonline/aad-tenant-applications-add-appinfo.png
[10]: ./media/create-api-crmonline/aad-tenant-applications-add-app-properties.png
[12]: ./media/create-api-crmonline/contoso-aad-app-configure.png