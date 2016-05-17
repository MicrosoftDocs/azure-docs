<properties
	pageTitle="Add the Dropbox API in PowerApps Enterprise or logic apps| Microsoft Azure"
	description="Overview of the Dropbox API with REST API parameters"
	services=""
    suite=""
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

# Get started with the Dropbox API 
Connect to Dropbox to manage files, such us create files, get files, and more. The Dropbox API can be be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-dropbox.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-dropbox.md)

&nbsp; 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.


With Dropbox, you can: 

- Build your business flow based on the data you get from Dropbox. 
- Use triggers for when a file is created or updated.
- Use actions to create a file, delete a file, and more. These actions get a response, and then make the output available for other actions. For example, when a new file is created in Dropbox, you can email that file using Office 365.
- Add the Dropbox API to PowerApps Enterprise. Then, your users can use this API within their apps. 

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
Dropbox includes the following triggers and actions.

Triggers | Actions
--- | ---
<ul><li>When a file is created</li><li>When a file is modified</li></ul> | <ul><li>Create file</li><li>When a file is created</li><li>Copy file</li><li>Delete file</li><li>Extract archive to folder</li><li>Get file content using id</li><li>Get file using path</li><li>Get file metadata using id</li><li>Get file metadata using path</li><li>Update file</li><li>When a file is modified</li></ul>

All APIs support data in JSON and XML formats.

## Create the connection to Dropbox

When you add this API to your logic apps, you must authorize logic apps to connect to your Dropbox.

1. Sign in to your Dropbox account.
2. Select **Authorize**, and allow your logic apps to connect and use your Dropbox. 

After you create the connection, you enter the Dropbox properties, like the folder path or file name. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same Dropbox connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

### Create file    
Uploads a file to Dropbox.  
```POST: /datasets/default/files```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none |Folder path to upload the file to Dropbox|
|name|string|yes|query|none |Name of the file to create in Dropbox|
|body|string(binary) |yes|body|none |Content of the file to upload to Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### When a file is created    
Triggers a flow when a new file is created in a Dropbox folder.  
```GET: /datasets/default/triggers/onnewfile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none |Unique identifier of the folder in Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Copy file    
Copies a file to Dropbox.  
```POST: /datasets/default/copyFile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none |Url to source file|
|destination|string|yes|query| none|Destination file path in Dropbox, including target filename|
|overwrite|boolean|no|query|none |Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Delete file    
Deletes a file from Dropbox.  
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none|Unique identifier of the file to delete from Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Extract archive to folder    
Extracts an archive file into a folder in Dropbox (example: .zip).  
**```POST: /datasets/default/extractFolderV2```**

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none |Path to the archive file|
|destination|string|yes|query|none |Path in Dropbox to extract the archive contents|
|overwrite|boolean|no|query|none |Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using id    
Retrieves file contents from Dropbox using id.  
```GET: /datasets/default/files/{id}/content```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file in Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path    
Retrieves file contents from Dropbox using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Unique path to the file in Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using id    
Retrieves file metadata from Dropbox using file id.  
```GET: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file in Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using path    
Retrieves file metadata from Dropbox using path.  
```GET: /datasets/default/GetFileByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Unique path to the file in Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file    
Updates a file in Dropbox.  
```PUT: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path| none|Unique identifier of the file to update in Dropbox|
|body|string(binary) |yes|body|none |Content of the file to update in Dropbox|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### When a file is modified    
Triggers a flow when a file is modified in a Dropbox folder.  
```GET: /datasets/default/triggers/onupdatedfile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderId|string|yes|query|none |Unique identifier of the folder in Dropbox|

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

Go back to the [APIs list](apis-list.md).


<!--References-->
[1]: https://www.dropbox.com/login
[2]: https://www.dropbox.com/developers/apps/create
[3]: https://www.dropbox.com/developers/apps
[8]: ./media/connectors-create-api-dropbox/dropbox-developer-site.png
[9]: ./media/connectors-create-api-dropbox/dropbox-create-app.png
[10]: ./media/connectors-create-api-dropbox/dropbox-create-app-page1.png
[11]: ./media/connectors-create-api-dropbox/dropbox-create-app-page2.png
