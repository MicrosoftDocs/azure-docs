<properties
pageTitle="GitHub | Microsoft Azure"
description="Create Logic apps with Azure App service. GitHub is a web-based Git repository hosting service. It offers all of the distributed revision control and source code management (SCM) functionality of Git as well as adding its own features."
services="logic-apps"	
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

# Get started with the GitHub connector



The GitHub connector can be used from:  

- [Logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md)  
- [PowerApps](http://powerapps.microsoft.com)  
- [Flow](http://flows.microsoft.com)  

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. 

You can get started by creating a Logic app now, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The GitHub connector can be used as an action; it has trigger(s). All connectors support data in JSON and XML formats. 

 The GitHub connector has the following action(s) and/or trigger(s) available:

### GitHub actions
You can take these action(s):

|Action|Description|
|--- | ---|
|[CreateIssue](connectors-create-api-github.md#createissue)|Creates an issue|
### GitHub triggers
You can listen for these event(s):

|Trigger | Description|
|--- | ---|
|When an issue is opened|An issue is opened|
|When an issue is closed|An issue is closed|
|When an issue is assigned|An issue is assigned|


## Create a connection to GitHub
To create Logic apps with GitHub, you must first create a **connection** then provide the details for the following properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide GitHub Credentials|
After you create the connection, you can use it to execute the actions and listen for the triggers described in this article. 

>[AZURE.INCLUDE [Steps to create a connection to GitHub](../../includes/connectors-create-api-github.md)]

>[AZURE.TIP] You can use this connection in other logic apps.

## Reference for GitHub
Applies to version: 1.0

## CreateIssue
Create an issue: Creates an issue 

```POST: /repos/{repositoryOwner}/{repositoryName}/issues``` 

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|repositoryOwner|string|yes|path|none|Repository owner|
|repositoryName|string|yes|path|none|Repository name|
|issueBasicDetails| |yes|body|none|Issue details|

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


## IssueOpened
When an issue is opened: An issue is opened 

```GET: /trigger/issueOpened``` 

There are no parameters for this call
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


## IssueClosed
When an issue is closed: An issue is closed 

```GET: /trigger/issueClosed``` 

There are no parameters for this call
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


## IssueAssigned
When an issue is assigned: An issue is assigned 

```GET: /trigger/issueAssigned``` 

There are no parameters for this call
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

### IssueBasicDetailsModel


| Property Name | Data Type | Required |
|---|---|---|
|title|string|Yes |
|body|string|Yes |
|assignee|string|Yes |



### IssueDetailsModel


| Property Name | Data Type | Required |
|---|---|---|
|title|string|Yes |
|body|string|Yes |
|assignee|string|Yes |
|number|string|No |
|state|string|No |
|created_at|string|No |
|repository_url|string|No |


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md)