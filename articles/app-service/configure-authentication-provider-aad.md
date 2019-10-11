---
title: Configure Azure Active Directory authentication - Azure App Service
description: Learn how to configure Azure Active Directory authentication for your App Service app.
author: cephalin
services: app-service
documentationcenter: ''
manager: gwallace
editor: ''

ms.assetid: 6ec6a46c-bce4-47aa-b8a3-e133baef22eb
ms.service: app-service
ms.workload: web,mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 09/03/2019
ms.author: cephalin
ms.custom: seodec18
ms.custom: fasttrack-edit

---
# Configure your App Service app to use Azure Active Directory sign-in

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

> [!NOTE]
> At this time, AAD V2 (including MSAL) is not supported for Azure App Service and Azure Functions.
>

This article shows you how to configure Azure App Service to use Azure Active Directory as an authentication provider.

It's recommended that you configure each App Service app with its own registration, so it has its own permissions and consent. Also, consider using separate app registrations for separate deployment slots. This avoids permission sharing between environments, so that an issue in new code you're testing does not affect production.

## <a name="express"> </a>Configure with express settings

1. In the [Azure portal], navigate to your App Service app. In the left navigation, select **Authentication / Authorization**.
2. If **Authentication / Authorization** is not enabled, select **On**.
3. Select **Azure Active Directory**, and then select **Express** under **Management Mode**.
4. Select **OK** to register the App Service app in Azure Active Directory. This creates a new app registration. If you want to choose an existing app registration instead, click **Select an existing app** and then search for the name of a previously created app registration within your tenant. Click the app registration to select it and click **OK**. Then click **OK** on the Azure Active Directory settings page.
By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.
5. (Optional) To restrict access to your app to only users authenticated by Azure Active Directory, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Azure Active Directory for authentication.

    > [!NOTE]
    > Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** may be preferred, with the app manually starting login itself, as described [here](overview-authentication-authorization.md#authentication-flow).
6. Click **Save**.

## <a name="advanced"> </a>Configure with advanced settings

You can also provide configuration settings manually, if the Azure Active Directory tenant you want to use is different from the tenant with which you sign into Azure. To complete the configuration, you must first create a registration in Azure Active Directory, and then you must provide some of the registration details to App Service.

### <a name="register"> </a>Create an app registration in Azure AD for your App Service app

When creating an app registration manually, note three pieces of information that you will need later when configuring your App Service app: the client ID, the tenant ID, and optionally the client secret and the application ID URI.

1. In the [Azure portal], navigate to your App Service app and note your app's **URL**. You will use it to configure your Azure Active Directory app registration.
1. In the [Azure portal], from the left menu, select **Active Directory** > **App registrations** > **New registration**. 
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Web** and type the URL of your App Service app and append the path `/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`. Then select **Create**.
1. Once the app registration is created, copy the **Application (client) ID** and the **Directory (tenant) ID** for later.
1. Select **Branding**. In **Home page URL**, type the URL of your App Service app and select **Save**.
1. Select **Expose an API** > **Set**. Paste in the URL of your App Service app and select **Save**.

    > [!NOTE]
    > This value is the **Application ID URI** of the app registration. If you want to have a front-end web app to access a back-end API, for example, and you want the back end to explicitly grant access to the front end, you need the **Application ID URI** of the *front end* when you configure the App Service app resource of the *back end*.
1. Select **Add a scope**. In **Scope name**, type *user_impersonation*. In the text boxes, type the consent scope name and description you want users to see on the consent page, such as *Access my app*. When finished, click **Add scope**.
1. (Optional) To create a client secret, select **Certificates & secrets** > **New client secret** > **Add**. Copy the client secret value shown in the page. Once you navigate away, it won't be shown again.
1. (Optional) To add multiple **Reply URLs**, select **Authentication** in the menu.

### <a name="secrets"> </a>Add Azure Active Directory information to your App Service app

1. In the [Azure portal], navigate to your App Service app. From the left menu, select **Authentication / Authorization**. If the Authentication/Authorization feature is not enabled, select **On**. 
1. (Optional) By default, App Service authentication allows unauthenticated access to your app. To enforce user authentication, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**.
1. Under Authentication Providers, select **Azure Active Directory**.
1. In **Management mode**, select **Advanced** and configure App Service authentication according to the following table:

    |Field|Description|
    |-|-|
    |Client ID| Use the **Application (client) ID** of the app registration. |
    |Issuer ID| Use `https://login.microsoftonline.com/<tenant-id>`, and replace *\<tenant-id>* with the **Directory (tenant) ID** of the app registration. |
    |Client Secret (Optional)| Use the client secret you generated in the app registration.|
    |Allowed Token Audiences| If this is a *back-end* app and you want to allow authentication tokens from a front-end app, add the **Application ID URI** of the *front end* here. |

    > [!NOTE]
    > The configured **Client ID** is *always* implicitly considered to be an allowed audience, regardless of how you configured the **Allowed Token Audiences**.
1. Select **OK**, then select **Save**.

You are now ready to use Azure Active Directory for authentication in your App Service app.

## Configure a native client application
You can register native clients if you wish to perform sign-ins using a client library such as the **Active Directory Authentication Library**.

1. In the [Azure portal], from the left menu, select **Active Directory** > **App registrations** > **New registration**. 
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and type the URL of your App Service app and append the path `/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`. Then select **Create**.

    > [!NOTE]
    > For a Windows application, use the [package SID](../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#package-sid) as the URI instead.
1. Once the app registration is created, copy the value of **Application (client) ID**.
1. From the left menu, select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your App Service app. If you don't see the app registration, check that you've added the **user_impersonation** scope in [Create an app registration in Azure AD for your App Service app](#register).
1. Select **user_impersonation** and click **Add permissions**.

You have now configured a native client application that can access your App Service app.

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
[8]: ./media/configure-authentication-provider-aad/app-service-webapp-auth-config.png



<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[alternative method]:#advanced
