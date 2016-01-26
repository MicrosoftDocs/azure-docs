<properties
	pageTitle="Add the FTP connector API to your Logic Apps | Microsoft Azure"
	description="Create or configure a new FTP connector"
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

# Get started with the FTP connector

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [FTP connector](..app-service-logic-connector-ftp.md).

Connect to an FTP server to manage your files. You can do different tasks on the FTP server, such as upload files, delete files, and more.

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

When you create a logic app, you are building a "flow". You can add the FTP connector to your logic app, and build it based on the data you get from the FTP server. For example, you can get a file from an FTP server, and then use that file within the logic app to send a tweet, update a SQL database, send an email using Office 365, and so on. 

This topic focuses on the triggers and actions available with the FTP connector, and also the REST API parameters available. 

## Triggers and actions

Triggers are events that cause *something* to happen. For example, when a file is updated or changed on the FTP server, you can "trigger" or start your logic app. An Action is the *something* that happens. For example, copying a file to the FTP server is an action, deleting a file on the FTP server is an action. 

The FTP connector can be used as a trigger and as an action. All connectors support data in JSON and XML formats. The FTP connector has the following triggers and actions available:

Triggers | Actions
--- | ---
<ul><li>Gets an updated file</li></ul> | <ul><li>Create file</li><li>Copy file</li><li>Delete file</li><li>Extract archive to folder</li><li>Get file content</li><li>Get file content using path</li><li>Get file metadata</li><li>Get file metadata using path</li><li>Gets an updated file</li><li>Update file</li></ul>


## Create a connection to the FTP connector

When you add an FTP trigger or action to your logic app, you are prompted for specific FTP settings, like folder path, file name, and so on. You can use the following steps to configure a new FTP server for your logic apps. 

1. Add an FTP trigger or action to your logic app.
2. Select **Change connection**. 
3. Select **Create new**.
4. Enter the following properties:  

	|Property| Required|Description|
| ---|---|---|
|Server Address| Yes | Enter the fully qualified domain (FQDN) or IP address of the FTP server.|
|User name| Yes | Enter the user name to connect to the FTP Server.|
|Password | Yes | Enter the user name's password.|

5. Select **Create connection** to save your changes. 

You can connect to an on-premises FTP server, or create a web app that **INSERT TEXT**. 

## REST API reference

### Create file
Uploads a file to FTP server.
```POST: /datasets/default/files```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|folderPath|string|Yes|query|Folder path to upload the file to FTP server|
|name|string|Yes|query|Name of the file to create in FTP server|
|body|string|Yes|body|Content of the file to upload to FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Copy file
Copies a file to FTP server. 
```POST: /datasets/default/copyFile```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|source|string|Yes|query|Url to source file|
|destination|string|Yes|query|Destination file path in FTP server, including target filename|
|overwrite|boolean|No|query|Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Delete file 
Deletes a file from FTP server. 
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|id|string|Yes|path|Unique identifier of the file to delete from FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Extract archive to folder
Extracts an archive file into a folder in FTP server (example: .zip). 
```POST: /datasets/default/extractFolder```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|source|string|Yes|query|Path to the archive file|
|destination|string|Yes|query|Path in FTP server to extract the archive contents|
|overwrite|boolean|No|query|Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

### Get file content
Retrieves file contents from FTP Server using id. 
```GET: /datasets/default/files/{id}/content```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|id|string|Yes|path|Unique identifier of the file|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path
Retrieves file contents from FTP server using path. 
```GET: /datasets/default/GetFileContentByPath```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|path|string|Yes|query|Unique path to the file in FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get File Metadata 
Retrieves file metadata from FTP server using file id. 
```GET: /datasets/default/files/{id}```

| Name | Data Type | Required | Located In | Description |
| --- | --- | --- | --- | --- |
| id | string | Yes | path | Unique identifier of the file | 

#### Response
| Name | Description |
| --- | --- |
| 200 | OK | 
| default | Operation Failed.


### Get File Metadata using path
Retrieves file metadata from FTP server using path. 
```GET: /datasets/default/GetFileByPath```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|path|string|Yes|query|Unique path to the file in FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Gets an updated file
Gets an updated file. 
```GET: /datasets/default/triggers/onupdatedfile```

| Name|Data Type|Required|Located In|Description|
| ---|---|---|---|---|
|folderId|string|Yes|query|Folder Id under which to look for an updated file|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file 
Updates a file in FTP server. 
```PUT: /datasets/default/files/{id}```

| Name| Data Type | Required |Located In | Description |
| ---|---|---|---|---|
|id|string|Yes|path|Unique identifier of the file to update in FTP server|
|body|string|Yes|body|Content of the file to update in FTP server|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|