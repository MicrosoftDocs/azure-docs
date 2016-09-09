<properties
pageTitle=" Use the Slack Connector in your Logic apps| Microsoft Azure"
description="Get started using the Slack Connector in your Microsoft Azure App Service Logic apps"
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

# Get started with the Slack connector

Slack is a team communication tool, that brings together all of your team communications in one place, instantly searchable and available wherever you go.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With the Slack connector, you can:

* Use it to build logic apps

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Slack connector can be used as an action; there are no triggers. All connectors support data in JSON and XML formats. 

 The Slack connector has the following action(s) and/or trigger(s) available:

### Slack actions
You can take these action(s):

|Action|Description|
|--- | ---|
|PostMessage|Post a Message to a specified channel.|
## Create a connection to Slack
To use the Slack connector, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Slack Credentials|

Follow these steps to sign into Slack and complete the configuration of the Slack **connection** in your logic app:

1. Select **Recurrence**
2. Select a **Frequency** and enter an **Interval**
3. Select **Add an action**  
![Configure Slack][1]  
4. Enter Slack in the search box and wait for the search to return all entries with Slack in the name
5. Select **Slack - Post message**
6. Select **Sign in to Slack**:  
![Configure Slack][2]
7. Provide your Slack credentials to sign in to authorize the  application    
![Configure Slack][3]  
8. You'll be redirected to your organization's Log in page. **Authorize** Slack to interact with your logic app:      
![Configure Slack][5] 
9. After the authorization completes you'll be redirected to your logic app to complete it by configuring the **Slack - Get all messages** section. Add other triggers and actions that you need.  
![Configure Slack][6]
10. Save your work by selecting **Save** on the menu bar above.


>[AZURE.TIP] You can use this connection in other logic apps.

## Slack REST API reference
#### This documentation is for version: 1.0


### Post a Message to a specified channel.
**```POST: /chat.postMessage```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|channel|string|yes|query|none|Channel, private group, or IM channel to send message to. Can be a name(ex: #general) or an encoded ID.|
|text|string|yes|query|none|Text of the message to send. For formatting options, see https://api.slack.com/docs/formatting.|
|username|string|no|query|none|Name of the bot|
|as_user|boolean|no|query|none|Pass true to post the message as the authenticated user, instead of as a bot|
|parse|string|no|query|none|Change how messages are treated. For details, see https://api.slack.com/docs/formatting.|
|link_names|integer|no|query|none|Find and link channel names and usernames.|
|unfurl_links|boolean|no|query|none|Pass true to enable unfurling of primarily text-based content.|
|unfurl_media|boolean|no|query|none|Pass false to disable unfurling of media content.|
|icon_url|string|no|query|none|URL to an image to use as an icon for this message|
|icon_emoji|string|no|query|none|Emoji to use as an icon for this message|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|408|Request Timeout|
|429|Too Many Requests|
|500|Internal Server Error. Unknown error occured|
|503|Slack Service Unavailable|
|504|Gateway Timeout|
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


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)

[1]: ./media/connectors-create-api-slack/connectionconfig1.png
[2]: ./media/connectors-create-api-slack/connectionconfig2.png 
[3]: ./media/connectors-create-api-slack/connectionconfig3.png
[4]: ./media/connectors-create-api-slack/connectionconfig4.png
[5]: ./media/connectors-create-api-slack/connectionconfig5.png
[6]: ./media/connectors-create-api-slack/connectionconfig6.png
