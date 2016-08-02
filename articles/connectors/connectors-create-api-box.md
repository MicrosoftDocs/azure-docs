<properties
    pageTitle="Add the Box connector to your Logic Apps | Microsoft Azure"
    description="Overview of the Box connector with REST API parameters"
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
   ms.date="05/18/2016"
   ms.author="mandia"/>

# Get started with the Box connector
Connect to Box and create files, delete files, and more. The Box connector can be used from:

- Logic apps (discussed in this topic)
- PowerApps (see the [PowerApps connections list](https://powerapps.microsoft.com/tutorials/connections-list/) for the complete list)

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With Box, you can:

- Build your business flow based on the data you get from Box. 
- Use triggers when a file is created or updated.
- Use actions that copy a file, delete a file, and more. These actions get a response, and then make the output available for other actions. For example, when a file is changed on Box, you can take that file and email it using Office 365.

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
Box includes the following trigger and actions.

| Triggers | Actions|
| --- | --- |
|<ul><li>When a file is created</li><li>When a file is modified</li></ul> | <ul><li>Create file</li><li>When a file is created</li><li>Copy file</li><li>Delete file</li><li>Extract archive to folder</li><li>Get file content using id</li><li>Get file content using path</li><li>Get file metadata using id</li><li>Get file metadata using path</li><li>Update file</li><li>When a file is modified</li></ul>

All connectors support data in JSON and XML formats.

## Create a connection to Box
When you add this connector to your logic apps, you must authorize logic apps to connect to your Box.

>[AZURE.INCLUDE [Steps to create a connection to box](../../includes/connectors-create-api-box.md)]

After you create the connection, you enter the Box properties. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same Box connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

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
