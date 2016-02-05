<properties
	pageTitle="Use the Facebook API in your Logic Apps | Microsoft Azure"
	description="Overview of the Facebook API with REST API parameters"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service=""
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="02/04/2016"
   ms.author="mandia"/>

# Get started with the Facebook API
Connect to Facebook and post to a timeline, get a page feed, and more. 

The Facebook API can be used from logic apps. 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Facebook connector](..app-service-logic-connector-facebook.md).


With Facebook, you can:

- Build your business flow based on the data you get from Facebook. 
- Use a trigger when a new post is received.
- Use actions that post to your timeline, get a page feed, and more. These actions get a response, and then make the output available for other actions. For example, when there is a new post on your timeline, you can take that post and push it to your Twitter feed. 

To add an operation in logic apps, see [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Triggers and actions
The Facebook API includes the following trigger and actions. 

| Triggers | Actions|
| --- | --- |
| <ul><li>When there is a new post on my timeline</li></ul> |<ul><li>Get feed from my timeline</li><li>Post to my timeline</li><li>When there is a new post on my timeline</li><li>Get page feed</li><li>Get user timeline</li><li>Post to page</li></ul>

All APIs support data in JSON and XML formats.

## Create a connection to Facebook
When you add this API to your logic apps, you must authorize logic apps to connect to your Facebook.

1. Sign in to your Facebook account
2. Select **Authorize**, and allow your logic apps to connect and use your Facebook. 

After you create the connection, you enter the Facebook properties. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same Facebook connection in other logic apps.

## Swagger REST API reference

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

## Next steps

[Create a logic app](..app-service-logic-create-a-logic-app.md).