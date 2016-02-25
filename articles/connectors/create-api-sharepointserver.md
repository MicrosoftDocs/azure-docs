<properties
pageTitle="Use the SharePoint Server API in your Logic Apps | Microsoft Azure"
description="Get started using the Azure App Service SharePoint Server API in your Logic apps and your PowerApps."
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

# Get started with the SharePoint API

The SharePoint Connection Provider provides an API to work with Lists on SharePoint.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [SharePoint](../app-service-logic/app-service-logic-connector-SharePoint.md).

With SharePoint, you can:

* Use it to build logic apps
* Use it to build PowerApps  

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The SharePoint API can be used as an action; it has trigger(s). All APIs support data in JSON and XML formats. 

The SharePoint API has the following action(s) and/or trigger(s) available:

### SharePoint actions
You can take these action(s):

|Action|Description|
|--- | ---|
|GetFileMetadata|Used for getting a file metadata on Document Library|
|UpdateFile|Used for updating a file on Document Library|
|DeleteFile|Used for deleting a file on Document Library|
|GetFileMetadataByPath|Used for getting a file metadata on Document Library|
|GetFileContentByPath|Used for getting a file on Document Library|
|GetFileContent|Used for getting a file on Document Library|
|CreateFile|Used for uploading a file on Document Library|
|CopyFile|Used for copying a file on Document Library|
|ExtractFolderV2|Used for extracting a folder on Document Library|
|PostItem|Creates a new item in a SharePoint list|
|GetItem|Retrieves a single item from a SharePoint list|
|DeleteItem|Deletes an item from a SharePoint list|
|PatchItem|Updates an item in a SharePoint list|
### SharePoint triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|OnNewFile|Triggers a flow when a new file is created in a SharePoint folder|
|OnUpdatedFile|Triggers a flow when a file is modified in a SharePoint folder|
|GetOnNewItems|When a new item is created in a SharePoint list|
|GetOnUpdatedItems|When an existing item is modified in a SharePoint list|


## Create a connection to SharePoint
To use the SharePoint API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide SharePoint Credentials|  

>[AZURE.TIP] You can use this connection in other logic apps or PowerApps or both.

## SharePoint REST API reference
#### This documentation is for version: 1.0


### Used for getting a file metadata on Document Library
**```GET: /datasets/{dataset}/files/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|id|string|yes|path|none|Unique identifier of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for updating a file on Document Library
**```PUT: /datasets/{dataset}/files/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|id|string|yes|path|none|Unique identifier of the file|
|body| |yes|body|none|The Content of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for deleting a file on Document Library
**```DELETE: /datasets/{dataset}/files/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|id|string|yes|path|none|Unique identifier of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for getting a file metadata on Document Library
**```GET: /datasets/{dataset}/GetFileByPath```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|path|string|yes|query|none|Path of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for getting a file on Document Library
**```GET: /datasets/{dataset}/GetFileContentByPath```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|path|string|yes|query|none|Path of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for getting a file on Document Library
**```GET: /datasets/{dataset}/files/{id}/content```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|id|string|yes|path|none|Unique identifier of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for uploading a file on Document Library
**```POST: /datasets/{dataset}/files```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|folderPath|string|yes|query|none|The path to the folder|
|name|string|yes|query|none|Name of the file|
|body| |yes|body|none|The Content of the file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for copying a file on Document Library
**```POST: /datasets/{dataset}/copyFile```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|source|string|yes|query|none|Path to the source file|
|destination|string|yes|query|none|Path to the destination file|
|overwrite|boolean|no|query|false|Whether or not to overwrite an existing file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Triggers a flow when a new file is created in a SharePoint folder
**```GET: /datasets/{dataset}/triggers/onnewfile```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint site url|
|folderId|string|yes|query|none|Unique identifier of the folder in SharePoint|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Triggers a flow when a file is modified in a SharePoint folder
**```GET: /datasets/{dataset}/triggers/onupdatedfile```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint site url|
|folderId|string|yes|query|none|Unique identifier of the folder in SharePoint|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Used for extracting a folder on Document Library
**```POST: /datasets/{dataset}/extractFolderV2```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site URL. E.g. http://contoso.sharepoint.com/sites/mysite|
|source|string|yes|query|none|Path to the source file|
|destination|string|yes|query|none|Path to the destination folder|
|overwrite|boolean|no|query|false|Whether or not to overwrite an existing file|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### When a new item is created in a SharePoint list
**```GET: /datasets/{dataset}/tables/{table}/onnewitems```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table|string|yes|path|none|SharePoint list name|
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



### When an existing item is modified in a SharePoint list
**```GET: /datasets/{dataset}/tables/{table}/onupdateditems```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table|string|yes|path|none|SharePoint list name|
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



### Creates a new item in a SharePoint list
**```POST: /datasets/{dataset}/tables/{table}/items```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table|string|yes|path|none|SharePoint list name|
|item| |yes|body|none|Item to create|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Retrieves a single item from a SharePoint list
**```GET: /datasets/{dataset}/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table|string|yes|path|none|SharePoint list name|
|id|integer|yes|path|none|Unique identifier of item to be retrieved|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Deletes an item from a SharePoint list
**```DELETE: /datasets/{dataset}/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table|string|yes|path|none|SharePoint list name|
|id|integer|yes|path|none|Unique identifier of item to be deleted|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Updates an item in a SharePoint list
**```PATCH: /datasets/{dataset}/tables/{table}/items/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none|SharePoint Site url (example: http://contoso.sharepoint.com/sites/mysite)|
|table|string|yes|path|none|SharePoint list name|
|id|integer|yes|path|none|Unique identifier of item to be updated|
|item| |yes|body|none|Item with changed properties|


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



 **BlobMetadata**:

Required properties for BlobMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
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



 **Object**:

Required properties for Object:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|



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
[Create a power app](../power-apps/powerapps-get-started-azure-portal.md)  
