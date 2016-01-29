<properties
	pageTitle="Add the Box connector API to your Logic Apps | Microsoft Azure"
	description="Create or configure a new Box connector"
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

# Get started with the Box connector

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Box connector](..app-service-logic-connector-box.md).

Connect to Box and create files, delete files, and more.

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Box connector, you can:

- Add the Box connector to your logic app, and build your business flow based on the data you get from Box. 
- Use triggers to start your flow. When a file is created or updated, it triggers (or starts) a new instance of the flow (your logic app), and passes the data received to your logic app for additional processing.
- Use actions that copy a file, delete a file, and more. These actions get a response, and then make the output available for other actions in the logic app to use. For example, when a file is changed on Box, you can take that file and email it using Office 365.

This topic focuses on the Box triggers and actions available, creating a connection to Box, and also lists the REST API parameters. 

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).


## Triggers and actions
The Box connector can be used as a trigger and as an action. All connectors support data in JSON and XML formats. The Box connector has the following triggers and actions available:

| Triggers | Actions|
| --- | --- |
|<ul><li>When a file is created</li><li>When a file is modified</li></ul> | <ul><li>Create file</li><li>When a file is created</li><li>Copy file</li><li>Delete file</li><li>Extract archive to folder</li><li>Get file content using id</li><li>Get file content using path</li><li>Get file metadata using id</li><li>Get file metadata using path</li><li>Update file</li><li>When a file is modified</li></ul>

## Create a connection to Box
To use the Box connector, you first create a connection to Box. To create the connection: 

1. Sign in to your Box account.
2. Select **Authorize**, and allow your logic apps to connect and use your Box. 

After you create the connection, you enter the Box properties. The properties change, depending on the trigger or action you choose. For example, if you choose the **Copy file** action, then enter the **Source URL**, **Destination file path**, and the **Overwrite** properties. For a description of these properties, see the **REST API reference** in this topic. 

>[AZURE.TIP] You can use this same Box connection in other logic apps.

## Swagger REST API reference

### Create file
Uploads a file to Box.  
```POST: /datasets/default/files```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|Yes|query|None |Folder path to upload the file to Box|
|name|string|Yes|query|None |Name of the file to create in Box|
|body|string(binary) |Yes|body|None |Content of the file to upload to Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### When a file is created
Triggers a flow when a new file is created in a Box folder.  
```GET: /datasets/default/triggers/onnewfile```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|Yes|query|None |Unique identifier of the folder in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Copy file
Copies a file to Box.  
```POST: /datasets/default/copyFile```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|Yes|query|None |Url to source file|
|destination|string|Yes|query| None|Destination file path in Box, including target filename|
|overwrite|boolean|No|query| None|Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Delete file
Deletes a file from Box.  
```DELETE: /datasets/default/files/{id}```


| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|Yes|path|None |Unique identifier of the file to delete from Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Extract archive to folder
Extracts an archive file into a folder in Box (example: .zip).  
```POST: /datasets/default/extractFolderV2```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|Yes|query| |Path to the archive file|
|destination|string|Yes|query| |Path in Box to extract the archive contents|
|overwrite|boolean|No|query| |Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using id
Retrieves file contents from Box using id.  
```GET: /datasets/default/files/{id}/content```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|Yes|path|None |Unique identifier of the file in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path
Retrieves file contents from Box using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|Yes|query|None |Unique path to the file in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using id
Retrieves file metadata from Box using file id.  
```GET: /datasets/default/files/{id}```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|Yes|path| None|Unique identifier of the file in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using path
Retrieves file metadata from Box using path.  
```GET: /datasets/default/GetFileByPath```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|Yes|query|None |Unique path to the file in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file
Updates a file in Box.  
```PUT: /datasets/default/files/{id}```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|Yes|path| None|Unique identifier of the file to update in Box|
|body|string(binary) |Yes|body|None |Content of the file to update in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### When a file is modified
Triggers a flow when a file is modified in a Box folder.  
```GET: /datasets/default/triggers/onupdatedfile```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|Yes|query|None |Unique identifier of the folder in Box|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|