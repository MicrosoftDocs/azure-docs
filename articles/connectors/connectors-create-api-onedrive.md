<properties
pageTitle="Add the OneDrive API in PowerApps Enterprise and your Logic Apps | Microsoft Azure"
description="Overview of the OneDrive API with REST API parameters"
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
ms.date="05/12/2016"
ms.author="mandia"/>

# Get started with the OneDrive API

Connect to OneDrive to manage your files, including upload, get, delete files, and more. The OneDrive API can be be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-onedrive.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-onedrive.md)

&nbsp; 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With OneDrive, you can: 

- Build your business flow based on the data you get from OneDrive. 
- Use triggers for when a file is created or updated.
- Use actions to create a file, delete a file, and more. These actions get a response, and then make the output available for other actions. For example, when a new file is created in OneDrive, you can email that file using Office 365.
- Add the OneDrive API to PowerApps Enterprise. Then, your users can use this API within their apps. 

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
The OneDrive API includes the following trigger and actions. 

| Triggers | Actions|
| --- | --- |
|<ul><li>When a file is created</li><li>When a file is modified</li></ul> | <ul><li>Create file</li><li>List files in a folder</li><li>When a file is created</li><li>Copy file</li><li>Delete file</li><li>Extract folder</li><li>Get file content using id</li><li>Get file content using path</li><li>Get file metadata using id</li><li>Get file metadata using path</li><li>List root folder</li><li>Update file</li><li>When a file is modified</li></ul>

All APIs support data in JSON and XML formats.

## Create a connection to OneDrive

When you add this API to your logic apps, you must authorize logic apps to connect to your OneDrive.

1. Sign in to your OneDrive account.
2. Allow your logic apps to connect and use your OneDrive. 

>[AZURE.INCLUDE [Steps to create a connection to OneDrive](../../includes/connectors-create-api-onedrive.md)]

>[AZURE.TIP] You can use this same connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.


### Get file metadata using id
Retrieves metadata of a file in OneDrive using id.  
```GET: /datasets/default/files/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file in OneDrive|

### Responses
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file
Updates a file in OneDrive.  
```PUT: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file to update in OneDrive|
|body| |yes|body|none|Content of the file to update in OneDrive|


### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Delete file
Deletes a file from OneDrive.  
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file to delete from OneDrive|


### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using path
Retrieves metadata of a file in OneDrive using path.  
```GET: /datasets/default/GetFileByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique path to the file in OneDrive|


### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|




### Get file content using path
Retrieves contents of a file in OneDrive using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique Path to the file in OneDrive|


### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|




### Get file content using id
Retrieves contents of a file in OneDrive using id.  
```GET: /datasets/default/files/{id}/content```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file in OneDrive|


### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|




### Create file
Uploads a file to OneDrive.  
```POST: /datasets/default/files```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none|Folder path to upload the file to OneDrive|
|name|string|yes|query|none|Name of the file to create in OneDrive|
|body| |yes|body|none|Content of the file to upload to OneDrive|


### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Copy file
Copies a file to OneDrive.  
```POST: /datasets/default/copyFile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none|Url to source file|
|destination|string|yes|query|none|Destination file path in OneDrive, including target filename|
|overwrite|boolean|no|query|false|Overwrites the destination file if set to 'true'|


### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### When a file is created
Triggers a flow when a new file is created in a OneDrive folder.  
```GET: /datasets/default/triggers/onnewfile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none|Unique identifier of the folder in OneDrive|


### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Triggers a flow when a file is modified in a OneDrive folder
Triggers a flow when a file is modified in a OneDrive folder.  
```GET: /datasets/default/triggers/onupdatedfile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none|Unique identifier of the folder in OneDrive|


### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|



### Extract folder
Extracts a folder to OneDrive.  
```POST: /datasets/default/extractFolderV2```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none|Path to the archive file|
|destination|string|yes|query|none|Path in OneDrive to extract the archive contents|
|overwrite|boolean|no|query|false|Overwrites the destination files if set to 'true'|


### Response

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



#### BlobMetadata

|Property Name | Data Type |Required|
|---|---|---|
|Id|string|no|
|Name|string|no|
|DisplayName|string|no|
|Path|string|no|
|LastModified|string|no|
|Size|integer|no|
|MediaType|string|no|
|IsFolder|boolean|no|
|ETag|string|no|
|FileLocator|string|no|


## Next Steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).

[5]: https://account.live.com/developers/applications/create
[6]: ./media/connectors-create-api-onedrive/onedrive-new-app.png
[7]: ./media/connectors-create-api-onedrive/onedrive-app-api-settings.png
