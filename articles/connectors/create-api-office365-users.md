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
ms.date="02/25/2016"
ms.author="deonhe"/>

# Get started with the Office 365 Users API

Connect to Office 365 Users to get profiles, search users, and more. The Office 365 Users API can be used from:

- PowerApps 
- Logic apps 

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Office 365 API](../app-service-logic/app-service-logic-connector-office365.md).   


With Office 365 Users, you can:

- Build your business flow based on the data you get from Office 365 Users. 
- Use actions that get direct reports, get a manager's user profile, and more. These actions get a response, and then make the output available for other actions. For example, get a person's direct reports, and then take this information and update a SQL Azure database. 
- Add the Office 365 Users API to PowerApps Enterprise. Then, your users can use this API within their apps. 

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions

The Office 365 Users API has the following actions available. There are no triggers.

| Triggers | Actions|
| --- | --- |
|None | <ul><li>Get manager</li><li>Get my profile</li><li>Get direct reports</li><li>Get user profile</li><li>Search for users</li></ul>|

All APIs support data in JSON and XML formats. 


## Create a connection to Office 365 Users

### Add additional configuration in PowerApps
When you add this API to PowerApps Enterprise, you enter the **Client ID** and **Client Secret** values of your Office 365 Azure Active Directory (AAD) application. The **Redirect URL** value is also used in your Office 365 application. If you don't have an Office 365 application, you can use the following steps to create the application:

1. In the [Azure Portal][5], open **Active Directory**, and open your organization's tenant name.
2. Select the **Applications** tab, and select **Add**:  
![AAD tenant applications][7]

3. In **Add application**:  

	1. Enter a **Name** for your application.  
	2. Leave the application type as **Web**.  
	3. Select **Next**.  

	![Add AAD application - app info][8]

4. In **App Properties**:  

	1. Enter the **SIGN-ON URL** of your application. Since you are going to authenticate with AAD for PowerApps, set the sign-on url to _https://login.windows.net_.  
	2. Enter a valid **APP ID URI** for your app.  
	3. Select **OK**.  

	![Add AAD application - app properties][9]

5. When complete, the new AAD app opens. Select **Configure**:  
![Contoso AAD app][10]

6. Under the **OAuth 2** section, set the **Reply URL** to the redirect URL value shown when you added the Office 365 Users API in the Azure Portal. Select **Add application**:  
![Configure Contoso AAD app][11]

7. In **Permissions to other applications**, select **Office 365 Unified API (Preview)**, and select **OK**:  

	Back in the configure page, note that _Office 365 Unified API (Preview)_ is added to the _Permission to other applications_ list.

8. For **Office 365 Exchange Online**, select **Delegated Permissions** , and select the **Read all users' basic profiles** permission.

A new Azure Active Directory app is created. You can copy/paste the **Client ID** and **Client Secret** values into your Office 365 users API configuration in the Azure portal. 

Some good info on AAD applications at [How and why applications are added to Azure AD](../active-directory/active-directory-how-applications-are-added.md).


### Add additional configuration in logic apps
When you add this API to your logic apps, you must sign-in to your Office 365 Users  account and allow logic apps to connect to your account.

1. Sign in to your Office 365 Users account.
2. Allow your logic apps to connect and use your Office 365 account. 

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

| Name | Data Type |Required
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
After you add the Office 365 API to PowerApps Enterprise, [give users permissions](../power-apps/powerapps-manage-api-connection-user-access.md) to use the API in their apps.

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

<!--References-->
[5]: https://portal.azure.com
[7]: ./media/create-api-office365-users/aad-tenant-applications.PNG
[8]: ./media/create-api-office365-users/aad-tenant-applications-add-appinfo.PNG
[9]: ./media/create-api-office365-users/aad-tenant-applications-add-app-properties.PNG
[10]: ./media/create-api-office365-users/contoso-aad-app.PNG
[11]: ./media/create-api-office365-users/contoso-aad-app-configure.PNG
