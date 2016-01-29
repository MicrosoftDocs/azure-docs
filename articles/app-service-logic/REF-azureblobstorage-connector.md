<properties
	pageTitle="Add the Azure blob storage connector API to your Logic Apps | Microsoft Azure"
	description="Create or configure a new Azure blob storage connector"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="01/28/2016"
   ms.author="mandia"/>

# Get started with the Azure blob storage connector

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Azure Storage Blob connector](..app-service-logic-connector-azurestorageblob.md).

Connect to an Azure storage blob to manage files in a blob container, such as creating files, deleting files, and more.

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Azure blob storage connector, you can:

- Add the blob connector to your logic app, and build your business flow based on the data you get from the blob. 
- Use triggers to start your flow. When a file is updated, it triggers (or starts) a new instance of the flow (your logic app), and passes the data received to your logic app for additional processing.
- Use actions that let you create a file, get file content, and more. These actions get a response, and then make the output available for other actions in the logic app to use. For example, you can search for "urgent" in a file in your blob, and then send all files with "urgent" in an email using Office 365. 

This topic focuses on the Azure storage blob triggers and actions available, creating a connection to your blob, and also lists the REST API parameters. 

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Triggers and actions
The Azure storage blob connector can be used as a trigger and as an action. All connectors support data in JSON and XML formats. The storage blob connector has the following triggers and actions available:

| Triggers | Actions|
| --- | --- |
| <ul><li>Gets an updated file</li></ul> | <ul><li>Create file</li><li>Copy file</li><li>Delete file</li><li>Extract archive to folder</li><li>Get file content</li><li>Get file content using path</li><li>Get file metadata</li><li>Get file metadata using</li><li>Gets an updated file</li><li>Update file</li></ul> |

## Create a connection to Azure storage blob
To use the storage blob connector, you first create a connection to your blob. When you create the connection, enter the following blob properties: 

|Property| Required|Description|
| ---|---|---|
|Azure storage account name | Yes | The name of your blob storage account|
|Azure storage account access key | Yes | The access key to your blob storage account|

After you create the connection, you enter the blob properties. The properties change, depending on the trigger or action you choose. For example, if you choose the **Create file** action, then enter the **Folder path**, **File name**, and the **File content** properties. For a description of these properties, see the **REST API reference** in this topic.

>[AZURE.TIP] You can use this same storage blob connection in other logic apps.
 

## Swagger REST API reference

### Create file
Uploads a file to Azure Blob Storage.  
```POST: /datasets/default/files```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|Yes|query| None |Folder path to upload the file to Azure Blob Storage|
|name|string|Yes|query|None |Name of the file to create in Azure Blob Storage|
|body|string(binary) |Yes|body|None|Content of the file to upload to Azure Blob Storage|

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
|source|string|Yes|query|None |Url to source file|
|destination|string|Yes|query| None|Destination file path in Azure Blob Storage, including target filename|
|overwrite|boolean|No|query|None |Overwrites the destination file if set to 'true'|

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
|id|string|Yes|path|None |Unique identifier of the file to delete from Azure Blob Storage|

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
|source|string|Yes|query| None|Path to the archive file|
|destination|string|Yes|query|None |Path in Azure Blob Storage to extract the archive contents|
|overwrite|boolean|No|query|None |Overwrites the destination files if set to 'true'|

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
|id|string|Yes|path|None|Unique identifier of the file|

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
|path|string|Yes|query|None |Unique path to the file in Azure Blob Storage|

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
|id|string|Yes|path|None |Unique identifier of the file|

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
|path|string|Yes|query|None|Unique path to the file in Azure Blob Storage|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Gets an updated file
Gets an updated file.  
```GET: /datasets/default/triggers/onupdatedfile```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|Yes|query|None |Folder Id under which to look for an updated file|

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
|id|string|Yes|path|None |Unique identifier of the file to update in Azure Blob Storage|
|body|string(binary) |Yes|body|None |Content of the file to update in Azure Blob Storage|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
