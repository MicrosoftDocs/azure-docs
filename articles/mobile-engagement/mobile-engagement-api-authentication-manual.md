---
title: Authenticate with Mobile Engagement REST APIs - manual setup
description: Describes how to manually setup authentication for Mobile Engagement REST APIs
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: 2e79f9c9-41e4-45ac-b427-3b8338675163
ms.service: mobile-engagement
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: mobile-multiple
ms.workload: mobile
ms.date: 08/19/2016
ms.author: piyushjo

---
# Authenticate with Mobile Engagement REST APIs - manual setup
This is an appendix documentation to [Authenticate with Mobile Engagement REST APIs](mobile-engagement-api-authentication.md). Make sure you read it first to get the context.
This describes an alternate way to do the One-time setup for setting up your authentication for the Mobile Engagement REST APIs using the Azure Portal. 

> [!NOTE]
> The instructions below are based on this [Active Directory guide](../azure-resource-manager/resource-group-create-service-principal-portal.md) and customized for what is required for authentication for Mobile Engagement APIs. So refer to it if you want to understand the steps below in detail.

1. Login to your Azure Account through the [classic portal](https://manage.windowsazure.com/).
2. Select **Active Directory** from the left pane.
     ![select Active Directory][1]
3. To view the applications in your directory, click on **App registrations**.
     ![view applications][3]
4. Click on **New application registration**.
     ![add application][4]
5. Fill in name of the application and leave the type of application as **Web app/API** and click the next button. You can provide any dummy URLs for **SIGN-ON URL**: They are not used for our scenario and the URLs themselves are not validated.
6. At the end of this, you will have an AAD app with the name you provided previously like the following. This is your **AD\_APP\_NAME** and make a note of it.
     ![app name][8]
7. Click on the app name
8. Find **Application ID**, make a note of it, it will be the CLIENT ID that will be used as **CLIENT\_ID** for your API calls.
     ![configure app][10]
9. Find the **Keys** section on the right
     ![configure app][11]
10. Create a new key and immediately copy it and save it for use. It will never be shown again
     ![configure app][12]
    > [!IMPORTANT]
    > This key will expire at the end of the duration that you specified so make sure to renew it when the time comes otherwise your API authentication will not work anymore. You can also delete and recreate this key if you think that it has been compromised.
11. Click on **Endpoints** button at the top of the page and copy the **OAUTH 2.0 TOKEN ENDPOINT**. 
    ![][14]
16. This endpoint will be in the following form where the GUID in the URL is your **TENANT_ID** so make a note of it: `https://login.microsoftonline.com/<GUID>/oauth2/token`
17. Now we will proceed to configure the permissions on this app. For this you will have to open up the [Azure portal](https://portal.azure.com). 
18. Click on **Resource Groups** and find the **Mobile Engagement** resource group.  
    
    ![][15]
19. Click the **Mobile Engagement** resource group and navigate to the **Settings** blade here. 
    
    ![][16]
20. Click on **Users** in the Settings blade and then click on **Add** to add a user. 
    
    ![][17]
21. Click on **Select a role**
    
    ![][18]
22. Click on **Owner**
    
    ![][19]
23. Search for the name of your application **AD\_APP\_NAME** in the Search box. You will not see this by default here. Once you find it, select it and click on **Select** at the bottom of the blade. 
    
    ![][20]
24. On the **Add Access** blade, it will show up as **1 user, 0 groups**. Click **OK** on this blade to confirm the change. 
    
    ![][21]

You have now completed the required AAD configuration and you are all set to call the APIs. 

<!-- Images -->
[1]: ./media/mobile-engagement-api-authentication-manual/active-directory.png
[2]: ./media/mobile-engagement-api-authentication-manual/active-directory-details.png
[3]: ./media/mobile-engagement-api-authentication-manual/view-applications.png
[4]: ./media/mobile-engagement-api-authentication-manual/add-icon.png
[5]: ./media/mobile-engagement-api-authentication-manual/what-do-you-want-to-do.png
[6]: ./media/mobile-engagement-api-authentication-manual/tell-us-about-your-application.png
[7]: ./media/mobile-engagement-api-authentication-manual/app-properties.png
[8]: ./media/mobile-engagement-api-authentication-manual/aad-app.png
[9]: ./media/mobile-engagement-api-authentication-manual/configure-menu.png
[10]: ./media/mobile-engagement-api-authentication-manual/client-id.png
[11]: ./media/mobile-engagement-api-authentication-manual/client-secret.png
[12]: ./media/mobile-engagement-api-authentication-manual/keys.png
[13]: ./media/mobile-engagement-api-authentication-manual/view-endpoints.png
[14]: ./media/mobile-engagement-api-authentication-manual/app-endpoints.png
[15]: ./media/mobile-engagement-api-authentication-manual/resource-groups.png
[16]: ./media/mobile-engagement-api-authentication-manual/resource-groups-settings.png
[17]: ./media/mobile-engagement-api-authentication-manual/add-users.png
[18]: ./media/mobile-engagement-api-authentication-manual/add-role.png
[19]: ./media/mobile-engagement-api-authentication-manual/select-role.png
[20]: ./media/mobile-engagement-api-authentication-manual/add-user-select.png
[21]: ./media/mobile-engagement-api-authentication-manual/add-access-final.png



