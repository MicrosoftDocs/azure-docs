<properties
pageTitle="Use the Yammer API in your Logic Apps | Microsoft Azure"
description="Get started building Microsoft Azure App Service logic apps with Yammer API (connector)"
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

# Get started with the Yammer API

Yammer is a social networking service for the enterprise.  Connect to Yammer to access conversations in your enterprise network.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Yammer](../app-service-logic/app-service-logic-connector-Yammer.md).

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Yammer connector, you can:

* Use it to build logic apps

This topic focuses on the Yammer triggers and actions available, creating a connection to the connector, and also lists the REST API parameters.

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Yammer connector can be used as an action; there are no triggers. All connectors support data in JSON and XML formats. 

 The Yammer connector has the following action(s) and/or trigger(s) available:

### Yammer actions
You can take these action(s):

|Action|Description|
|--- | ---|
|GetMessages|Get all public messages in the logged in user's Yammer network. Corresponds to "All" conversations in the Yammer web interface.|
|PostMessage|Post a Message to a Group or All Company Feed. If group ID is provided, message will be posted to the specified group else it will be posted in All Company Feed.|
## Create a connection to Yammer
To use the Yammer API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Yammer Credentials|


>[AZURE.TIP] You can use this connection in other logic apps.

## Yammer REST API reference
#### This documentation is for version: 1.0


### Get all public messages in the logged in user's Yammer network. Corresponds to "All" conversations in the Yammer web interface.
**```GET: /messages.json```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|older_then|integer|no|query|none|Returns messages older than the message ID specified as a numeric string. This is useful for paginating messages. For example, if you’re currently viewing 20 messages and the oldest is number 2912, you could append “?older_than=2912″ to your request to get the 20 messages prior to those you’re seeing.|
|newer_then|integer|no|query|none|Returns messages newer than the message ID specified as a numeric string. This should be used when polling for new messages. If you’re looking at messages, and the most recent message returned is 3516, you can make a request with the parameter “?newer_than=3516″ to ensure that you do not get duplicate copies of messages already on your page.|
|limit|integer|no|query|none|Return only the specified number of messages.|
|page|integer|no|query|none|Get the page specified. If returned data is greater than the limit, you can use this field to access subsequent pages|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|408|Request Timeout|
|429|Too Many Requests|
|500|Internal Server Error. Unknown error occured|
|503|Yammer Service Unavailable|
|504|Gateway Timeout|
|default|Operation Failed.|
------



### Post a Message to a Group or All Company Feed. If group ID is provided, message will be posted to the specified group else it will be posted in All Company Feed.
**```POST: /messages.json```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|input| |yes|body|none|Post Message Request|


### Here are the possible responses:

|Name|Description|
|---|---|
|201|Created|
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