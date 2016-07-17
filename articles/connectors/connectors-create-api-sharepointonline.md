<properties
pageTitle="SharePoint Online connector | Microsoft Azure"
description="Create Logic apps with the SharePoint Online connector to mange lists on SharePoint."
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
ms.date="07/19/2016"
ms.author="deonhe"/>

# Get started with the SharePoint Online connector

Use the SharePoint Online connector to manage SharePoint lists.  

To use [any connector](./apis-list.md), you first need to create a Logic app. You can get started by [creating a Logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Connect to SharePoint Online

Before your Logic app can access any service, you first need to create a *connection* to the service. A [connection](./connectors-overview.md) provides connectivity between a Logic app and another service.  

### Create a connection to SharePoint Online

>[AZURE.INCLUDE [Steps to create a connection to SharePoint](../../includes/connectors-create-api-sharepointonline.md)]

## Use a SharePoint Online trigger

A trigger is an event that can be used to start the workflow defined in a Logic app. [Learn more about triggers](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).  

>[AZURE.INCLUDE [Steps to create a SharePoint Online trigger](../../includes/connectors-create-api-sharepointonline-trigger.md)]

## Use a SharePoint Online action

An action is an operation carried out by the workflow defined in a Logic app. [Learn more about actions](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).  

>[AZURE.INCLUDE [Steps to create a SharePoint Online action](../../includes/connectors-create-api-sharepointonline-action.md)]

## Technical Details

Here are the details about the triggers, actions and responses that this connection supports:

## SharePoint Online triggers

SharePoint has the following trigger(s):  

|Trigger | Description|
|--- | ---|
|[When a file is created](connectors-create-api-sharepointonline.md#when-a-file-is-created)|This operation triggers a flow when a new file is created in a SharePoint folder.|
|[When a file is modified](connectors-create-api-sharepointonline.md#when-a-file-is-modified)|This operation triggers a flow when a file is modified in a SharePoint folder.|
|[When a new item is created](connectors-create-api-sharepointonline.md#when-a-new-item-is-created)|This operation triggers a flow when a new item is created in a SharePoint list.|
|[When an existing item is modified](connectors-create-api-sharepointonline.md#when-an-existing-item-is-modified)|This operation triggers a flow when an existing item is modified in a SharePoint list.|


## SharePoint Online actions

SharePoint has the following actions:


|Action|Description|
|--- | ---|
|[Get file metadata](connectors-create-api-sharepointonline.md#get-file-metadata)|This operation gets file metadata using the file id.|
|[Update file](connectors-create-api-sharepointonline.md#update-file)|This operation updates file content.|
|[Delete file](connectors-create-api-sharepointonline.md#delete-file)|This operation deletes a file.|
|[Get file metadata using path](connectors-create-api-sharepointonline.md#get-file-metadata-using-path)|This operation gets file metadata using the file path.|
|[Get file content using path](connectors-create-api-sharepointonline.md#get-file-content-using-path)|This operation gets file contents using the file path.|
|[Get file content](connectors-create-api-sharepointonline.md#get-file-content)|This operation gets file content using the file id.|
|[Create file](connectors-create-api-sharepointonline.md#create-file)|This operation uploads a file to a SharePoint site.|
|[Copy file](connectors-create-api-sharepointonline.md#copy-file)|This operation copies a file to a SharePoint site.|
|[List folder](connectors-create-api-sharepointonline.md#list-folder)|This operation gets files contained in a SharePoint folder.|
|[List root folder](connectors-create-api-sharepointonline.md#list-root-folder)|This operaiton gets the files in the root SharePoint folder.|
|[Extract folder](connectors-create-api-sharepointonline.md#extract-folder)|This operation extracts an archive file into a SharePoint folder (example: .zip).|
|[Get items](connectors-create-api-sharepointonline.md#get-items)|This operation gets items from a SharePoint list.|
|[Create item](connectors-create-api-sharepointonline.md#create-item)|This operation creates a new item in a SharePoint list.|
|[Get item](connectors-create-api-sharepointonline.md#get-item)|This operation gets a single item by its id from a SharePoint list.|
|[Delete item](connectors-create-api-sharepointonline.md#delete-item)|This operation deletes an item from a SharePoint list.|
|[Update item](connectors-create-api-sharepointonline.md#update-item)|This operation updates an item in a SharePoint list.|
|[Get entity values](connectors-create-api-sharepointonline.md#get-entity-values)|This operation gets possible values for a SharePoint entity.|
|[Get lists](connectors-create-api-sharepointonline.md#get-lists)|This operation gets SharePoint lists from a site.|
### Action details

Here are the details for the actions and triggers for this connector, along with their responses:



### Get file metadata
This operation gets file metadata using the file id. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|id*|File identifier|Select a file|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Update file
This operation updates file content. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|id*|File identifier|Select a file|
|body*|File Content|Content of the file|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Delete file
This operation deletes a file. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|id*|File identifier|Select a file|

An * indicates that a property is required




### Get file metadata using path
This operation gets file metadata using the file path. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|path*|File path|Select a file|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Get file content using path
This operation gets file contents using the file path. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|path*|File path|Select a file|

An * indicates that a property is required




### Get file content
This operation gets file content using the file id. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|id*|File identifier|Select a file|

An * indicates that a property is required




### Create file
This operation uploads a file to a SharePoint site. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|folderPath*|Folder Path|Select a file|
|name*|File name|Name of the file|
|body*|File Content|Content of the file|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Copy file
This operation copies a file to a SharePoint site. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|source*|Source file Path|Path to the source file|
|destination*|Destination file path|Path to the destination file|
|overwrite|Overwrite flag|Whether or not to overwrite the destination file if it exists|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### When a file is created
This operation triggers a flow when a new file is created in a SharePoint folder. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url|
|folderId*|Folder Id|Select a folder|

An * indicates that a property is required




### When a file is modified
This operation triggers a flow when a file is modified in a SharePoint folder. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url|
|folderId*|Folder Id|Select a folder|

An * indicates that a property is required




### List folder
This operation gets files contained in a SharePoint folder. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|id*|File identifier|Unique identifier of the folder|

An * indicates that a property is required



#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### List root folder
This operaiton gets the files in the root SharePoint folder. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|

An * indicates that a property is required



#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Extract folder
This operation extracts an archive file into a SharePoint folder (example: .zip). 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site URL|SharePoint site url like http://contoso.sharepoint.com/sites/mysite|
|source*|Source file Path|Path to the source file|
|destination*|Destination folder path|Path to the destination folder|
|overwrite|Overwrite flag|Whether or not to overwrite the destination file if it exists|

An * indicates that a property is required



#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### When a new item is created
This operation triggers a flow when a new item is created in a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|$filter|Filter Query|An ODATA filter query to restrict the entries returned|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|

An * indicates that a property is required

#### Output Details

ItemsList


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|




### When an existing item is modified
This operation triggers a flow when an existing item is modified in a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|$filter|Filter Query|An ODATA filter query to restrict the entries returned|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|

An * indicates that a property is required

#### Output Details

ItemsList


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|




### Get items
This operation gets items from a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|$filter|Filter Query|An ODATA filter query to restrict the entries returned|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|

An * indicates that a property is required

#### Output Details

ItemsList


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|




### Create item
This operation creates a new item in a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|item*|Item|Item to create|

An * indicates that a property is required

#### Output Details

Item


| Property Name | Data Type | Description |
|---|---|---|
|ItemInternalId|string|undefined|




### Get item
This operation gets a single item by its id from a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|id*|Id|Unique identifier of item to be retrieved|

An * indicates that a property is required

#### Output Details

Item


| Property Name | Data Type | Description |
|---|---|---|
|ItemInternalId|string|undefined|




### Delete item
This operation deletes an item from a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|id*|Id|Unique identifier of item to be deleted|

An * indicates that a property is required




### Update item
This operation updates an item in a SharePoint list. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table*|List name|SharePoint list name|
|id*|Id|Unique identifier of item to be updated|
|item*|Item|Item with changed properties|

An * indicates that a property is required

#### Output Details

Item


| Property Name | Data Type | Description |
|---|---|---|
|ItemInternalId|string|undefined|




### Get entity values
This operation gets possible values for a SharePoint entity. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|SharePoint site url|SharePoint site url|
|table*|table name|table name|
|id*|entity id|entity id|

An * indicates that a property is required

#### Output Details





### Get lists
This operation gets SharePoint lists from a site. 


|Property Name| Display Name|Description|
| ---|---|---|
|dataset*|Site url|SharePoint site url (example: http://contoso.sharepoint.com/sites/mysite)|

An * indicates that a property is required

#### Output Details

TablesList


| Property Name | Data Type | Description |
|---|---|---|
|value|array|undefined|



## HTTP responses

The actions and triggers above can return one or more of the following HTTP status codes: 

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occurred.|
|default|Operation Failed.|















## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)