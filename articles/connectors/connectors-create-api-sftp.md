<properties
	pageTitle="Add the SFTP API in your Logic Apps | Microsoft Azure"
	description="Overview of the SFTP API with REST API parameters"
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
   ms.date="02/25/2016"
   ms.author="mandia"/>

# Get started with the SFTP API
Connect to an SFTP server to manage your files. You can do different tasks on the SFTP server, such as upload files, delete files, and more. The SFTP API can be used from: 

- Logic apps

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With SFTP, you can: 

- Build your business flow based on the data you get from SFTP. 
- Use a trigger when a file is updated.
- Use actions that create files, delete files, and more. These actions get a response, and then make the output available for other actions. For example, you can get the content of a file, and then update a SQL database. 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).


## Triggers and actions
The SFTP API has the following triggers and actions available.

Triggers | Actions
--- | ---
<ul><li>When a file is created or modified </li></ul> | <ul><li>Create file</li><li>Copy file</li><li>Delete file</li><li>Extract folder</li><li>Get file content</li><li>Get file content using path</li><li>Get file metadata</li><li>Get file metadata using path</li><li>Update file</li><li>When a file is created or modified </li></ul>

All APIs support data in JSON and XML formats. 


## Create a connection to SFTP
When you add this API to your logic apps, enter the following values:

|Property| Required|Description|
| ---|---|---|
|Host Server Address| Yes | Enter the fully qualified domain (FQDN) or IP address of the SFTP server.|
|User name| Yes | Enter the user name to connect to the SFTP Server.|
|Password | Yes | Enter the user name's password.|
|SSH Server Host Key Finger Print | Yes | Enter the fingerprint of the public host key for the SSH server. <br/><br/>Typically, the server administrator can give you this key. You can also use the ```WinSCP``` or ```ssh-keygen-g3 -F``` tools to get the key fingerprint. | 

After you create the connection, you enter the SFTP properties, like the folder path or file. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same SFTP connection in other logic apps.


## Swagger REST API reference
Applies to version: 1.0.

### Create file
Uploads a file in SFTP.  
```POST: /datasets/default/files```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none |Unique path of the folder in SFTP|
|name|string|yes|query| none|Name of the file|
|body|string(binary) |yes|body|none |Content of the file to create in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Copy file
Copies a file to SFTP.  
```POST: /datasets/default/copyFile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query| none|Path to the source file|
|destination|string|yes|query|none |Path to the destination file, including file name|
|overwrite|boolean|no|query|none|Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Delete file 
Deletes a file in SFTP.  
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Extract folder
Extracts an archive file into a folder using SFTP (example: .zip).  
```POST: /datasets/default/extractFolderV2```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none |Path to the archive file|
|destination|string|yes|query|none |Path to the destination folder|
|overwrite|boolean|no|query|none|Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Get file content
Retrieves file contents from SFTP using id.  
```GET: /datasets/default/files/{id}/content```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path
Retrieves file contents from SFTP using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query| none|Unique path of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get File Metadata 
Retrieves file metadata from SFTP using file id.  
```GET: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path| none|Unique identifier of the file in SFTP|

#### Response
| Name | Description |
| --- | --- |
| 200 | OK | 
| default | Operation Failed.


### Get File Metadata using path
Retrieves file metadata from SFTP using path.  
```GET: /datasets/default/GetFileByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Unique path of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file
Updates file content using SFTP.  
```PUT: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file in SFTP|
|body|string(binary) |yes|body| none|Content of the file to update in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### When a file is created or modified 
Triggers a flow when a file is modified in SFTP.  
```GET: /datasets/default/triggers/onupdatedfile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none |Unique identifier of the folder|

#### Response
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

#### BlobMetadata

| Name | Data Type | Required|
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
