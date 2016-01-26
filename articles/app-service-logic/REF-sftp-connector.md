<properties
	pageTitle="Add the SFTP connector API to your Logic Apps | Microsoft Azure"
	description="Create or configure a new SFTP connector"
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
   ms.date="01/25/2016"
   ms.author="mandia"/>

# Get started with the SFTP connector

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [SFTP connector](..app-service-logic-connector-sftp.md).

Connect to an SFTP server to manage your files. You can do different tasks on the SFTP server, such as upload files, delete files, and more.

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

When you create a logic app, you are building a "flow". You can add the SFTP connector to your logic app, and build it based on the data you get from the SFTP server. For example, you can get a file from an SFTP server, and then use that file within the logic app to send a tweet, update a SQL database, send an email using Office 365, and so on. 

This topic focuses on the triggers and actions available with the SFTP connector, and also the REST API parameters available. 

## Triggers and actions

Triggers are events that cause *something* to happen. For example, when a file is updated or changed on the SFTP server, you can "trigger" or start your logic app. An Action is the *something* that happens. For example, copying a file to the SFTP server is an action, deleting a file on the SFTP server is an action. 

The SFTP connector can be used as a trigger and as an action. All connectors support data in JSON and XML formats. The SFTP connector has the following triggers and actions available:

Triggers | Actions
--- | ---
<ul><li>When a file is modified</li></ul> | <ul><li>Create file</li><li>Copy file</li><li>Delete file</li><li>Extract folder</li><li>Get file content</li><li>Get file content using path</li><li>Get file metadata</li><li>Get file metadata using path</li><li>Update file</li><li>When a file is modified</li></ul>

## Create a connection to the SFTP connector
When you add an SFTP trigger or action to your logic app, you are prompted for specific SFTP settings, like folder path, file name, and so on. You can use the following steps to configure a new SFTP server for your logic apps. 

1. Add an SFTP trigger or action to your logic app.
2. Select **Change connection**. 
3. Select **Create new**.
4. Enter the following properties:  

	|Property| Required|Description|
| ---|---|---|
|Host Server Address| Yes | Enter the fully qualified domain (FQDN) or IP address of the SFTP server.|
|User name| Yes | Enter the user name to connect to the SFTP Server.|
|Password | Yes | Enter the user name's password.|
|SSH Server Host Key Finger Print | Yes | Enter the fingerprint of the public host key for the SSH server. <br/><br/>Typically, the server administrator can give you this key. You can also use the ```WinSCP``` or ```ssh-keygen-g3 -F``` tools to get the key fingerprint. | 

5. Select **Create connection** to save your changes. 
 
You can connect to an on-premises SFTP server, or create a web app that **INSERT TEXT**. 


## REST API reference

### Create file
Uploads a file in SFTP.
```POST: /datasets/default/files```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|folderPath|string|Yes|query|Unique path of the folder in SFTP|
|name|string|Yes|query|Name of the file|
|body|string|Yes|body|Content of the file to create in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Copy file
Copies a file to SFTP. 
```POST: /datasets/default/copyFile```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|source|string|Yes|query|Path to the source file|
|destination|string|Yes|query|Path to the destination file, including file name|
|overwrite|boolean|No|query|Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Delete file 
Deletes a file in SFTP. 
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|id|string|Yes|path|Unique identifier of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Extract archive to folder
Extracts an archive file into a folder using SFTP (example: .zip).
```POST: /datasets/default/extractFolder```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|source|string|Yes|query|Path to the archive file|
|destination|string|Yes|query|Path to the destination folder|
|overwrite|boolean|No|query|Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Get file content
Retrieves file contents from SFTP using id. 
```GET: /datasets/default/files/{id}/content```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|id|string|Yes|path|Unique identifier of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path
Retrieves file contents from SFTP using path. 
```GET: /datasets/default/GetFileContentByPath```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|path|string|Yes|query|Unique path OF the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get File Metadata 
Retrieves file metadata from SFTP using file id. 
```GET: /datasets/default/files/{id}```

| Name | Data Type | Required | Located In | Description |
| --- | --- | --- | --- | --- |
| id | string | Yes | path | Unique identifier of the file in SFTP| 

#### Response
| Name | Description |
| --- | --- |
| 200 | OK | 
| default | Operation Failed.


### Get File Metadata using path
Retrieves file metadata from SFTP using path. 
```GET: /datasets/default/GetFileByPath```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|path|string|Yes|query|Unique path of the file in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file
Updates file content using SFTP. 
```PUT: /datasets/default/files/{id}```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|id|string|Yes|path|Unique identifier of the file in SFTP|
|body|string|true|body|Content of the file to update in SFTP|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### When a file is modified
Updates a file in FTP server. 
```GET: /datasets/default/triggers/onupdatedfile```

| Name| Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|folderId|string|Yes|query|Unique identifier of the folder|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|