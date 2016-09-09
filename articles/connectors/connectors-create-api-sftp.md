<properties
pageTitle="Learn how to use the SFTP connector in your logic apps | Microsoft Azure"
description="Create logic apps with Azure App service. Connect to SFTP API to send and receive files. You can perform various operations such as create, update, get or delete files."
services="logic-apps"	
documentationCenter=".net,nodejs,java" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors" />

<tags
ms.service="logic-apps"
ms.devlang="multiple"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="07/20/2016"
ms.author="deonhe"/>

# Get started with the SFTP connector

Use the SFTP connector to access an SFTP account to send and receive files. You can perform various operations such as create, update, get or delete files.  

To use [any connector](./apis-list.md), you first need to create a logic app. You can get started by [creating a logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Connect to SFTP

Before your logic app can access any service, you first need to create a *connection* to the service. A [connection](./connectors-overview.md) provides connectivity between a logic app and another service.  

### Create a connection to SFTP

>[AZURE.INCLUDE [Steps to create a connection to SFTP](../../includes/connectors-create-api-sftp.md)]

## Use an SFTP trigger

A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).  

In this example, I will show you how to use the **SFTP - When a file is added or modified** trigger to initiate a logic app workflow when a file is added to, or modified on, an SFTP server. In the example, you will also learn how to add a condition that checks the contents of the new or modified file and make a decision to extract the file if its contents indicate that it  should be extracted before using the contents. Finally, you will learn how to add an action to extract the contents of a file and place the extracted contents in a folder on the SFTP server. 

In an enterprise example, you could use this trigger to monitor an SFTP folder for new files that represent orders from customers.  You could then use an SFTP connector action such as **Get file content** to get the contents of the order for further processing and storage in your orders database.

>[AZURE.INCLUDE [Steps to create an SFTP trigger](../../includes/connectors-create-api-sftp-trigger.md)]

## Add a condition

>[AZURE.INCLUDE [Steps to add a condition](../../includes/connectors-create-api-sftp-condition.md)]

## Use an SFTP action

An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).  

>[AZURE.INCLUDE [Steps to create an SFTP action](../../includes/connectors-create-api-sftp-action.md)]


## Technical Details

Here are the details about the triggers, actions and responses that this connection supports:

## SFTP triggers

SFTP has the following trigger(s):  

|Trigger | Description|
|--- | ---|
|[When a file is added or modified](connectors-create-api-sftp.md#when-a-file-is-added-or-modified)|This operation triggers a flow when a file is added or modified in a folder.|


## SFTP actions

SFTP has the following actions:


|Action|Description|
|--- | ---|
|[Get file metadata](connectors-create-api-sftp.md#get-file-metadata)|This operation gets file metadata using the file id.|
|[Update file](connectors-create-api-sftp.md#update-file)|This operation updates the file content.|
|[Delete file](connectors-create-api-sftp.md#delete-file)|This operation deletes a file.|
|[Get file metadata using path](connectors-create-api-sftp.md#get-file-metadata-using-path)|This operation gets file metadata using the file path.|
|[Get file content using path](connectors-create-api-sftp.md#get-file-content-using-path)|This operation gets file contents using the file path.|
|[Get file content](connectors-create-api-sftp.md#get-file-content)|This operation gets file contents using the file id.|
|[Create file](connectors-create-api-sftp.md#create-file)|This operation uploads a file to an SFTP server.|
|[Copy file](connectors-create-api-sftp.md#copy-file)|This operation copies a file to an SFTP server.|
|[List files in folder](connectors-create-api-sftp.md#list-files-in-folder)|This operation gets files contained in a folder.|
|[List files in root folder](connectors-create-api-sftp.md#list-files-in-root-folder)|This operation gets the files in the root folder.|
|[Extract folder](connectors-create-api-sftp.md#extract-folder)|This operation extracts an archive file into a folder (example: .zip).|
### Action details

Here are the details for the actions and triggers for this connector, along with their responses:



### Get file metadata
This operation gets file metadata using the file id. 


|Property Name| Display Name|Description|
| ---|---|---|
|id*|File|Specify the file|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Update file
This operation updates the file content. 


|Property Name| Display Name|Description|
| ---|---|---|
|id*|File|Specify the file|
|body*|File content|Content of the file to update|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Delete file
This operation deletes a file. 


|Property Name| Display Name|Description|
| ---|---|---|
|id*|File|Specify the file|

An * indicates that a property is required




### Get file metadata using path
This operation gets file metadata using the file path. 


|Property Name| Display Name|Description|
| ---|---|---|
|path*|File path|Unique path of the file|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Get file content using path
This operation gets file contents using the file path. 


|Property Name| Display Name|Description|
| ---|---|---|
|path*|File path|Unique path of the file|

An * indicates that a property is required




### Get file content
This operation gets file contents using the file id. 


|Property Name| Display Name|Description|
| ---|---|---|
|id*|File|Specify the file|

An * indicates that a property is required




### Create file
This operation uploads a file to an SFTP server. 


|Property Name| Display Name|Description|
| ---|---|---|
|folderPath*|Folder path|Unique path of the folder|
|name*|File name|Name of the file|
|body*|File content|Content of the file to create|

An * indicates that a property is required

#### Output Details

BlobMetadata


|| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Copy file
This operation copies a file to an SFTP server. 


|Property Name| Display Name|Description|
| ---|---|---|
|source*|Source file path|Path to the source file|
|destination*|Destination file path|Path to the destination file, including file name|
|overwrite|Overwrite?|Overwrites the destination file if set to 'true'|

An * indicates that a property is required

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### When a file is added or modified
This operation triggers a flow when a file is added or modified in a folder. 


|Property Name| Display Name|Description|
| ---|---|---|
|folderId*|Folder|Specify a folder|

An * indicates that a property is required




### List files in folder
This operation gets files contained in a folder. 


|Property Name| Display Name|Description|
| ---|---|---|
|id*|Folder|Specify the folder|

An * indicates that a property is required



#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### List files in root folder
This operation gets the files in the root folder. 


There are no parameters for this call

#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|




### Extract folder
This operation extracts an archive file into a folder (example: .zip). 


|Property Name| Display Name|Description|
| ---|---|---|
|source*|Source archive file path|Path to the archive file|
|destination*|Destination folder path|Path to the destination folder|
|overwrite|Overwrite?|Overwrites the destination files if set to 'true'|

An * indicates that a property is required



#### Output Details

BlobMetadata


| Property Name | Data Type |
|---|---|---|
|Id|string|
|Name|string|
|DisplayName|string|
|Path|string|
|LastModified|string|
|Size|integer|
|MediaType|string|
|IsFolder|boolean|
|ETag|string|
|FileLocator|string|



## HTTP responses

The actions and triggers above can return one or more of the following HTTP status codes: 

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occurred.|
|default|Operation Failed.|







## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)