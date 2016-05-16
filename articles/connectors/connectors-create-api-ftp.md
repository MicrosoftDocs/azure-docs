<properties
	pageTitle="Add the FTP API in your Logic Apps | Microsoft Azure"
	description="Overview of the FTP API with REST API parameters"
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
   ms.date="05/16/2016"
   ms.author="mandia"/>

# Get started with the FTP API
Connect to an FTP server to manage your files, including upload files, delete files, and more. The FTP API can be used from:

- Logic apps (discussed in this topic)
- PowerApps (see the [PowerApps connections list](https://powerapps.microsoft.com/en-us/tutorials/connections-list/ for the complete list))

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With FTP, you can: 

- Build your business flow based on the data you get from FTP. 
- Use a trigger when a file is updated.
- Use actions that create files, get file content, and more. These actions get a response, and then make the output available for other actions. For example, you can get the content of a file, and then update a SQL database. 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).


## Triggers and actions
FTP has the following triggers and actions available.

Triggers | Actions
--- | ---
<ul><li>Gets an updated file</li></ul> | <ul><li>Create file</li><li>Copy file</li><li>Delete file</li><li>Extract folder</li><li>Get file content</li><li>Get file content using path</li><li>Get file metadata</li><li>Get file metadata using path</li><li>Gets an updated file</li><li>Update file</li></ul>

All APIs support data in JSON and XML formats.

## Create a connection to FTP
When you add this API to your logic apps, enter the following values:

|Property| Required|Description|
| ---|---|---|
|Server Address| Yes | Enter the fully qualified domain (FQDN) or IP address of the FTP server.|
|User name| Yes | Enter the user name to connect to the FTP Server.|
|Password | Yes | Enter the user name's password.|

After you create the connection, you enter the FTP properties, like the source file or destination folder. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same FTP connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

### Create file
Uploads a file to FTP server.  
```POST: /datasets/default/files```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none |Folder path to upload the file to FTP server|
|name|string|yes|query| none|Name of the file to create in FTP server|
|body| |yes|body|none |Content of the file to upload to FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Copy file
Copies a file to FTP server.  
```POST: /datasets/default/copyFile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none |Url to source file|
|destination|string|yes|query|none |Destination file path in FTP server, including target filename|
|overwrite|boolean|no|query|none |Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Delete file 
Deletes a file from FTP server.  
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file to delete from FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Extract folder
Extracts an archive file into a folder in FTP server (example: .zip).  
```POST: /datasets/default/extractFolderV2```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query| none|Path to the archive file|
|destination|string|yes|query| none|Path to the destination folder|
|overwrite|boolean|no|query|none|Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Get file content
Retrieves file contents from FTP Server using id.  
```GET: /datasets/default/files/{id}/content```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path
Retrieves file contents from FTP server using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Unique path to the file in FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get File Metadata 
Retrieves file metadata from FTP server using file id.  
```GET: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file|

#### Response
| Name | Description |
| --- | --- |
| 200 | OK | 
| default | Operation Failed.


### Get File Metadata using path
Retrieves file metadata from FTP server using path.  
```GET: /datasets/default/GetFileByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query| none|Unique path to the file in FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Gets an updated file
Gets an updated file.  
```GET: /datasets/default/triggers/onupdatedfile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none |Folder Id under which to look for an updated file|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file 
Updates a file in FTP server.  
```PUT: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path| none|Unique identifier of the file to update in FTP server|
|body| |yes|body|none |Content of the file to update in FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## Object definitions

#### DataSetsMetadata

| Name | Data Type | Required |
|---|---|---|
|tabular|not defined|no|
|blob|not defined|no|

#### TabularDataSetsMetadata

| Name | Data Type | Required |
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|
|tableDisplayName|string|no|
|tablePluralName|string|no|

#### BlobDataSetsMetadata

| Name | Data Type | Required |
|---|---|---|
|source|string|no|
|displayName|string|no|
|urlEncoding|string|no|

#### BlobMetadata

| Name | Data Type | Required |
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
