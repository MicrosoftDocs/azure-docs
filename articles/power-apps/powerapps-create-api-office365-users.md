<properties
	pageTitle="Add Office 365 Users API in PowerApps | Azure"
	description="Add a new Office 365 Users API in your organization's App Service Environment"
	services="powerapps"
	documentationCenter="" 
	authors="rajeshramabathiran"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/19/2015"
   ms.author="litran"/>

#Create a new Office 365 Users API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][1]

3. In the **Manage APIs** blade, select **Add** to add a new API
![Add API][2]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **Office 365 Users** from the marketplace
![select Office 365 Users api][3]

7. Select *Settings - Configure required settings*
![configure Office 365 Users API settings][4]

8. Enter *Client Id* and *Client Secret* of your Office 365 AAD application. If you don't already have one, see the section below titled "Register an AAD app for use with PowerApps Office 365 Users API". 
> Note the _redirect URL_ here before starting to register the AAD app

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new Office 365 Users API in your ASE.

On successful completion, a new Office 365 Users API is added to your ASE.

##Register an AAD app for use with PowerApps Office 365 Users API

1. Open [Azure Portal][5].

2. Click on Browse and then select **Active Directory**
	>Note: This will launch the Active Directory extensions in the previous version of the Azure Portal.

3. Click on your organization's tenant name
![Launch Azure Active Directory][6]

4. Click on the **Applications** tab and the click on **Add**
![AAD tenant applications][7]

5. In the **Add application** dialog that shows up
	1. Provide a **Name** for your application
	2. Leave the application type to _Web_
	3. Click on Next
![Add AAD application - app info][8]

6. In the **App Properties** dialog that follows
	1. Provide the **SIGN-ON URL** of your application
		>Note: Since you are going to authenticate with AAD for PowerApps, set the sign-on url to _https://login.windows.net_
	2. Provide a valid **APP ID URI** for your app
	3. Click **OK**
![Add AAD application - app properties][9]

7. On successful completion, you are redirected to the new AAD app. Click on **Configure**
![Contoso AAD app][10]

8. Set the **Reply URL** under _OAuth 2_ section to the redirect URL obtained from adding a new Dropbox API in Azure Portal. Click on ** Add application**
![Configure Contoso AAD app][11]

9. In the **Permissions to other applications** dialog, select **Office 365 Unified API (Preview)** and click **OK**

10. Back in the configure page, note that _Office 365 Unified API (Preview)_ is added to the _Permission to other applications_ list.

11. Click on **Delegated Permissions** for _Office 365 Unified API (Preview)_ and select the following permissions
	1. **Read all users' basic profiles**
	

Congratulations! You have now successfully created an AAD app for use with PowerApps Office 365 Users API.

<!--References-->
[1]: ./media/powerapps-create-api-office365-users/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-office365-users/add-api.PNG
[3]: ./media/powerapps-create-api-office365-users/select-office365-users-api.PNG
[4]: ./media/powerapps-create-api-office365-users/configure-office365-users-api.PNG
[5]: https://portal.azure.com
[6]: ./media/powerapps-create-api-office365-users/launch-aad.PNG
[7]: ./media/powerapps-create-api-office365-users/aad-tenant-applications.PNG
[8]: ./media/powerapps-create-api-office365-users/aad-tenant-applications-add-appinfo.PNG
[9]: ./media/powerapps-create-api-office365-users/aad-tenant-applications-add-app-properties.PNG
[10]: ./media/powerapps-create-api-office365-users/contoso-aad-app.PNG
[11]: ./media/powerapps-create-api-office365-users/contoso-aad-app-configure.PNG
[12]: ./media/powerapps-create-api-office365-users/contoso-aad-app-delegate-office365-users.PNG
[13]: ./media/powerapps-create-api-office365-users/contoso-aad-app-delegate-office365-users-permissions.PNG