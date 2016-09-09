<properties
    pageTitle="Add the Office 365 Users connector in PowerApps Enterprise or Logic Apps | Microsoft Azure"
    description="Overview of Office 365 Users connector with REST API parameters"
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
ms.date="05/18/2016"
ms.author="deonhe"/>

# Get started with the Office 365 Users connector

Connect to Office 365 Users to get profiles, search users, and more. The Office 365 Users connector can be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-office365-users.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-office365-users.md)

&nbsp; 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version.


With Office 365 Users, you can:

- Build your business flow based on the data you get from Office 365 Users. 
- Use actions that get direct reports, get a manager's user profile, and more. These actions get a response, and then make the output available for other actions. For example, get a person's direct reports, and then take this information and update a SQL Azure database. 
- Add the Office 365 Users connector to PowerApps Enterprise. Then, your users can use this connector within their apps. 

For information on how to add a connector in PowerApps Enterprise, go to [Register a connector in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The Office 365 Users connector has the following actions available. There are no triggers.

| Triggers | Actions|
| --- | --- |
|None | <ul><li>Get manager</li><li>Get my profile</li><li>Get direct reports</li><li>Get user profile</li><li>Search for users</li></ul>|

All connectors support data in JSON and XML formats. 


## Create a connection to Office 365 Users

When you add this connector to your logic apps, you must sign-in to your Office 365 Users account and allow logic apps to connect to your account.

>[AZURE.INCLUDE [Steps to create a connection to Office 365 Users](../../includes/connectors-create-api-office365users.md)]

After you create the connection, you enter the Office 365 Users properties, like the user ID. The **REST API reference** in this topic describes these properties.

>[AZURE.TIP] You can use this same Office 365 Users connection in other logic apps.


## Office 365 Users REST API reference
Applies to version: 1.0.

### Get my profile 
Retrieves the profile for the current user.  
```GET: /users/me``` 

There are no parameters for this call.

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


### Get user profile 
Retrieves a specific user profile.  
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


### Get manager 
Retrieves user profile for the manager of the specified user.  
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



### Get direct reports 
Get direct reports.  
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



### Search for users 
Retrieves search results of user profiles.  
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



## Object definitions

#### User: User model class

|Property Name | Data Type |Required
|---|---|---|
|DisplayName|string|no|
|GivenName|string|no|
|Surname|string|no|
|Mail|string|no|
|MailNickname|string|no|
|TelephoneNumber|string|no|
|AccountEnabled|boolean|no|
|Id|string|yes
|UserPrincipalName|string|no|
|Department|string|no|
|JobTitle|string|no|
|mobilePhone|string|no|


## Next Steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).

<!--References-->
[5]: https://portal.azure.com
[7]: ./media/connectors-create-api-office365-users/aad-tenant-applications.PNG
[8]: ./media/connectors-create-api-office365-users/aad-tenant-applications-add-appinfo.PNG
[9]: ./media/connectors-create-api-office365-users/aad-tenant-applications-add-app-properties.PNG
[10]: ./media/connectors-create-api-office365-users/contoso-aad-app.PNG
[11]: ./media/connectors-create-api-office365-users/contoso-aad-app-configure.PNG
