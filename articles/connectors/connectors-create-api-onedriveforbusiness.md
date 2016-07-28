<properties
pageTitle="OneDrive for Business | Microsoft Azure"
description="Create Logic apps with Azure App service. Connect to OneDrive for Business to manage your files. You can perform various actions such as upload, update, get, and delete on files."
services="app-servicelogic"	
documentationCenter=".net,nodejs,java" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors" />

<tags
ms.service="logic-apps"
ms.devlang="multiple"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="05/17/2016"
ms.author="deonhe"/>

# Get started with the OneDrive for Business connector



The OneDrive for Business connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The OneDrive for Business connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The OneDrive for Business connector has the following action(s) and/or trigger(s) available:

### OneDrive for Business actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[GetFileMetadata](connectors-create-api-onedriveforbusiness.md#getfilemetadata)|Retrieves metadata of a file in OneDrive for Business using id|
|[UpdateFile](connectors-create-api-onedriveforbusiness.md#updatefile)|Updates a file in OneDrive for Business|
|[DeleteFile](connectors-create-api-onedriveforbusiness.md#deletefile)|Deletes a file from OneDrive for Business|
|[GetFileMetadataByPath](connectors-create-api-onedriveforbusiness.md#getfilemetadatabypath)|Retrieves metadata of a file in OneDrive for Business using path|
|[GetFileContentByPath](connectors-create-api-onedriveforbusiness.md#getfilecontentbypath)|Retrieves contents of a file in OneDrive for Business using path|
|[GetFileContent](connectors-create-api-onedriveforbusiness.md#getfilecontent)|Retrieves contents of a file in OneDrive for Business using id|
|[CreateFile](connectors-create-api-onedriveforbusiness.md#createfile)|Uploads a file to OneDrive for Business|
|[CopyFile](connectors-create-api-onedriveforbusiness.md#copyfile)|Copies a file to OneDrive for Business|
|[ListFolder](connectors-create-api-onedriveforbusiness.md#listfolder)|Lists files in a OneDrive for Business folder|
|[ListRootFolder](connectors-create-api-onedriveforbusiness.md#listrootfolder)|Lists files in the OneDrive for Business root folder|
|[ExtractFolderV2](connectors-create-api-onedriveforbusiness.md#extractfolderv2)|Extracts a folder to OneDrive for Business|
### OneDrive for Business triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When a file is created|Triggers a flow when a new file is created in a OneDrive for Business folder|
|When a file is modified|Triggers a flow when a file is modified in a OneDrive for Business folder|


## Create a connection to OneDrive for Business
To create Logic apps with OneDrive for Business, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide OneDrive for Business Credentials|
After you create the connection, you can use it to execute the actions and listen for the triggers described in this article. 

>[AZURE.INCLUDE [Steps to create a connection to OneDrive for Business](../../includes/connectors-create-api-onedriveforbusiness.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for OneDrive for Business
Applies to version: 1.0

## GetFileMetadata
Get file metadata using id: Retrieves metadata of a file in OneDrive for Business using id 

```GET: /datasets/default/files/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Specify the file|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## UpdateFile
Update file: Updates a file in OneDrive for Business 

```PUT: /datasets/default/files/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Specify the file to update|
|body| |yes|body|none|Content of the file to update in OneDrive for Business|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## DeleteFile
Delete file: Deletes a file from OneDrive for Business 

```DELETE: /datasets/default/files/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Specify the file to delete|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## GetFileMetadataByPath
Get file metadata using path: Retrieves metadata of a file in OneDrive for Business using path 

```GET: /datasets/default/GetFileByPath``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique path to the file in OneDrive for Business|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## GetFileContentByPath
Get file content using path: Retrieves contents of a file in OneDrive for Business using path 

```GET: /datasets/default/GetFileContentByPath``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique path to the file in OneDrive for Business|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## GetFileContent
Get file content using id: Retrieves contents of a file in OneDrive for Business using id 

```GET: /datasets/default/files/{id}/content``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Specify the file|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CreateFile
Create file: Uploads a file to OneDrive for Business 

```POST: /datasets/default/files``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none|Folder path to upload the file to OneDrive for Business|
|name|string|yes|query|none|Name of the file to create in OneDrive for Business|
|body| |yes|body|none|Content of the file to upload to OneDrive for Business|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CopyFile
Copy file: Copies a file to OneDrive for Business 

```POST: /datasets/default/copyFile``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none|Url to source file|
|destination|string|yes|query|none|Destination file path in OneDrive for Business, including target filename|
|overwrite|boolean|no|query|false|Overwrites the destination file if set to 'true'|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## OnNewFile
When a file is created: Triggers a flow when a new file is created in a OneDrive for Business folder 

```GET: /datasets/default/triggers/onnewfile``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none|Specify a folder|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## OnUpdatedFile
When a file is modified: Triggers a flow when a file is modified in a OneDrive for Business folder 

```GET: /datasets/default/triggers/onupdatedfile``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none|Specify a folder|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ListFolder
List files in folder: Lists files in a OneDrive for Business folder 

```GET: /datasets/default/folders/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Specify the folder|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ListRootFolder
List root folder: Lists files in the OneDrive for Business root folder 

```GET: /datasets/default/folders``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ExtractFolderV2
Extract folder: Extracts a folder to OneDrive for Business 

```POST: /datasets/default/extractFolderV2``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none|Path to the archive file|
|destination|string|yes|query|none|Path in OneDrive for Business to extract the archive contents|
|overwrite|boolean|no|query|false|Overwrites the destination files if set to 'true'|

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



### BlobMetadata


| Property Name | Data Type | Required |
|---|---|---|
|Id|string|No |
|Name|string|No |
|DisplayName|string|No |
|Path|string|No |
|LastModified|string|No |
|Size|integer|No |
|MediaType|string|No |
|IsFolder|boolean|No |
|ETag|string|No |
|FileLocator|string|No |



### Object


| Property Name | Data Type | Required |
|---|---|---|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)