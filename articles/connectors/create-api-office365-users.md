<properties
	pageTitle="Add the Office 365 Users API to your Logic Apps | Microsoft Azure"
	description="Overview of Office 365 Users API with REST API parameters"
	services=""	
	documentationCenter="" 	
	authors="msftman"	
	manager="erikre"	
	editor="" 
	tags="connectors" />

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="integration"
ms.date="02/22/2016"
ms.author="deonhe"/>

# Get started with the Office 365 Users API

Office 365 Users Connection provider lets you access user profiles in your organization using your Office 365 account. You can perform various actions such as get your profile, a user's profile, a user's manager or direct reports and also update a user profile.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Office 365 API](../app-service-logic/app-service-logic-connector-office365.md).   


With Office 365 Users, you can:

* Use it to build logic apps
* Use it to build PowerApps

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Office 365 Users API can be used as an action; there are no triggers. All APIs support data in JSON and XML formats. 

 The Office 365 Users API has the following action(s) and/or trigger(s) available:

### Office 365 Users actions
You can take these action(s):

|Action|Description|
|--- | ---|
|MyProfile|Retrieves the profile for the current user|
|UserProfile|Retrieves a specific user profile|
|Manager|Retrieves user profile for the manager of the specified user|
|DirectReports|Get direct reports|
|SearchUser|Retrieves search results of user profiles|
## Create a connection to Office 365 Users
To use the Office 365 Users API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide Office365 Credentials|


>[AZURE.TIP] You can use this connection in other logic apps.

## Office 365 Users REST API reference
#### This documentation is for version: 1.0


### Get my profile 


 Retrieves the profile for the current user
```GET: /users/me``` 

There are no parameters for this call
#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Get user profile 


 Retrieves a specific user profile
```GET: /users/{userId}``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userId|string|yes|path|none|User principal name or email id|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Get manager 


 Retrieves user profile for the manager of the specified user
```GET: /users/{userId}/manager``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userId|string|yes|path|none|User principal name or email id|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Get direct reports 


 Get direct reports
```GET: /users/{userId}/directReports``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|userId|string|yes|path|none|User principal name or email id|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Search for users 


 Retrieves search results of user profiles
```GET: /users``` 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|searchTerm|string|no|query|none|Search string (applies to: display name, given name, surname, mail, mail nickname and user principal name)|


#### Response

|Name|Description|
|---|---|
|200|Operation was successful|
|202|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|403|Forbidden|
|500|Internal Server Error|
|default|Operation Failed.|
------



## Object definition(s): 

 **User**:User model class.

Required properties for User:

Id

**All properties**: 


| Name | Data Type |
|---|---|
|DisplayName|string|
|GivenName|string|
|Surname|string|
|Mail|string|
|MailNickname|string|
|TelephoneNumber|string|
|AccountEnabled|boolean|
|Id|string|
|UserPrincipalName|string|
|Department|string|
|JobTitle|string|


## Next Steps
After you add the Office 365 API to PowerApps Enterprise, [give users permissions](../power-apps/powerapps-manage-api-connection-user-access.md) to use the API in their apps.

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).