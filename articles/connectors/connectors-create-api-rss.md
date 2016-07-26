<properties
pageTitle="RSS | Microsoft Azure"
description="Create Logic apps with Azure App service. RSS connector allows the users to publish and retrieve feed items. It also allows the users to trigger operations when a new item is published to the feed."
services="app-servicelogic"	
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

# Get started with the RSS connector



The RSS connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The RSS connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The RSS connector has the following action(s) and/or trigger(s) available:

### RSS actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[ListFeedItems](connectors-create-api-rss.md#listfeeditems)|Get all RSS feed items.|
### RSS triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When a new feed item published|Triggers a workflow when a new feed is published|


## Create a connection to RSS

>[AZURE.INCLUDE [Steps to create a connection to an RSS feed](../../includes/connectors-create-api-rss.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for RSS
Applies to version: 1.0

## OnNewFeed
When a new feed item published: Triggers a workflow when a new feed is published 

```GET: /OnNewFeed``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|feedUrl|string|yes|query|none|Feed url|

#### Response

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## ListFeedItems
List all RSS feed items.: Get all RSS feed items. 

```GET: /ListFeedItems``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|feedUrl|string|yes|query|none|Feed url|

#### Response

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## Object definitions 

### TriggerBatchResponse[FeedItem]


| Property Name | Data Type | Required |
|---|---|---|
|value|array|No |



### FeedItem


| Property Name | Data Type | Required |
|---|---|---|
|id|string|Yes |
|title|string|Yes |
|content|string|Yes |
|links|array|No |
|updatedOn|string|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)