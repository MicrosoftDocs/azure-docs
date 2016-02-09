<properties
pageTitle="Use the OneDrive API in your Logic Apps | Microsoft Azure"
description="Get started using the Azure App Service OneDrive API in your Logic apps and your Power apps."
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

# Get started with the OneDrive API

Connect to OneDrive to manage your files. You can perform various actions such as upload, update, get, and delete on files in OneDrive.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [OneDrive](../app-service-logic/app-service-logic-connector-OneDrive.md).

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the OneDrive connector, you can:

* Use it to build logic apps
* Use it to build power apps  

This topic focuses on the OneDrive triggers and actions available, creating a connection to the connector, and also lists the REST API parameters.

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The OneDrive connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The OneDrive connector has the following action(s) and/or trigger(s) available:

### OneDrive actions
You can take these action(s):

|Action|Description|
|--- | ---|
|GetFileMetadata|Retrieves metadata of a file in OneDrive using id|
|UpdateFile|Updates a file in OneDrive|
|DeleteFile|Deletes a file from OneDrive|
|GetFileMetadataByPath|Retrieves metadata of a file in OneDrive using path|
|GetFileContentByPath|Retrieves contents of a file in OneDrive using path|
|GetFileContent|Retrieves contents of a file in OneDrive using id|
|CreateFile|Uploads a file to OneDrive|
|CopyFile|Copies a file to OneDrive|
|ExtractFolderV2|Extracts a folder to OneDrive|
### OneDrive triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|OnNewFile|Triggers a flow when a new file is created in a OneDrive folder|
|OnUpdatedFile|Triggers a flow when a file is modified in a OneDrive folder|


## Create a connection to OneDrive
To use the OneDrive API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide OneDrive Credentials|  

>[AZURE.TIP] You can use this connection in other logic apps or power apps, or both.

## OneDrive REST API reference
#### This documentation is for version: 1.0


### Retrieves metadata of a file in OneDrive using id
**```GET: /datasets/default/files/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Updates a file in OneDrive
**```PUT: /datasets/default/files/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file to update in OneDrive|
|body| |yes|body|none|Content of the file to update in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Deletes a file from OneDrive
**```DELETE: /datasets/default/files/{id}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file to delete from OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Retrieves metadata of a file in OneDrive using path
**```GET: /datasets/default/GetFileByPath```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique path to the file in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Retrieves contents of a file in OneDrive using path
**```GET: /datasets/default/GetFileContentByPath```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique Path to the file in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Retrieves contents of a file in OneDrive using id
**```GET: /datasets/default/files/{id}/content```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Uploads a file to OneDrive
**```POST: /datasets/default/files```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none|Folder path to upload the file to OneDrive|
|name|string|yes|query|none|Name of the file to create in OneDrive|
|body| |yes|body|none|Content of the file to upload to OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Copies a file to OneDrive
**```POST: /datasets/default/copyFile```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none|Url to source file|
|destination|string|yes|query|none|Destination file path in OneDrive, including target filename|
|overwrite|boolean|no|query|false|Overwrites the destination file if set to 'true'|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Triggers a flow when a new file is created in a OneDrive folder
**```GET: /datasets/default/triggers/onnewfile```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none|Unique identifier of the folder in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Triggers a flow when a file is modified in a OneDrive folder
**```GET: /datasets/default/triggers/onupdatedfile```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none|Unique identifier of the folder in OneDrive|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Extracts a folder to OneDrive
**```POST: /datasets/default/extractFolderV2```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none|Path to the archive file|
|destination|string|yes|query|none|Path in OneDrive to extract the archive contents|
|overwrite|boolean|no|query|false|Overwrites the destination files if set to 'true'|


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


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)  
[Create a power app](../power-apps/powerapps-get-started-azure-portal.md)  
