<properties
pageTitle="Add the Office 365 Outlook API to your Logic Apps | Microsoft Azure"
description="Overview of Office 365 Outlook API with REST API parameters"
services=""	
documentationCenter="" 	
authors="msftman"	
manager="dwrede"	
editor="" tags="connectors" />

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="02/22/2016"
ms.author="deonhe"/>

# Get started with the Office365 Outlook API

Office 365 connector enables interaction with Office 365. For example: creating, editing, and updating contacts and calendar items.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Office365](../app-service-logic/app-service-logic-connector-Office365.md).

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Office365 connector, you can:

* Use it to build logic apps
* Use it to build power apps

This topic focuses on the Office365 triggers and actions available, creating a connection to the connector, and also lists the REST API parameters.

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](..powerapps-register-from-available-apis.md).

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Office365 connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The Office365 connector has the following action(s) and/or trigger(s) available:

### Office365 actions
You can take these action(s):

|Action|Description|
|--- | ---|
|GetEmails|Retrieves emails from a folder|
|SendEmail|Sends an email message|
|DeleteEmail|Deletes an email message by id|
|MarkAsRead|Marks an email message as having been read|
|ReplyTo|Replies to an email message|
|GetAttachment|Retrieves message attachment by id|
|SendMailWithOptions|Send an email with multiple options and wait for the recipient to respond back with one of the options.|
|SendApprovalMail|Send an approval email and wait for a response from the To recipient.|
|CalendarGetTables|Retrieves calendars|
|CalendarGetItems|Retrieves items from a calendar|
|CalendarPostItem|Creates a new event|
|CalendarGetItem|Retrieves a specific item from a calendar|
|CalendarDeleteItem|Deletes a calendar item|
|CalendarPatchItem|Partially updates a calendar item|
|ContactGetTables|Retrieves contacts folders|
|ContactGetItems|Retrieves contacts from a contacts folder|
|ContactPostItem|Creates a new contact|
|ContactGetItem|Retrieves a specific contact from a contacts folder|
|ContactDeleteItem|Deletes a contact|
|ContactPatchItem|Partially updates a contact|
### Office365 triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|OnUpcomingEvents|Triggers a flow when an upcoming calendar event is starting|
|OnNewEmail|Triggers a flow when a new email arrives|
|CalendarGetOnNewItems|Triggered when a new calendar item is created|
|CalendarGetOnUpdatedItems|Triggered when a calendar item is modified|


## Create a connection to Office365
To use the Office365 API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Office365 Credentials|


>[AZURE.TIP] You can use this connection in other logic apps.

## Office365 REST API reference
#### This documentation is for version: 1.0


### On event starting soon 


 Triggers a flow when an upcoming calendar event is starting
```GET: /Events/OnUpcomingEvents``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|query|none|Unique identifier of the calendar|
|lookAheadTimeInMinutes|integer|no|query|15|Time (in minutes) to look ahead for upcoming events.|


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
------



### Get emails 


 Retrieves emails from a folder
```GET: /Mail``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|no|query|Inbox|Path of the folder to retrieve messages (default: 'Inbox')|
|top|integer|no|query|10|Number of emails to retrieve (default: 10)|
|fetchOnlyUnread|boolean|no|query|true|Retrieve only unread messages?|
|includeAttachments|boolean|no|query|false|If set to true, attachments will also be retrieved along with the email message.|
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
------



### Send Email 


 Sends an email message
```POST: /Mail``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|emailMessage| |yes|body|none|Email message instance|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Delete email 


 Deletes an email message by id
```DELETE: /Mail/{messageId}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the message to delete.|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Mark as read 


 Marks an email message as having been read
```POST: /Mail/MarkAsRead/{messageId}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the message to be marked as read|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Reply to message 


 Replies to an email message
```POST: /Mail/ReplyTo/{messageId}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the message to reply to|
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
------



### Get attachment 


 Retrieves message attachment by id
```GET: /Mail/{messageId}/Attachments/{attachmentId}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|messageId|string|yes|path|none|Id of the message|
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
------



### On new email 


 Triggers a flow when a new email arrives
```GET: /Mail/OnNewEmail``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|folderPath|string|no|query|Inbox|Email folder to retrieve (default: Inbox)|
|to|string|no|query|none|Recipient email addresses|
|from|string|no|query|none|From address|
|importance|string|no|query|Normal|Importance of the email (High, Normal, Low) (default: Normal)|
|fetchOnlyWithAttachment|boolean|no|query|false|Retrieve only emails with an attachment|
|includeAttachments|boolean|no|query|false|Include attachments|
|subjectFilter|string|no|query|none|String to look for in the subject.|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful.|
|202|Accepted|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Send email with options 


 Send an email with multiple options and wait for the recipient to respond back with one of the options.
```POST: /mailwithoptions/$subscriptions``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|optionsEmailSubscription| |yes|body|none|Subscription Request for options Email|


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
------



### Send approval email 


 Send an approval email and wait for a response from the To recipient.
```POST: /approvalmail/$subscriptions``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|approvalEmailSubscription| |yes|body|none|Subscription Request for Approval Email.|


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
------



### Get calendars 


 Retrieves calendars
```GET: /datasets/calendars/tables``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Get events 


 Retrieves items from a calendar
```GET: /datasets/calendars/tables/{table}/items``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of the calendar to retrieve|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Create event 


 Creates a new event
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
------



### Get event 


 Retrieves a specific item from a calendar
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
------



### Delete event 


 Deletes a calendar item
```DELETE: /datasets/calendars/tables/{table}/items/{id}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar.|
|id|string|yes|path|none|Unique identifier of calendar item to delete|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Update event 


 Partially updates a calendar item
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
------



### On new items 


 Triggered when a new calendar item is created
```GET: /datasets/calendars/tables/{table}/onnewitems``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### On updated items 


 Triggered when a calendar item is modified
```GET: /datasets/calendars/tables/{table}/onupdateditems``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a calendar|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Get contact folders 


 Retrieves contacts folders
```GET: /datasets/contacts/tables``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Get contacts 


 Retrieves contacts from a contacts folder
```GET: /datasets/contacts/tables/{table}/items``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of the contacts folder to retrieve|
|$skip|integer|no|query|none|Number of entries to skip (default = 0)|
|$top|integer|no|query|none|Maximum number of entries to retrieve (default = 256)|
|$filter|string|no|query|none|An ODATA filter query to restrict the number of entries|
|$orderby|string|no|query|none|An ODATA orderBy query for specifying the order of entries|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Create contact 


 Creates a new contact
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
------



### Get contact 


 Retrieves a specific contact from a contacts folder
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
------



### Delete contact 


 Deletes a contact
```DELETE: /datasets/contacts/tables/{table}/items/{id}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|table|string|yes|path|none|Unique identifier of a contacts folder.|
|id|string|yes|path|none|Unique identifier of contact to delete|


#### Response

|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|
------



### Update contact 


 Partially updates a contact
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
------



## Object definition(s): 

 **TriggerBatchResponse[IDictionary[String,Object]]**:

Required properties for TriggerBatchResponse[IDictionary[String,Object]]:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **Object**:

Required properties for Object:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|



 **SendMessage**:Send Email Message

Required properties for SendMessage:

Subject, Body, To

**All properties**: 


| Name | Data Type |
|---|---|
|Attachments|array|
|From|string|
|Cc|string|
|Bcc|string|
|Subject|string|
|Body|string|
|Importance|string|
|IsHtml|boolean|
|To|string|



 **SendAttachment**:Attachment

Required properties for SendAttachment:

Name, ContentBytes

**All properties**: 


| Name | Data Type |
|---|---|
|@odata.type|string|
|Name|string|
|ContentBytes|string|



 **ReceiveMessage**:Receive Email Message

Required properties for ReceiveMessage:

Subject, Body, To

**All properties**: 


| Name | Data Type |
|---|---|
|Id|string|
|IsRead|boolean|
|HasAttachment|boolean|
|DateTimeReceived|string|
|Attachments|array|
|From|string|
|Cc|string|
|Bcc|string|
|Subject|string|
|Body|string|
|Importance|string|
|IsHtml|boolean|
|To|string|



 **ReceiveAttachment**:Receive Attachment

Required properties for ReceiveAttachment:

Id, ContentType, Name, ContentBytes

**All properties**: 


| Name | Data Type |
|---|---|
|Id|string|
|ContentType|string|
|@odata.type|string|
|Name|string|
|ContentBytes|string|



 **DigestMessage**:Send Email Message

Required properties for DigestMessage:

Subject, Digest, To

**All properties**: 


| Name | Data Type |
|---|---|
|Subject|string|
|Body|string|
|Importance|string|
|Digest|array|
|Attachments|array|
|To|string|



 **TriggerBatchResponse[ReceiveMessage]**:

Required properties for TriggerBatchResponse[ReceiveMessage]:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **DataSetsMetadata**:

Required properties for DataSetsMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|tabular|not defined|
|blob|not defined|



 **TabularDataSetsMetadata**:

Required properties for TabularDataSetsMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|source|string|
|displayName|string|
|urlEncoding|string|
|tableDisplayName|string|
|tablePluralName|string|



 **BlobDataSetsMetadata**:

Required properties for BlobDataSetsMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|source|string|
|displayName|string|
|urlEncoding|string|



 **TableMetadata**:

Required properties for TableMetadata:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|name|string|
|title|string|
|x-ms-permission|string|
|schema|not defined|



 **OptionsEmailSubscription**:Model for Options Email Subscription

Required properties for OptionsEmailSubscription:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|NotificationUrl|string|
|Message|not defined|



 **MessageWithOptions**:User Options Email Message. This is the message expected as part of user input

Required properties for MessageWithOptions:

Subject, Options, To

**All properties**: 


| Name | Data Type |
|---|---|
|Subject|string|
|Options|string|
|Body|string|
|Importance|string|
|Attachments|array|
|To|string|



 **SubscriptionResponse**:Model for Approval Email Subscription

Required properties for SubscriptionResponse:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|id|string|
|resource|string|
|notificationType|string|
|notificationUrl|string|



 **ApprovalEmailSubscription**:Model for Approval Email Subscription

Required properties for ApprovalEmailSubscription:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|NotificationUrl|string|
|Message|not defined|



 **ApprovalMessage**:Approval Email Message. This is the message expected as part of user input

Required properties for ApprovalMessage:

Subject, Options, To

**All properties**: 


| Name | Data Type |
|---|---|
|Subject|string|
|Options|string|
|Body|string|
|Importance|string|
|Attachments|array|
|To|string|



 **ApprovalEmailResponse**:Approval Email Response

Required properties for ApprovalEmailResponse:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|SelectedOption|string|



 **TablesList**:

Required properties for TablesList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **Table**:

Required properties for Table:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Name|string|
|DisplayName|string|



 **Item**:

Required properties for Item:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|ItemInternalId|string|



 **CalendarItemsList**:The list of calendar items

Required properties for CalendarItemsList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **CalendarItem**:Represents a calendar table item

Required properties for CalendarItem:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|ItemInternalId|string|



 **ContactItemsList**:The list of contact items

Required properties for ContactItemsList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **ContactItem**:Represents a contact table item

Required properties for ContactItem:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|ItemInternalId|string|



 **DataSetsList**:

Required properties for DataSetsList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|value|array|



 **DataSet**:

Required properties for DataSet:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Name|string|
|DisplayName|string|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)