<properties
	pageTitle="Add the Azure blob storage API in your Logic Apps | Microsoft Azure"
	description="Overview of Azure blob storage API with REST API parameters"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
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
   ms.author="mandia"/>

# Get started with the Azure blob storage API
Connect to an Azure Blob to manage files in a blob container, such as creating files, deleting files, and more. The Azure blob storage API can be used from:

- Logic apps 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With Azure blob storage, you can:

- Build your business flow based on the data you get from the blob. 
- Use actions that let you create a file, get file content, and more. These actions get a response, and then make the output available for other actions. For example, you can search for "urgent" in a file in your blob, and then send all files with "urgent" in an email using Office 365. 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
Azure blob includes the following actions. There are no triggers.

| Triggers | Actions|
| --- | --- |
| None. | <ul><li>Create file</li><li>Copy file</li><li>Delete file</li><li>Extract archive to folder</li><li>Get file content</li><li>Get file content using path</li><li>Get file metadata</li><li>Get file metadata using path</li><li>Update file</li></ul> |

All APIs support data in JSON and XML formats.

## Create a connection to Azure blob
When you add this API to your logic apps, enter the following storage account values: 

|Property| Required|Description|
| ---|---|---|
|Azure storage account name | yes | The name of your blob storage account|
|Azure storage account access key | yes | The access key to your blob storage account|

After you create the connection, you enter the blob properties, like folder path or file name. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same blob connection in other logic apps.
 

## Swagger REST API reference
Applies to version: 1.0.

### Create file
Uploads a file to Azure Blob Storage.  
```POST: /datasets/default/files```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query| none |Folder path to upload the file to Azure Blob Storage|
|name|string|yes|query|none |Name of the file to create in Azure Blob Storage|
|body|string(binary) |yes|body|none|Content of the file to upload to Azure Blob Storage|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Copy file
Copies a file to Azure Blob Storage.   
```POST: /datasets/default/copyFile```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none |Url to source file|
|destination|string|yes|query| none|Destination file path in Azure Blob Storage, including target filename|
|overwrite|boolean|no|query|none |Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Delete file
Deletes a file from Azure Blob Storage.  
```DELETE: /datasets/default/files/{id}```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file to delete from Azure Blob Storage|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Extract archive to folder
Extracts an archive file into a folder in Azure Blob Storage (example: .zip).  
```POST: /datasets/default/ExtractFolderV2```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query| none|Path to the archive file|
|destination|string|yes|query|none |Path in Azure Blob Storage to extract the archive contents|
|overwrite|boolean|no|query|none |Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content
Retrieves file contents from Azure Blob Storage using id.  
```GET: /datasets/default/files/{id}/content```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path
Retrieves file contents from Azure Blob Storage using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Unique path to the file in Azure Blob Storage|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get File Metadata
Retrieves file metadata from Azure Blob Storage using file id.  
```GET: /datasets/default/files/{id}```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using path
Retrieves file metadata from Azure Blob Storage using path.  
```GET: /datasets/default/GetFileByPath```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none|Unique path to the file in Azure Blob Storage|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file
Updates a file in Azure Blob Storage.  
```PUT: /datasets/default/files/{id}```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file to update in Azure Blob Storage|
|body|string(binary) |yes|body|none |Content of the file to update in Azure Blob Storage|

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

## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).
