---
title: Configure Microsoft Account authentication - Azure App Service
description: Learn how to configure Microsoft Account authentication for your App Services application.
author: mattchenderson
services: app-service
documentationcenter: ''
manager: syntaxc4
editor: ''

ms.assetid: ffbc6064-edf6-474d-971c-695598fd08bf
ms.service: app-service
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 08/08/2019
ms.author: mahender
ms.custom: seodec18

---
# How to configure your App Service application to use Microsoft Account login
[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Service to use Microsoft Account as an authentication provider. 

## <a name="register-microsoft-account"> </a>Register your app with Microsoft Account
1. Sign in to the [Azure portal], and navigate to your application. 

<!-- Copy your **URL**, which you will use later to configure your app with Microsoft Account. -->
1. Navigate to [**App registrations**](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade), and sign in with your Microsoft account, if requested.

1. Click **New registration**, then type an application name.

1. In **Redirect URIs**, select **Web**, and then type `https://<app-domain-name>/.auth/login/microsoftaccount/callback supply the endpoint for your application`. Replace *\<app-domain-name>* with the domain name of your app.  For example, `https://contoso.azurewebsites.net/.auth/login/microsoftaccount/callback`. 

   > [!NOTE]
   > Use the HTTPS scheme in the URL.

1. select **Register**. 

1. Copy the **Application (Client) ID**. You need it later. 
   
7. From the left navigation of the new app registration, select **Certificates & secrets** > **New client secret**. Supply a description, select the validity duration, and select **Add**.

1. Copy the value that appears in the **Certificates & secrets** page. Once you leave the page, it will not be displayed again.

    > [!IMPORTANT]
    > The password is an important security credential. Do not share the password with anyone or distribute it within a client application.

## <a name="secrets"> </a>Add Microsoft Account information to your App Service application
1. In the [Azure portal], navigate to your application. From the left navigation, click **Authentication / Authorization**.

2. If the Authentication / Authorization feature is not enabled, select **On**.

3. Under **Authentication Providers**, select **Microsoft Account**. Paste in the Application (client) ID and client secret that you obtained earlier, and optionally enable any scopes your application requires. Then click **OK**.

    By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.

4. (Optional) To restrict access to Microsoft account users, set **Action to take when request is not authenticated** to **Log in with Microsoft Account**. This requires that all requests be authenticated, and all unauthenticated requests are redirected to Microsoft account for authentication.

> [!CAUTION]
> Restricting access in this way applies to all calls to your app, which may not be desirable for apps wanting a publicly available home page, as in many single-page applications. For such applications, **Allow anonymous requests (no action)** may be preferred, with the app manually starting login itself, as described [here](overview-authentication-authorization.md#authentication-flow).

5. Click **Save**.

You are now ready to use Microsoft Account for authentication in your app.

## <a name="related-content"> </a>Related content
[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- URLs. -->

[My Applications]: https://go.microsoft.com/fwlink/p/?LinkId=262039
[Azure portal]: https://portal.azure.com/
