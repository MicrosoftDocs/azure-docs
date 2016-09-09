<properties
    pageTitle="Add the Google Drive connector in PowerApps or logic apps | Microsoft Azure"
    description="Overview of the Google Drive connector with REST API parameters"
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
   ms.date="05/18/2016"
   ms.author="mandia"/>

# Get started with the Google Drive connector
Connect to Google Drive to create files, get rows, and more. The Google Drive connector can be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-googledrive.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-googledrive.md)

With Google Drive, you can: 

- Build your business flow based on the data you get from your search. 
- Use actions to search images, search the news, and more. These actions get a response, and then make the output available for other actions. For example, you can search for a video, and then use Twitter to post that video to a Twitter feed.
- Add the Google Drive connector to PowerApps Enterprise. Then, your users can use this connector within their apps. 

For information on how to add a connector in PowerApps Enterprise, go to [Register a connector in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).


## Triggers and actions
Google Drive includes the following actions. There are no triggers. 

Triggers | Actions
--- | ---
None | <ul><li>Create file</li><li>Insert row</li><li>Copy file</li><li>Delete file</li><li>Delete row</li><li>Extract archive to folder</li><li>Get file content using id</li><li>Get file content using path</li><li>Get file metadata using id</li><li>Get file metadata using path</li><li>Get row</li><li>Update file</li><li>Update row</li></ul>

All connectors support data in JSON and XML formats.


## Create the connection to Google Drive

When you add this connector to your logic apps, you must authorize logic apps to connect to your Google Drive.

>[AZURE.INCLUDE [Steps to create a connection to googledrive](../../includes/connectors-create-api-googledrive.md)]

After you create the connection, you enter the Google Drive properties, like the folder path or file name. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same Google Drive connection in other logic apps.


## Swagger REST API reference
Applies to version: 1.0.

### Create file    
Uploads a file to Google Drive.  
```POST: /datasets/default/files```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|yes|query|none |Folder path to upload the file to Google Drive|
|name|string|yes|query|none |Name of the file to create in Google Drive|
|body|string(binary) |yes|body| none|Content of the file to upload to Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Insert row    
Inserts a row into a Google Sheet.  
```POST: /datasets/{dataset}/tables/{table}/items```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path| none|Unique identifier of the Google Sheet file|
|table|string|yes|path|none |Unique identifier of the worksheet|
|item|ItemInternalId: string |yes|body|none |Row to insert into the specified sheet|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Copy file    
Copies a file on Google Drive.  
```POST: /datasets/default/copyFile```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query| none|Url to source file|
|destination|string|yes|query|none |Destination file path in Google Drive, including target filename|
|overwrite|boolean|no|query|none |Overwrites the destination file if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Delete file    
Deletes a file from Google Drive.  
```DELETE: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file to delete from Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Delete Row    
Deletes a row from a Google Sheet.  
```DELETE: /datasets/{dataset}/tables/{table}/items/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none |Unique identifier of the Google Sheet file|
|table|string|yes|path|none |Unique identifier of the worksheet|
|id|string|yes|path|none |Unique identifier of the row to delete|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Extract archive to folder    
Extracts an archive file into a folder in Google Drive (example: .zip).  
```POST: /datasets/default/extractFolderV2```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|source|string|yes|query|none |Path to the archive file|
|destination|string|yes|query|none |Path in Google Drive to extract the archive contents|
|overwrite|boolean|no|query|none |Overwrites the destination files if set to 'true'|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using id    
Retrieves file content from Google Drive using id.  
```GET: /datasets/default/files/{id}/content```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file to retrieve in Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file content using path    
Retrieves file content from Google Drive using path.  
```GET: /datasets/default/GetFileContentByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Path of the file in Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using id    
Retrieves file metadata from Google Drive using id.  
```GET: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file in Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get file metadata using path    
Retrieves file metadata from Google Drive using path.  
```GET: /datasets/default/GetFileByPath```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|path|string|yes|query|none |Path of the file in Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get row    
Retrieves a single row from a Google Sheet.  
```GET: /datasets/{dataset}/tables/{table}/items/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none |Unique identifier of the Google Sheet file|
|table|string|yes|path|none |Unique identifier of the worksheet|
|id|string|yes|path| none|Unique identifier of row to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update file    
Updates a file in Google Drive.  
```PUT: /datasets/default/files/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|id|string|yes|path|none |Unique identifier of the file to update in Google Drive|
|body|string(binary) |yes|body| none|Content of the file to upload to Google Drive|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Update row    
Updates a row in a Google Sheet.  
```PATCH: /datasets/{dataset}/tables/{table}/items/{id}```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|dataset|string|yes|path|none |Unique identifier of the Google Sheet file|
|table|string|yes|path| none|Unique identifier of the worksheet|
|id|string|yes|path|none |Unique identifier of the row to update|
|item|ItemInternalId: string |yes|body|none |Row with updated values|

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

#### TableMetadata

|Property Name | Data Type |Required|
|---|---|---|
|name|string|no|
|title|string|no|
|x-ms-permission|string|no|
|schema|not defined|no|

#### TablesList

|Property Name | Data Type |Required|
|---|---|---|
|value|array|no|

#### Table

|Property Name | Data Type |Required|
|---|---|---|
|Name|string|no|
|DisplayName|string|no|

#### Item

|Property Name | Data Type |Required|
|---|---|---|
|ItemInternalId|string|no|

#### ItemsList

|Property Name | Data Type |Required|
|---|---|---|
|value|array|no|


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).


<!--References-->
[5]: https://console.developers.google.com/
[6]: ./media/connectors-create-api-googledrive/google-developers-console.png
[8]: ./media/connectors-create-api-googledrive/use-google-apis.png
[9]: ./media/connectors-create-api-googledrive/googledrive-api-overview.png
[10]: ./media/connectors-create-api-googledrive/enable-googledrive-api.png
[12]: ./media/connectors-create-api-googledrive/googledrive-api-credentials-add.png
[13]: ./media/connectors-create-api-googledrive/configure-consent-screen.png
[14]: ./media/connectors-create-api-googledrive/create-client-id.png
