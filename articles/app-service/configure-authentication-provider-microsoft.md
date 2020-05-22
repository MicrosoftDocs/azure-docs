---
title: Configure Microsoft authentication
description: Learn how to configure Microsoft Account authentication as an identity provider for your App Service or Azure Functions app.
ms.assetid: ffbc6064-edf6-474d-971c-695598fd08bf
ms.topic: article
ms.date: 08/08/2019
ms.custom: [seodec18, fasttrack-edit]

---

# Configure your App Service or Azure Functions app to use Microsoft Account login

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Service or Azure Functions to use AAD to support personal Microsoft account logins.

> [!NOTE]
> Both personal Microsoft accounts and organizational accounts use the AAD identity provider. At this time, is not possible to configure this identity provider to support both types of log-ins.

## <a name="register-microsoft-account"> </a>Register your app with Microsoft Account

1. Go to [**App registrations**](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) in the Azure portal. If needed, sign in with your Microsoft account.
1. Select **New registration**, then enter an application name.
1. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**
1. In **Redirect URIs**, select **Web**, and then enter `https://<app-domain-name>/.auth/login/aad/callback`. Replace *\<app-domain-name>* with the domain name of your app.  For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`. Be sure to use the HTTPS scheme in the URL.

1. Select **Register**.
1. Copy the **Application (Client) ID**. You'll need it later.
1. From the left pane, select **Certificates & secrets** > **New client secret**. Enter a description, select the validity duration, and select **Add**.
1. Copy the value that appears on the **Certificates & secrets** page. After you leave the page, it won't be displayed again.

    > [!IMPORTANT]
    > The client secret value (password) is an important security credential. Do not share the password with anyone or distribute it within a client application.

## <a name="secrets"> </a>Add Microsoft Account information to your App Service application

1. Go to your application in the [Azure portal].
1. Select **Settings** > **Authentication / Authorization**, and make sure that **App Service Authentication** is **On**.
1. Under **Authentication Providers**, select **Azure Active Directory**. Select **Advanced** under **Management mode**. Paste in the Application (client) ID and client secret that you obtained earlier. Use **`https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0`** for the **Issuer Url** field.
1. Select **OK**.

   App Service provides authentication, but doesn't restrict authorized access to your site content and APIs. You must authorize users in your app code.

1. (Optional) To restrict access to Microsoft account users, set **Action to take when request is not authenticated** to **Log in with Azure Active Directory**. When you set this functionality, your app requires all requests to be authenticated. It also redirects all unauthenticated requests to use AAD for authentication. Note that because you have configured your **Issuer Url** to use the Microsoft Account tenant, only personal acccounts will successfully authenticate.

   > [!CAUTION]
   > Restricting access in this way applies to all calls to your app, which might not be desirable for apps that have a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** might be preferred so that the app manually starts authentication itself. For more information, see [Authentication flow](overview-authentication-authorization.md#authentication-flow).

1. Select **Save**.

You are now ready to use Microsoft Account for authentication in your app.

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- URLs. -->

[My Applications]: https://go.microsoft.com/fwlink/p/?LinkId=262039
[Azure portal]: https://portal.azure.com/
