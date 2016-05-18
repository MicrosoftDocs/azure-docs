<properties
pageTitle="Add the Yammer Connector in your Logic Apps | Microsoft Azure"
description="Overview of the Yammer Connector with REST API parameters"
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
ms.date="05/18/2016"
ms.author="deonhe"/>

# Get started with the Yammer connector

Connect to Yammer to access conversations in your enterprise network.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With Yammer, you can:

- Build your business flow based on the data you get from Yammer. 
- Use triggers for when there is a new message in a group, or a feed your following.
- Use actions to post a message, get all messages, and more. These actions get a response, and then make the output available for other actions. For example, when a new message appears, you can send an email using Office 365.

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
Yammer includes the following triggers and actions. 

Trigger | Actions
--- | ---
<ul><li>When there is a new message in a group</li><li>When there is a new message in my Following feed</li></ul>| <ul><li>Get all messages</li><li>Gets messages in a group</li><li>Gets the messages from my Following feed</li><li>Post message</li><li>When there is a new message in a group</li><li>When there is a new message in my Following feed</li></ul>

All connectors support data in JSON and XML formats. 

## Create a connection to Yammer
To use the Yammer connector, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Yammer Credentials|

>[AZURE.INCLUDE [Steps to create a connection to Yammer](../../includes/connectors-create-api-yammer.md)]


>[AZURE.TIP] You can use this connection in other logic apps.

## Yammer REST API reference
This documentation is for version: 1.0


### Get all public messages in the logged in user's Yammer network
Corresponds to "All" conversations in the Yammer web interface.  
```GET: /messages.json```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|older_then|integer|no|query|none|Returns messages older than the message ID specified as a numeric string. This is useful for paginating messages. For example, if you’re currently viewing 20 messages and the oldest is number 2912, you could append “?older_than=2912″ to your request to get the 20 messages prior to those you’re seeing.|
|newer_then|integer|no|query|none|Returns messages newer than the message ID specified as a numeric string. This should be used when polling for new messages. If you’re looking at messages, and the most recent message returned is 3516, you can make a request with the parameter “?newer_than=3516″ to ensure that you do not get duplicate copies of messages already on your page.|
|limit|integer|no|query|none|Return only the specified number of messages.|
|page|integer|no|query|none|Get the page specified. If returned data is greater than the limit, you can use this field to access subsequent pages|


### Response

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|408|Request Timeout|
|429|Too Many Requests|
|500|Internal Server Error. Unknown error occurred|
|503|Yammer Service Unavailable|
|504|Gateway Timeout|
|default|Operation Failed.|


### Post a Message to a Group or All Company Feed
If group ID is provided, message will be posted to the specified group else it will be posted in All Company Feed.    
```POST: /messages.json``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|input| |yes|body|none|Post Message Request|


### Response

|Name|Description|
|---|---|
|201|Created|



## Object definitions

#### Message: Yammer Message

| Name | Data Type | Required |
|---|---| --- | 
|id|integer|no|
|content_excerpt|string|no|
|sender_id|integer|no|
|replied_to_id|integer|no|
|created_at|string|no|
|network_id|integer|no|
|message_type|string|no|
|sender_type|string|no|
|url|string|no|
|web_url|string|no|
|group_id|integer|no|
|body|not defined|no|
|thread_id|integer|no|
|direct_message|boolean|no|
|client_type|string|no|
|client_url|string|no|
|language|string|no|
|notified_user_ids|array|no|
|privacy|string|no|
|liked_by|not defined|no|
|system_message|boolean|no|

#### PostOperationRequest: Represents a post request for Yammer Connector to post to yammer

| Name | Data Type | Required |
|---|---| --- | 
|body|string|yes|
|group_id|integer|no|
|replied_to_id|integer|no|
|direct_to_id|integer|no|
|broadcast|boolean|no|
|topic1|string|no|
|topic2|string|no|
|topic3|string|no|
|topic4|string|no|
|topic5|string|no|
|topic6|string|no|
|topic7|string|no|
|topic8|string|no|
|topic9|string|no|
|topic10|string|no|
|topic11|string|no|
|topic12|string|no|
|topic13|string|no|
|topic14|string|no|
|topic15|string|no|
|topic16|string|no|
|topic17|string|no|
|topic18|string|no|
|topic19|string|no|
|topic20|string|no|

#### MessageList: List of messages

| Name | Data Type | Required |
|---|---| --- | 
|messages|array|no|


#### MessageBody: Message Body

| Name | Data Type | Required |
|---|---| --- | 
|parsed|string|no|
|plain|string|no|
|rich|string|no|

#### LikedBy: Liked By

| Name | Data Type | Required |
|---|---| --- | 
|count|integer|no|
|names|array|no|

#### YammmerEntity: Liked By

| Name | Data Type | Required |
|---|---| --- | 
|type|string|no|
|id|integer|no|
|full_name|string|no|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

[1]: ./media/connectors-create-api-yammer/connectionconfig1.png
[2]: ./media/connectors-create-api-yammer/connectionconfig2.png 
[3]: ./media/connectors-create-api-yammer/connectionconfig3.png
[4]: ./media/connectors-create-api-yammer/connectionconfig4.png
[5]: ./media/connectors-create-api-yammer/connectionconfig5.png
