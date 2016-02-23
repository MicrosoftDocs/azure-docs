<properties
pageTitle="Use the Twilio API in your Logic apps| Microsoft Azure"
description="Get started using the Twilio API (connector) in your Microsoft Azure App Service Logic apps"
services=""	
documentationCenter="" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors"/>

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="na"
ms.date="02/18/2016"
ms.author="deonhe"/>

# Get started with the Twilio API

Twilio enables apps to send and receive global SMS, MMS and IP messages.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Twilio](../app-service-logic/app-service-logic-connector-Twilio.md).

With Twilio, you can:

* Use it to build logic apps


To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Twilio API can be used as an action; there are no triggers. All APIs support data in JSON and XML formats. 

 The Twilio API has the following action(s) and/or trigger(s) available:

### Twilio actions
You can take these action(s):

|Action|Description|
|--- | ---|
|ListMessages|Returns a list of messages associated with your account|
|SendMessage|Send a new message to a mobile number.|
|GetMessage|Returns a single message specified by the provided Message ID.|
## Create a connection to Twilio
To use the Twilio API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Sid|Yes|Provide Your Twilio Account Id|
|Token|Yes|Twilio Access Token|
After you create the connection, TODO TODO TODO

>[AZURE.TIP] You can use this connection in other logic apps.

## Twilio REST API reference
#### This documentation is for version: 1.0


### Returns a list of messages associated with your account
**```GET: /Messages.json```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|To|string|no|query|none|To phone number|
|From|string|no|query|none|From phone number|
|DateSent|string|no|query|none|Only show messages sent on this date (in GMT format), given as YYYY-MM-DD. Example: DateSent=2009-07-06. You can also specify inequality, such as DateSent<=YYYY-MM-DD for messages that were sent on or before midnight on a date, and DateSent>=YYYY-MM-DD for messages sent on or after midnight on a date.|
|PageSize|integer|no|query|50|How many resources to return in each list page. Default is 50.|
|Page|integer|no|query|0|Page number. Default is 0.|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|
------



### Send a new message to a mobile number.
**```POST: /Messages.json```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|sendMessageRequest| |yes|body|none|Message To Send|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|
------



### Returns a single message specified by the provided Message ID.
**```GET: /Messages/{MessageId}.json```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|MessageId|string|yes|path|none|Message ID|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation successful|
|400|Bad Request|
|404|Message not found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|
------



## Object definition(s): 

 **Message**:Yammer Message

Required properties for Message:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|id|integer|
|content_excerpt|string|
|sender_id|integer|
|replied_to_id|integer|
|created_at|string|
|network_id|integer|
|message_type|string|
|sender_type|string|
|url|string|
|web_url|string|
|group_id|integer|
|body|not defined|
|thread_id|integer|
|direct_message|boolean|
|client_type|string|
|client_url|string|
|language|string|
|notified_user_ids|array|
|privacy|string|
|liked_by|not defined|
|system_message|boolean|



 **PostOperationRequest**:Represents a post request for Yammer Connector to post to yammer

Required properties for PostOperationRequest:

body

**All properties**: 


| Name | Data Type |
|---|---|
|body|string|
|group_id|integer|
|replied_to_id|integer|
|direct_to_id|integer|
|broadcast|boolean|
|topic1|string|
|topic2|string|
|topic3|string|
|topic4|string|
|topic5|string|
|topic6|string|
|topic7|string|
|topic8|string|
|topic9|string|
|topic10|string|
|topic11|string|
|topic12|string|
|topic13|string|
|topic14|string|
|topic15|string|
|topic16|string|
|topic17|string|
|topic18|string|
|topic19|string|
|topic20|string|



 **MessageList**:List of messages

Required properties for MessageList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|messages|array|



 **MessageBody**:Message Body

Required properties for MessageBody:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|parsed|string|
|plain|string|
|rich|string|



 **LikedBy**:Liked By

Required properties for LikedBy:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|count|integer|
|names|array|



 **YammmerEntity**:Liked By

Required properties for YammmerEntity:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|type|string|
|id|integer|
|full_name|string|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)
## Object definition(s): 

 **WebResultModel**:Bing web search results

Required properties for WebResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Title|string|
|Description|string|
|DisplayUrl|string|
|Id|string|
|FullUrl|string|



 **VideoResultModel**:Bing video search results

Required properties for VideoResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Title|string|
|DisplayUrl|string|
|Id|string|
|MediaUrl|string|
|Runtime|integer|
|Thumbnail|not defined|



 **ThumbnailModel**:Thumbnail properties of the multimedia element

Required properties for ThumbnailModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|MediaUrl|string|
|ContentType|string|
|Width|integer|
|Height|integer|
|FileSize|integer|



 **ImageResultModel**:Bing image search results

Required properties for ImageResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Title|string|
|DisplayUrl|string|
|Id|string|
|MediaUrl|string|
|SourceUrl|string|
|Thumbnail|not defined|



 **NewsResultModel**:Bing news search results

Required properties for NewsResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Title|string|
|Description|string|
|DisplayUrl|string|
|Id|string|
|Source|string|
|Date|string|



 **SpellResultModel**:Bing spelling suggestions results

Required properties for SpellResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Id|string|
|Value|string|



 **RelatedSearchResultModel**:Bing related search results

Required properties for RelatedSearchResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Title|string|
|Id|string|
|BingUrl|string|



 **CompositeSearchResultModel**:Bing composite search results

Required properties for CompositeSearchResultModel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|WebResultsTotal|integer|
|ImageResultsTotal|integer|
|VideoResultsTotal|integer|
|NewsResultsTotal|integer|
|SpellSuggestionsTotal|integer|
|WebResults|array|
|ImageResults|array|
|VideoResults|array|
|NewsResults|array|
|SpellSuggestionResults|array|
|RelatedSearchResults|array|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)
## Object definition(s): 

 **PostOperationResponse**:Represents response of post operation of Slack Connector for posting to Slack

Required properties for PostOperationResponse:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|ok|boolean|
|channel|string|
|ts|string|
|message|not defined|
|error|string|



 **MessageItem**:A channel message.

Required properties for MessageItem:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|text|string|
|id|string|
|user|string|
|created|integer|
|is_user-deleted|boolean|


## Object definition(s): 

 **SendMessageRequest**:Request model for Send Message operation

Required properties for SendMessageRequest:

From, To, Body

**All properties**: 


| Name | Data Type |
|---|---|
|From|string|
|To|string|
|Body|string|
|MediaUrl|array|
|StatusCallback|string|
|MessagingServiceSid|string|
|ApplicationSid|string|
|MaxPrice|string|



 **Message**:Model for Message

Required properties for Message:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|body|string|
|from|string|
|to|string|
|status|string|
|sid|string|
|account_sid|string|
|api_version|string|
|num_segments|string|
|num_media|string|
|date_created|string|
|date_sent|string|
|date_updated|string|
|direction|string|
|error_code|string|
|error_message|string|
|price|string|
|uri|string|
|SubresourceUri|array|
|MessagingServiceSid|string|



 **MessageList**:Response model for List Messages operation

Required properties for MessageList:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|messages|array|
|page|integer|
|page_size|integer|
|uri|string|
|first_page_uri|string|
|next_page_uri|string|
|previous_page_uri|string|



 **AddIncomingPhoneNumberRequest**:Request model for Add Incoming Number operation

Required properties for AddIncomingPhoneNumberRequest:

PhoneNumber

**All properties**: 


| Name | Data Type |
|---|---|
|PhoneNumber|string|
|AreaCode|string|
|FriendlyName|string|



 **IncomingPhoneNumber**:Response model for Get Incoming Phone Numbers peration

Required properties for IncomingPhoneNumber:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|phone_number|string|
|friendly_name|string|
|sid|string|
|date_created|string|
|mms|boolean|
|sms|boolean|
|voice|boolean|



 **AvailablePhoneNumbers**:Available Phone Numbers

Required properties for AvailablePhoneNumbers:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|phone_number|string|
|friendly_name|string|
|lata|string|
|latitude|string|
|longitude|string|
|postal_code|string|
|rate_center|string|
|region|string|
|MMS|boolean|
|SMS|boolean|
|voice|boolean|



 **UsageRecords**:Usage Records class

Required properties for UsageRecords:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|category|string|
|usage|string|
|usage_unit|string|
|description|string|
|price|number|
|price_unit|string|
|count|string|
|count_unit|string|
|start_date|string|
|end_date|string|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).