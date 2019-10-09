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

# Configure your App Service app to use Azure AD login

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure Azure App Service to use Azure Active Directory (Azure AD) as an authentication provider.

> [!NOTE]
> At this time, Azure App Service and Azure Functions are only supported by Azure AD v1.0. They're not supported by the [Microsoft identity platform v2.0](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview), which includes Microsoft Authentication Libraries (MSAL).

Follow these best practices when setting up your app and authentication:

- Give each App Service app its own permissions and consent.
- Configure each App Service app with its own registration.
- Avoid permission sharing between environments by using separate app registrations for separate deployment slots. When testing new code, this practice can help prevent issues from affecting the production app.

## <a name="express"> </a>Configure with express settings

1. In the [Azure portal], go to your App Service app.
1. Select **Settings** > **Authentication / Authorization** in the left pane, and make sure that **App Service Authentication** is **On**.
1. Select **Azure Active Directory**, and then select **Express** under **Management Mode**.
1. Select **OK** to register the App Service app in Azure Active Directory. A new app registration is created.

   If you want to choose an existing app registration instead:

   1. Choose **Select an existing app** and then search for the name of a previously created app registration within your tenant.
   1. Select the app registration and then select **OK**.
   1. Then select **OK** on the Azure Active Directory settings page.

   By default, App Service provides authentication but doesn't restrict authorized access to your site content and APIs. You must authorize users in your app code.
1. (Optional) To restrict app access only to users authenticated by Azure Active Directory, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**. When you set this functionality, your app requires all requests to be authenticated. It also redirects all unauthenticated to Azure Active Directory for authentication.

    > [!CAUTION]
    > Restricting access in this way applies to all calls to your app, which might not be desirable for apps that have a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** might be preferred, with the app manually starting login itself. For more information, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).
1. Select **Save**.

## <a name="advanced"> </a>Configure with advanced settings

You can configure app settings manually if you want to use an Azure AD tenant that's different from the one you use to sign in to Azure. To complete this custom configuration, you'll need to:

1. Create a registration in Azure AD.
1. Provide some of the registration details to App Service.

### <a name="register"> </a>Create an app registration in Azure AD for your App Service app

You'll need the following information when you configure your App Service app:

- Client ID
- Tenant ID
- Client secret (optional)
- Application ID URI

Perform the following steps:

1. Sign in to the [Azure portal] and go to your App Service app. Note your app's **URL**. You'll use it to configure your Azure Active Directory app registration.
1. Select **Azure Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Web** and enter the URL of your App Service app and append the path `/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`. 
1. Select **Create**.
1. After the app registration is created, copy the **Application (client) ID** and the **Directory (tenant) ID** for later.
1. Select **Branding**. In **Home page URL**, enter the URL of your App Service app and select **Save**.
1. Select **Expose an API** > **Set**. Paste in the URL of your App Service app and select **Save**.

   > [!NOTE]
   > This value is the **Application ID URI** of the app registration. If your web app requires access to an API in the cloud, you need the **Application ID URI** of the web app when you configure the cloud App Service resource. You can use this, for example, if you want the cloud service to explicitly grant access to the web app.

1. Select **Add a scope**.
   1. In **Scope name**, enter *user_impersonation*.
   1. In the text boxes, enter the consent scope name and description you want users to see on the consent page. For example, enter *Access my app*. 
   1. Select **Add scope**.
1. (Optional) To create a client secret, select **Certificates & secrets** > **New client secret** > **Add**. Copy the client secret value shown in the page. It won't be shown again.
1. (Optional) To add multiple **Reply URLs**, select **Authentication**.

### <a name="secrets"> </a>Add Azure Active Directory information to your App Service app

1. In the [Azure portal], go to your App Service app. 
1. Select **Settings > Authentication / Authorization** in the left pane, and make sure that **App Service Authentication** is **On**.
1. (Optional) By default, App Service authentication allows unauthenticated access to your app. To enforce user authentication, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**.
1. Under Authentication Providers, select **Azure Active Directory**.
1. In **Management mode**, select **Advanced** and configure App Service authentication according to the following table:

    |Field|Description|
    |-|-|
    |Client ID| Use the **Application (client) ID** of the app registration. |
    |Issuer ID| Use `https://login.microsoftonline.com/<tenant-id>`, and replace *\<tenant-id>* with the **Directory (tenant) ID** of the app registration. |
    |Client Secret (Optional)| Use the client secret you generated in the app registration.|
    |Allowed Token Audiences| If this is a cloud or server app and you want to allow authentication tokens from a web app, add the **Application ID URI** of the web app here. |

    > [!NOTE]
    > The configured **Client ID** is *always* implicitly considered to be an allowed audience, regardless of how you configured the **Allowed Token Audiences**.
1. Select **OK**, and then select **Save**.

You're now ready to use Azure Active Directory for authentication in your App Service app.

## Configure a native client application

You can register native clients to allow authentication using a client library such as the **Active Directory Authentication Library**.

1. In the [Azure portal], select **Active Directory** > **App registrations** > **New registration**.
1. In the **Register an application** page, enter a **Name** for your app registration.
1. In **Redirect URI**, select **Public client (mobile & desktop)** and enter the URL of your App Service app and append the path `/.auth/login/aad/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`.
1. Select **Create**.

    > [!NOTE]
    > For a Windows application, use the [package SID](../app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library.md#package-sid) as the URI instead.
1. After the app registration is created, copy the value of **Application (client) ID**.
1. Select **API permissions** > **Add a permission** > **My APIs**.
1. Select the app registration you created earlier for your App Service app. If you don't see the app registration, make sure that you've added the **user_impersonation** scope in [Create an app registration in Azure AD for your App Service app](#register).
1. Select **user_impersonation**, and then select **Add permissions**.

You have now configured a native client application that can access your App Service app.

## <a name="related-content"> </a>Next steps

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
