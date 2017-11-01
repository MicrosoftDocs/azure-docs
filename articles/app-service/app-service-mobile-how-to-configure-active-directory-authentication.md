---
title: How to configure Azure Active Directory authentication for your App Services application
description: Learn how to configure Azure Active Directory authentication for your App Services application.
author: mattchenderson
services: app-service
documentationcenter: ''
manager: syntaxc4
editor: ''

ms.assetid: 6ec6a46c-bce4-47aa-b8a3-e133baef22eb
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 10/01/2016
ms.author: mahender

---
# How to configure your App Service application to use Azure Active Directory login
[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Services to use Azure Active Directory as an authentication provider.

## <a name="express"> </a>Configure Azure Active Directory using express settings
1. In the [Azure portal], navigate to your application. Click **Settings**, and then **Authentication/Authorization**.
2. If the Authentication / Authorization feature is not enabled, turn the switch to **On**.
3. Click **Azure Active Directory**, and then click **Express** under **Management Mode**.
4. Click **OK** to register the application in Azure Active Directory. This will create a new registration. If you want to choose an existing
   registration instead, click **Select an existing app** and then search for the name of a previously created registration within your tenant.
   Click the registration to select it and click **OK**. Then click **OK** on the Azure Active Directory settings blade.
   By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.
5. (Optional) To restrict access to your site to only users authenticated by Azure Active Directory, set **Action to take when request
   is not authenticated** to **Log in with Azure Active Directory**. This requires that all requests be authenticated, and all unauthenticated
   requests are redirected to Azure Active Directory for authentication.
6. Click **Save**.

You are now ready to use Azure Active Directory for authentication in your app.

## <a name="advanced"> </a>(Alternative method) Manually configure Azure Active Directory with advanced settings
You can also choose to provide configuration settings manually. This is the preferred solution if the AAD tenant you wish to use is different from the tenant with which you sign into Azure. To complete the configuration, you must first create a registration in Azure Active Directory, and then you must provide some of the registration details to App Service.

### <a name="register"> </a>Register your application with Azure Active Directory
1. Log on to the [Azure portal], and navigate to your application. Copy your application **URL**. You will use this to configure your Azure Active Directory app.
2. Navigate to **Active Directory**, then select the **App registrations**, then click **New application registration** at the top to start a new app registration. 
3. In the Create application registration dialog, enter a **Name** for your application, select the  **Web App API** type, in the **Sign-on URL** box paste the application URL (from step 1). Then click to **Create**.
4. In a few seconds, you should see the new Application Registration you just created appear.
5. Once the application has been added, click on the Application Registration name, click on **Settings** at the top, then click on **Properties** 
6. In the **App ID URI** box, paste in the Application URL (from step 1), also in the **Home Page URL** paste in the Application URL (from step 1) as well, then click **Save**
7. Now click on the **Reply URLs**, edit the **Reply URL**, paste in the Application URL (from step 1), modify the protocol to make sure you have **https://** protocol (not http://), then appended to the end of the URL, */.auth/login/aad/callback* . (For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.) Click **Save**.   
8.  At this point, copy the **Application ID** for the app. Keep this for later use. You will need this to configure your web application.
9. Close the Application Registration details blade. You should return to the Azure Active Directory App Registration summary, click on the **Endpoints** button at the top, then copy the **Federation Metadata Document** URL. 
10. Open a new browser window and navigate to the URL by pasting and browsing to the XML page. At the top of document will be a **EntityDescriptor** element, there should be an **entityID** attribute of the form `https://sts.windows.net/` followed by a GUID specific to your tenant (called a "tenant ID"). Copy this value - it will serve as your **Issuer URL**. You will configure your application to use this later.

### <a name="secrets"> </a>Add Azure Active Directory information to your application
1. Back in the [Azure portal], navigate to your application. Click **Authentication/Authorization**. If the Authentication/Authorization feature is not enabled, turn the switch to **On**. Click on **Azure Active Directory**, under Authentication Providers, to configure your application. 
(Optional) By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code. Select the **Action to take when request is not authenticated**, set this to **Log in with Azure Active Directory**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Azure Active Directory for authentication.
2.In the Active Directory Authentication configuration, click **Advanced** under **Management Mode**. Paste the Application ID into the Client ID box (from step 8) and paste in the entityId (from step 10) into the Issuer URL value. Then click **OK**.
3. On the Active Directory Authentication configuration blade, click **Save**.

You are now ready to use Azure Active Directory for authentication in your app.

## (Optional) Configure a native client application
Azure Active Directory also allows you to register native clients, which provides greater control over permissions mapping. You need this if you wish to perform logins using a library such as the **Active Directory Authentication Library**.

1. Navigate to **Active Directory** in the [Azure classic portal].
2. Select your directory, and then select the **Applications** tab at the top. Click **ADD** at the bottom to create a new app registration.
3. Click **Add an application my organization is developing**.
4. In the Add Application Wizard, enter a **Name** for your application and click the  **Native Client Application** type. Then click to continue.
5. In the **Redirect URI** box, enter your site's */.auth/login/done* endpoint, using the HTTPS scheme. This value should be similar to *https://contoso.azurewebsites.net/.auth/login/done*. If creating a Windows application, instead use the [package SID](../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#package-sid) as the URI.
6. Once the native application has been added, click the **Configure** tab. Find the **Client ID** and make a note of this value.
7. Scroll the page down to the **Permissions to other applications** section and click **Add application**.
8. Search for the web application that you registered earlier and click the plus icon. Then click the check to close the dialog. If the web application cannot be found, navigate to its registration and add a new reply URL (e.g., the HTTP version of your current URL), click save, and then repeat these steps - the application should show up in the list.
9. On the new entry you just added, open the **Delegated Permissions** dropdown and select **Access (appName)**. Then click **Save**.

You have now configured a native client application which can access your App Service application.

## <a name="related-content"> </a>Related Content
[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-webapp-url.png
[1]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-app_registration.png
[2]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-app-registration-create.png
[3]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-app-registration-config-appidurl.png
[4]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-app-registration-config-replyurl.png
[5]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-endpoints.png
[6]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-endpoints-fedmetadataxml.png
[7]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-webapp-auth.png
[8]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-webapp-auth-config.png



<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[Azure classic portal]: https://manage.windowsazure.com/
[alternative method]:#advanced
