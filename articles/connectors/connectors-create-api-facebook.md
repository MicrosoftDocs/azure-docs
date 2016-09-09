<properties
    pageTitle="Add the Facebook connector in your Logic Apps | Microsoft Azure"
    description="Overview of the Facebook connector with REST API parameters"
    services=""
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

# Get started with the Facebook connector
Connect to Facebook and post to a timeline, get a page feed, and more. The Facebook connector can be used from:

- Logic apps (discussed in this topic)
- PowerApps (see the [PowerApps connections list](https://powerapps.microsoft.com/tutorials/connections-list/) for the complete list)

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.


With Facebook, you can:

- Build your business flow based on the data you get from Facebook. 
- Use a trigger when a new post is received.
- Use actions that post to your timeline, get a page feed, and more. These actions get a response, and then make the output available for other actions. For example, when there is a new post on your timeline, you can take that post and push it to your Twitter feed. 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
The Facebook connector includes the following trigger and actions. 

| Triggers | Actions|
| --- | --- |
| <ul><li>When there is a new post on my timeline</li></ul> |<ul><li>Get feed from my timeline</li><li>Post to my timeline</li><li>When there is a new post on my timeline</li><li>Get page feed</li><li>Get user timeline</li><li>Post to page</li></ul>

All connectors support data in JSON and XML formats.

## Create a connection to Facebook
When you add this connector to your logic apps, you must authorize logic apps to connect to your Facebook.

1. Sign in to your Facebook account
2. Select **Authorize**, and allow your logic apps to connect and use your Facebook. 

>[AZURE.INCLUDE [Steps to create a connection to Facebook](../../includes/connectors-create-api-facebook.md)]

>[AZURE.TIP] You can use this same Facebook connection in other logic apps.

## Swagger REST API reference
Applies to version: 1.0.

### Get feed from my timeline
Gets the feeds from the logged in user's timeline.  
```GET: /me/feed```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|fields|string|no|query|none |Specify the fields you want returned. Example (id,name,picture).|
|limit|integer|no|query| none|Maximum number of posts to be retrieved|
|with|string|no|query| none|Restrict the list of posts to only those with location attached.|
|filter|string|no|query| none|Retrieve only posts that match a particular stream filter.|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|


### Post to my timeline
Post a status message to the logged in user's timeline.  
```POST: /me/feed```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|post|string |yes|body|none |New message to be posted|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|


### When there is a new post on my timeline
Triggers a new flow when there is a new post on the logged in user's timeline.  
```GET: /trigger/me/feed```

There are no parameters. 

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|


### Get page feed
Get posts from the feed of a specified page.  
```GET: /{pageId}/feed```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|pageId|string|yes|path| none|Id of the page from which posts have to be retrieved.|
|limit|integer|no|query| none|Maximum number of posts to be retrieved|
|include_hidden|boolean|no|query|none |Whether or not to include any posts that were hidden by the Page|
|fields|string|no|query|none |Specify the fields you want returned. Example (id,name,picture).|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|


### Get user timeline
Get Posts from a user's timeline.  
```GET: /{userId}/feed```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userId|string|yes|path|none |Id of the user whose timeline have to be retrieved.|
|limit|integer|no|query|none |Maximum number of posts to be retrieved|
|with|string|no|query|none |Restrict the list of posts to only those with location attached.|
|filter|string|no|query| none|Retrieve only posts that match a particular stream filter.|
|fields|string|no|query| none|Specify the fields you want returned. Example (id,name,picture).|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|


### Post to page
Post a message to a Facebook Page as the logged in user.  
```POST: /{pageId}/feed```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|pageId|string|yes|path|none |Id of the page to post.|
|post|many |yes|body|none |New message to be posted.|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|


## Object definitions

#### GetFeedResponse

|Property Name | Data Type | Required|
|---|---|---|
|data|array|no|

#### TriggerFeedResponse

|Property Name | Data Type |Required|
|---|---|---|
|data|array|no|

#### PostItem: A single entry in a profile's feed
The profile could be a user, page, app, or group. 

|Property Name | Data Type |Required|
|---|---|---|
|id|string|no|
|admin_creator|array|no|
|caption|string|no|
|created_time|string|no|
|description|string|no|
|feed_targeting|not defined|no|
|from|not defined|no|
|icon|string|no|
|is_hidden|boolean|no|
|is_published|boolean|no|
|link|string|no|
|message|string|no|
|name|string|no|
|object_id|string|no|
|picture|string|no|
|place|not defined|no|
|privacy|not defined|no|
|properties|array|no|
|source|string|no|
|status_type|string|no|
|story|string|no|
|targeting|not defined|no|
|to|array|no|
|type|string|no|
|updated_time|string|no|
|with_tags|not defined|no|

#### TriggerItem: A single entry in a profile's feed
The profile could be a user, page, app, or group.

|Property Name | Data Type |Required|
|---|---|---|
|id|string|no|
|created_time|string|no|
|from|not defined|no|
|message|string|no|
|type|string|no|

#### AdminItem

|Property Name | Data Type |Required|
|---|---|---|
|id|string|no|
|link|string|no|

#### PropertyItem

|Property Name | Data Type |Required|
|---|---|---|
|name|string|no|
|text|string|no|
|href|string|no|

#### UserPostFeedRequest

|Property Name | Data Type |Required|
|---|---|---|
|message|string|yes|
|link|string|no|
|picture|string|no|
|name|string|no|
|caption|string|no|
|description|string|no|
|place|string|no|
|tags|string|no|
|privacy|not defined|no|
|object_attachment|string|no|

#### PagePostFeedRequest

|Property Name | Data Type |Required|
|---|---|---|
|message|string|yes|
|link|string|no|
|picture|string|no|
|name|string|no|
|caption|string|no|
|description|string|no|
|actions|array|no|
|place|string|no|
|tags|string|no|
|object_attachment|string|no|
|targeting|not defined|no|
|feed_targeting|not defined|no|
|published|boolean|no|
|scheduled_publish_time|string|no|
|backdated_time|string|no|
|backdated_time_granularity|string|no|
|child_attachments|array|no|
|multi_share_end_card|boolean|no|

#### PostFeedResponse

|Property Name | Data Type |Required|
|---|---|---|
|id|string|no|

#### ProfileCollection

|Property Name | Data Type |Required|
|---|---|---|
|data|array|no|

#### UserItem

|Property Name | Data Type |Required|
|---|---|---|
|id|string|no|
|first_name|string|no|
|last_name|string|no|
|name|string|no|
|gender|string|no|
|about|string|no|

#### ActionItem

|Property Name | Data Type |Required|
|---|---|---|
|name|string|no|
|link|string|no|

#### TargetItem

|Property Name | Data Type |Required|
|---|---|---|
|countries|array|no|
|locales|array|no|
|regions|array|no|
|cities|array|no|

#### FeedTargetItem: Object that controls news feed targeting for this post
Anyone in these groups is more likely to see this post, others are less likely. Applies to Pages only.

|Property Name | Data Type |Required|
|---|---|---|
|countries|array|no|
|regions|array|no|
|cities|array|no|
|age_min|integer|no|
|age_max|integer|no|
|genders|array|no|
|relationship_statuses|array|no|
|interested_in|array|no|
|college_years|array|no|
|interests|array|no|
|relevant_until|integer|no|
|education_statuses|array|no|
|locales|array|no|

#### PlaceItem

|Property Name | Data Type |Required|
|---|---|---|
|id|string|no|
|name|string|no|
|overall_rating|number|no|
|location|not defined|no|

#### LocationItem

|Property Name | Data Type |Required|
|---|---|---|
|city|string|no|
|country|string|no|
|latitude|number|no|
|located_in|string|no|
|longitude|number|no|
|name|string|no|
|region|string|no|
|state|string|no|
|street|string|no|
|zip|string|no|

#### PrivacyItem

|Property Name | Data Type |Required|
|---|---|---|
|description|string|no|
|value|string|yes|
|allow|string|no|
|deny|string|no|
|friends|string|no|

#### ChildAttachmentsItem

|Property Name | Data Type |Required|
|---|---|---|
|link|string|no|
|picture|string|no|
|image_hash|string|no|
|name|string|no|
|description|string|no|

#### PostPhotoRequest

|Property Name | Data Type |Required|
|---|---|---|
|url|string|yes|
|caption|string|no|

#### PostPhotoResponse

|Property Name | Data Type |Required|
|---|---|---|
|id|string|yes|
|post_id|string|yes|

#### PostVideoRequest

|Property Name | Data Type |Required|
|---|---|---|
|videoData|string|yes|
|description|string|yes|
|title|string|yes|
|uploadedVideoName|string|no|

#### GetPhotoResponse

|Property Name | Data Type |Required|
|---|---|---|
|data|not defined|yes|

#### GetPhotoResponseItem

|Property Name | Data Type |Required|
|---|---|---|
|url|string|yes|
|is_silhouette|boolean|yes|
|height|string|no|
|width|string|no|

#### GetEventResponse

|Property Name | Data Type |Required|
|---|---|---|
|data|array|yes|

#### GetEventResponseItem

|Property Name | Data Type |Required|
|---|---|---|
|id|string|yes|
|name|string|yes|
|start_time|string|no|
|end_time|string|no|
|timezone|string|no|
|location|string|no|
|description|string|no|
|ticket_uri|string|no|
|rsvp_status|string|yes|


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).
