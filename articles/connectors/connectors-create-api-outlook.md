<properties
pageTitle="Outlook.com | Microsoft Azure"
description="Create Logic apps with Azure App service. Outlook.com connector allows you to manage your mail, calendars, and contacts. You can perform various actions such as send mail, schedule meetings, add contacts, etc."
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
ms.date="04/29/2016"
ms.author="deonhe"/>

# Get started with the Outlook.com connector

Outlook.com connector allows you to manage your mail, calendars, and contacts. You can perform various actions such as send mail, schedule meetings, add contacts, etc.

The Outlook.com connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flow.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The Outlook.com connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The Outlook.com connector has the following action(s) and/or trigger(s) available:

### Outlook.com actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[GetEmails](connectors-create-api-outlook.md#GetEmails)|Retrieves emails from a folder|
|[SendEmail](connectors-create-api-outlook.md#SendEmail)|Sends an email|
|[DeleteEmail](connectors-create-api-outlook.md#DeleteEmail)|Deletes an email by id|
|[MarkAsRead](connectors-create-api-outlook.md#MarkAsRead)|Marks an email as having been read|
|[ReplyTo](connectors-create-api-outlook.md#ReplyTo)|Replies to an email|
|[GetAttachment](connectors-create-api-outlook.md#GetAttachment)|Retrieves email attachment by id|
|[SendMailWithOptions](connectors-create-api-outlook.md#SendMailWithOptions)|Send an email with multiple options and wait for the recipient to respond back with one of the options|
|[SendApprovalMail](connectors-create-api-outlook.md#SendApprovalMail)|Send an approval email and wait for a response from the recipient|
|[CalendarGetTables](connectors-create-api-outlook.md#CalendarGetTables)|Retrieves calendars|
|[CalendarGetItems](connectors-create-api-outlook.md#CalendarGetItems)|Retrieves items from a calendar|
|[CalendarPostItem](connectors-create-api-outlook.md#CalendarPostItem)|Creates a new event|
|[CalendarGetItem](connectors-create-api-outlook.md#CalendarGetItem)|Retrieves a specific item from a calendar|
|[CalendarDeleteItem](connectors-create-api-outlook.md#CalendarDeleteItem)|Deletes a calendar item|
|[CalendarPatchItem](connectors-create-api-outlook.md#CalendarPatchItem)|Partially updates a calendar item|
|[ContactGetTables](connectors-create-api-outlook.md#ContactGetTables)|Retrieves contacts folders|
|[ContactGetItems](connectors-create-api-outlook.md#ContactGetItems)|Retrieves contacts from a contacts folder|
|[ContactPostItem](connectors-create-api-outlook.md#ContactPostItem)|Creates a new contact|
|[ContactGetItem](connectors-create-api-outlook.md#ContactGetItem)|Retrieves a specific contact from a contacts folder|
|[ContactDeleteItem](connectors-create-api-outlook.md#ContactDeleteItem)|Deletes a contact|
|[ContactPatchItem](connectors-create-api-outlook.md#ContactPatchItem)|Partially updates a contact|
### Outlook.com triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|On event starting soon|Triggers a flow when an upcoming calendar event is starting|
|On new email|Triggers a flow when a new email arrives|
|On new items|Triggered when a new calendar item is created|
|On updated items|Triggered when a calendar item is modified|


## Create a connection to Outlook.com
To create Logic apps with Outlook.com, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Outlook.com Credentials|
After you create the connection, you can use it to execute the actions and listen for the triggers described in this article.

>[AZURE.INCLUDE [Steps to create a connection to Outlook.com](../../includes/connectors-create-api-outlook.md)] 

>[AZURE.TIP] You can use this connection in other logic apps.  

## Reference for Outlook.com
Applies to version: 1.0

## OnUpcomingEvents
On event starting soon: Triggers a flow when an upcoming calendar event is starting 

```GET: /Events/OnUpcomingEvents``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|query|none|Unique identifier of the calendar|
|lookAheadTimeInMinutes|integer|no|query|15|Time (in minutes) to look ahead for upcoming events|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## GetEmails
Get emails: Retrieves emails from a folder 

```GET: /Mail``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|no|query|Inbox|Path of the folder to retrieve emails (default: 'Inbox')|
|top|integer|no|query|10|Number of emails to retrieve (default: 10)|
|fetchOnlyUnread|boolean|no|query|true|Retrieve only unread emails?|
|includeAttachments|boolean|no|query|false|If set to true, attachments will also be retrieved along with the email|
|searchQuery|string|no|query|none|Search query to filter emails|
|skip|integer|no|query|0|Number of emails to skip (default: 0)|
|skipToken|string|no|query|none|Skip token to fetch new page|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## SendEmail
Send email: Sends an email 

```POST: /Mail``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|emailMessage| |yes|body|none|Email|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## DeleteEmail
Delete email: Deletes an email by id 

```DELETE: /Mail/{messageId}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the email to delete|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## MarkAsRead
Mark as read: Marks an email as having been read 

```POST: /Mail/MarkAsRead/{messageId}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the email to be marked as read|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## ReplyTo
Reply to email: Replies to an email 

```POST: /Mail/ReplyTo/{messageId}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the email to reply to|
|comment|string|yes|query|none|Reply comment|
|replyAll|boolean|no|query|false|Reply to all recipients|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## GetAttachment
Get attachment: Retrieves email attachment by id 

```GET: /Mail/{messageId}/Attachments/{attachmentId}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the email|
|attachmentId|string|yes|path|none|Id of the attachment to download|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## OnNewEmail
On new email: Triggers a flow when a new email arrives 

```GET: /Mail/OnNewEmail``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|no|query|Inbox|Email folder to retrieve (default: Inbox)|
|to|string|no|query|none|Recipient email addresses|
|from|string|no|query|none|From address|
|importance|string|no|query|Normal|Importance of the email (High, Normal, Low) (default: Normal)|
|fetchOnlyWithAttachment|boolean|no|query|false|Retrieve only emails with an attachment|
|includeAttachments|boolean|no|query|false|Include attachments|
|subjectFilter|string|no|query|none|String to look for in the subject|

#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Accepted|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## SendMailWithOptions
Send email with options: Send an email with multiple options and wait for the recipient to respond back with one of the options 

```POST: /mailwithoptions/$subscriptions``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|optionsEmailSubscription| |yes|body|none|Subscription request for options email|

#### Response

|Name|Description|
|---|---|
|200|OK|
|201|Subscription Created|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## SendApprovalMail
Send approval email: Send an approval email and wait for a response from the recipient 

```POST: /approvalmail/$subscriptions``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|approvalEmailSubscription| |yes|body|none|Subscription request for approval email|

#### Response

|Name|Description|
|---|---|
|200|OK|
|201|Subscription Created|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|


## CalendarGetTables
Get calendars: Retrieves calendars 

```GET: /datasets/calendars/tables``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarGetItems
Get events: Retrieves items from a calendar 

```GET: /datasets/calendars/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of the calendar to retrieve|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarPostItem
Create event: Creates a new event 

```POST: /datasets/calendars/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|item| |yes|body|none|Calendar item to create|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarGetItem
Get event: Retrieves a specific item from a calendar 

```GET: /datasets/calendars/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|id|string|yes|path|none|Unique identifier of a calendar item to retrieve|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarDeleteItem
Delete event: Deletes a calendar item 

```DELETE: /datasets/calendars/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|id|string|yes|path|none|Unique identifier of calendar item to delete|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarPatchItem
Update event: Partially updates a calendar item 

```PATCH: /datasets/calendars/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|id|string|yes|path|none|Unique identifier of calendar item to update|
|item| |yes|body|none|Calendar item to update|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarGetOnNewItems
On new items: Triggered when a new calendar item is created 

```GET: /datasets/calendars/tables/{table}/onnewitems``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## CalendarGetOnUpdatedItems
On updated items: Triggered when a calendar item is modified 

```GET: /datasets/calendars/tables/{table}/onupdateditems``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ContactGetTables
Get contact folders: Retrieves contacts folders 

```GET: /datasets/contacts/tables``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ContactGetItems
Get contacts: Retrieves contacts from a contacts folder 

```GET: /datasets/contacts/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of the contacts folder to retrieve|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ContactPostItem
Create contact: Creates a new contact 

```POST: /datasets/contacts/tables/{table}/items``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a contacts folder|
|item| |yes|body|none|Contact to create|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ContactGetItem
Get contact: Retrieves a specific contact from a contacts folder 

```GET: /datasets/contacts/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a contacts folder|
|id|string|yes|path|none|Unique identifier of a contact to retrieve|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ContactDeleteItem
Delete contact: Deletes a contact 

```DELETE: /datasets/contacts/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a contacts folder|
|id|string|yes|path|none|Unique identifier of contact to delete|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## ContactPatchItem
Update contact: Partially updates a contact 

```PATCH: /datasets/contacts/tables/{table}/items/{id}``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a contacts folder|
|id|string|yes|path|none|Unique identifier of contact to update|
|item| |yes|body|none|Contact item to update|

#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## Object definitions 

### TriggerBatchResponse[IDictionary[String,Object]]


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### Object


| Property Name | Data Type | Required |
|---|---|---|



### SendMessage


| Property Name | Data Type | Required |
|---|---|---|
|Attachments|array|No |
|From|string|No |
|Cc|string|No |
|Bcc|string|No |
|Subject|string|Yes |
|Body|string|Yes |
|Importance|string|No |
|IsHtml|boolean|No |
|To|string|Yes |



### SendAttachment


| Property Name | Data Type | Required |
|---|---|---|
|@odata.type|string|No |
|Name|string|Yes |
|ContentBytes|string|Yes |



### ReceiveMessage


| Property Name | Data Type | Required |
|---|---|---|
|Id|string|No |
|IsRead|boolean|No |
|HasAttachment|boolean|No |
|DateTimeReceived|string|No |
|Attachments|array|No |
|From|string|No |
|Cc|string|No |
|Bcc|string|No |
|Subject|string|Yes |
|Body|string|Yes |
|Importance|string|No |
|IsHtml|boolean|No |
|To|string|Yes |



### ReceiveAttachment


| Property Name | Data Type | Required |
|---|---|---|
|Id|string|Yes |
|ContentType|string|Yes |
|@odata.type|string|No |
|Name|string|Yes |
|ContentBytes|string|Yes |



### DigestMessage


| Property Name | Data Type | Required |
|---|---|---|
|Subject|string|Yes |
|Body|string|No |
|Importance|string|No |
|Digest|array|Yes |
|Attachments|array|No |
|To|string|Yes |



### TriggerBatchResponse[ReceiveMessage]


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### DataSetsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|tabular|not defined|No |
|blob|not defined|No |



### TabularDataSetsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|source|string|No |
|displayName|string|No |
|urlEncoding|string|No |
|tableDisplayName|string|No |
|tablePluralName|string|No |



### BlobDataSetsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|source|string|No |
|displayName|string|No |
|urlEncoding|string|No |



### TableMetadata


| Property Name | Data Type | Required |
|---|---|---|
|name|string|No |
|title|string|No |
|x-ms-permission|string|No |
|x-ms-capabilities|not defined|No |
|schema|not defined|No |



### TableCapabilitiesMetadata


| Property Name | Data Type | Required |
|---|---|---|
|sortRestrictions|not defined|No |
|filterRestrictions|not defined|No |
|filterFunctions|array|No |



### TableSortRestrictionsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|sortable|boolean|No |
|unsortableProperties|array|No |
|ascendingOnlyProperties|array|No |



### TableFilterRestrictionsMetadata


| Property Name | Data Type | Required |
|---|---|---|
|filterable|boolean|No |
|nonFilterableProperties|array|No |
|requiredProperties|array|No |



### OptionsEmailSubscription


| Property Name | Data Type | Required |
|---|---|---|
|NotificationUrl|string|No |
|Message|not defined|No |



### MessageWithOptions


| Property Name | Data Type | Required |
|---|---|---|
|Subject|string|Yes |
|Options|string|Yes |
|Body|string|No |
|Importance|string|No |
|Attachments|array|No |
|To|string|Yes |



### SubscriptionResponse


| Property Name | Data Type | Required |
|---|---|---|
|id|string|No |
|resource|string|No |
|notificationType|string|No |
|notificationUrl|string|No |



### ApprovalEmailSubscription


| Property Name | Data Type | Required |
|---|---|---|
|NotificationUrl|string|No |
|Message|not defined|No |



### ApprovalMessage


| Property Name | Data Type | Required |
|---|---|---|
|Subject|string|Yes |
|Options|string|Yes |
|Body|string|No |
|Importance|string|No |
|Attachments|array|No |
|To|string|Yes |



### ApprovalEmailResponse


| Property Name | Data Type | Required |
|---|---|---|
|SelectedOption|string|No |



### TablesList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### Table


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|No |
|DisplayName|string|No |



### Item


| Property Name | Data Type | Required |
|---|---|---|
|ItemInternalId|string|No |



### CalendarItemsList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### CalendarItem


| Property Name | Data Type | Required |
|---|---|---|
|ItemInternalId|string|No |



### ContactItemsList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### ContactItem


| Property Name | Data Type | Required |
|---|---|---|
|ItemInternalId|string|No |



### DataSetsList


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### DataSet


| Property Name | Data Type | Required |
|---|---|---|
|Name|string|No |
|DisplayName|string|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)