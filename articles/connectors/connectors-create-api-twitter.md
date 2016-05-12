<properties
	pageTitle="Add the Twitter connector in PowerApps Enterprise and Logic Apps | Microsoft Azure"
	description="Overview of Twitter connector with REST API parameters"
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
   ms.date="05/12/2016"
   ms.author="mandia"/>


# Get started with the Twitter connector
Connect to Twitter to post a tweet, get a user's timeline, and more. The Twitter API can be be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-twitter.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-twitter.md)

&nbsp; 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.

With Twitter, you can:

- Build your business flow based on the data you get from Twitter. 
- Use triggers for when there is a new tweet.
- Use actions to post a tweet, search tweets, and more. These actions get a response, and then make the output available for other actions. For example, when a new tweet appears, you can post this tweet on Facebook.
- Add the Twitter API to PowerApps Enterprise. Then, your users can use this API within their apps. 

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).


## Triggers and actions
Twitter includes the following trigger and actions.

Trigger | Actions
--- | ---
<ul><li>When a new tweet appears</li></ul>| <ul><li>Post a new tweet</li><li>When a new tweet appears</li><li>Get home timeline</li><li>Get user</li><li>Get user timeline</li><li>Search tweet</li><li>Get followers</li><li>Get my followers</li><li>Get following</li><li>Get my following</li></ul>

All APIs support data in JSON and XML formats.


## Create the connection to Twitter

When you add this API to your logic apps, you must authorize logic apps to connect to your Twitter account.

1. Sign in to your Twitter account.
2. Select **Authorize**, and allow your logic apps to connect and use your Twitter account. 

>[AZURE.INCLUDE [Steps to create a connection to Twitter](../../includes/connectors-create-api-twitter.md)]

>[AZURE.TIP] You can use this same Twitter connection in other logic apps.


## Swagger REST API reference
Applies to version: 1.0.

### Post a new tweet 
Tweet.  
```POST: /posttweet``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tweetText|string|no|query|none|Text to be posted|
|body| string (binary) |no|body|none|Media to be posted|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### When a new tweet appears 
Triggers a workflow when a new tweet is posted which matches your search query.  
```GET: /onnewtweet``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|searchQuery|string|yes|query|none|Query text (you may use any Twitter supported query operators: http://www.twitter.com/search)|

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


### Get home timeline 
Retrieves the most recent tweets and re-tweets posted me and my followers.  
```GET: /hometimeline``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|maxResults|integer|no|query|20|Maximum number of tweets to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Get user 
Retrieves details about the specified user (example: user name, description, followers count, etc.).  
```GET: /user``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userName|string|yes|query|none|Twitter handle of the user|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Get user timeline 
Retrieves a collection of the most recent tweets posted by the specified user.  
```GET: /usertimeline``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userName|string|yes|query|none|Twitter handle|
|maxResults|integer|no|query|20|Maximum number of tweets to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Search tweet 
Retrieves a collection of relevant tweets matching a specified query.  
```GET: /searchtweets``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|searchQuery|string|yes|query|none|Query text (you may use any Twitter supported query operators: http://www.twitter.com/search)|
|maxResults|integer|no|query|20|Maximum number of tweets to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Get followers 
Retrieves users following the specified user.  
```GET: /followers``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userName|string|yes|query|none|Twitter handle of the user|
|maxResults|integer|no|query|20|Maximum number of users to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Get my followers 
Retrieves users who are following me.  
```GET: /myfollowers``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|maxResults|integer|no|query|20|Maximum number of users to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Get following 
Retrieves users who the specified user is following.  
```GET: /friends``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userName|string|yes|query|none|Twitter handle of the user|
|maxResults|integer|no|query|20|Maximum number of users to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


### Get my following 
Retrieves users that I am following.  
```GET: /myfriends``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|maxResults|integer|no|query|20|Maximum number of users to retrieve|

#### Response
|Name|Description|
|---|---|
|200|OK|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occured|
|default|Operation Failed.|


## Object definitions

### TweetModel: representation of tweet object

| Property Name | Data Type | Required |
|---|---| --- | 
|TweetText|string|yes|
|TweetId|string|no|
|CreatedAt|string|no|
|RetweetCount|integer|yes|
|TweetedBy|string|yes|
|MediaUrls|array|no|

### UserDetailsModel: representation of a Twitter user's details

|Property Name | Data Type | Required |
|---|---|---|
|FullName|string|yes|
|Location|string|yes|
|Id|integer|no|
|UserName|string|yes|
|FollowersCount|integer|no|
|Description|string|yes|
|StatusesCount|integer|no|
|FriendsCount|integer|no|

### TweetResponseModel: model representing posted tweet

| Name | Data Type | Required |
|---|---|---|
|TweetId|string|yes|

### TriggerBatchResponse[TweetModel]

|Property Name | Data Type |Required |
|---|---|---|
|value|array|no|


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).

<!--References-->

[6]: ./media/connectors-create-api-twitter/twitter-apps-page.png
[7]: ./media/connectors-create-api-twitter/twitter-app-create.png
