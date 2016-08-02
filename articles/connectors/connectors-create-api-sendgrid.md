<properties
pageTitle="SendGrid | Microsoft Azure"
description="Create Logic apps with Azure App service. SendGrid Connection Provider lets you send email and manage recipient lists."
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
ms.date="05/17/2016"
ms.author="deonhe"/>

# Get started with the SendGrid connector



The SendGrid connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The SendGrid connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The SendGrid connector has the following action(s) and/or trigger(s) available:

### SendGrid actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[SendEmail](connectors-create-api-sendgrid.md#sendemail)|Sends an email using SendGrid API (Limited to 10,000 recipients)|
|[AddRecipientToList](connectors-create-api-sendgrid.md#addrecipienttolist)|Add an individual recipient to a recipient list|
### SendGrid triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|


## Create a connection to SendGrid
To create Logic apps with SendGrid, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|ApiKey|Yes|Provide Your SendGrid Api Key|
 

>[AZURE.INCLUDE [Steps to create a connection to SendGrid](../../includes/connectors-create-api-sendgrid.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

After you create the connection, you can use it to execute the actions and listen for the triggers described in this article.

## Reference for SendGrid
Applies to version: 1.0

## SendEmail
Send email: Sends an email using SendGrid API (Limited to 10,000 recipients) 

```POST: /api/mail.send.json``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|request| |yes|body|none|Email message to send|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|429|Too Many Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## AddRecipientToList
Add recipient to list: Add an individual recipient to a recipient list 

```POST: /v3/contactdb/lists/{listId}/recipients/{recipientId}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|listId|string|yes|path|none|Unique id of the recipient list|
|recipientId|string|yes|path|none|Unique id of the recipient|

#### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## Object definitions 

### EmailRequest


| Property Name | Data Type | Required |
|---|---|---|
|from|string|Yes |
|fromname|string|No |
|to|string|Yes |
|toname|string|No |
|subject|string|Yes |
|body|string|Yes |
|ishtml|boolean|No |
|cc|string|No |
|ccname|string|No |
|bcc|string|No |
|bccname|string|No |
|replyto|string|No |
|date|string|No |
|headers|string|No |
|files|array|No |
|filenames|array|No |



### EmailResponse


| Property Name | Data Type | Required |
|---|---|---|
|message|string|No |



### RecipientLists


| Property Name | Data Type | Required |
|---|---|---|
|lists|array|No |



### RecipientList


| Property Name | Data Type | Required |
|---|---|---|
|id|integer|No |
|name|string|No |
|recipient_count|integer|No |



### Recipients


| Property Name | Data Type | Required |
|---|---|---|
|recipients|array|No |



### Recipient


| Property Name | Data Type | Required |
|---|---|---|
|email|string|No |
|last_name|string|No |
|first_name|string|No |
|id|string|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)