<properties
	pageTitle="Add the Facebook connector API to your Logic Apps | Microsoft Azure"
	description="Create or configure a new Facebook connector"
	services=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="01/28/2016"
   ms.author="mandia"/>

# Get started with the Facebook connector
>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version of this connector, click [Facebook connector](..app-service-logic-connector-facebook.md).

Connect to Facebook and post to a timeline, get a page feed, and more. 

>[AZURE.TIP] "Connector" and "API" are used interchangeably.

With the Facebook connector, you can:

- Add the Facebook connector to your logic app, and build your business flow based on the data you get from Facebook. 
- Use triggers to start your flow. When a new post is received, it triggers (or starts) a new instance of the flow (your logic app), and passes the data received to your logic app for additional processing.
- Use actions that post to your timeline, get a page feed, and more. These actions get a response, and then make the output available for other actions in the logic app to use. For example, when there is a new post on your timeline, you can take that post and push it to your Twitter feed. 

This topic focuses on the Facebook triggers and actions available, creating a connection to Facebook, and also lists the REST API parameters. 

Need help creating a logic app? See [Create a logic app](..app-service-logic-create-a-logic-app.md).


## Triggers and actions
The Facebook connector can be used as a trigger and as an action. All connectors support data in JSON and XML formats. The Facebook connector has the following trigger and actions available:

| Triggers | Actions|
| --- | --- |
| <ul><li>When there is a new post on my timeline</li></ul> |<ul><li>Get feed from my timeline</li><li>Post to my timeline</li><li>When there is a new post on my timeline</li><li>Get page feed</li><li>Get user timeline</li><li>Post to page</li></ul>

## Create a connection to Facebook
To use the Facebook connector, you first create a connection to Facebook. To create the connection: 

1. Sign in to your Facebook account
2. Select **Authorize**, and allow your logic apps to connect and use your Facebook. 

After you create the connection, you enter specific Facebook properties. The properties change, depending on the trigger or action you choose. For example, if you choose the **Post to my timeline** action, then enter the **Status message**, **Privacy value**, and other properties. For a description of these properties, see the **REST API reference** in this topic. 

>[AZURE.TIP] You can use this same Facebook connection in other logic apps.

## Swagger REST API reference

### Get feed from my timeline
Gets the feeds from the logged in user's timeline.  
```GET: /me/feed```

| Name|Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|fields|string|No|query|None |Specify the fields you want returned. Example (id,name,picture).|
|limit|integer|No|query| None|Maximum number of posts to be retrieved|
|with|string|No|query| None|Restrict the list of posts to only those with location attached.|
|filter|string|No|query| None|Retrieve only posts that match a particular stream filter.|

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
|post|string |Yes|body|None |New message to be posted|

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
|pageId|string|Yes|path| None|Id of the page from which posts have to be retrieved.|
|limit|integer|No|query| None|Maximum number of posts to be retrieved|
|include_hidden|boolean|No|query|None |Whether or not to include any posts that were hidden by the Page|
|fields|string|No|query|None |Specify the fields you want returned. Example (id,name,picture).|

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
|userId|string|Yes|path|None |Id of the user whose timeline have to be retrieved.|
|limit|integer|No|query|None |Maximum number of posts to be retrieved|
|with|string|No|query|None |Restrict the list of posts to only those with location attached.|
|filter|string|No|query| None|Retrieve only posts that match a particular stream filter.|
|fields|string|No|query| None|Specify the fields you want returned. Example (id,name,picture).|

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
|pageId|string|Yes|path|None |Id of the page to post.|
|post| |Yes|body|None |New message to be posted.|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|500|Internal Server Error|
|default|Operation Failed.|